import { escapeHtml, sendBrevoEmail } from "../lib/brevo";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  locale?: unknown;
};

const readJson = async (request: Request): Promise<ContactPayload> => {
  try {
    return (await request.json()) as ContactPayload;
  } catch {
    return {};
  }
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const payload = await readJson(request);
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const locale = String(payload.locale ?? "nl").trim().toLowerCase();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !message || !emailLooksValid) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const internalRecipient = String(env.BREVO_TO_EMAIL ?? "info@topfitrunning.com").trim();
  const replyToEmail = String(env.BREVO_REPLY_TO_EMAIL ?? "info@topfitrunning.com").trim();

  const internalResult = await sendBrevoEmail(env, {
    to: [{ email: internalRecipient }],
    replyTo: { email, name },
    subject: locale === "en" ? `New contact request from ${name}` : `Nieuw contactbericht van ${name}`,
    htmlContent: `
      <h2>${locale === "en" ? "New contact request" : "Nieuw contactbericht"}</h2>
      <p><strong>${locale === "en" ? "Name" : "Naam"}:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>${locale === "en" ? "Locale" : "Taal"}:</strong> ${escapeHtml(locale)}</p>
      <p><strong>${locale === "en" ? "Message" : "Bericht"}:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
    textContent:
      `${locale === "en" ? "New contact request" : "Nieuw contactbericht"}\n\n` +
      `${locale === "en" ? "Name" : "Naam"}: ${name}\n` +
      `Email: ${email}\n` +
      `${locale === "en" ? "Locale" : "Taal"}: ${locale}\n\n` +
      `${locale === "en" ? "Message" : "Bericht"}:\n${message}`,
    tags: ["contact-form", locale],
  });

  if (!internalResult.ok) {
    return new Response(JSON.stringify({ ok: false, error: internalResult.error ?? "Email delivery failed" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const customerResult = await sendBrevoEmail(env, {
    to: [{ email, name }],
    replyTo: { email: replyToEmail, name: "TopFit Running" },
    subject: locale === "en" ? "We received your message" : "We hebben je bericht ontvangen",
    htmlContent:
      locale === "en"
        ? `<p>Hi ${escapeHtml(name)},</p><p>We received your message and will reply as soon as possible.</p><p>Team TopFit Running</p>`
        : `<p>Hi ${escapeHtml(name)},</p><p>We hebben je bericht ontvangen en reageren zo snel mogelijk.</p><p>Team TopFit Running</p>`,
    textContent:
      locale === "en"
        ? `Hi ${name},\n\nWe received your message and will reply as soon as possible.\n\nTeam TopFit Running`
        : `Hi ${name},\n\nWe hebben je bericht ontvangen en reageren zo snel mogelijk.\n\nTeam TopFit Running`,
    tags: ["contact-autoreply", locale],
  });

  return new Response(
    JSON.stringify({
      ok: true,
      internalMessageId: internalResult.ok ? internalResult.messageId : null,
      customerReplySent: customerResult.ok,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    },
  );
};
