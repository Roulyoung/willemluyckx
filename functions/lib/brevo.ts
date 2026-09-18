type BrevoRecipient = {
  email: string;
  name?: string;
};

type BrevoSendInput = {
  to: BrevoRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: BrevoRecipient;
  tags?: string[];
};

type BrevoEnv = {
  BREVO_API_KEY?: string;
  BREVO_FROM_EMAIL?: string;
  BREVO_FROM_NAME?: string;
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendBrevoEmail = async (env: BrevoEnv, input: BrevoSendInput) => {
  const apiKey = String(env.BREVO_API_KEY ?? "").trim();
  const fromEmail = String(env.BREVO_FROM_EMAIL ?? "").trim();
  const fromName = String(env.BREVO_FROM_NAME ?? "TopFit Running").trim();

  if (!apiKey || !fromEmail || input.to.length === 0) {
    return {
      ok: false as const,
      skipped: true as const,
      error: "Brevo configuration missing",
    };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: input.to,
      subject: input.subject,
      htmlContent: input.htmlContent,
      textContent: input.textContent,
      replyTo: input.replyTo?.email ? input.replyTo : undefined,
      tags: input.tags?.length ? input.tags : undefined,
    }),
  });

  let data: { messageId?: string; message?: string } | null = null;
  try {
    data = (await response.json()) as { messageId?: string; message?: string };
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      ok: false as const,
      skipped: false as const,
      error: data?.message ?? `Brevo request failed (${response.status})`,
    };
  }

  return {
    ok: true as const,
    skipped: false as const,
    messageId: data?.messageId ?? null,
  };
};


