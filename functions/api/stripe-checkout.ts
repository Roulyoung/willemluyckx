import { getActiveShopProduct } from "../lib/shopProducts";

type CheckoutPayload = {
  locale?: unknown;
  slug?: unknown;
  email?: unknown;
  name?: unknown;
  phone?: unknown;
  embedded?: unknown;
  termsAccepted?: unknown;
  termsVersion?: unknown;
};

const readJson = async (request: Request): Promise<CheckoutPayload> => {
  try {
    return (await request.json()) as CheckoutPayload;
  } catch {
    return {};
  }
};

const slugAliases: Record<string, string> = {
  basis: "base",
};

const productConfig: Record<
  string,
  { priceEnv: string; successPath: (locale: string) => string; cancelPath: (locale: string) => string }
> = {
  premium: {
    priceEnv: "STRIPE_PRICE_PREMIUM",
    successPath: (locale) => `/${locale}/abonnementen/premium?success=1#checkout`,
    cancelPath: (locale) => `/${locale}/abonnementen/premium?canceled=1`,
  },
  base: {
    priceEnv: "STRIPE_PRICE_BASE",
    successPath: (locale) => `/${locale}/abonnementen/${locale === "nl" ? "basis" : "base"}?success=1#checkout`,
    cancelPath: (locale) => `/${locale}/abonnementen/${locale === "nl" ? "basis" : "base"}?canceled=1`,
  },
  "clinic-ticket": {
    priceEnv: "STRIPE_PRICE_CLINIC",
    successPath: (locale) => `/${locale}/abonnementen/clinic-ticket?success=1#checkout`,
    cancelPath: (locale) => `/${locale}/abonnementen/clinic-ticket?canceled=1`,
  },
  schema: {
    priceEnv: "STRIPE_PRICE_SCHEMA",
    successPath: (locale) => `/${locale}/${locale === "nl" ? "aanbod" : "offers"}/schema/afrekenen?success=1`,
    cancelPath: (locale) => `/${locale}/${locale === "nl" ? "aanbod" : "offers"}/schema/afrekenen?canceled=1`,
  },
  "stripe-test-1-eur": {
    priceEnv: "STRIPE_PRICE_TEST",
    successPath: (locale) => `/${locale}/stripe-test-1-eur?success=1`,
    cancelPath: (locale) => `/${locale}/stripe-test-1-eur?canceled=1`,
  },
};

const toEnvKey = (value: string) => value.toUpperCase().replace(/-/g, "_");

const wantsEmbeddedCheckout = (value: unknown) => value === true || value === "true" || value === 1 || value === "1";

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const payload = await readJson(request);
  const locale = String(payload.locale ?? "nl").toLowerCase();
  const slug = String(payload.slug ?? "").trim();
  const normalizedSlug = slugAliases[slug] ?? slug;
  // Retired offers must not remain purchasable through bookmarked clients.
  // Historical payments still use the unchanged webhook handler.
  if (["premium", "base", "clinic-ticket"].includes(normalizedSlug)) {
    return Response.json({ ok: false, error: "This offer has been retired. Please view the current TopFit Running offers." }, { status: 410 });
  }
  const email = String(payload.email ?? "").trim();
  const name = String(payload.name ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const product = productConfig[normalizedSlug];
  const embedded = wantsEmbeddedCheckout(payload.embedded);
  const termsAccepted = payload.termsAccepted === true;
  const termsVersion = String(payload.termsVersion ?? "").trim();

  if (!product) {
    return Response.json({ ok: false, error: "Unknown product" }, { status: 400 });
  }
  if (!termsAccepted || !termsVersion) {
    return Response.json({ ok: false, error: "Required legal confirmations are missing" }, { status: 400 });
  }

  const stripeSecretKey = String(env.STRIPE_SECRET_KEY ?? "").trim();
  const siteUrl = String(env.SITE_URL ?? "https://topfitrunning.com").trim().replace(/\/$/, "");
  const overrideKey = toEnvKey(normalizedSlug);
  const successUrl = String(env[`STRIPE_SUCCESS_URL_${overrideKey}`] ?? `${siteUrl}${product.successPath(locale)}`).trim();
  const cancelUrl = String(env[`STRIPE_CANCEL_URL_${overrideKey}`] ?? `${siteUrl}${product.cancelPath(locale)}`).trim();
  let shopProduct: Awaited<ReturnType<typeof getActiveShopProduct>> = null;
  try {
    shopProduct = await getActiveShopProduct(env as Record<string, unknown>, normalizedSlug, locale);
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Shop product lookup failed" }, { status: 503 });
  }
  const priceId = String(env[product.priceEnv] ?? "").trim();

  if (!stripeSecretKey || (!priceId && !shopProduct)) {
    return Response.json({ ok: false, error: "Stripe configuration missing" }, { status: 503 });
  }

  const form = new URLSearchParams();
  form.set("mode", "payment");
  if (shopProduct) {
    form.set("line_items[0][price_data][currency]", shopProduct.currency);
    form.set("line_items[0][price_data][unit_amount]", String(shopProduct.amount));
    form.set("line_items[0][price_data][product_data][name]", shopProduct.name);
    if (shopProduct.description) form.set("line_items[0][price_data][product_data][description]", shopProduct.description);
    form.set("line_items[0][price_data][product_data][metadata][product_id]", shopProduct.productId);
  } else {
    form.set("line_items[0][price]", priceId);
  }
  form.set("line_items[0][quantity]", "1");
  // Put iDEAL first so Dutch customers see it as the default payment method.
  form.set("payment_method_types[0]", "ideal");
  form.set("payment_method_types[1]", "card");
  form.set("allow_promotion_codes", "true");
  form.set("phone_number_collection[enabled]", "true");
  form.set("metadata[product_slug]", normalizedSlug);
  form.set("metadata[requested_slug]", slug || normalizedSlug);
  form.set("metadata[locale]", locale);
  form.set("metadata[terms_accepted]", "true");
  form.set("metadata[terms_version]", termsVersion);
  form.set("metadata[consent_recorded_at]", new Date().toISOString());
  if (email) form.set("customer_email", email);
  if (name) form.set("metadata[customer_name]", name);
  if (email) form.set("metadata[customer_email]", email);
  if (phone) form.set("metadata[phone]", phone);
  form.set("client_reference_id", `${locale}:${normalizedSlug}`);

  if (embedded) {
    form.set("ui_mode", "embedded_page");
    form.set("redirect_on_completion", "if_required");
    form.set("return_url", `${successUrl}${successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`);
  } else {
    form.set("success_url", successUrl);
    form.set("cancel_url", cancelUrl);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ ok: false, error: data?.error?.message ?? "Stripe session creation failed" }, { status: 500 });
  }

  if (embedded) {
    if (!data?.client_secret) {
      return Response.json({ ok: false, error: "Stripe embedded checkout secret missing" }, { status: 500 });
    }

    return Response.json({ ok: true, id: data.id, clientSecret: data.client_secret, productSlug: normalizedSlug });
  }

  return Response.json({ ok: true, url: data.url, id: data.id, productSlug: normalizedSlug });
};
