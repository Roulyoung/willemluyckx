export const onRequestGet: PagesFunction = async ({ env }) => {
  const publishableKey = String(env.VITE_STRIPE_PUBLISHABLE_KEY ?? env.STRIPE_PUBLISHABLE_KEY ?? "").trim();

  if (!publishableKey) {
    return Response.json(
      { ok: false, error: "Stripe publishable key missing" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, publishableKey },
    { headers: { "Cache-Control": "no-store" } },
  );
};
