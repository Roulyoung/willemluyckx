import { BrainCircuit, HeartPulse, Leaf, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Locale } from "@/lib/i18n";

const copy = {
  nl: {
    eyebrow: "Gezond Hardlopen in de 21e Eeuw",
    title: "Waarom TopFit Running kiest voor gezondheid boven prestatie",
    lead:
      "Hardlopen moet in de eerste plaats bijdragen aan gezondheid, vitaliteit, energie en levensvreugde. Niet aan extra stress, prestatiedruk of chronische vermoeidheid.",
    science: {
      title: "Wat de wetenschap laat zien",
      text:
        "Regelmatig hardlopen verlaagt het risico op hart- en vaatziekten, diabetes type 2, hoge bloeddruk en vroegtijdig overlijden. Ook mentaal werkt lopen sterk: stress daalt, stemming verbetert en veel lopers ervaren meer helderheid en rust.",
    },
    danger: {
      title: "Wanneer wordt hardlopen ongezond?",
      text:
        "Als elke training sneller moet, elke wedstrijd beter en herstel steeds verder wordt weggedrukt, verandert hardlopen van een bron van gezondheid in een bron van stress.",
    },
    philosophy: {
      title: "Mukti Running",
      text:
        "Mukti betekent bevrijding. Niet de prestatie staat centraal, maar de ervaring: ademhaling, aanwezigheid, natuur en het gevoel dat lopen je energie teruggeeft.",
    },
    bullets: [
      "Gezondheid boven prestaties",
      "Consistentie boven extremen",
      "Herstel als onderdeel van training",
      "Luisteren naar het lichaam",
    ],
    ctaPrimary: "Lees over Mukti Running",
    ctaSecondary: "Bekijk de abonnementen",
  },
  en: {
    eyebrow: "Healthy Running in the 21st Century",
    title: "Why TopFit Running chooses health over performance",
    lead:
      "Running should first and foremost support health, vitality, energy and joy. Not extra stress, pressure or chronic fatigue.",
    science: {
      title: "What the science says",
      text:
        "Regular running lowers the risk of cardiovascular disease, type 2 diabetes, high blood pressure and early death. Mentally, running reduces stress, improves mood and often creates clarity and calm.",
    },
    danger: {
      title: "When does running become unhealthy?",
      text:
        "When every session must be faster, every race must be better and recovery gets pushed aside, running stops being a source of health and becomes a source of stress.",
    },
    philosophy: {
      title: "Mukti Running",
      text:
        "Mukti means liberation. Performance is not the center; the experience is: breathing, presence, nature and the feeling that running gives energy back.",
    },
    bullets: ["Health over performance", "Consistency over extremes", "Recovery is part of training", "Listen to the body"],
    ctaPrimary: "Read about Mukti Running",
    ctaSecondary: "View subscriptions",
  },
  he: {
    eyebrow: "Healthy Running",
    title: "Why TopFit Running chooses health over performance",
    lead:
      "Running should first support health, vitality, energy and joy. Not extra stress, pressure or chronic fatigue.",
    science: {
      title: "What the science says",
      text:
        "Regular running lowers the risk of cardiovascular disease, type 2 diabetes, high blood pressure and early death. Mentally, running reduces stress, improves mood and creates more calm.",
    },
    danger: {
      title: "When does running become unhealthy?",
      text:
        "When every session must be faster and recovery gets pushed aside, running can become a source of stress instead of health.",
    },
    philosophy: {
      title: "Mukti Running",
      text:
        "Mukti means liberation. The focus is breathing, presence, nature and the feeling that running gives energy back.",
    },
    bullets: ["Health over performance", "Consistency over extremes", "Recovery is part of training", "Listen to the body"],
    ctaPrimary: "Read about Mukti Running",
    ctaSecondary: "View subscriptions",
  },
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    science: { title: string; text: string };
    danger: { title: string; text: string };
    philosophy: { title: string; text: string };
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  }
>;

type HomeHealthyRunningSectionProps = {
  locale: Locale;
  loaded: boolean;
};

export const HomeHealthyRunningSection = ({ locale, loaded }: HomeHealthyRunningSectionProps) => {
  const content = copy[locale];
  const muktiHref = locale === "en" ? "/en/mukti-running" : locale === "he" ? "/he/mukti-running" : "/nl/mukti-running";
  const offersHref = locale === "en" ? "/en/subscriptions" : locale === "he" ? "/he/subscriptions" : "/nl/abonnementen";

  return (
    <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${loaded ? "animate-fade-up" : "animate-fade-up"}`}>
      <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.28)]">
        <CardContent className="space-y-8 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                <HeartPulse className="h-4 w-4" />
                {content.eyebrow}
              </div>
              <h2 className="max-w-4xl text-3xl font-black uppercase tracking-[0.04em] sm:text-4xl md:text-5xl">
                {content.title}
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-200">{content.lead}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {content.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="hero" asChild>
                  <Link to={muktiHref}>{content.ctaPrimary}</Link>
                </Button>
                <Button variant="heroOutline" asChild>
                  <Link to={offersHref}>{content.ctaSecondary}</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                    <BrainCircuit className="h-4 w-4" />
                    {content.science.title}
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{content.science.text}</p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                    <TimerReset className="h-4 w-4" />
                    {content.danger.title}
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{content.danger.text}</p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                    <Leaf className="h-4 w-4" />
                    {content.philosophy.title}
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{content.philosophy.text}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
            <span className="font-semibold uppercase tracking-[0.28em] text-blue-200">
              TopFit Running
            </span>
            <span className="ml-3">
              {locale === "nl"
                ? "Gezondheid mag leidend zijn; prestaties mogen volgen."
                : "Health can lead; performance can follow."}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
