import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";

type EmbeddedCheckoutResponse = {
  ok?: boolean;
  id?: string;
  clientSecret?: string;
  productSlug?: string;
  error?: string;
};

type StripePublicConfigResponse = {
  ok?: boolean;
  publishableKey?: string;
  error?: string;
};

type EmbeddedCheckoutInstance = {
  mount: (container: string | HTMLElement) => void;
  destroy: () => void | Promise<void>;
};

type EmbeddedPackageCheckoutProps = {
  locale: Locale;
  slug: string;
  isSuccess: boolean;
  intakePath: string;
  loaded: boolean;
  product: {
    title: string;
    price: string;
    bullets: string[];
  };
};

const formatPrice = (price: string) => {
  const index = price.toLowerCase().indexOf(" incl.");
  if (index === -1) {
    return { main: price, suffix: "" };
  }

  return {
    main: price.slice(0, index).trim(),
    suffix: price.slice(index).trim(),
  };
};

const PriceBlock = ({
  price,
  className = "",
  emphasis = false,
}: {
  price: string;
  className?: string;
  emphasis?: boolean;
}) => {
  const { main, suffix } = formatPrice(price);

  return (
    <div className={`space-y-1 text-left ${className}`}>
      <div className={`${emphasis ? "text-4xl md:text-5xl" : "text-2xl"} font-black tracking-[0.02em] text-current`}>{main}</div>
      {suffix ? <div className={`${emphasis ? "text-[11px]" : "text-[10px]"} font-semibold uppercase tracking-[0.32em] text-current/60`}>{suffix}</div> : null}
    </div>
  );
};

const EmbeddedPackageCheckout = ({ locale, slug, isSuccess, intakePath, loaded, product }: EmbeddedPackageCheckoutProps) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMounted, setCheckoutMounted] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const checkoutContainerRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<EmbeddedCheckoutInstance | null>(null);
  const productSlugRef = useRef(slug === "basis" ? "base" : slug);

  const destroyCheckout = async () => {
    const mountedCheckout = checkoutRef.current;
    checkoutRef.current = null;

    if (mountedCheckout) {
      await mountedCheckout.destroy();
    }

    if (checkoutContainerRef.current) {
      checkoutContainerRef.current.innerHTML = "";
    }

    setCheckoutMounted(false);
  };

  useEffect(() => {
    return () => {
      void destroyCheckout();
    };
  }, []);

  const startEmbeddedCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError("");
      await destroyCheckout();
      setCheckoutMounted(true);
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      const configResponse = await fetch("/api/stripe-public-config", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const configResult = (await configResponse.json()) as StripePublicConfigResponse;
      if (!configResponse.ok || !configResult.ok || !configResult.publishableKey) {
        throw new Error(configResult.error || (locale === "en" ? "Stripe configuration missing" : "Stripe-configuratie ontbreekt"));
      }

      const stripe = await loadStripe(configResult.publishableKey);
      if (!stripe) {
        throw new Error(locale === "en" ? "Stripe could not be loaded" : "Stripe kon niet worden geladen");
      }

      const embeddedCheckout = await stripe.createEmbeddedCheckoutPage({
        fetchClientSecret: async () => {
          const response = await fetch("/api/stripe-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              locale,
              slug,
              embedded: true,
            }),
          });
          const result = (await response.json()) as EmbeddedCheckoutResponse;
          if (!response.ok || !result.ok || !result.clientSecret) {
            throw new Error(result.error || (locale === "en" ? "Checkout could not be started" : "Afrekenen kon niet worden gestart"));
          }
          productSlugRef.current = result.productSlug || productSlugRef.current;
          return result.clientSecret;
        },
        onComplete: async () => {
          await destroyCheckout();
          const url = new URL(window.location.href);
          url.searchParams.set("success", "1");
          url.searchParams.delete("canceled");
          url.hash = "checkout";
          window.location.assign(url.toString());
        },
      });

      if (!checkoutContainerRef.current) {
        await embeddedCheckout.destroy();
        throw new Error(locale === "en" ? "Checkout container missing" : "Checkout-container ontbreekt");
      }

      checkoutRef.current = embeddedCheckout;
      embeddedCheckout.mount(checkoutContainerRef.current);
      checkoutContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : locale === "en"
            ? "Checkout could not be started"
            : "Afrekenen kon niet worden gestart",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="checkout" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${loaded ? "animate-fade-up" : "animate-fade-up"}`}>
        <Card className="border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              {locale === "en" ? "Payment received" : "Betaling ontvangen"}
            </div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
              {locale === "en" ? "Your payment is confirmed" : "Je betaling is bevestigd"}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-emerald-950/80 md:text-base">
              {locale === "en"
                ? "Everything worked. Your order is in, and you can start the intake whenever it suits you. You do not need to do that immediately."
                : "Alles is goed gegaan. Je bestelling is ontvangen en je kunt de intake starten wanneer het jou uitkomt. Dat hoeft niet meteen."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <a href={intakePath}>{locale === "en" ? "Start intake when ready" : "Start intake wanneer je wilt"}</a>
              </Button>
              <Button variant="heroOutline" asChild>
                <a href={`/${locale}/${locale === "en" ? "subscriptions" : "abonnementen"}`}>
                  {locale === "en" ? "Back to plans" : "Terug naar pakketten"}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="checkout" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${loaded ? "animate-fade-up" : "animate-fade-up"}`}>
      <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {locale === "en" ? "Checkout" : "Afrekenen"}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
                {locale === "en" ? "Complete your order on this page" : "Rond je bestelling af op deze pagina"}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-200">
                {locale === "en"
                  ? "No separate payment page and no extra pre-form first. The secure Stripe checkout opens below in the TopFit experience, where name, email, phone and payment are handled in one clear flow."
                  : "Geen losse betaalpagina en geen extra voorformulier. De veilige Stripe-checkout opent hieronder binnen de TopFit-ervaring, waar naam, e-mail, telefoon en betaling in één duidelijke flow samenkomen."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  locale === "en" ? "Secure Stripe payment stays embedded on TopFit Running." : "Veilige Stripe-betaling blijft embedded op TopFit Running.",
                  locale === "en" ? "Name, email and phone are collected in the checkout itself." : "Naam, e-mail en telefoon worden direct in de checkout verzameld.",
                  locale === "en" ? "Promo codes can still be entered inside the Stripe panel." : "Kortingscodes kunnen nog steeds in het Stripe-paneel worden ingevuld.",
                  locale === "en" ? "After payment you can continue to the intake when it suits you." : "Na betaling kun je verder met de intake wanneer het jou uitkomt.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-white/10 bg-white/10 text-white backdrop-blur">
              <CardContent className="space-y-4 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                  {locale === "en" ? "Order summary" : "Besteloverzicht"}
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-4">
                  <div className="text-sm uppercase tracking-[0.3em] text-blue-300">{product.title}</div>
                  <PriceBlock price={product.price} emphasis />
                </div>
                <div className="grid gap-2 text-sm text-slate-200">
                  {product.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                <Button variant="hero" className="w-full" disabled={checkoutLoading || checkoutMounted} onClick={startEmbeddedCheckout}>
                  {checkoutLoading
                    ? locale === "en"
                      ? "Loading secure payment..."
                      : "Veilige betaling laden..."
                    : checkoutMounted
                      ? locale === "en"
                        ? "Secure checkout is open below"
                        : "Veilige checkout staat hieronder open"
                      : locale === "en"
                        ? "Open secure checkout"
                        : "Open veilige checkout"}
                </Button>
                {checkoutMounted ? (
                  <Button
                    variant="heroOutline"
                    className="w-full"
                    onClick={() => {
                      void destroyCheckout();
                      setCheckoutError("");
                    }}
                  >
                    {locale === "en" ? "Close checkout" : "Checkout sluiten"}
                  </Button>
                ) : null}
                <p className="text-xs leading-6 text-slate-300">
                  {locale === "en"
                    ? "You stay in the same visual flow first, then move into intake only after the payment is complete."
                    : "Je blijft eerst in dezelfde visuele flow en gaat pas na de betaling door naar de intake."}
                </p>
              </CardContent>
            </Card>
          </div>

          {checkoutError ? (
            <div className="rounded-2xl border border-rose-300/40 bg-rose-950/40 px-4 py-3 text-sm leading-6 text-rose-100">
              {checkoutError}
            </div>
          ) : null}

          <div
            className={`space-y-3 rounded-[2rem] border border-white/10 bg-white/95 p-3 shadow-inner shadow-blue-950/10 transition-all md:p-4 ${checkoutMounted ? "opacity-100" : "max-h-0 overflow-hidden border-transparent bg-transparent p-0 opacity-0"}`}
          >
            <div className="px-2 pt-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
              {locale === "en" ? "Secure payment on this page" : "Veilige betaling op deze pagina"}
            </div>
            <div ref={checkoutContainerRef} className="min-h-[720px] overflow-hidden rounded-[1.5rem] bg-white" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EmbeddedPackageCheckout;
