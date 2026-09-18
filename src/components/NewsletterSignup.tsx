import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { newsletterConsentText, newsletterConsentVersion } from "@/lib/newsletterConsent";

export const NewsletterSignup = ({ locale }: { locale: Locale }) => {
  const id = useId();
  const nl = locale === "nl";
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent || status === "pending") return;
    setStatus("pending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, locale, consentVersion: newsletterConsentVersion, website }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Signup failed");
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch { setStatus("error"); }
  };
  return <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-8">
    <h2 className="text-2xl font-black text-slate-950">{nl ? "Blijf geïnspireerd" : "Stay inspired"}</h2>
    <p className="mt-3 text-sm leading-7 text-slate-700">{nl ? "Hardlooptips van Willem en nieuws over persoonlijke begeleiding, clinics en lezingen. Meld je aan voor de nieuwsbrief." : "Running tips from Willem and news about personal guidance, clinics and talks. Sign up for the newsletter."}</p>
    {status === "success" ? <p role="status" className="mt-5 font-semibold text-emerald-800">{nl ? "Bedankt! Je bent aangemeld voor de nieuwsbrief." : "Thank you! You are signed up for the newsletter."}</p> : <form onSubmit={submit} className="mt-5 space-y-4">
      <div><label htmlFor={`${id}-email`} className="text-sm font-semibold text-slate-700">{nl ? "E-mailadres" : "Email address"}</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 focus:outline-blue-600" /></div>
      <div className="hidden" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></div>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600" /><span>{newsletterConsentText(locale)}</span></label>
      <Button type="submit" variant="hero" className="h-auto min-h-12 max-w-full whitespace-normal px-4 py-3 text-center" disabled={status === "pending"}>{status === "pending" ? nl ? "Aanmelden…" : "Signing up…" : nl ? "Aanmelden voor nieuwsbrief" : "Subscribe to newsletter"}</Button>
      {status === "error" && <p role="alert" className="text-sm text-red-700">{nl ? "Aanmelden is niet gelukt. Probeer het opnieuw of neem contact met ons op." : "Signup failed. Please try again or contact us."}</p>}
    </form>}
    <p className="mt-4 text-xs leading-6 text-slate-600">{nl ? "Aanmelden is vrijwillig en staat los van je aanvraag. Je kunt je altijd afmelden via " : "Signing up is optional and separate from your enquiry. You can unsubscribe at any time via "}<a className="underline" href="mailto:info@topfitrunning.com?subject=Nieuwsbrief%20afmelden">info@topfitrunning.com</a>.</p>
  </div>;
};
