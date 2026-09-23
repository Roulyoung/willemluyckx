import { escapeHtml, sendBrevoEmail } from "../lib/brevo";

type StripeSession = {
  id?: string;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  };
  metadata?: Record<string, string>;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
};

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: StripeSession;
  };
};

const textEncoder = new TextEncoder();
const handledEventTypes = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
};

const verifyStripeSignature = async (payload: string, signatureHeader: string, secret: string) => {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = Number.parseInt(timestampPart.slice(2), 10);
  if (!Number.isFinite(timestamp)) return false;

  const tolerance = 300;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, textEncoder.encode(signedPayload));
  const expected = bytesToHex(new Uint8Array(digest));

  return signatures.some((signature) => timingSafeEqual(signature, expected));
};

const formatAmount = (amountTotal?: number | null, currency?: string | null) => {
  if (typeof amountTotal !== "number") return null;
  try {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: (currency ?? "EUR").toUpperCase(),
    }).format(amountTotal / 100);
  } catch {
    return `${(amountTotal / 100).toFixed(2)} ${(currency ?? "EUR").toUpperCase()}`;
  }
};

const getProductLabel = (productSlug: string, locale: string) => {
  const labels: Record<string, { nl: string; en: string }> = {
    schema: { nl: "Persoonlijk hardloopschema (12 weken)", en: "Personal running plan (12 weeks)" },
    premium: { nl: "Premium abonnement", en: "Premium subscription" },
    base: { nl: "Basis abonnement", en: "Base subscription" },
    "clinic-ticket": { nl: "Clinic ticket", en: "Clinic ticket" },
  };

  const language = locale === "nl" ? "nl" : "en";
  return labels[productSlug]?.[language] ?? productSlug;
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const signature = request.headers.get("stripe-signature") ?? "";
  const secret = String(env.STRIPE_WEBHOOK_SECRET ?? "").trim();

  if (!secret) {
    return Response.json({ ok: false, error: "Missing webhook secret" }, { status: 503 });
  }

  const rawBody = await request.text();

  if (!signature) {
    return Response.json({ ok: false, error: "Missing signature" }, { status: 400 });
  }

  const valid = await verifyStripeSignature(rawBody, signature, secret);
  if (!valid) {
    return Response.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!handledEventTypes.has(event.type)) {
    return Response.json({ ok: true, ignored: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const session = event.data?.object ?? {};
  if (event.type === "checkout.session.completed" && session.payment_status && session.payment_status !== "paid") {
    return Response.json(
      { ok: true, ignored: true, pending: true, eventId: event.id, sessionId: session.id ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const locale = String(session.metadata?.locale ?? "nl").toLowerCase();
  const productSlug = String(session.metadata?.product_slug ?? "").trim() || "unknown";
  const requestedSlug = String(session.metadata?.requested_slug ?? productSlug).trim();
  const customerName = String(session.customer_details?.name ?? session.metadata?.customer_name ?? "").trim();
  const customerEmail = String(session.customer_details?.email ?? session.customer_email ?? "").trim();
  const customerPhone = String(session.customer_details?.phone ?? session.metadata?.phone ?? "").trim();
  const amount = formatAmount(session.amount_total, session.currency);
  const siteUrl = String(env.SITE_URL ?? "https://topfitrunning.com").trim().replace(/\/$/, "");
  const intakeUrl = `${siteUrl}/intake?locale=${locale}&flow=checkout&product=${encodeURIComponent(productSlug)}`;
  const internalRecipient = String(env.BREVO_TO_EMAIL ?? "info@topfitrunning.com").trim();
  const replyToEmail = String(env.BREVO_REPLY_TO_EMAIL ?? "info@topfitrunning.com").trim();
  const productLabel = getProductLabel(productSlug, locale);

  const internalEmail = await sendBrevoEmail(env, {
    to: [{ email: internalRecipient }],
    replyTo: customerEmail ? { email: customerEmail, name: customerName || customerEmail } : undefined,
    subject: locale === "nl" ? `Nieuwe Stripe betaling: ${productLabel}` : `New Stripe payment: ${productLabel}`,
    htmlContent: `
      <h2>${locale === "nl" ? "Nieuwe Stripe betaling" : "New Stripe payment"}</h2>
      <p><strong>Product:</strong> ${escapeHtml(productLabel)}</p>
      <p><strong>Canonical slug:</strong> ${escapeHtml(productSlug)}</p>
      <p><strong>Requested slug:</strong> ${escapeHtml(requestedSlug)}</p>
      <p><strong>${locale === "nl" ? "Naam" : "Name"}:</strong> ${escapeHtml(customerName || "-")}</p>
      <p><strong>Email:</strong> ${escapeHtml(customerEmail || "-")}</p>
      <p><strong>${locale === "nl" ? "Telefoon" : "Phone"}:</strong> ${escapeHtml(customerPhone || "-")}</p>
      <p><strong>${locale === "nl" ? "Bedrag" : "Amount"}:</strong> ${escapeHtml(amount ?? "-")}</p>
      <p><strong>Stripe event:</strong> ${escapeHtml(event.id)}</p>
      <p><strong>Stripe session:</strong> ${escapeHtml(session.id ?? "-")}</p>
      <p><strong>${locale === "nl" ? "Vervolgstap" : "Next step"}:</strong> <a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p>
    `,
    textContent:
      `${locale === "nl" ? "Nieuwe Stripe betaling" : "New Stripe payment"}\n\n` +
      `Product: ${productLabel}\n` +
      `Canonical slug: ${productSlug}\n` +
      `Requested slug: ${requestedSlug}\n` +
      `${locale === "nl" ? "Naam" : "Name"}: ${customerName || "-"}\n` +
      `Email: ${customerEmail || "-"}\n` +
      `${locale === "nl" ? "Telefoon" : "Phone"}: ${customerPhone || "-"}\n` +
      `${locale === "nl" ? "Bedrag" : "Amount"}: ${amount || "-"}\n` +
      `Stripe event: ${event.id}\n` +
      `Stripe session: ${session.id || "-"}\n` +
      `${locale === "nl" ? "Vervolgstap" : "Next step"}: ${intakeUrl}`,
    tags: ["stripe-payment", productSlug, locale, "internal"],
  });

  const customerEmailResult = customerEmail
    ? await sendBrevoEmail(env, {
        to: [{ email: customerEmail, name: customerName || undefined }],
        replyTo: { email: replyToEmail, name: "TopFit Running" },
        subject:
          locale === "nl"
            ? `Je betaling is ontvangen${productLabel ? ` - ${productLabel}` : ""}`
            : `Your payment has been received${productLabel ? ` - ${productLabel}` : ""}`,
        htmlContent:
          locale === "nl"
            ? `<p>Hi ${escapeHtml(customerName || "daar")},</p><p>Je betaling voor <strong>${escapeHtml(productLabel)}</strong> is ontvangen.</p><p>De volgende stap is je intake invullen:</p><p><a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p><p>Daarmee kan Willem jouw doelen, achtergrond en belastbaarheid vertalen naar een passend traject.</p><p>Team TopFit Running</p>`
            : `<p>Hi ${escapeHtml(customerName || "there")},</p><p>Your payment for <strong>${escapeHtml(productLabel)}</strong> has been received.</p><p>Your next step is to complete the intake:</p><p><a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p><p>That helps Willem turn your goals, background and training load into the right path.</p><p>Team TopFit Running</p>`,
        textContent:
          locale === "nl"
            ? `Hi ${customerName || "daar"},\n\nJe betaling voor ${productLabel} is ontvangen.\n\nVolgende stap: vul je intake in:\n${intakeUrl}\n\nTeam TopFit Running`
            : `Hi ${customerName || "there"},\n\nYour payment for ${productLabel} has been received.\n\nNext step: complete your intake:\n${intakeUrl}\n\nTeam TopFit Running`,
        tags: ["stripe-payment", productSlug, locale, "customer"],
      })
    : { ok: false as const, skipped: true as const, error: "No customer email available" };

  return Response.json(
    {
      ok: true,
      received: true,
      eventId: event.id,
      sessionId: session.id ?? null,
      productSlug,
      internalEmail,
      customerEmail: customerEmailResult,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
};
