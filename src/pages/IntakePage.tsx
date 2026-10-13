import { FormEvent, ReactNode, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { offerPath } from "@/lib/proposition";
import { localizedPath } from "@/lib/localeRoutes";

type AnswerState = Record<string, string>;

const nlGoals = ["Beginnen met hardlopen", "5 km lopen of verbeteren", "10 km lopen of verbeteren", "Halve marathon", "Marathon", "Gezondheid en conditie verbeteren", "Blessurevrij hardlopen", "Ander doel"];
const enGoals = ["Start running", "Run or improve a 5K", "Run or improve a 10K", "Half marathon", "Marathon", "Improve health and fitness", "Run injury-free", "Other goal"];
const nlDays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const enDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const isDutch = () => typeof navigator === "undefined" || navigator.language.toLowerCase().startsWith("nl");
const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const IntakePage = () => {
  const [searchParams] = useSearchParams();
  const localeParam = searchParams.get("locale")?.toLowerCase();
  const localeNl = localeParam ? localeParam === "nl" : isDutch();
  const locale = localeNl ? "nl" : "en";
  const isPostPurchaseFlow = searchParams.get("flow") === "checkout" || searchParams.get("paid") === "1";
  const [values, setValues] = useState<AnswerState>({});
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [healthConsent, setHealthConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const toggleDay = (day: string) => setAvailableDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!emailIsValid(values.email ?? "")) {
      setError(localeNl ? "Vul een geldig e-mailadres in." : "Enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          available_days: availableDays,
          locale,
          source: "post-purchase-intake",
          product: searchParams.get("product") ?? "schema",
          health_consent: healthConsent,
          health_consent_version: "2026-10-14",
          health_consent_recorded_at: new Date().toISOString(),
        }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || `Submission failed (${response.status})`);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : (localeNl ? "Versturen is niet gelukt." : "Submission failed."));
    } finally {
      setLoading(false);
    }
  };

  if (!isPostPurchaseFlow) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-5 p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">TopFit Running</p>
            <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{localeNl ? "De intake volgt na betaling" : "The intake follows payment"}</h1>
            <p className="text-lg leading-8 text-slate-600">{localeNl ? "Na aankoop van je persoonlijke hardloopschema krijg je direct toegang tot het intakeformulier. Zo kan Willem jouw schema voor 12 weken op maat maken." : "After purchasing your personal running plan, you will get direct access to the intake form so Willem can create your tailored 12-week plan."}</p>
            <Button variant="hero" asChild><Link to={offerPath(locale, "schema")}>{localeNl ? "Bekijk het persoonlijke schema" : "View the personal plan"}</Link></Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-6 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700"><CheckCircle2 className="h-4 w-4" />{localeNl ? "Ingestuurd" : "Submitted"}</div>
            <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{localeNl ? "We hebben je intake ontvangen" : "We received your intake"}</h1>
            <p className="text-lg leading-8 text-slate-600">{localeNl ? "Willem gebruikt je antwoorden om je persoonlijke schema te maken. Als er nog iets ontbreekt, neemt hij contact met je op." : "Willem will use your answers to create your personal plan. He will contact you if any information is missing."}</p>
            <Button variant="hero" asChild><Link to={localizedPath(locale, "home")}>{localeNl ? "Terug naar home" : "Back home"}</Link></Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const Input = ({ name, label, type = "text", required = false, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) => (
    <label className="space-y-2 text-sm font-semibold text-slate-700"><span>{label}{required ? " *" : ""}</span><input name={name} type={type} required={required} value={values[name] ?? ""} onChange={(event) => setValue(name, event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-normal text-slate-950 outline-none transition-colors focus:border-blue-500 focus:bg-white" /></label>
  );
  const Textarea = ({ name, label, help, required = false }: { name: string; label: string; help?: string; required?: boolean }) => (
    <label className="space-y-2 text-sm font-semibold text-slate-700"><span>{label}{required ? " *" : ""}</span>{help ? <span className="block font-normal leading-6 text-slate-500">{help}</span> : null}<textarea name={name} required={required} value={values[name] ?? ""} onChange={(event) => setValue(name, event.target.value)} rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-950 outline-none transition-colors focus:border-blue-500 focus:bg-white" /></label>
  );
  const RadioGroup = ({ name, label, options, required = false }: { name: string; label: string; options: string[]; required?: boolean }) => (
    <fieldset className="space-y-3"><legend className="text-sm font-semibold text-slate-700">{label}{required ? " *" : ""}</legend><div className="grid gap-2 sm:grid-cols-2">{options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${values[name] === option ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}><input type="radio" name={name} value={option} required={required} checked={values[name] === option} onChange={(event) => setValue(name, event.target.value)} className="accent-blue-600" />{option}</label>)}</div></fieldset>
  );
  const Section = ({ number, title, children }: { number: number; title: string; children: ReactNode }) => (
    <section className="space-y-5 rounded-3xl border border-slate-200 p-5 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{number}</span><h2 className="text-xl font-black text-slate-950 sm:text-2xl">{title}</h2></div>{children}</section>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10"><CardContent className="space-y-8 p-5 sm:p-8 md:p-10">
        <header className="space-y-3 border-b border-slate-200 pb-7"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">TopFit Running</p><p className="font-semibold text-slate-600">{localeNl ? "Persoonlijke begeleiding • Gezond en verantwoord hardlopen" : "Personal coaching • Healthy and responsible running"}</p><h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{localeNl ? "Intakeformulier – Persoonlijk hardloopschema (12 weken)" : "Intake form – Personal running plan (12 weeks)"}</h1><p className="leading-7 text-slate-600">{localeNl ? "Vul onderstaande vragen zo volledig mogelijk in. Het invullen duurt ongeveer 10–15 minuten." : "Please answer the questions below as fully as possible. This takes about 10–15 minutes."}</p></header>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Section number={1} title={localeNl ? "Persoonlijke gegevens" : "Personal details"}><div className="grid gap-5 sm:grid-cols-2"><Input name="name" label={localeNl ? "Naam en achternaam" : "Full name"} required /><Input name="email" label={localeNl ? "E-mailadres" : "Email address"} type="email" required /><Input name="phone" label={localeNl ? "Mobiel telefoonnummer" : "Mobile phone number"} type="tel" required /><Input name="birth_date" label={localeNl ? "Geboortedatum" : "Date of birth"} type="date" required /></div></Section>
          <Section number={2} title={localeNl ? "Sportervaring en blessures" : "Sports experience and injuries"}><RadioGroup name="training_years" label={localeNl ? "Hoeveel jaar train je al regelmatig?" : "How many years have you trained regularly?"} options={localeNl ? ["Minder dan 1 jaar", "1–3 jaar", "3–5 jaar", "Meer dan 5 jaar"] : ["Less than 1 year", "1–3 years", "3–5 years", "More than 5 years"]} required /><Textarea name="sports_history" label={localeNl ? "Welke sporten beoefen je of heb je beoefend?" : "Which sports do you currently or previously practise?"} /><Textarea name="injuries" label={localeNl ? "Heb je momenteel of recent blessures gehad?" : "Do you currently have, or have you recently had, any injuries?"} /></Section>
          <Section number={3} title={localeNl ? "Persoonlijke records en recente prestaties" : "Personal records and recent performances"}><p className="text-sm leading-6 text-slate-500">{localeNl ? "Vul je beste officiële of gemeten tijden in. Laat leeg wat niet van toepassing is." : "Enter your best official or measured times. Leave fields blank if they do not apply."}</p><div className="grid gap-5 sm:grid-cols-2"><Input name="pr_5k" label={localeNl ? "5 km – persoonlijk record" : "5K – personal best"} placeholder="00:00:00" /><Input name="pr_10k" label={localeNl ? "10 km – persoonlijk record" : "10K – personal best"} placeholder="00:00:00" /><Input name="pr_half" label={localeNl ? "Halve marathon – persoonlijk record" : "Half marathon – personal best"} placeholder="00:00:00" /><Input name="pr_marathon" label={localeNl ? "Marathon – persoonlijk record" : "Marathon – personal best"} placeholder="00:00:00" /></div><Textarea name="recent_times" label={localeNl ? "Wat zijn je beste tijden van de afgelopen 6 maanden?" : "What are your best times from the past 6 months?"} /></Section>
          <Section number={4} title={localeNl ? "Trainingen van de afgelopen maand" : "Training over the past month"}><Textarea name="training_log" label={localeNl ? "Trainingslogboek" : "Training log"} help={localeNl ? "Beschrijf je trainingen van de afgelopen vier weken. Vermeld per training de afstand, tijd, gemiddelde hartslag en soort training." : "Describe your training over the past four weeks. Include distance, time, average heart rate and training type for each session."} required /><Input name="training_overview_url" label={localeNl ? "Deelbare link naar Garmin-, Strava- of Excel-overzicht (optioneel)" : "Share link to Garmin, Strava or Excel overview (optional)"} type="url" placeholder="https://" /><p className="text-sm leading-6 text-slate-500">{localeNl ? "Vermeld bij intervaltraining zo mogelijk de tempo’s en hartslag per herhaling. Controleer of Willem de gedeelde link kan openen." : "For interval sessions, include pace and heart rate per repetition where possible. Make sure Willem can open the shared link."}</p></Section>
          <Section number={5} title={localeNl ? "Beschikbaarheid en aanvullende training" : "Availability and additional training"}><RadioGroup name="runs_per_week" label={localeNl ? "Hoe vaak wil je per week hardlopen?" : "How often do you want to run each week?"} options={localeNl ? ["2 keer", "3 keer", "4 keer", "5 keer", "6 keer of meer"] : ["2 times", "3 times", "4 times", "5 times", "6 times or more"]} required /><fieldset className="space-y-3"><legend className="text-sm font-semibold text-slate-700">{localeNl ? "Op welke dagen kun je trainen? (Meerdere keuzes mogelijk)" : "Which days can you train? (Select all that apply)"} *</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(localeNl ? nlDays : enDays).map((day) => <label key={day} className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-3 text-sm ${availableDays.includes(day) ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}><input type="checkbox" checked={availableDays.includes(day)} onChange={() => toggleDay(day)} className="accent-blue-600" />{day}</label>)}</div></fieldset><RadioGroup name="session_duration" label={localeNl ? "Hoeveel tijd heb je gemiddeld per training?" : "How much time do you usually have per session?"} options={localeNl ? ["30–45 minuten", "45–60 minuten", "60–90 minuten", "Meer dan 90 minuten"] : ["30–45 minutes", "45–60 minutes", "60–90 minutes", "More than 90 minutes"]} required /><Textarea name="strength_training" label={localeNl ? "Wat doe je aan krachttraining?" : "What strength training do you do?"} /><Textarea name="technique_training" label={localeNl ? "Doe je aan looptechniektraining?" : "Do you do running technique training?"} /></Section>
          <Section number={6} title={localeNl ? "Persoonlijk hardloopdoel" : "Personal running goal"}><RadioGroup name="goal" label={localeNl ? "Wat is je belangrijkste doel voor de komende 12 weken?" : "What is your main goal for the next 12 weeks?"} options={localeNl ? nlGoals : enGoals} required />{values.goal === (localeNl ? "Ander doel" : "Other goal") ? <Input name="goal_other" label={localeNl ? "Omschrijf je andere doel" : "Describe your other goal"} required /> : null}<div className="grid gap-5 sm:grid-cols-2"><Input name="target_time" label={localeNl ? "Wat is je gewenste eindtijd (indien van toepassing)?" : "What is your target finish time (if applicable)?"} /><Input name="race_date" label={localeNl ? "Datum van je wedstrijd (indien bekend)" : "Race date (if known)"} type="date" /></div><Textarea name="extra_notes" label={localeNl ? "Andere wensen of opmerkingen" : "Other wishes or comments"} /></Section>
          <Section number={7} title={localeNl ? "Persoonlijke online begeleiding" : "Personal online coaching"}><p className="leading-7 text-slate-600">{localeNl ? "Wil je een persoonlijk online gesprek van 30 minuten met een TopFit Running-trainer? Tijdens dit Zoom-gesprek krijg je uitleg over je trainingsschema en kun je vragen stellen over training, techniek, herstel en blessures. Prijs: € 40." : "Would you like a personal 30-minute online conversation with a TopFit Running trainer? During this Zoom call, you will receive an explanation of your training plan and can ask questions about training, technique, recovery and injuries. Price: €40."}</p><RadioGroup name="online_guidance" label={localeNl ? "Kies een optie" : "Choose an option"} options={localeNl ? ["Ja, ik wil een online gesprek (€ 40)", "Nee, alleen het trainingsschema", "Misschien later"] : ["Yes, I want an online conversation (€40)", "No, the training plan only", "Maybe later"]} required /></Section>
          <label className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700"><input type="checkbox" required checked={healthConsent} onChange={(event) => setHealthConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600" /><span>{localeNl ? "Ik geef uitdrukkelijk toestemming aan TopFit Running om de gegevens die ik over blessures of lichamelijke signalen invul te verwerken voor mijn intake, schema en coaching. Ik kan deze toestemming altijd intrekken via info@topfitrunning.com. Lees de " : "I explicitly consent to TopFit Running processing information I provide about injuries or physical issues for my intake, plan and coaching. I may withdraw this consent at any time via info@topfitrunning.com. Read the "}<Link className="underline" target="_blank" to={`/${locale}/privacy`}>{localeNl ? "privacyverklaring" : "privacy statement"}</Link>.</span></label>
          {availableDays.length === 0 ? <p className="text-sm text-amber-700">{localeNl ? "Kies minimaal één beschikbare trainingsdag." : "Select at least one available training day."}</p> : null}
          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          <Button variant="hero" type="submit" disabled={loading || !healthConsent || availableDays.length === 0}>{loading ? (localeNl ? "Versturen..." : "Sending...") : (localeNl ? "Verstuur intake" : "Submit intake")}</Button>
        </form>
      </CardContent></Card>
    </main>
  );
};

export default IntakePage;
