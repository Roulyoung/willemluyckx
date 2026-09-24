import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";

type CheckoutResponse = { ok?: boolean; url?: string; error?: string };
type Props = { locale: Locale; slug: string; isSuccess: boolean; intakePath: string; loaded: boolean; product: { title: string; price: string; bullets: string[] } };

const EmbeddedPackageCheckout = ({ locale, slug, isSuccess, intakePath, loaded, product }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nl = locale === "nl";
  const startCheckout = async () => {
    try {
      setLoading(true); setError("");
      const response = await fetch("/api/stripe-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, slug, embedded: false }) });
      const result = (await response.json()) as CheckoutResponse;
      if (!response.ok || !result.ok || !result.url) throw new Error(result.error || (nl ? "Afrekenen kon niet worden gestart" : "Checkout could not be started"));
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : nl ? "Afrekenen kon niet worden gestart" : "Checkout could not be started"); setLoading(false);
    }
  };
  if (isSuccess) return <section id="checkout" className="mx-auto max-w-4xl px-5 py-10 md:px-8"><Card className="border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm"><CardContent className="space-y-5 p-6 md:p-8"><div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">{nl ? "Betaling ontvangen" : "Payment received"}</div><h2 className="text-3xl font-black md:text-5xl">{nl ? "Je betaling is gelukt" : "Your payment is complete"}</h2><p className="max-w-3xl text-sm leading-7 text-emerald-950/80 md:text-base">{nl ? "Vul nu de korte intake in, zodat Willem jouw schema persoonlijk kan maken." : "Continue with the short intake so Willem can create your plan personally."}</p><Button variant="hero" asChild><a href={intakePath}>{nl ? "Start de intake" : "Start the intake"}</a></Button></CardContent></Card></section>;
  return <section id="checkout" className={`mx-auto max-w-4xl px-5 py-10 md:px-8 ${loaded ? "animate-fade-up" : ""}`}><Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]"><CardContent className="space-y-7 p-6 md:p-10"><div className="space-y-4"><div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">{nl ? "Veilig afrekenen" : "Secure checkout"}</div><h2 className="text-3xl font-black md:text-5xl">{nl ? "Jouw persoonlijke schema begint hier" : "Your personal plan starts here"}</h2><p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">{nl ? "Controleer je bestelling en ga veilig verder naar Stripe. Na de betaling kom je automatisch terug om je intake in te vullen." : "Review your order and continue securely to Stripe. After payment, you will return here to complete your intake."}</p></div><Card className="border-white/10 bg-white/10 text-white"><CardContent className="space-y-5 p-6"><div className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">{nl ? "Je bestelling" : "Your order"}</div><div><div className="text-lg font-bold">{product.title}</div><div className="text-4xl font-black text-blue-200">{product.price}</div></div><div className="grid gap-3 text-sm text-slate-200">{product.bullets.map((bullet) => <div key={bullet} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" /><span>{bullet}</span></div>)}</div><Button variant="hero" className="w-full" disabled={loading} onClick={startCheckout}>{loading ? (nl ? "Betaling laden..." : "Loading payment...") : (nl ? "Ga veilig naar betaling" : "Continue to secure payment")}</Button><p className="text-xs leading-6 text-slate-300">{nl ? "Eenmalige betaling van €19. Geen abonnement. Betaling wordt verwerkt door Stripe." : "One-off €19 payment. No subscription. Payment is processed by Stripe."}</p></CardContent></Card>{error ? <div className="rounded-2xl border border-rose-300/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">{error}</div> : null}</CardContent></Card></section>;
};

export default EmbeddedPackageCheckout;
