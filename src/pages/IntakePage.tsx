import { FormEvent, ReactNode, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { offerPath } from "@/lib/proposition";
import { localizedPath } from "@/lib/localeRoutes";
import type { Locale } from "@/lib/i18n";

type AnswerState = Record<string, string>;

const nlGoals = ["Beginnen met hardlopen", "5 km lopen of verbeteren", "10 km lopen of verbeteren", "Halve marathon", "Marathon", "Gezondheid en conditie verbeteren", "Blessurevrij hardlopen", "Ander doel"];
const enGoals = ["Start running", "Run or improve a 5K", "Run or improve a 10K", "Half marathon", "Marathon", "Improve health and fitness", "Run injury-free", "Other goal"];
const heGoals = ["להתחיל לרוץ", "לרוץ 5 ק״מ או לשפר תוצאה", "לרוץ 10 ק״מ או לשפר תוצאה", "חצי מרתון", "מרתון", "לשפר את הבריאות והכושר", "לרוץ ללא פציעות", "מטרה אחרת"];
const nlDays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const enDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const heDays = ["יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת", "יום ראשון"];

const isDutch = () => typeof navigator === "undefined" || navigator.language.toLowerCase().startsWith("nl");
const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const IntakePage = () => {
  const [searchParams] = useSearchParams();
  const localeParam = searchParams.get("locale")?.toLowerCase();
  const localeNl = localeParam ? localeParam === "nl" : isDutch();
  const localeHe = localeParam === "he";
  const locale: Locale = localeHe ? "he" : localeNl ? "nl" : "en";
  const t = (nl: string, en: string, he: string) => localeHe ? he : localeNl ? nl : en;
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
      setError(t("Vul een geldig e-mailadres in.", "Enter a valid email address.", "יש להזין כתובת דוא״ל תקינה."));
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
      setError(submitError instanceof Error ? submitError.message : t("Versturen is niet gelukt.", "Submission failed.", "שליחת הטופס נכשלה."));
    } finally {
      setLoading(false);
    }
  };

  if (!isPostPurchaseFlow) {
    return (
      <section dir={localeHe ? "rtl" : "ltr"} className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-5 p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">TopFit Running</p>
            <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{t("De intake volgt na betaling", "The intake follows payment", "שאלון הקליטה זמין לאחר התשלום")}</h1>
            <p className="text-lg leading-8 text-slate-600">{t("Na aankoop van je persoonlijke hardloopschema krijg je direct toegang tot het intakeformulier. Zo kan Willem jouw schema voor 12 weken op maat maken.", "After purchasing your personal running plan, you will get direct access to the intake form so Willem can create your tailored 12-week plan.", "לאחר רכישת תוכנית הריצה האישית תקבלו גישה מיידית לשאלון. כך וילם יוכל להכין עבורכם תוכנית מותאמת ל־12 שבועות.")}</p>
            <Button variant="hero" asChild><Link to={offerPath(locale, "schema")}>{t("Bekijk het persoonlijke schema", "View the personal plan", "לצפייה בתוכנית האישית")}</Link></Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (submitted) {
    return (
      <section dir={localeHe ? "rtl" : "ltr"} className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-6 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700"><CheckCircle2 className="h-4 w-4" />{t("Ingestuurd", "Submitted", "נשלח")}</div>
            <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{t("We hebben je intake ontvangen", "We received your intake", "קיבלנו את שאלון הקליטה שלכם")}</h1>
            <p className="text-lg leading-8 text-slate-600">{t("Willem gebruikt je antwoorden om je persoonlijke schema te maken. Als er nog iets ontbreekt, neemt hij contact met je op.", "Willem will use your answers to create your personal plan. He will contact you if any information is missing.", "וילם ישתמש בתשובות כדי להכין את התוכנית האישית שלכם. אם יחסר מידע, הוא ייצור איתכם קשר.")}</p>
            <Button variant="hero" asChild><Link to={localizedPath(locale, "home")}>{t("Terug naar home", "Back home", "חזרה לדף הבית")}</Link></Button>
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
    <main dir={localeHe ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10"><CardContent className="space-y-8 p-5 sm:p-8 md:p-10">
        <header className="space-y-3 border-b border-slate-200 pb-7"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">TopFit Running</p><p className="font-semibold text-slate-600">{t("Persoonlijke begeleiding • Gezond en verantwoord hardlopen", "Personal coaching • Healthy and responsible running", "ליווי אישי • ריצה בריאה ואחראית")}</p><h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl">{t("Intakeformulier – Persoonlijk hardloopschema (12 weken)", "Intake form – Personal running plan (12 weeks)", "שאלון קליטה – תוכנית ריצה אישית (12 שבועות)")}</h1><p className="leading-7 text-slate-600">{t("Vul onderstaande vragen zo volledig mogelijk in. Het invullen duurt ongeveer 10–15 minuten.", "Please answer the questions below as fully as possible. This takes about 10–15 minutes.", "אנא מלאו את השאלות הבאות באופן מלא ככל האפשר. המילוי אורך כ־10–15 דקות.")}</p></header>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Section number={1} title={t("Persoonlijke gegevens", "Personal details", "פרטים אישיים")}><div className="grid gap-5 sm:grid-cols-2"><Input name="name" label={t("Naam en achternaam", "Full name", "שם מלא")} required /><Input name="email" label={t("E-mailadres", "Email address", "כתובת דוא״ל")} type="email" required /><Input name="phone" label={t("Mobiel telefoonnummer", "Mobile phone number", "מספר טלפון נייד")} type="tel" required /><Input name="birth_date" label={t("Geboortedatum", "Date of birth", "תאריך לידה")} type="date" required /></div></Section>
          <Section number={2} title={t("Sportervaring en blessures", "Sports experience and injuries", "ניסיון ספורטיבי ופציעות")}><RadioGroup name="training_years" label={t("Hoeveel jaar train je al regelmatig?", "How many years have you trained regularly?", "כמה שנים אתם מתאמנים באופן קבוע?")} options={localeHe ? ["פחות משנה", "1–3 שנים", "3–5 שנים", "יותר מ־5 שנים"] : localeNl ? ["Minder dan 1 jaar", "1–3 jaar", "3–5 jaar", "Meer dan 5 jaar"] : ["Less than 1 year", "1–3 years", "3–5 years", "More than 5 years"]} required /><Textarea name="sports_history" label={t("Welke sporten beoefen je of heb je beoefend?", "Which sports do you currently or previously practise?", "באילו ענפי ספורט אתם עוסקים או עסקתם בעבר?")} /><Textarea name="injuries" label={t("Heb je momenteel of recent blessures gehad?", "Do you currently have, or have you recently had, any injuries?", "האם יש לכם כרגע פציעות או שסבלתם מפציעות לאחרונה?")} /></Section>
          <Section number={3} title={t("Persoonlijke records en recente prestaties", "Personal records and recent performances", "שיאים אישיים ותוצאות אחרונות")}><p className="text-sm leading-6 text-slate-500">{t("Vul je beste officiële of gemeten tijden in. Laat leeg wat niet van toepassing is.", "Enter your best official or measured times. Leave fields blank if they do not apply.", "הזינו את הזמנים הרשמיים או המדודים הטובים ביותר שלכם. השאירו ריק מה שאינו רלוונטי.")}</p><div className="grid gap-5 sm:grid-cols-2"><Input name="pr_5k" label={t("5 km – persoonlijk record", "5K – personal best", "5 ק״מ – שיא אישי")} placeholder="00:00:00" /><Input name="pr_10k" label={t("10 km – persoonlijk record", "10K – personal best", "10 ק״מ – שיא אישי")} placeholder="00:00:00" /><Input name="pr_half" label={t("Halve marathon – persoonlijk record", "Half marathon – personal best", "חצי מרתון – שיא אישי")} placeholder="00:00:00" /><Input name="pr_marathon" label={t("Marathon – persoonlijk record", "Marathon – personal best", "מרתון – שיא אישי")} placeholder="00:00:00" /></div><Textarea name="recent_times" label={t("Wat zijn je beste tijden van de afgelopen 6 maanden?", "What are your best times from the past 6 months?", "מהם הזמנים הטובים ביותר שלכם בששת החודשים האחרונים?")} /></Section>
          <Section number={4} title={t("Trainingen van de afgelopen maand", "Training over the past month", "האימונים בחודש האחרון")}><Textarea name="training_log" label={t("Trainingslogboek", "Training log", "יומן אימונים")} help={t("Beschrijf je trainingen van de afgelopen vier weken. Vermeld per training de afstand, tijd, gemiddelde hartslag en soort training.", "Describe your training over the past four weeks. Include distance, time, average heart rate and training type for each session.", "תארו את האימונים בארבעת השבועות האחרונים. לכל אימון ציינו מרחק, זמן, דופק ממוצע וסוג האימון.")} required /><Input name="training_overview_url" label={t("Deelbare link naar Garmin-, Strava- of Excel-overzicht (optioneel)", "Share link to Garmin, Strava or Excel overview (optional)", "קישור משותף לסיכום Garmin, Strava או Excel (לא חובה)")} type="url" placeholder="https://" /><p className="text-sm leading-6 text-slate-500">{t("Vermeld bij intervaltraining zo mogelijk de tempo’s en hartslag per herhaling. Controleer of Willem de gedeelde link kan openen.", "For interval sessions, include pace and heart rate per repetition where possible. Make sure Willem can open the shared link.", "באימוני אינטרוולים ציינו, אם אפשר, את הקצב והדופק בכל חזרה. ודאו שווילם יכול לפתוח את הקישור המשותף.")}</p></Section>
          <Section number={5} title={t("Beschikbaarheid en aanvullende training", "Availability and additional training", "זמינות ואימונים נוספים")}><RadioGroup name="runs_per_week" label={t("Hoe vaak wil je per week hardlopen?", "How often do you want to run each week?", "כמה פעמים בשבוע תרצו לרוץ?")} options={localeHe ? ["פעמיים", "3 פעמים", "4 פעמים", "5 פעמים", "6 פעמים או יותר"] : localeNl ? ["2 keer", "3 keer", "4 keer", "5 keer", "6 keer of meer"] : ["2 times", "3 times", "4 times", "5 times", "6 times or more"]} required /><fieldset className="space-y-3"><legend className="text-sm font-semibold text-slate-700">{t("Op welke dagen kun je trainen? (Meerdere keuzes mogelijk)", "Which days can you train? (Select all that apply)", "באילו ימים תוכלו להתאמן? (אפשר לבחור כמה ימים)")} *</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(localeHe ? heDays : localeNl ? nlDays : enDays).map((day) => <label key={day} className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-3 text-sm ${availableDays.includes(day) ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}><input type="checkbox" checked={availableDays.includes(day)} onChange={() => toggleDay(day)} className="accent-blue-600" />{day}</label>)}</div></fieldset><RadioGroup name="session_duration" label={t("Hoeveel tijd heb je gemiddeld per training?", "How much time do you usually have per session?", "כמה זמן עומד לרשותכם בממוצע לכל אימון?")} options={localeHe ? ["30–45 דקות", "45–60 דקות", "60–90 דקות", "יותר מ־90 דקות"] : localeNl ? ["30–45 minuten", "45–60 minuten", "60–90 minuten", "Meer dan 90 minuten"] : ["30–45 minutes", "45–60 minutes", "60–90 minutes", "More than 90 minutes"]} required /><Textarea name="strength_training" label={t("Wat doe je aan krachttraining?", "What strength training do you do?", "איזה אימון כוח אתם מבצעים?")} /><Textarea name="technique_training" label={t("Doe je aan looptechniektraining?", "Do you do running technique training?", "האם אתם מתאמנים על טכניקת ריצה?")} /></Section>
          <Section number={6} title={t("Persoonlijk hardloopdoel", "Personal running goal", "מטרת ריצה אישית")}><RadioGroup name="goal" label={t("Wat is je belangrijkste doel voor de komende 12 weken?", "What is your main goal for the next 12 weeks?", "מהי המטרה העיקרית שלכם ל־12 השבועות הקרובים?")} options={localeHe ? heGoals : localeNl ? nlGoals : enGoals} required />{values.goal === (localeHe ? "מטרה אחרת" : localeNl ? "Ander doel" : "Other goal") ? <Input name="goal_other" label={t("Omschrijf je andere doel", "Describe your other goal", "תארו את המטרה האחרת")} required /> : null}<div className="grid gap-5 sm:grid-cols-2"><Input name="target_time" label={t("Wat is je gewenste eindtijd (indien van toepassing)?", "What is your target finish time (if applicable)?", "מהו זמן היעד שלכם (אם רלוונטי)?")} /><Input name="race_date" label={t("Datum van je wedstrijd (indien bekend)", "Race date (if known)", "תאריך התחרות (אם ידוע)")} type="date" /></div><Textarea name="extra_notes" label={t("Andere wensen of opmerkingen", "Other wishes or comments", "בקשות או הערות נוספות")} /></Section>
          <Section number={7} title={t("Persoonlijke online begeleiding", "Personal online coaching", "ליווי אישי מקוון")}><p className="leading-7 text-slate-600">{t("Wil je een persoonlijk online gesprek van 30 minuten met een TopFit Running-trainer? Tijdens dit Zoom-gesprek krijg je uitleg over je trainingsschema en kun je vragen stellen over training, techniek, herstel en blessures. Prijs: € 40.", "Would you like a personal 30-minute online conversation with a TopFit Running trainer? During this Zoom call, you will receive an explanation of your training plan and can ask questions about training, technique, recovery and injuries. Price: €40.", "האם תרצו שיחה אישית מקוונת של 30 דקות עם מאמן TopFit Running? בשיחת Zoom תקבלו הסבר על תוכנית האימונים ותוכלו לשאול על אימון, טכניקה, התאוששות ופציעות. מחיר: €40.")}</p><RadioGroup name="online_guidance" label={t("Kies een optie", "Choose an option", "בחרו אפשרות")} options={localeHe ? ["כן, אני רוצה שיחה מקוונת (€40)", "לא, רק את תוכנית האימונים", "אולי בהמשך"] : localeNl ? ["Ja, ik wil een online gesprek (€ 40)", "Nee, alleen het trainingsschema", "Misschien later"] : ["Yes, I want an online conversation (€40)", "No, the training plan only", "Maybe later"]} required /></Section>
          <label className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700"><input type="checkbox" required checked={healthConsent} onChange={(event) => setHealthConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600" /><span>{t("Ik geef uitdrukkelijk toestemming aan TopFit Running om de gegevens die ik over blessures of lichamelijke signalen invul te verwerken voor mijn intake, schema en coaching. Ik kan deze toestemming altijd intrekken via info@topfitrunning.com. Lees de ", "I explicitly consent to TopFit Running processing information I provide about injuries or physical issues for my intake, plan and coaching. I may withdraw this consent at any time via info@topfitrunning.com. Read the ", "אני מסכים/ה במפורש לכך ש־TopFit Running יעבדו את המידע שאמסור על פציעות או תסמינים גופניים לצורך שאלון הקליטה, התוכנית והליווי. ניתן לבטל את ההסכמה בכל עת דרך info@topfitrunning.com. קראו את ")}<Link className="underline" target="_blank" to={`/${locale}/privacy`}>{t("privacyverklaring", "privacy statement", "הצהרת הפרטיות")}</Link>.</span></label>
          {availableDays.length === 0 ? <p className="text-sm text-amber-700">{t("Kies minimaal één beschikbare trainingsdag.", "Select at least one available training day.", "בחרו לפחות יום אימון אחד שבו אתם זמינים.")}</p> : null}
          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          <Button variant="hero" type="submit" disabled={loading || !healthConsent || availableDays.length === 0}>{loading ? t("Versturen...", "Sending...", "שולח...") : t("Verstuur intake", "Submit intake", "שליחת השאלון")}</Button>
        </form>
      </CardContent></Card>
    </main>
  );
};

export default IntakePage;
