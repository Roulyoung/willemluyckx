import { BookOpen, Check, ChevronRight, Clock3, Globe2, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import techniqueImage from "@/assets/technique-running.jpg";
import muktiLogo from "@/assets/topfit/photos/mukti-logo-transparent.png";
import { isLocale, isRtlLocale, normalizeLocale, type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import { getLocaleContent, type LocaleContent } from "@/lib/topfitContent";
import { loadTopfitContent } from "@/lib/topfitRemote";

const fadeClass = (loaded: boolean) => (loaded ? "animate-fade-up" : "opacity-0");

const LocalePage = () => {
  const params = useParams();
  const location = useLocation();
  const locale = normalizeLocale(params.locale);
  const fallbackContent = getLocaleContent(locale);
  const [content, setContent] = useState<LocaleContent>(fallbackContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setContent(fallbackContent);

    void loadTopfitContent(locale, fallbackContent).then((nextContent) => {
      if (active) setContent(nextContent);
    });

    const timer = window.setTimeout(() => {
      if (active) setLoaded(true);
    }, 80);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [fallbackContent, locale]);

  if (!isLocale(params.locale)) {
    return <Navigate to="/nl" replace />;
  }

  const parts = location.pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "home";
  const slug = parts[2];

  return (
    <div
      dir={isRtlLocale(locale) ? "rtl" : "ltr"}
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(23,120,242,0.16),_transparent_36%),linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fbff_100%)] text-slate-950"
    >
      <SiteHeader locale={locale} content={content} currentPath={location.pathname} />
      <main className={loaded ? "animate-fade-in" : "opacity-0"}>
        {section === "blog" && slug ? <BlogArticle locale={locale} slug={slug} /> : <PageView locale={locale} section={section} content={content} loaded={loaded} />}
      </main>
      <SiteFooter locale={locale} content={content} />
    </div>
  );
};

export default LocalePage;

const SubscriptionsPage = ({
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
    <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm">
            <Globe2 className="h-4 w-4" />
            {highlight.title}
          </div>
          <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl">{content.hero.title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">{highlight.intro}</p>
        </div>
        <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">TopFit Runningbook</div>
            <p className="text-sm leading-7 text-slate-600">
              Voor elk abonnement is het Runningbook het inhoudelijke fundament. Daaronder vallen trainingsleer, opbouw, blessurepreventie, techniek en herstel.
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
      </div>
    </section>
  );
};

const TrainingPlansPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const plans =
    locale === "en"
      ? [
          { title: "Beginner", summary: "A calm start with structure, consistency and confidence.", bullets: ["Easy build-up", "Habit formation", "Technique basics"] },
          { title: "5K", summary: "Build speed and rhythm without losing control.", bullets: ["Sharper sessions", "Recovery balance", "Race prep"] },
          { title: "10K", summary: "Strength and pacing for a strong 10K performance.", bullets: ["Threshold work", "Pacing practice", "Load management"] },
          { title: "Half marathon", summary: "Endurance, durability and efficient long efforts.", bullets: ["Long run structure", "Tempo work", "Fueling guidance"] },
          { title: "Marathon", summary: "A complete marathon build with smart progression.", bullets: ["Periodized build", "Recovery focus", "Race-specific blocks"] },
          { title: "Trail running", summary: "Uneven terrain, stability and tactical effort.", bullets: ["Hill work", "Strength support", "Technical pacing"] },
          { title: "Custom plan", summary: "A personal plan around your schedule, goals and level.", bullets: ["1-on-1 intake", "Adjustable load", "Flexible support"] },
        ]
      : [
          { title: "Beginners", summary: "Een rustige start met structuur, ritme en vertrouwen.", bullets: ["Makkelijke opbouw", "Gewenning aan trainen", "Basis techniek"] },
          { title: "5 km", summary: "Meer snelheid en ritme, zonder controle te verliezen.", bullets: ["Kortere prikkels", "Herstel in balans", "Wedstrijdvoorbereiding"] },
          { title: "10 km", summary: "Sterkte en tempo voor een sterke 10 kilometer.", bullets: ["Drempeltraining", "Pacing", "Belasting slim verdelen"] },
          { title: "Halve marathon", summary: "Duurvermogen, belastbaarheid en efficiënte lange duurlopen.", bullets: ["Lange duurlopen", "Tempoblokken", "Voedingsadvies"] },
          { title: "Marathon", summary: "Een complete opbouw richting de marathon met slimme progressie.", bullets: ["Periodieke opbouw", "Herstel centraal", "Specifieke blokken"] },
          { title: "Trailrunning", summary: "Oneffen terrein, stabiliteit en tactisch lopen.", bullets: ["Heuveltraining", "Kracht als basis", "Technische pacing"] },
          { title: "Schema op maat", summary: "Een persoonlijk schema rond jouw agenda, doel en niveau.", bullets: ["Intake 1-op-1", "Aanpasbare belasting", "Flexibele begeleiding"] },
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
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Training plans" : "Trainingsschema's"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Request a custom plan" : "Vraag een schema aan"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={`/${locale}/online-coaching`}>{locale === "en" ? "Discuss coaching" : "Bespreek coaching"}</Link>
            </Button>
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "What makes it strong" : "Waarom dit werkt"}</div>
            <p className="text-sm leading-7 text-slate-600">
              {locale === "en"
                ? "Every plan is built around smart load, recovery moments and a clear progression path."
                : "Elk schema wordt opgebouwd rond slimme belasting, herstelmomenten en een heldere progressie."}
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Plan types" : "Soorten schema's"}</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
            {locale === "en" ? "Structured for every distance and level" : "Opbouw voor elke afstand en elk niveau"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Plan" : "Schema"}</div>
                <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{plan.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{plan.summary}</p>
                <div className="grid gap-2">
                  {plan.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Custom route" : "Maatwerk route"}</div>
              <p className="text-lg leading-8 text-slate-600">
                {locale === "en"
                  ? "If your goal does not fit a standard distance, Willem can shape a custom plan around your schedule and ambition."
                  : "Past jouw doel niet in een standaard afstand, dan kan Willem een schema op maat maken rond jouw agenda en ambitie."}
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Start custom plan" : "Start schema op maat"}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

const TechniquePage = ({
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
          { step: "Receive the analysis", detail: "Willem reviews posture, cadence, foot strike and rhythm." },
          { step: "Apply the drills", detail: "You get targeted exercises and points to improve in training." },
        ]
      : [
          { step: "Stuur een korte video", detail: "Film een paar minuten hardlopen van opzij en van achter." },
          { step: "Ontvang de analyse", detail: "Willem bekijkt houding, pasfrequentie, landing en ritme." },
          { step: "Voer de oefeningen uit", detail: "Je krijgt gerichte drills en duidelijke aandachtspunten mee." },
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
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Why it matters" : "Waarom dit telt"}</div>
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
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

const MuktiPage = ({
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
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Globe2 className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
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
            <div className="relative min-h-[24rem] bg-slate-950">
              <img src={muktiLogo} alt="Mukti Running logo" className="h-full w-full object-cover" />
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
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

const ClinicsPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const camps =
    locale === "en"
      ? [
          { title: "Trail running camp", detail: "Focused days on trails, climbs, descents and technical pacing." },
          { title: "Desert running", detail: "Warm-climate running experiences built around mindset and endurance." },
          { title: "Mountain camp", detail: "Longer efforts, altitude, recovery and group cohesion in the mountains." },
        ]
      : [
          { title: "Trailrunning kamp", detail: "Gerichte dagen op trails, klimmen, dalen en technisch tempo." },
          { title: "Woestijnrunning", detail: "Running experiences in een warm klimaat met focus op mindset en duurvermogen." },
          { title: "Bergkamp", detail: "Langere inspanningen, hoogte, herstel en groepsgevoel in de bergen." },
        ];

  const program =
    locale === "en"
      ? [
          "Training theory and pacing",
          "Nutrition and recovery",
          "Functional strength work",
          "Running technique drills",
          "Interval and fartlek sessions",
          "Shared lunch and personal guidance",
        ]
      : [
          "Theorie over training en pacing",
          "Voeding en herstel",
          "Functionele krachttraining",
          "Looptechniek oefeningen",
          "Interval- en fartlektraining",
          "Gezamenlijke lunch en persoonlijke begeleiding",
        ];

  return (
    <>
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Users className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Clinics & training camps" : "Clinics & trainingskampen"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Ask for dates" : "Vraag data aan"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={`/${locale}/online-coaching`}>{locale === "en" ? "Discuss support" : "Bespreek begeleiding"}</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="p-0">
            <div className="relative min-h-[24rem]">
              <img src={runningImage} alt="Running clinic" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(8,26,58,0.38)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.35em] text-blue-300">{locale === "en" ? "Group experience" : "Groepsbeleving"}</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {locale === "en"
                    ? "Clinics combine theory, practice and shared momentum in one inspiring day."
                    : "Clinics combineren theorie, praktijk en gezamenlijk momentum in één inspirerende dag."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {program.map((item) => (
            <Card key={item} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="flex items-start gap-3 p-6">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Training camps" : "Trainingskampen"}</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
            {locale === "en" ? "More than one day, more than one workout" : "Meer dan één dag, meer dan één training"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {camps.map((camp) => (
            <Card key={camp.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Camp" : "Kamp"}</div>
                <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{camp.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{camp.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

const CoachingPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const topics =
    locale === "en"
      ? [
          { title: "Training and load", detail: "Review your weekly structure, recovery balance and next steps." },
          { title: "Motivation and focus", detail: "Work through friction, consistency and race-day mindset." },
          { title: "Injuries and recovery", detail: "Talk about pain signals, return-to-run and adaptation." },
          { title: "Nutrition", detail: "Cover fueling, recovery meals and practical race-day habits." },
          { title: "Evaluation", detail: "Check how your plan is working and where to adjust it." },
        ]
      : [
          { title: "Training en belasting", detail: "Bespreek je weekstructuur, herstelbalans en volgende stappen." },
          { title: "Motivatie en focus", detail: "Werk aan drempels, consistentie en wedstrijdmentaliteit." },
          { title: "Blessures en herstel", detail: "Praat over signalen, opbouw en terugkeer naar lopen." },
          { title: "Voeding", detail: "Ga in op brandstof, herstelmaaltijden en praktische wedstrijdgewoonten." },
          { title: "Evaluatie", detail: "Controleer hoe je schema werkt en waar je kunt bijsturen." },
        ];

  const formats =
    locale === "en"
      ? [
          { title: "1-on-1 coaching", detail: "Personal Zoom sessions with direct feedback." },
          { title: "Monthly consults", detail: "A steady rhythm for structure and progress checks." },
          { title: "Premium support", detail: "For runners who want more guidance and detail." },
        ]
      : [
          { title: "1-op-1 coaching", detail: "Persoonlijke Zoom-sessies met directe feedback." },
          { title: "Maandelijkse consulten", detail: "Een vast ritme voor structuur en voortgang." },
          { title: "Premium begeleiding", detail: "Voor lopers die meer sturing en detail willen." },
        ];

  return (
    <>
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <MessageCircle className="h-4 w-4" />
            {highlight.title}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {locale === "en" ? "Online coaching" : "Online coaching"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Plan a call" : "Plan een gesprek"}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <CardContent className="p-0">
            <div className="relative min-h-[24rem]">
              <img src={portraitImage} alt="Willem coaching online" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(8,26,58,0.45)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.35em] text-blue-300">{locale === "en" ? "Zoom support" : "Zoom-begeleiding"}</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {locale === "en"
                    ? "Discuss your plan, motivation, injuries, nutrition and recovery in one personal call."
                    : "Bespreek je schema, motivatie, blessures, voeding en herstel in één persoonlijk gesprek."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-6 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "What we discuss" : "Waar we het over hebben"}</div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
            {locale === "en" ? "Coaching covers the whole runner" : "Coaching kijkt naar de hele loper"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <Card key={topic.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Topic" : "Onderwerp"}</div>
                <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{topic.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{topic.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {formats.map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Format" : "Vorm"}</div>
                <h3 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Next step" : "Volgende stap"}</div>
              <p className="text-lg leading-8 text-slate-600">
                {locale === "en"
                  ? "Book a coaching call when you want an outside eye on your running plan or a clear next move."
                  : "Boek een gesprek wanneer je een externe blik op je schema wilt of een duidelijke volgende stap zoekt."}
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to={`/${locale}/contact`}>{locale === "en" ? "Book a call" : "Boek een gesprek"}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

const ShopPage = ({
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
  const digital = content.shop.filter((item) => item.type === "digital");
  const services = content.shop.filter((item) => item.type === "service" || item.type === "ticket");
  const physical = content.shop.filter((item) => item.type === "physical" || item.type === "bundle");

  const sectionBlock = (title: string, items: typeof content.shop) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-black uppercase tracking-[0.04em]">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{item.type}</div>
              <h3 className="text-xl font-black uppercase tracking-[0.04em]">{item.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{item.summary}</p>
              <div className="text-sm font-semibold text-blue-700">{item.price}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm">
              <Globe2 className="h-4 w-4" />
              {highlight.title}
            </div>
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl">
              {locale === "en" ? "Shop" : locale === "he" ? "חנות" : "Shop"}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{highlight.intro}</p>
          </div>
          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Waarom de shop werkt</div>
              <p className="text-sm leading-7 text-slate-600">
                De shop staat los van abonnementen, maar versterkt dezelfde sportieve autoriteit. Zo kun je digitale producten, service-items en fysieke sportvoeding naast elkaar verkopen.
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
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>{sectionBlock("Digitale producten", digital)}</section>
      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>{sectionBlock("Services en tickets", services)}</section>
      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>{sectionBlock("Fysieke producten", physical)}</section>
    </>
  );
};

const BlogArticle = ({ locale, slug }: { locale: Locale; slug: string }) => {
  const content = getLocaleContent(locale);
  const post = content.blog.find((entry) => entry.slug === slug);

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Blog</div>
        <h1 className="text-4xl font-black uppercase tracking-[0.04em] md:text-6xl">{post?.title ?? "Artikel"}</h1>
        <p className="text-lg leading-8 text-slate-600">{post?.excerpt ?? "Deze blogpost wordt later vanuit Google Sheets geladen."}</p>
      </div>
      <Card className="mt-8 border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-6 md:p-8">
          <p className="text-sm leading-7 text-slate-600">
            De blog-architectuur staat nu klaar. De echte inhoud kan straks per post uit Google Sheets komen, met dezelfde locale structuur en SEO-velden.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" asChild>
              <Link to={`/${locale}/blog`}>Terug naar blog</Link>
            </Button>
            <Button variant="heroOutline" asChild>
              <Link to={`/${locale}/contact`}>Contact</Link>
            </Button>
            <Button variant="heroOutline" asChild>
              <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

const PageView = ({
  locale,
  section,
  content,
  loaded,
}: {
  locale: Locale;
  section: string;
  content: LocaleContent;
  loaded: boolean;
}) => {
  const isHome = section === "home" || section === "";
  const isTrainingPlans = section === "trainingsschemas" || section === "training-plans";
  const isTechnique = section === "looptechniek" || section === "running-technique";
  const isMukti = section === "mukti-running";
  const isClinics = section === "clinics-en-trainingskampen" || section === "clinics-and-training-camps";
  const isOnlineCoaching = section === "online-coaching" || section === "coaching";
  const isSubscriptions = section === "abonnementen" || section === "subscriptions";
  const isShop = section === "shop";
  const fallbackKey = locale === "nl" ? "abonnementen" : "subscriptions";
  const highlight = content.pageHighlights[section] ?? content.pageHighlights[fallbackKey];
  const planHref =
    locale === "en" ? "/en/training-plans" : locale === "he" ? "/he/training-plans" : "/nl/trainingsschemas";

  return (
    <>
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
            <Globe2 className="h-4 w-4" />
            {content.hero.eyebrow}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
              {content.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{content.hero.lead}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/${locale}/contact`}>{content.hero.primaryCta}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to={planHref}>{content.hero.secondaryCta}</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {content.proof.stats.map((stat) => (
              <Card key={stat.label} className="border-white/70 bg-white/85 shadow-sm shadow-blue-950/5 backdrop-blur">
                <CardContent className="p-5">
                  <div className="text-2xl font-black text-slate-950">{stat.value}</div>
                  <div className="mt-1 uppercase tracking-[0.28em] text-slate-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              locale === "en" ? "Personal plans" : locale === "he" ? "תוכניות אישיות" : "Persoonlijke schema's",
              locale === "en" ? "Weekly feedback" : locale === "he" ? "משוב שבועי" : "Wekelijkse feedback",
              locale === "en" ? "Clinic access" : locale === "he" ? "כניסה לקליניקות" : "Clinic toegang",
            ].map((chip) => (
              <span key={chip} className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_30px_80px_rgba(13,46,102,0.16)]">
          <CardContent className="space-y-5 p-5 md:p-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white">
              <img
                src={darkRunImage}
                alt="Willem running in the dark"
                className="absolute inset-0 h-full w-full object-cover object-[center_30%] opacity-50 brightness-[0.78] contrast-[1.08] sm:object-[center_24%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,46,102,0.38)_0%,rgba(8,26,58,0.92)_100%)]" />
              <div className="relative p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs uppercase tracking-[0.35em] text-blue-200">TopFit Running</div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-100">
                    40+ years
                  </div>
                </div>
                <div className="mt-4 text-3xl font-black uppercase tracking-[0.06em] md:text-4xl">{topFitSiteConfig.slogan}</div>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-200">{content.proof.description}</p>
              </div>
              <div className="relative -mt-4 grid gap-3 px-6 pb-6 sm:grid-cols-3">
                {content.proof.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur">
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {content.offers.slice(0, 2).map((offer) => (
                <div key={offer.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{offer.price}</div>
                      <div className="mt-1 text-lg font-bold text-slate-950">{offer.title}</div>
                    </div>
                    {offer.featured ? <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">Top</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{offer.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {isHome ? (
        <>
          <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
            <div className="mb-6 max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{content.proof.headline}</div>
              <p className="mt-3 text-lg leading-8 text-slate-600">{content.proof.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {content.offers.map((offer) => (
                <Card key={offer.title} className={`border-slate-200 bg-white shadow-sm ${offer.featured ? "ring-2 ring-blue-500/30" : ""}`}>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.35em] text-slate-500">{offer.price}</div>
                        <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.04em]">{offer.title}</h2>
                      </div>
                      {offer.featured ? <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">Top</span> : null}
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{offer.summary}</p>
                    <div className="grid gap-2">
                      {offer.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
            <div className="mb-6 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {locale === "en" ? "Site structure" : "Website-opbouw"}
              </div>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
                {locale === "en" ? "The full journey in the right order" : "De volledige route in de juiste volgorde"}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {content.nav.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-3 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.label}</div>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                    {locale === "en" ? "Open section" : "Open sectie"}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Services</div>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">{content.about.title}</h2>
              </div>
              <Button variant="minimal" asChild>
                <Link to={`/${locale}/abonnementen`}>All offers</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.services.map((item) => (
                <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="space-y-4 p-6">
                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700">
                      {item.tag}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-[0.04em]">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{item.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className={`mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[0.95fr_1.05fr] ${fadeClass(loaded)}`}>
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="relative min-h-[24rem]">
                  <img src={portraitImage} alt="Willem portrait" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(8,26,58,0.32)_100%)]" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700 shadow-sm">
                    Over Willem
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/65 p-5 text-white backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-300">40+ years</div>
                    <div className="mt-3 text-2xl font-black uppercase tracking-[0.04em]">Coach. docent. gids.</div>
                    <p className="mt-2 text-sm leading-7 text-slate-200">
                      Willem zet prestatie, plezier en bewustzijn naast elkaar. Dat is de basis van de merkbeleving.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Shop</div>
                    <h2 className="text-3xl font-black uppercase tracking-[0.04em]">Webshop naast abonnementen</h2>
                  </div>
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  Runningbook PDF, intake, clinic tickets en later fysieke producten of cadeaubonnen.
                </p>
                <div className="grid gap-3">
                  {content.shop.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">{item.type}</div>
                        <div className="mt-1 font-bold text-slate-950">{item.title}</div>
                      </div>
                      <div className="text-sm font-semibold text-blue-700">{item.price}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className={`mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[1fr_0.95fr] ${fadeClass(loaded)}`}>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Blog</div>
                    <h2 className="text-3xl font-black uppercase tracking-[0.04em]">Autoriteit en SEO</h2>
                  </div>
                  <Clock3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="grid gap-3">
                  {content.blog.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/${locale}/blog/${post.slug}`}
                      className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{post.category}</div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="mt-2 text-lg font-bold text-slate-950">{post.title}</div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardContent className="p-0">
                <div className="relative min-h-[24rem]">
                  <img src={runningImage} alt="Willem running" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(8,26,58,0.42)_100%)]" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700 shadow-sm">
                    Training
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/65 p-5 text-white backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-300">Visual proof</div>
                    <div className="mt-3 text-2xl font-black uppercase tracking-[0.04em]">Beweging verkoopt</div>
                    <p className="mt-2 text-sm leading-7 text-slate-200">
                      Met echte fotografie voelt de website direct als een premium sportmerk, niet als een generieke template.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      ) : isTrainingPlans ? (
        <TrainingPlansPage locale={locale} highlight={highlight} loaded={loaded} />
      ) : isTechnique ? (
        <TechniquePage locale={locale} highlight={highlight} loaded={loaded} />
      ) : isMukti ? (
        <MuktiPage locale={locale} highlight={highlight} loaded={loaded} />
      ) : isClinics ? (
        <ClinicsPage locale={locale} highlight={highlight} loaded={loaded} />
      ) : isOnlineCoaching ? (
        <CoachingPage locale={locale} highlight={highlight} loaded={loaded} />
      ) : isSubscriptions ? (
        <SubscriptionsPage locale={locale} content={content} highlight={highlight} loaded={loaded} />
      ) : isShop ? (
        <ShopPage locale={locale} content={content} highlight={highlight} loaded={loaded} />
      ) : (
        <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{highlight.title}</div>
              <h2 className="max-w-4xl text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">{highlight.intro}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {highlight.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" asChild>
                  <Link to={`/${locale}/contact`}>{content.cta.button}</Link>
                </Button>
                <Button variant="heroOutline" asChild>
                  <Link to={`/${locale}/shop`}>Shop</Link>
                </Button>
                <Button variant="heroOutline" asChild>
                  <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <img src={topFitSiteConfig.logoPath} alt={topFitSiteConfig.brandName} className="h-full w-full object-cover" />
          </CardContent>
        </Card>
      </section>
      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{content.about.eyebrow}</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">{content.about.title}</h2>
            <div className="space-y-4 text-sm leading-7 text-slate-600">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{content.cta.title}</div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{content.cta.lead}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to={`/${locale}/contact`}>{content.cta.button}</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={`/${locale}/shop`}>Shop</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};
