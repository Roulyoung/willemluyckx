import { offerPath } from "@/lib/proposition";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localizedPath } from "@/lib/localeRoutes";

type AnswerState = Record<string, string>;

type Question = {
  key: string;
  titleNl: string;
  titleEn: string;
  placeholderNl: string;
  placeholderEn: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
};

const questions: Question[] = [
  { key: "name", titleNl: "Wat is je naam?", titleEn: "What is your name?", placeholderNl: "Voor- en achternaam", placeholderEn: "Full name", type: "text" },
  { key: "email", titleNl: "Wat is je e-mailadres?", titleEn: "What is your email address?", placeholderNl: "naam@voorbeeld.nl", placeholderEn: "name@example.com", type: "email" },
  { key: "phone", titleNl: "Wat is je telefoonnummer?", titleEn: "What is your phone number?", placeholderNl: "06 12345678", placeholderEn: "+31 6 12345678", type: "tel" },
  { key: "goal", titleNl: "Wat is je belangrijkste doel?", titleEn: "What is your main goal?", placeholderNl: "Bijv. 10 km, halve marathon, marathon", placeholderEn: "For example: 10K, half marathon, marathon", type: "text" },
  { key: "race_distance", titleNl: "Voor welke afstand of wedstrijd train je?", titleEn: "Which distance or race are you training for?", placeholderNl: "Noem afstand of evenement", placeholderEn: "Name the distance or event", type: "text" },
  { key: "experience", titleNl: "Wat is je huidige hardloopniveau en ervaring?", titleEn: "What is your current running level and experience?", placeholderNl: "Bijv. beginner, 2 jaar ervaring of een recente wedstrijdtijd", placeholderEn: "For example: beginner, 2 years of experience or a recent race time", type: "text" },
  { key: "weekly_volume", titleNl: "Hoeveel loop je ongeveer per week?", titleEn: "How much do you run per week?", placeholderNl: "Bijv. 3x per week / 30 km", placeholderEn: "For example: 3 runs per week / 30 km", type: "text" },
  { key: "main_challenge", titleNl: "Wat is op dit moment je grootste uitdaging?", titleEn: "What is your biggest challenge right now?", placeholderNl: "Bijv. structuur, tempo, motivatie, techniek", placeholderEn: "For example: structure, pace, motivation, technique", type: "textarea" },
  { key: "injuries", titleNl: "Zijn er blessures of signalen waar we rekening mee moeten houden?", titleEn: "Any injuries or physical issues we should consider?", placeholderNl: "Beschrijf kort wat relevant is", placeholderEn: "Describe anything relevant briefly", type: "textarea" },
  { key: "support_type", titleNl: "Welke ondersteuning zoek je het liefst?", titleEn: "What kind of support do you want?", placeholderNl: "Kies een optie", placeholderEn: "Choose an option", type: "select", options: ["Schema", "Looptechniek", "Online coaching", "Fysieke coaching", "Combinatie"] },
  { key: "runs_per_week", titleNl: "Hoeveel keer per week wil je idealiter trainen?", titleEn: "How many times per week do you ideally want to train?", placeholderNl: "Bijv. 3, 4 of 5 keer", placeholderEn: "For example: 3, 4 or 5 times", type: "text" },
  { key: "timeline", titleNl: "Wanneer wil je starten of een doel bereiken?", titleEn: "When do you want to start or reach your goal?", placeholderNl: "Bijv. binnen 8 weken", placeholderEn: "For example: within 8 weeks", type: "text" },
  { key: "coaching_preference", titleNl: "Wat past het beste bij jou: online, fysiek of een combinatie?", titleEn: "What suits you best: online, physical or a combination?", placeholderNl: "Kies of licht toe", placeholderEn: "Choose or explain briefly", type: "select", options: ["Online", "Fysiek", "Combinatie"] },
  { key: "extra_notes", titleNl: "Nog iets dat we moeten weten?", titleEn: "Anything else we should know?", placeholderNl: "Eventuele extra context", placeholderEn: "Any additional context", type: "textarea" },
];

const isDutch = () => {
  if (typeof navigator === "undefined") return true;
  return navigator.language.toLowerCase().startsWith("nl");
};

const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const IntakePage = () => {
  const [searchParams] = useSearchParams();
  const localeParam = searchParams.get("locale")?.toLowerCase();
  const localeNl = localeParam ? localeParam === "nl" : isDutch();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<AnswerState>({
    support_type: "Schema",
    coaching_preference: "Combinatie",
  });

  const progress = useMemo(() => ((step + 1) / (questions.length + 1)) * 100, [step]);
  const currentQuestion = questions[step];
  const isLastQuestion = step === questions.length - 1;
  const controlValue = values[currentQuestion.key] ?? "";
  const currentEmailIsValid = currentQuestion.key !== "email" || emailIsValid(controlValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const isPostPurchaseFlow = searchParams.get("flow") === "checkout" || searchParams.get("paid") === "1";

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const setValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          extra_notes: [values.extra_notes, `${localeNl ? "Niveau en ervaring" : "Level and experience"}: ${values.experience ?? ""}`, searchParams.get("product") === "schema" ? "Aanvraag: persoonlijk schema, 12 weken, €19" : ""].filter(Boolean).join("\n"),
          locale: localeNl ? "nl" : "en",
          source: "intake-page",
          product: searchParams.get("product") ?? "",
        }),
      });
      const rawBody = await response.text();
      let payload: { ok?: boolean; error?: string } = {};
      if (rawBody) {
        try {
          payload = JSON.parse(rawBody) as { ok?: boolean; error?: string };
        } catch {
          payload = { error: rawBody.slice(0, 240) };
        }
      }
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `Submission failed (${response.status})`);
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const locale = localeNl ? "nl" : "en";
    const homeHref = localizedPath(locale, "home");
    const plansHref = localizedPath(locale, localeNl ? "abonnementen" : "subscriptions");
    const schemaHref = offerPath(locale, "schema");
    return (
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8 sm:px-6 sm:py-10 md:px-8">
        <Card className="w-full border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-6 p-6 sm:p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {localeNl ? "Ingestuurd" : "Submitted"}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-4xl md:text-6xl">
              {isPostPurchaseFlow
                ? localeNl
                  ? "Bedankt, we hebben je intake ontvangen."
                  : "Thanks, we received your intake."
                : localeNl
                  ? "Bedankt, we hebben je intake ontvangen."
                  : "Thanks, we received your intake."}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              {isPostPurchaseFlow
                ? localeNl
                  ? "Willem gebruikt je antwoorden om je schema op maat te maken en stuurt het daarna toe. Als er iets ontbreekt, nemen we contact op."
                  : "Willem uses your answers to create your personal plan and sends it to you afterwards. We will contact you if we need more information."
                : localeNl
                  ? "Willem bekijkt je antwoorden en neemt contact met je op. Vraag je het schema van €19 aan? Dan maakt hij het op maat en stuurt het daarna toe."
                  : "Willem will review your answers and get in touch. Requesting the €19 plan? He will create it personally and send it to you afterwards."}
            </p>
            <div className="flex flex-wrap gap-3">
              {isPostPurchaseFlow ? (
                <Button variant="hero" asChild>
                  <Link to={homeHref}>{localeNl ? "Terug naar home" : "Back home"}</Link>
                </Button>
              ) : (
                <>
                  <Button variant="hero" asChild>
                    <Link to={schemaHref}>{localeNl ? "Bekijk het schema van €19" : "View the €19 plan"}</Link>
                  </Button>
                  <Button variant="heroOutline" asChild>
                    <Link to={plansHref}>{localeNl ? "Bekijk begeleiding" : "Explore guidance"}</Link>
                  </Button>
                </>
              )}
            </div>
            <NewsletterSignup locale={locale} />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-10 md:px-8">
      <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
        <CardContent className="space-y-6 p-5 sm:p-6 md:p-8">
          <p className="text-sm leading-7 text-slate-600">{localeNl ? "Jouw schema op maat: €19 voor 12 weken. Vertel Willem over je doel, niveau en trainingsmogelijkheden. Hij maakt je schema en stuurt het daarna toe." : "Your tailored plan: €19 for 12 weeks. Tell Willem about your goal, level and training availability. He will create your plan and send it to you."}</p>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              {localeNl ? "Stap" : "Step"} {step + 1}/{questions.length}
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <ProgressPrimitive.Root value={progress} className="h-full w-full overflow-hidden rounded-full bg-slate-100">
              <ProgressPrimitive.Indicator
                className="h-full rounded-full bg-blue-600 transition-transform duration-300"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </ProgressPrimitive.Root>
          </div>

          <div className="space-y-5">
            <div className="text-lg font-semibold leading-8 text-slate-950 sm:text-xl">
              {localeNl ? currentQuestion.titleNl : currentQuestion.titleEn}
            </div>
            {currentQuestion.type === "select" ? (
              <div className="grid gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setValue(currentQuestion.key, option)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-colors ${
                      controlValue === option
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : currentQuestion.type === "textarea" ? (
              <textarea
                ref={element => { inputRef.current = element; }}
                value={controlValue}
                onChange={(event) => setValue(currentQuestion.key, event.target.value)}
                placeholder={localeNl ? currentQuestion.placeholderNl : currentQuestion.placeholderEn}
                rows={6}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              />
            ) : (
              <input
                ref={element => { inputRef.current = element; }}
                type={currentQuestion.type ?? "text"}
                value={controlValue}
                onChange={(event) => setValue(currentQuestion.key, event.target.value)}
                placeholder={localeNl ? currentQuestion.placeholderNl : currentQuestion.placeholderEn}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              />
            )}
            {currentQuestion.key === "email" && controlValue.trim() && !currentEmailIsValid ? (
              <p className="text-xs font-medium text-red-600">
                {localeNl ? "Gebruik een geldig e-mailadres." : "Use a valid email address."}
              </p>
            ) : null}
          </div>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="heroOutline"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0 || loading}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {localeNl ? "Terug" : "Back"}
            </Button>
            {isLastQuestion ? (
              <Button variant="hero" onClick={handleSubmit} disabled={!controlValue.trim() || !currentEmailIsValid || loading} className="gap-2">
                {loading ? (localeNl ? "Versturen..." : "Sending...") : localeNl ? "Verstuur intake" : "Submit intake"}
              </Button>
            ) : (
              <Button variant="hero" onClick={() => setStep((current) => Math.min(current + 1, questions.length - 1))} disabled={!controlValue.trim() || !currentEmailIsValid} className="gap-2">
                {localeNl ? "Volgende" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default IntakePage;
