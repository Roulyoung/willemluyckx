import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";

type Props = { locale: Locale; slug: string; isSuccess: boolean; intakePath: string; loaded: boolean; product: { title: string; price: string; bullets: string[] } };
type CheckoutResult = { ok?: boolean; clientSecret?: string; error?: string };
type PublicConfig = { ok?: boolean; publishableKey?: string; error?: string };

const EmbeddedPackageCheckout = ({ locale, slug, isSuccess, intakePath, loaded, product }: Props) => {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [earlyStartRequested, setEarlyStartRequested] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<{ mount: (element: HTMLElement) => void; destroy: () => void | Promise<void> } | null>(null);
  const nl = locale === "nl";

  useEffect(() => {
    if (isSuccess || !termsAccepted || !earlyStartRequested) return;
    let active = true;
    const openCheckout = async () => {
      try {
        const configResponse = await fetch("/api/stripe-public-config", { cache: "no-store" });
        const config = (await configResponse.json()) as PublicConfig;
        if (!configResponse.ok || !config.ok || !config.publishableKey) throw new Error(config.error || (nl ? "Stripe-configuratie ontbreekt" : "Stripe configuration is missing"));
        const stripe = await loadStripe(config.publishableKey);
        if (!stripe) throw new Error(nl ? "Stripe kon niet worden geladen" : "Stripe could not be loaded");
        const checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const response = await fetch("/api/stripe-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, slug, embedded: true, termsVersion: "2026-10-13", termsAccepted: true, earlyStartRequested: true }) });
            const result = (await response.json()) as CheckoutResult;
            if (!response.ok || !result.ok || !result.clientSecret) throw new Error(result.error || (nl ? "Afrekenen kon niet worden gestart" : "Checkout could not be started"));
            return result.clientSecret;
          },
          onComplete: () => window.location.assign(`${window.location.pathname}?success=1`),
        });
        if (!active || !mountRef.current) { await checkout.destroy(); return; }
        checkoutRef.current = checkout;
        checkout.mount(mountRef.current);
        setReady(true);
      } catch (checkoutError) {
        if (active) setError(checkoutError instanceof Error ? checkoutError.message : nl ? "Afrekenen kon niet worden gestart" : "Checkout could not be started");
      }
    };
    void openCheckout();
    return () => { active = false; const checkout = checkoutRef.current; checkoutRef.current = null; if (checkout) void checkout.destroy(); };
  }, [earlyStartRequested, isSuccess, locale, nl, slug, termsAccepted]);

  if (isSuccess) return <section className="mx-auto max-w-4xl px-5 py-10 md:px-8"><Card className="border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm"><CardContent className="space-y-5 p-6 md:p-8"><div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">{nl ? "Betaling ontvangen" : "Payment received"}</div><h2 className="text-3xl font-black md:text-5xl">{nl ? "Je betaling is gelukt" : "Your payment is complete"}</h2><p className="max-w-3xl text-sm leading-7 text-emerald-950/80 md:text-base">{nl ? "Vul nu de korte intake in, zodat Willem jouw schema persoonlijk kan maken. Je ontvangt ook een e-mail met de downloadlink naar het TopFit Running Boek." : "Continue with the short intake so Willem can create your plan personally. You will also receive an email with the download link for the TopFit Running Book."}</p><div className="flex flex-wrap gap-3"><Button variant="hero" asChild><a href={intakePath}>{nl ? "Start de intake" : "Start the intake"}</a></Button><Button variant="heroOutline" asChild><a href="/downloads/TopFit-Running-Boek.pdf" download>{nl ? "Download het boek (pdf)" : "Download the book (PDF)"}</a></Button></div></CardContent></Card></section>;

  const termsPath = `/${locale}/${nl ? "algemene-voorwaarden" : "terms"}`;
  return <section className={`mx-auto max-w-5xl px-5 py-10 md:px-8 ${loaded ? "animate-fade-up" : ""}`}><Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]"><CardContent className="space-y-7 p-5 md:p-9"><div className="space-y-4"><div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">{nl ? "Veilig afrekenen" : "Secure checkout"}</div><h2 className="text-3xl font-black md:text-5xl">{nl ? "Koop je persoonlijke schema" : "Buy your personal plan"}</h2><p className="max-w-3xl text-sm leading-7 text-slate-200 md:text-base">{nl ? "Eenmalig €19 voor een persoonlijk schema van 12 weken. Na betaling volgt de intake." : "A one-off €19 for a personal 12-week plan. The intake follows after payment."}</p></div><div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-3">{[nl ? "Eenmalig €19" : "One-off €19", nl ? "Geen abonnement" : "No subscription", nl ? "Na betaling: intake" : "Intake after payment"].map((item) => <div key={item} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center">{item}</div>)}</div><div className="rounded-[1.5rem] bg-white p-3 text-slate-950 md:p-5"><div className="mb-4 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Check className="h-5 w-5 text-blue-600" /><span className="font-bold">{product.title}</span></div><span className="font-black text-blue-700">{product.price}</span></div>{!termsAccepted || !earlyStartRequested ? <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="font-bold">{nl ? "Controleer en bevestig vóór betaling" : "Review and confirm before payment"}</p><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600"/><span>{nl ? "Ik ga akkoord met de " : "I agree to the "}<Link className="underline" target="_blank" to={termsPath}>{nl ? "algemene voorwaarden" : "terms"}</Link>{nl ? " en heb de " : " and have read the "}<Link className="underline" target="_blank" to={`/${locale}/privacy`}>{nl ? "privacyverklaring" : "privacy statement"}</Link>.</span></label><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={earlyStartRequested} onChange={event => setEarlyStartRequested(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600"/><span>{nl ? "Ik verzoek TopFit Running om tijdens de bedenktijd al te beginnen. Bij herroeping betaal ik naar verhouding voor wat al is uitgevoerd; na volledige uitvoering vervalt mijn herroepingsrecht." : "I request TopFit Running to begin during the cooling-off period. If I withdraw, I pay proportionately for work performed; after full performance my withdrawal right ends."}</span></label><p className="text-xs leading-5 text-slate-600">{nl ? "Na beide bevestigingen opent de Stripe-betaalomgeving. De uiteindelijke knop vermeldt dat je een betalingsverplichting aangaat." : "After both confirmations, Stripe checkout opens. The final button states that the order carries an obligation to pay."}</p></div> : <><div ref={mountRef} className="min-h-[680px] overflow-hidden rounded-xl" />{!ready && !error ? <p className="py-8 text-center text-sm text-slate-500">{nl ? "Veilige betaling laden..." : "Loading secure payment..."}</p> : null}</>}</div>{error ? <div className="rounded-2xl border border-rose-300/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">{error}</div> : null}</CardContent></Card></section>;
};

export default EmbeddedPackageCheckout;
