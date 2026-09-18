import { offerPath } from "@/lib/proposition";
import { CalendarDays, ChevronRight, Check, Clock3, Globe2, MapPin, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogFeatureCard } from "@/components/BlogFeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import techniqueImage from "@/assets/technique-running.jpg";
import muktiLogo from "@/assets/topfit/photos/mukti-logo-transparent.png";
import { type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localeRoutes";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { LocaleContent } from "@/lib/topfitContent";
import { hardloopwedstrijden as staticHardloopwedstrijden, type CalendarRow } from "@/data/hardloopwedstrijden";

const fadeClass = (_loaded: boolean) => "animate-fade-up";

const trainingCampWeeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const trainingCampDays = [
  { key: "Monday", label: "Maandag" },
  { key: "Tuesday", label: "Dinsdag" },
  { key: "Wednesday", label: "Woensdag" },
  { key: "Thursday", label: "Donderdag" },
  { key: "Friday", label: "Vrijdag" },
  { key: "Saturday", label: "Zaterdag" },
  { key: "Sunday", label: "Zondag" },
];

const translateTrainingLine = (value: string) => {
  let text = value.trim().replace(/^"|"$/g, "");

  text = text
    .replace(/\bw\.u\b/gi, "Warm-up")
    .replace(/\bc\.d\b/gi, "Cool-down")
    .replace(/\beasy\b/gi, "Rustige duurloop")
    .replace(/\ba\.r\b/gi, "Actief herstel")
    .replace(/\bRest\b/g, "Rustdag")
    .replace(/\brest\b/g, "Rustdag")
    .replace(/\bcross-training\b/gi, "Cross-training")
    .replace(/\bfartlek\b/gi, "Fartlek (vaartspel)")
    .replace(/\btempo\b/gi, "Tempoloop");

  text = text.replace(/\((\d+)'\)/g, "($1 min. rust)");
  text = text.replace(/\(\s*(\d+)'\s*\)/g, "($1 min. rust)");
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

const trainingCampSchedule: Record<string, string[]> = {
  Monday: ["Rest", "Rest", "Rest", "Rest", "Rest", "Rest", "Rest", "Rest", "Rest", "Rest"],
  Tuesday: [
    "2k w.u\n4x600 (2')\n2k c.d",
    "2k w.u\n4x600 (2')\n2k c.d",
    "2k w.u\n5x600 (2')\n2k c.d",
    "2k w.u\n5x600 (2')\n2k c.d",
    "2k w.u\n5x800 (2')\n2k c.d",
    "2k w.u\n5x800 (2')\n2k c.d",
    "2k w.u\n5x800 (2')\n2k c.d",
    "2k w.u\n6k easy\n2k c.d",
    "2k w.u\n6x800 (2')\n2k c.d",
    "2k w.u\n5x1000 (3')\n2k c.d",
  ],
  Wednesday: ["8k easy", "8k easy", "9k easy", "9k easy", "10k easy", "10k easy", "11k easy", "8k easy", "11k easy", "11 easy"],
  Thursday: [
    "cross-training",
    "cross-training",
    "cross-training",
    "cross-training",
    "cross-training",
    "cross-training",
    "cross-training",
    "2k w.u\n10x400 (2')\n2k c.d",
    "8k fartlek",
    "2k w.u\n5k tempo\n2k c.d",
  ],
  Friday: ["rest", "rest", "rest", "rest", "rest", "rest", "rest", "Rest", "Rest", "Rest"],
  Saturday: [
    "8k easy\n4x80 a.r",
    "8k easy\n4x80 a.r",
    "9k easy\n4x80 a.r",
    "9k easy\n4x80 a.r",
    "10k easy\n4x80 a.r",
    "10k easy\n4x80 a.r",
    "11k easy\n4x80 a.r",
    "5k easy +4x80",
    "11k easy\n4x100 a.r",
    "12k easy\n4x100 a.r",
  ],
  Sunday: ["10k easy", "10k easy", "11k easy", "11k easy", "12k easy", "12k easy", "13k easy", "Wedstrijd", "13k easy", "14k easy"],
};

const totalKilometers = ["33", "33", "37", "37", "41", "41", "44", "45", "53", "56"];

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

const formatCalendarDate = (value: string, locale: Locale) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value;

  const [, day, month, year] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const parseCalendarDateKey = (value: string) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const PriceBlock = ({
  price,
  align = "left",
  className = "",
  emphasis = false,
}: {
  price: string;
  align?: "left" | "right";
  className?: string;
  emphasis?: boolean;
}) => {
  const { main, suffix } = formatPrice(price);
  return (
    <div className={`${align === "right" ? "text-right" : "text-left"} space-y-1 ${className}`}>
      <div className={`${emphasis ? "text-4xl md:text-5xl" : "text-2xl"} font-black tracking-[0.02em] text-current`}>{main}</div>
      {suffix ? <div className={`${emphasis ? "text-[11px]" : "text-[10px]"} font-semibold uppercase tracking-[0.32em] text-current/60`}>{suffix}</div> : null}
    </div>
  );
};

export const BlogIndexPage = ({
  locale,
  content,
  highlight,
  loaded,
}: {
  locale: Locale;
  content: LocaleContent;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  return (
    <>
      <section id="blog-index" className="mx-auto max-w-7xl px-5 pb-10 pt-10 md:px-8">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
              <Clock3 className="h-4 w-4" />
              {highlight.title}
            </div>
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Blog / knowledge base" : "Blog / kennisbank"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to={`/${locale}/contact`}>{locale === "en" ? "Ask a question" : "Stel een vraag"}</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={offerPath(locale)}>{locale === "en" ? "View offers" : "Bekijk aanbod"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="blog-cards" className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {content.blog.map((post) => (
            <BlogFeatureCard key={post.slug} locale={locale} post={post} />
          ))}
        </div>
      </section>

      <section id="blog-cta" className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {locale === "en" ? "Need a direct answer?" : "Direct antwoord nodig?"}
              </div>
              <p className="text-lg leading-8 text-slate-200">
                {locale === "en"
                  ? "Use the blog for depth and the contact route for the next step."
                  : "Gebruik de blog voor verdieping en het contactkanaal voor de volgende stap."}
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Contact" : "Contact"}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section id="blog-race-calendar" className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {locale === "en" ? "Race calendar" : "Wedstrijdkalender"}
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "Use the hardloopkalender for a quick race overview, then read the blog for planning tips and selection advice."
                  : "Gebruik de hardloopkalender voor een snel wedstrijdoverzicht en lees de blog voor planningstips en keuzeadvies."}
              </p>
            </div>
            <Button variant="heroOutline" asChild>
              <Link to={`/${locale}/hardloopkalender`}>{locale === "en" ? "Open calendar" : "Open kalender"}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export const HardloopCalendarPage = ({
  locale,
  content,
  highlight,
  loaded,
}: {
  locale: Locale;
  content: LocaleContent;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const isEn = locale === "en";
  const [liveRows, setLiveRows] = useState<CalendarRow[] | null>(null);
  const fallbackRows = staticHardloopwedstrijden;

  useEffect(() => {
    let active = true;

    void fetch(`/api/topfit?locale=${locale}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { ok?: boolean; content?: { hardloopwedstrijden?: typeof fallbackRows } };
      })
      .then((payload) => {
        if (!active || !payload?.ok) return;
        const rows = payload.content?.hardloopwedstrijden;
        if (Array.isArray(rows) && rows.length > 0) {
          setLiveRows(rows);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [locale]);

  const sourceRows =
    liveRows && liveRows.length > 0
      ? liveRows
      : content.hardloopwedstrijden.length > 0
        ? content.hardloopwedstrijden
        : fallbackRows;
  const hasStructuredSourceRows = sourceRows.some((row) => row.date && row.distance && (row.location || row.title));
  const resolvedRows = hasStructuredSourceRows ? sourceRows : fallbackRows;

  const calendarRows = [...resolvedRows]
    .sort((a, b) => {
      const featuredDiff = Number(b.featured ?? false) - Number(a.featured ?? false);
      if (featuredDiff !== 0) return featuredDiff;
      return parseCalendarDateKey(a.date) - parseCalendarDateKey(b.date);
    })
    .filter((row) => row.title || row.location || row.date);
  const columns = isEn ? ["Race / location", "Date", "Distance", "Surface"] : ["Wedstrijd / locatie", "Datum", "Afstand", "Ondergrond"];

  return (
    <>
      <section id="technique-hero" className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <CalendarDays className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {isEn ? "Hardloop calendar" : "Hardloopkalender"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              {isEn
                ? "Choose a race, choose your training goal and turn that goal into a structured plan with coaching."
                : "Kies een wedstrijd, kies je trainingsdoel en vertaal dat doel naar een gestructureerd plan met begeleiding."}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              {isEn
                ? "This calendar helps you move from inspiration to a concrete goal faster."
                : "Deze kalender helpt je sneller van inspiratie naar een concreet doel te gaan."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {isEn ? "Personal plan · €19" : "Persoonlijk schema · €19"}
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {isEn
                  ? "Willem creates a 12-week plan tailored to your distance, level and race goal, then sends it to you."
                  : "Willem maakt een schema voor 12 weken op maat voor jouw afstand, niveau en wedstrijddoel en stuurt het toe."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {isEn ? "Zoom Check · €40" : "Zoom Check · €40"}
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {isEn
                  ? "Discuss your training questions with Willem during a personal 30-minute Zoom session."
                  : "Bespreek je trainingsvragen met Willem tijdens een persoonlijke Zoom-sessie van 30 minuten."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm">
            <Button variant="hero" size="lg" asChild className="h-auto min-h-14 max-w-full flex-1 whitespace-normal px-6 text-center sm:flex-none">
              <Link to={offerPath(locale, "schema")}>
                {isEn ? "View the €19 plan" : "Bekijk het schema van €19"}
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild className="h-auto min-h-14 max-w-full flex-1 whitespace-normal px-6 text-center sm:flex-none">
              <Link to={offerPath(locale, "zoom")}>
                {isEn ? "View the Zoom Check" : "Bekijk de Zoom Check"}
              </Link>
            </Button>
            <div className="flex-1 min-w-[16rem] self-center text-sm leading-7 text-slate-600">
              {isEn
                ? "Start with a tailored plan and add personal guidance when you need it."
                : "Begin met een schema op maat en kies persoonlijke begeleiding wanneer je die nodig hebt."}
            </div>
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-[0_30px_80px_rgba(13,46,102,0.16)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
              {isEn ? "Race overview" : "Wedstrijdoverzicht"}
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {isEn
                ? "Use this calendar to compare races by date, distance and surface, then turn a good match into a concrete race goal."
                : "Gebruik deze kalender om wedstrijden te vergelijken op datum, afstand en ondergrond, en maak van een goede match een concreet wedstrijddoel."}
            </p>
            <div className="grid gap-3">
              {highlight.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 md:px-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                {isEn ? "Selected races" : "Geselecteerde wedstrijden"}
              </div>
            </div>
            <div className="hidden border-b border-slate-200 bg-white px-6 py-3 md:grid md:grid-cols-[1.4fr_0.85fr_0.8fr_0.8fr] md:px-8">
              {columns.map((column) => (
                <div key={column} className="text-left text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {column}
                </div>
              ))}
            </div>
            <div className="divide-y divide-slate-200">
              {calendarRows.map((row) => (
                <div key={`${row.title}-${row.location}-${row.date}-${row.distance}`} className="grid gap-3 px-6 py-5 md:grid-cols-[1.4fr_0.85fr_0.8fr_0.8fr] md:items-start md:px-8">
                  <div className="text-left">
                    <div className="text-lg font-black uppercase tracking-[0.04em] text-slate-950">{row.title}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">{row.location}</div>
                    <div className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                      {row.country}
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 md:hidden">
                      {columns[1]}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{formatCalendarDate(row.date, locale)}</div>
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 md:hidden">
                      {columns[2]}
                    </div>
                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{row.distance}</div>
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 md:hidden">
                      {columns[3]}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{row.surface}</div>
                    <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {row.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="subscriptions-hero" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            isEn ? "Race selection" : "Wedstrijdkeuze",
            isEn ? "Goal setting" : "Doel bepalen",
            isEn ? "Plan the build-up" : "Opbouw plannen",
          ].map((item) => (
            <Card key={item} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                  <MapPin className="h-3.5 w-3.5" />
                  {isEn ? "Step" : "Stap"}
                </div>
                <h2 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item}</h2>
                <p className="text-sm leading-7 text-slate-600">
                  {isEn
                    ? "Use the calendar to turn a vague wish into a concrete race and a training target."
                    : "Gebruik de kalender om van een vaag idee een concrete wedstrijd en trainingsdoel te maken."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="subscriptions-hero" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {isEn ? "Next step" : "Volgende stap"}
              </div>
              <p className="text-lg leading-8 text-slate-200">
                {isEn
                  ? "If you want help choosing the right race or building toward it, use the calendar as a starting point and contact us."
                  : "Als je hulp wilt bij het kiezen van de juiste wedstrijd of de opbouw ernaartoe, gebruik de kalender als startpunt en neem contact op."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to={`/${locale}/contact`}>{isEn ? "Contact" : "Contact"}</Link>
              </Button>
              <Button variant="heroOutline" className="border-white bg-white text-slate-950 shadow-sm hover:border-blue-100 hover:bg-blue-50 hover:text-slate-950" asChild>
                <Link to={`/${locale}/blog`}>{isEn ? "Blog" : "Blog"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export const TechniquePage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const process =
    locale === "en"
      ? [
          { step: "Send a short video", detail: "Record a few minutes of running from the side and back." },
          { step: "Receive the analysis", detail: "You get feedback on posture, cadence, foot strike and rhythm." },
          { step: "Apply the drills", detail: "You get targeted exercises and points to improve in training." },
        ]
      : [
          { step: "Stuur een korte video", detail: "Film een paar minuten hardlopen van opzij en van achter." },
          { step: "Ontvang de analyse", detail: "Je krijgt feedback op houding, pasfrequentie, landing en ritme." },
          { step: "Voer de oefeningen uit", detail: "Je krijgt gerichte drills en duidelijke aandachtspunten mee." },
        ];
  const deliverables =
    locale === "en"
      ? [
          "Short video review with clear feedback",
          "Concrete drills for cadence, posture and landing",
          "Priorities you can apply in the next training week",
        ]
      : [
          "Korte videoreview met duidelijke feedback",
          "Concrete drills voor cadans, houding en landing",
          "Prioriteiten voor de eerstvolgende trainingsweek",
        ];

  return (
    <>
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Globe2 className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Running technique" : "Looptechniek"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Request analysis" : "Vraag analyse aan"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={`/${locale}/online-coaching`}>{locale === "en" ? "Discuss coaching" : "Bespreek coaching"}</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="p-0">
            <div className="relative min-h-[24rem]">
              <img src={techniqueImage} alt="Running technique analysis" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(8,26,58,0.42)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.35em] text-blue-300">{locale === "en" ? "Technique first" : "Techniek eerst"}</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {locale === "en"
                    ? "Technique is the bridge between talent and efficiency."
                    : "Techniek is de brug tussen talent en efficiëntie."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

    <section id="technique-deliverables" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "What you get" : "Wat je krijgt"}</div>
            <div className="grid gap-3 md:grid-cols-3">
              {deliverables.map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-5">
                  <div className="text-sm font-black uppercase tracking-[0.04em] text-slate-950">{item}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="technique-benefits" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Why it helps you" : "Waarom dit jou helpt"}</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
            {locale === "en" ? "Small corrections, big gains" : "Kleine aanpassingen, grote winst"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlight.bullets.map((bullet) => (
            <Card key={bullet} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Benefit" : "Voordeel"}</div>
                <p className="text-lg font-bold text-slate-950">{bullet}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="technique-process" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "How it works" : "Hoe het werkt"}</div>
            <div className="grid gap-3 md:grid-cols-3">
              {process.map((item, index) => (
                <div key={item.step} className="rounded-3xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                    <Clock3 className="h-4 w-4" />
                    {index + 1}
                  </div>
                  <div className="mt-3 text-lg font-black uppercase tracking-[0.04em] text-slate-950">{item.step}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export const MuktiPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const blocks =
    locale === "en"
      ? [
          {
            title: "From numbers to experience",
            text: "Mukti Running is a response to the pressure of pace, heart rate, kilometres and personal records.",
          },
          {
            title: "Running as counterweight to stress",
            text: "Instead of forcing performance, the focus shifts to breathing, calm and returning to yourself.",
          },
          {
            title: "A lecture topic as well",
            text: "The philosophy works well as a talk, inspiration session or workshop for runners and groups.",
          },
        ]
      : [
          {
            title: "Van cijfers naar ervaring",
            text: "Mukti Running is een antwoord op de druk van tempo, hartslag, kilometers en persoonlijke records.",
          },
          {
            title: "Hardlopen als tegenwicht voor stress",
            text: "In plaats van te forceren verschuift de aandacht naar ademhaling, rust en opnieuw voelen.",
          },
          {
            title: "Ook een onderwerp voor lezingen",
            text: "De filosofie werkt goed als lezing, inspiratiesessie of workshop voor lopers en groepen.",
          },
        ];

  const principles =
    locale === "en"
      ? ["Move", "Breathe", "Feel present", "Run free"]
      : ["Bewegen", "Ademen", "Aanwezig zijn", "Vrij lopen"];

  return (
    <>
      <section id="mukti-hero" className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Globe2 className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Mukti Running" : "Mukti Running"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Book a lecture" : "Boek een lezing"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={`/${locale}/online-coaching`}>{locale === "en" ? "Discuss coaching" : "Bespreek coaching"}</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="p-0">
            <div className="relative flex min-h-[24rem] items-center justify-center bg-slate-950 p-8">
              <img src={muktiLogo} alt="Mukti Running logo" className="max-h-[18rem] w-auto max-w-full object-contain" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.08)_0%,rgba(8,26,58,0.52)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.35em] text-blue-300">Mukti</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {locale === "en"
                    ? "Freedom. Breathing. Presence. Running becomes a way to reconnect."
                    : "Vrijheid. Ademen. Aanwezig zijn. Hardlopen wordt een manier om opnieuw verbinding te maken."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="mukti-themes" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {blocks.map((block) => (
            <Card key={block.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Theme" : "Thema"}</div>
                <h2 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{block.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{block.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="mukti-principles" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Core principles" : "Kernprincipes"}</div>
            <div className="flex flex-wrap gap-3">
              {principles.map((principle) => (
                <span key={principle} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                  {principle}
                </span>
              ))}
            </div>
            <p className="max-w-4xl text-lg leading-8 text-slate-600">
              {locale === "en"
                ? "Mukti Running is for beginners, experienced runners and competition runners who want more room, less pressure and more enjoyment."
                : "Mukti Running is er voor beginners, ervaren lopers en wedstrijdlopers die meer ruimte, minder druk en meer plezier willen."}
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export const TrainingCampsPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const isEn = locale === "en";
  const camps =
    locale === "en"
      ? [
          { title: "Trail escape", detail: "Run off-road, slow down mentally and get into a different rhythm." },
          { title: "Warm-weather retreat", detail: "Train in a warmer climate and combine effort with recovery and focus." },
          { title: "Mountain week", detail: "A bigger training week with elevation, views and a strong group feeling." },
        ]
      : [
          { title: "Trail escape", detail: "Buiten de weg lopen, mentaal loskomen en in een ander ritme komen." },
          { title: "Warm-weather retreat", detail: "Train in een warmer klimaat en combineer inspanning met herstel en focus." },
          { title: "Bergweek", detail: "Een grotere trainingsweek met hoogte, uitzicht en sterk groepsgevoel." },
        ];

  const program =
    locale === "en"
      ? [
          "A training rhythm that feels immersive",
          "Time to reset mentally and physically",
          "Technique, pacing and smart effort",
          "Shared meals and informal connection",
          "Recovery woven into the days",
          "A clear build-up before and after the camp",
        ]
      : [
          "Een trainingsritme dat echt onderdompelt",
          "Ruimte om mentaal en fysiek te resetten",
          "Techniek, pacing en slim lopen",
          "Gezamenlijke maaltijden en informeel contact",
          "Herstel verweven in de dagen",
          "Heldere opbouw voor en na het kamp",
        ];

  return (
    <>
      <section id="camp-hero" className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Users className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {isEn ? "Training camps that feel like a reset" : "Trainingskampen die voelen als een reset"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{isEn ? "Ask about dates" : "Vraag data aan"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={`/${locale}/online-coaching`}>{isEn ? "Prepare together" : "Samen voorbereiden"}</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="p-0">
            <div className="relative min-h-[24rem]">
              <img src={runningImage} alt="Training camp" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(8,26,58,0.38)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.35em] text-blue-300">{isEn ? "Shared experience" : "Gezamenlijke beleving"}</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {isEn
                    ? "Training camps combine running, recovery and connection into a memorable multi-day reset."
                    : "Trainingskampen combineren lopen, herstel en verbinding in een memorabele meerdaagse reset."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="camp-highlights" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {camps.map((camp) => (
            <Card key={camp.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{isEn ? "Camp" : "Kamp"}</div>
                <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{camp.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{camp.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="camp-table" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {isEn ? "10-week training plan" : "10-weken trainingsschema"}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
                {isEn ? "Clear week-by-week structure" : "Heldere opbouw per week"}
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                {isEn
                  ? "Swipe horizontally on mobile to compare the ten weeks without breaking the layout."
                  : "Swipe horizontaal op mobiel om de tien weken te vergelijken zonder dat de lay-out breekt."}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[960px] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-slate-200 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.32em] text-slate-600">
                      {isEn ? "Day" : "Dag"}
                    </th>
                    {trainingCampWeeks.map((week) => (
                      <th
                        key={week}
                        className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.32em] text-slate-600"
                      >
                        {isEn ? `Week ${week}` : `Week ${week}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainingCampDays.map((day) => (
                    <tr key={day.key} className="odd:bg-white even:bg-slate-50/70">
                      <th className="sticky left-0 z-10 border-b border-slate-200 bg-inherit px-4 py-4 text-left font-bold uppercase tracking-[0.22em] text-slate-900">
                        {day.label}
                      </th>
                      {trainingCampSchedule[day.key].map((cell, index) => {
                        const lines = translateTrainingLine(cell).split("\n");
                        return (
                          <td key={`${day.key}-${index}`} className="border-b border-slate-200 px-4 py-4 align-top text-slate-700">
                            <div className="whitespace-normal leading-7">
                              {lines.map((line, lineIndex) => (
                                <span key={lineIndex}>
                                  {line}
                                  {lineIndex < lines.length - 1 ? <br /> : null}
                                </span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-slate-100">
                    <th className="sticky left-0 z-10 border-b border-slate-200 bg-slate-200 px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.32em] text-slate-700">
                      {isEn ? "Total km" : "Totaal km"}
                    </th>
                    {totalKilometers.map((km, index) => (
                      <td key={`total-${index}`} className="border-b border-slate-200 px-4 py-4 text-center text-base font-black text-slate-950">
                        {km}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="camp-cta" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
              {isEn ? "What it includes" : "Wat erbij hoort"}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {program.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {isEn ? "Next step" : "Volgende stap"}
              </div>
              <p className="text-lg leading-8 text-slate-200">
                {isEn
                  ? "If you want a camp that feels like a real reset, send us a message and we will discuss the best dates and format."
                  : "Als je een kamp wilt dat voelt als een echte reset, stuur ons een bericht en bespreken we de beste data en vorm."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to={`/${locale}/contact`}>{isEn ? "Contact" : "Contact"}</Link>
              </Button>
              <Button variant="heroOutline" className="border-white bg-white text-slate-950 shadow-sm hover:border-blue-100 hover:bg-blue-50 hover:text-slate-950" asChild>
                <Link to={`/${locale}/online-coaching`}>{isEn ? "Prepare" : "Voorbereiden"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

