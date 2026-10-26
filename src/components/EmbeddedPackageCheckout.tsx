/* eslint-disable react-hooks/exhaustive-deps */
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale; slug: string; isSuccess: boolean; intakePath: string; loaded: boolean; product: { title: string; price: string; bullets: string[] } };
type CheckoutResult = { ok?: boolean; clientSecret?: string; error?: string };

const EmbeddedPackageCheckout = ({ locale, slug, isSuccess, intakePath, loaded, product }: Props) => {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<{ mount: (element: HTMLElement) => void; destroy: () => void | Promise<void> } | null>(null);
  const nl = locale === "nl";
  const he = locale === "he";
  const t = useCallback((n: string, e: string, h: string) => he ? h : nl ? n : e, [he, nl]);

  useEffect(() => {
    if (isSuccess || !termsAccepted) return;
    let active = true;
    const open = async () => {
      try {
        const configResponse = await fetch("/api/stripe-public-config", { cache: "no-store" });
        const config = await configResponse.json() as { ok?: boolean; publishableKey?: string; error?: string };
        if (!configResponse.ok || !config.ok || !config.publishableKey) throw new Error(config.error || t("Stripe-configuratie ontbreekt", "Stripe configuration is missing", "הגדרת Stripe חסרה"));
        const stripe = await loadStripe(config.publishableKey);
        if (!stripe) throw new Error(t("Stripe kon niet worden geladen", "Stripe could not be loaded", "לא ניתן לטעון את Stripe"));
        const checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const response = await fetch("/api/stripe-checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ locale, slug, embedded: true, termsVersion: "2026-10-13", termsAccepted: true }),
            });
            const result = await response.json() as CheckoutResult;
            if (!response.ok || !result.ok || !result.clientSecret) throw new Error(result.error || t("Afrekenen kon niet worden gestart", "Checkout could not be started", "לא ניתן להתחיל בתשלום"));
            return result.clientSecret;
          },
          onComplete: () => window.location.assign(`${window.location.pathname}?success=1`),
        });
        if (!active || !mountRef.current) {
          await checkout.destroy();
          return;
        }
        checkoutRef.current = checkout;
        checkout.mount(mountRef.current);
        setReady(true);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : t("Afrekenen kon niet worden gestart", "Checkout could not be started", "לא ניתן להתחיל בתשלום"));
      }
    };
    void open();
    return () => {
      active = false;
      const checkout = checkoutRef.current;
      checkoutRef.current = null;
      if (checkout) void checkout.destroy();
    };
  }, [isSuccess, locale, nl, he, slug, termsAccepted]);

  if (isSuccess) return <section className="mx-auto max-w-4xl px-5 py-10 md:px-8"><Card className="border-emerald-200 bg-emerald-50"><CardContent className="space-y-5 p-6 md:p-8"><p className="text-xs font-bold uppercase tracking-[.3em] text-emerald-700">{t("Betaling ontvangen", "Payment received", "התשלום התקבל")}</p><h2 className="text-3xl font-black md:text-5xl">{t("Je betaling is gelukt", "Your payment is complete", "התשלום הושלם בהצלחה")}</h2><p>{t("Vul nu de intake in. Je ontvangt ook een e-mail met de downloadlink naar het boek.", "Complete the intake now. You will also receive an email with the book download link.", "מלאו עכשיו את שאלון הקליטה. תקבלו גם דוא״ל עם קישור להורדת הספר.")}</p><div className="flex flex-wrap gap-3"><Button variant="hero" asChild><a href={intakePath}>{t("Start de intake", "Start the intake", "התחלת שאלון הקליטה")}</a></Button><Button variant="heroOutline" asChild><a href="/downloads/TopFit-Running-Boek.pdf" download>{t("Download het boek (pdf)", "Download the book (PDF)", "הורדת הספר (PDF)")}</a></Button></div></CardContent></Card></section>;

  const termsPath = `/${locale}/${nl ? "algemene-voorwaarden" : "terms"}`;
  return <section className={`mx-auto max-w-5xl px-5 py-10 md:px-8 ${loaded ? "animate-fade-up" : ""}`}><Card className="bg-slate-950 text-white"><CardContent className="space-y-7 p-5 md:p-9"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-blue-300">{t("Veilig afrekenen", "Secure checkout", "תשלום מאובטח")}</p><h2 className="mt-3 text-3xl font-black md:text-5xl">{t("Koop je persoonlijke schema", "Buy your personal plan", "רכישת התוכנית האישית")}</h2><p className="mt-3 text-slate-200">{t("Eenmalig €19 voor een persoonlijk schema van 12 weken. Na betaling volgt de intake.", "A one-off €19 for a personal 12-week plan. The intake follows after payment.", "תשלום חד־פעמי של €19 עבור תוכנית אישית ל־12 שבועות. השאלון יופיע לאחר התשלום.")}</p></div><div className="rounded-3xl bg-white p-5 text-slate-950"><div className="mb-5 flex justify-between gap-4"><span className="flex gap-2 font-bold"><Check className="text-blue-600" />{product.title}</span><strong>{product.price}</strong></div>{!termsAccepted ? <div className="space-y-4 rounded-2xl bg-slate-50 p-5"><p className="font-bold">{t("Controleer en bevestig vóór betaling", "Review and confirm before payment", "בדיקה ואישור לפני התשלום")}</p><label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} /><span>{t("Ik ga akkoord met de ", "I agree to the ", "אני מסכים/ה ל")}<Link className="underline" target="_blank" to={termsPath}>{t("algemene voorwaarden", "terms", "תנאי השימוש")}</Link>{t(" en heb de privacyverklaring gelezen.", " and have read the privacy statement.", " וקראתי את הצהרת הפרטיות.")}</span></label></div> : <><div ref={mountRef} className="min-h-[680px] overflow-hidden rounded-xl" />{!ready && !error ? <p className="py-8 text-center">{t("Veilige betaling laden...", "Loading secure payment...", "טוען תשלום מאובטח...")}</p> : null}</>}</div>{error ? <div className="rounded-2xl bg-rose-950 p-4 text-rose-100">{error}</div> : null}</CardContent></Card></section>;
};

export default EmbeddedPackageCheckout;
