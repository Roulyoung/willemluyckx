/* Intentionally unlinked: this page is only for a controlled live-payment test. */
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

const StripeTestPage = ({ locale }: { locale: Locale }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [earlyStartRequested, setEarlyStartRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(new URLSearchParams(window.location.search).get("success") === "1");
  const [error, setError] = useState("");
  const mountRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<{ mount: (element: HTMLElement) => void; destroy: () => void | Promise<void> } | null>(null);

  useEffect(() => {
    if (success || !termsAccepted || !earlyStartRequested) return;
    let active = true;

    const openCheckout = async () => {
      try {
        const configResponse = await fetch("/api/stripe-public-config", { cache: "no-store" });
        const config = await configResponse.json() as { ok?: boolean; publishableKey?: string; error?: string };
        if (!configResponse.ok || !config.ok || !config.publishableKey) throw new Error(config.error || "Stripe configuration is missing");
        const stripe = await loadStripe(config.publishableKey);
        if (!stripe) throw new Error("Stripe could not be loaded");
        const checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const response = await fetch("/api/stripe-checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                locale,
                slug: "stripe-test-1-eur",
                embedded: true,
                termsVersion: "stripe-live-test-2026-10-15",
                termsAccepted: true,
                earlyStartRequested: true,
              }),
            });
            const result = await response.json() as { ok?: boolean; clientSecret?: string; error?: string };
            if (!response.ok || !result.ok || !result.clientSecret) throw new Error(result.error || "Checkout could not be started");
            return result.clientSecret;
          },
          onComplete: () => setSuccess(true),
        });
        if (!active || !mountRef.current) {
          await checkout.destroy();
          return;
        }
        checkoutRef.current = checkout;
        checkout.mount(mountRef.current);
        setReady(true);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Checkout could not be started");
      }
    };

    void openCheckout();
    return () => {
      active = false;
      const checkout = checkoutRef.current;
      checkoutRef.current = null;
      if (checkout) void checkout.destroy();
    };
  }, [earlyStartRequested, locale, success, termsAccepted]);

  if (success) {
    return <section className="mx-auto max-w-3xl space-y-5 px-5 py-12 md:px-8">
      <Card className="border-emerald-200 bg-emerald-50"><CardContent className="space-y-4 p-7">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-emerald-700">Stripe live test</p>
        <h1 className="text-3xl font-black text-slate-950">Betaling ontvangen</h1>
        <p className="text-slate-700">De betaling van €1 is door Stripe voltooid. Controleer nu de webhook, de twee e-mails en de terugbetaling in Stripe.</p>
        <Button variant="heroOutline" onClick={() => { setSuccess(false); window.history.replaceState({}, "", window.location.pathname); }}>Nogmaals testen</Button>
      </CardContent></Card>
    </section>;
  }

  return <section className="mx-auto max-w-4xl space-y-6 px-5 py-12 md:px-8">
    <div className="space-y-3"><p className="text-xs font-bold uppercase tracking-[.3em] text-amber-700">Niet gelinkt · live test</p><h1 className="text-4xl font-black text-slate-950 md:text-6xl">Stripe testbetaling van €1</h1><p className="text-lg leading-8 text-slate-600">Deze verborgen pagina is alleen bedoeld voor een gecontroleerde productiecheck. Er wordt één echte betaling van €1 gestart.</p></div>
    <Card className="bg-slate-950 text-white"><CardContent className="space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 font-bold"><Check className="text-blue-300" /> Stripe live testproduct</span><strong className="text-2xl">€1,00</strong></div>
      <div className="space-y-4 rounded-2xl bg-white p-5 text-slate-950">
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>Ik begrijp dat dit een echte livebetaling van €1 is.</span></label>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={earlyStartRequested} onChange={(event) => setEarlyStartRequested(event.target.checked)} /><span>Ik bevestig dat ik de testbetaling nu wil starten.</span></label>
      </div>
      {termsAccepted && earlyStartRequested ? <div ref={mountRef} className="min-h-[680px] overflow-hidden rounded-xl bg-white" /> : <p className="text-slate-300">Vink beide bevestigingen aan om Stripe te laden.</p>}
      {termsAccepted && earlyStartRequested && !ready && !error ? <p className="text-center text-slate-300">Stripe laden…</p> : null}
      {error ? <p className="rounded-xl bg-rose-950 p-4 text-rose-100">{error}</p> : null}
    </CardContent></Card>
  </section>;
};

export default StripeTestPage;
