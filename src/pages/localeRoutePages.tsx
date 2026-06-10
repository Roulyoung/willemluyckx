import { ChevronRight, Check, Clock3, Globe2, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import techniqueImage from "@/assets/technique-running.jpg";
import muktiLogo from "@/assets/topfit/photos/mukti-logo-transparent.png";
import { type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { LocaleContent } from "@/lib/topfitContent";

const fadeClass = (_loaded: boolean) => "animate-fade-up";

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
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-10 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
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
                <Link to={`/${locale}/abonnementen`}>{locale === "en" ? "View offers" : "Bekijk aanbod"}</Link>
              </Button>
            </div>
          </div>

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {locale === "en" ? "What the blog is for" : "Waar de blog voor is"}
              </div>
              <p className="text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "This is not the homepage hero. It is the knowledge layer: opinions, explanations and practical articles."
                  : "Dit is niet de homepage-hero. Dit is de kennislaag: uitleg, visie en praktische artikelen."}
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

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {content.blog.map((post) => (
            <Link key={post.slug} to={`/${locale}/blog/${post.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{post.category}</div>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
                {locale === "en" ? "Read article" : "Lees artikel"}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
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
    </>
  );
};

export const SubscriptionsPage = ({
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
  const featuredOffers = content.offers.slice(0, 2);
  const addOnOffer = content.offers[2];

  return (
    <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm">
            <Globe2 className="h-4 w-4" />
            {highlight.title}
          </div>
          <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl">{content.hero.title}</h1>
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

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {featuredOffers.map((offer) => (
          <Card key={offer.title} className={`border-slate-200 bg-white shadow-sm ${offer.featured ? "ring-2 ring-blue-500/20" : ""}`}>
            <CardContent className="space-y-4 p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Plan" : "Pakket"}</div>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{offer.title}</h2>
                </div>
                {offer.featured ? <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">Top</span> : null}
              </div>
              <div className="text-xl font-black text-blue-700">{offer.price}</div>
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

      {addOnOffer ? (
        <section className="mt-8">
          <Card className="border-slate-200 bg-slate-50 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                  {locale === "en" ? "Optional extra" : "Losse toevoeging"}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{addOnOffer.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{addOnOffer.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-950">{addOnOffer.price}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{addOnOffer.title}</div>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </section>
  );
};

export const TrainingPlansPage = ({
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
  const chooser =
    locale === "en"
      ? [
          { title: "Pick your distance", text: "Choose the plan that fits your event and current level." },
          { title: "Set your rhythm", text: "Decide how much support, feedback and structure you want." },
          { title: "Move forward", text: "Book a call if you want the plan adjusted to your calendar." },
        ]
      : [
          { title: "Kies je afstand", text: "Selecteer het schema dat past bij je doel en huidige niveau." },
          { title: "Bepaal je ritme", text: "Kies hoeveel begeleiding, feedback en structuur je wilt." },
          { title: "Ga verder", text: "Plan een gesprek als het schema op jouw agenda moet passen." },
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
        <div className="grid gap-4 md:grid-cols-3">
          {chooser.map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Step" : "Stap"}</div>
                <h2 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
          { step: "Receive the analysis", detail: "Willem reviews posture, cadence, foot strike and rhythm." },
          { step: "Apply the drills", detail: "You get targeted exercises and points to improve in training." },
        ]
      : [
          { step: "Stuur een korte video", detail: "Film een paar minuten hardlopen van opzij en van achter." },
          { step: "Ontvang de analyse", detail: "Willem bekijkt houding, pasfrequentie, landing en ritme." },
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

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
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
      <section className={`mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16 ${fadeClass(loaded)}`}>
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

export const ClinicsPage = ({
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
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
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

export const CoachingPage = ({
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
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
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

export const ShopPage = ({
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
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl">
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


