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
  const labels: Record<string, { nl: string; en: string; he: string }> = {
    schema: { nl: "Persoonlijk hardloopschema (12 weken)", en: "Personal running plan (12 weeks)", he: "תוכנית ריצה אישית (12 שבועות)" },
    premium: { nl: "Premium abonnement", en: "Premium subscription", he: "מנוי פרימיום" },
    base: { nl: "Basis abonnement", en: "Base subscription", he: "מנוי בסיסי" },
    "clinic-ticket": { nl: "Clinic ticket", en: "Clinic ticket", he: "כרטיס לסדנה" },
    "stripe-test-1-eur": { nl: "Stripe live testproduct €1", en: "Stripe live test product €1", he: "מוצר בדיקה של Stripe €1" },
  };

  const language = locale === "he" ? "he" : locale === "nl" ? "nl" : "en";
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
  const bookUrl = `${siteUrl}/downloads/TopFit-Running-Boek.pdf`;
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
      <p><strong>TopFit Running Boek:</strong> <a href="${escapeHtml(bookUrl)}">${escapeHtml(bookUrl)}</a></p>
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
      `${locale === "nl" ? "Vervolgstap" : "Next step"}: ${intakeUrl}\n` +
      `TopFit Running Boek: ${bookUrl}`,
    tags: ["stripe-payment", productSlug, locale, "internal"],
  });

  const customerEmailResult = customerEmail
    ? await sendBrevoEmail(env, {
        to: [{ email: customerEmail, name: customerName || undefined }],
        replyTo: { email: replyToEmail, name: "TopFit Running" },
        subject:
          locale === "nl"
            ? `Je betaling is ontvangen${productLabel ? ` - ${productLabel}` : ""}`
            : locale === "he" ? `התשלום התקבל${productLabel ? ` - ${productLabel}` : ""}` : `Your payment has been received${productLabel ? ` - ${productLabel}` : ""}`,
        htmlContent:
          locale === "nl"
            ? `<p>Hi ${escapeHtml(customerName || "daar")},</p><p>Je betaling voor <strong>${escapeHtml(productLabel)}</strong> is ontvangen.</p><p>De volgende stap is je intake invullen:</p><p><a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p><p>Daarmee kan Willem jouw doelen, achtergrond en belastbaarheid vertalen naar een passend traject.</p><h3>Jouw TopFit Running Boek</h3><p>Als onderdeel van je aankoop kun je het boek van Willem hier downloaden:</p><p><a href="${escapeHtml(bookUrl)}">Download het TopFit Running Boek (pdf)</a></p><p>Bewaar deze e-mail, zodat je de downloadlink later terug kunt vinden.</p><p>Team TopFit Running</p>`
            : locale === "he" ? `<div dir="rtl"><p>שלום ${escapeHtml(customerName || "")},</p><p>התשלום עבור <strong>${escapeHtml(productLabel)}</strong> התקבל.</p><p>השלב הבא הוא מילוי שאלון הקליטה:</p><p><a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p><p>כך וילם יוכל להתאים את התוכנית למטרות, לרקע ולעומס האימונים שלכם.</p><h3>ספר TopFit Running שלכם</h3><p>הספר של וילם כלול ברכישה. אפשר להוריד אותו כאן:</p><p><a href="${escapeHtml(bookUrl)}">הורדת ספר TopFit Running (PDF)</a></p><p>שמרו את ההודעה כדי למצוא את הקישור בהמשך.</p><p>צוות TopFit Running</p></div>` : `<p>Hi ${escapeHtml(customerName || "there")},</p><p>Your payment for <strong>${escapeHtml(productLabel)}</strong> has been received.</p><p>Your next step is to complete the intake:</p><p><a href="${escapeHtml(intakeUrl)}">${escapeHtml(intakeUrl)}</a></p><p>That helps Willem turn your goals, background and training load into the right path.</p><h3>Your TopFit Running Book</h3><p>Your purchase includes Willem's book. Download it here:</p><p><a href="${escapeHtml(bookUrl)}">Download the TopFit Running Book (PDF)</a></p><p>Keep this email so you can find the download link later.</p><p>Team TopFit Running</p>`,
        textContent:
          locale === "nl"
            ? `Hi ${customerName || "daar"},\n\nJe betaling voor ${productLabel} is ontvangen.\n\nVolgende stap: vul je intake in:\n${intakeUrl}\n\nJouw aankoop bevat ook het TopFit Running Boek van Willem. Download de pdf hier:\n${bookUrl}\n\nBewaar deze e-mail, zodat je de downloadlink later terug kunt vinden.\n\nTeam TopFit Running`
            : locale === "he" ? `שלום ${customerName || ""},\n\nהתשלום עבור ${productLabel} התקבל.\n\nהשלב הבא: מלאו את שאלון הקליטה:\n${intakeUrl}\n\nהרכישה כוללת גם את ספר TopFit Running. הורידו אותו כאן:\n${bookUrl}\n\nצוות TopFit Running` : `Hi ${customerName || "there"},\n\nYour payment for ${productLabel} has been received.\n\nNext step: complete your intake:\n${intakeUrl}\n\nYour purchase also includes Willem's TopFit Running Book. Download the PDF here:\n${bookUrl}\n\nKeep this email so you can find the download link later.\n\nTeam TopFit Running`,
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
