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

export const onRequestPost: PagesFunction = async ({ request }) => {
  const payload = await readJson(request);
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
