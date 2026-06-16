import { ChevronRight, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import { type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import { getLocaleContent } from "@/lib/topfitContent";
import type { LocaleContent } from "@/lib/topfitContent";

const fadeClass = (_loaded: boolean) => "animate-fade-up";

export const AboutWillemPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const sections =
    locale === "en"
      ? [
          {
            title: "Performance without noise",
            text: "Je werkt met structuur, ritme en feedback zodat je beter wordt zonder te verdrinken in details.",
          },
          {
            title: "A coach with a teacher's eye",
            text: "Je krijgt niet alleen trainingen. Je hoort ook waarom een keuze werkt en wat die doet met jouw loopstijl.",
          },
          {
            title: "Freedom as the end goal",
            text: "De methode is serieus, maar jij merkt vooral meer lichtheid: meer vertrouwen, meer controle en meer plezier.",
          },
        ]
      : [
          {
            title: "Presteren zonder ruis",
            text: "Je werkt met structuur, ritme en feedback zodat je beter wordt zonder te verdrinken in details.",
          },
          {
            title: "Coach met het oog van een docent",
            text: "Je krijgt niet alleen trainingen. Je hoort ook waarom iets werkt en wat het met je loopstijl doet.",
          },
          {
            title: "Vrijheid als einddoel",
            text: "De methode is serieus, maar jij merkt vooral meer lichtheid: meer vertrouwen, meer controle en meer plezier.",
          },
        ];

  const profilePoints =
    locale === "en"
      ? ["Former Israeli champion", "Trained in Iten, Kenya", "Based in Amsterdam", "40+ years of experience"]
      : ["Voormalig Israëlisch kampioen", "Getraind in Iten, Kenia", "Werkzaam vanuit Amsterdam", "40+ jaar ervaring"];

  const focusCards =
    locale === "en"
      ? [
          { label: "Focus", value: "Performance with calm" },
          { label: "Method", value: "Structure, rhythm, feedback" },
          { label: "Result", value: "More control and pleasure" },
        ]
      : [
          { label: "Focus", value: "Presteren met rust" },
          { label: "Methode", value: "Structuur, ritme, feedback" },
          { label: "Resultaat", value: "Meer controle en plezier" },
        ];

  const storyHighlights =
    locale === "en"
      ? [
          { title: "Track", text: "Speed, mechanics and repeatable effort." },
          { title: "Road", text: "Endurance, patience and day-to-day consistency." },
          { title: "Coach", text: "A method that stays practical when the race starts." },
        ]
      : [
          { title: "Baan", text: "Snelheid, techniek en herhaalbare prikkels." },
          { title: "Weg", text: "Duurvermogen, geduld en dagelijkse consistentie." },
          { title: "Coach", text: "Een methode die praktisch blijft zodra het echt begint." },
        ];

  const photoCaption =
    locale === "en"
      ? "A coach who has seen the sport from the track, the dirt roads and the client side."
      : "Een coach die de sport kent van de baan, de stofpaden en de praktijk met lopers.";

  return (
    <>
      <section className={`mx-auto max-w-7xl px-5 pb-10 pt-10 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 shadow-sm shadow-blue-950/5">
              <Users className="h-4 w-4" />
              {highlight.title}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-slate-950 sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
                {locale === "en" ? "Your coach. teacher. guide." : "Jouw coach. docent. gids."}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {focusCards.map((card) => (
                <Card key={card.label} className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="space-y-2 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">{card.label}</div>
                    <div className="text-lg font-black uppercase tracking-[0.04em] text-slate-950">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {profilePoints.map((point) => (
                  <div key={point} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to={`/${locale}/contact`}>{locale === "en" ? "Plan a call" : "Plan een gesprek"}</Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to={`/${locale}/abonnementen`}>{locale === "en" ? "View packages" : "Bekijk pakketten"}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_30px_80px_rgba(13,46,102,0.16)]">
              <CardContent className="p-0">
                <div className="relative min-h-[24rem]">
                  <img src={portraitImage} alt="Willem portrait" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(8,26,58,0.26)_100%)]" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700 shadow-sm">
                    {locale === "en" ? "Portrait" : "Portret"}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-300">{locale === "en" ? "The person behind the plan" : "De persoon achter het plan"}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-200">{photoCaption}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
                {storyHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-700">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="relative min-h-[12rem]">
                    <img src={darkRunImage} alt="Willem running in the dark" className="h-full w-full object-cover object-[center_30%]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,58,0.1)_0%,rgba(8,26,58,0.72)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-200">{locale === "en" ? "Training background" : "Trainingsachtergrond"}</div>
                      <div className="mt-2 text-lg font-black uppercase tracking-[0.04em]">Iten, Kenya</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="relative min-h-[12rem]">
                    <img src={runningImage} alt="Willem running" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(8,26,58,0.34)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-100">{locale === "en" ? "Running style" : "Loopstijl"}</div>
                      <div className="mt-2 rounded-2xl border border-white/20 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                        {locale === "en" ? "Efficient, calm and purposeful" : "Efficiënt, rustig en doelgericht"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-5 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
            {locale === "en" ? "Why it works for you" : "Waarom dit voor jou werkt"}
          </div>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            {locale === "en"
              ? "On this page you quickly see who Willem is, what he stands for and why the method feels different."
              : "Op deze pagina zie je snel wie Willem is, waar hij voor staat en waarom de methode anders voelt."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Why it works for you" : "Waarom dit voor jou werkt"}</div>
                <h2 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                {locale === "en" ? "Experience" : "Ervaring"}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
                {locale === "en" ? "Years in the sport, not just years on paper" : "Jaren in de sport, niet alleen op papier"}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "The background matters because it shapes the advice: the practical side, the discipline and the calm."
                  : "Die achtergrond telt omdat ze het advies vormgeeft: praktisch, gedisciplineerd en rustig."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlight.bullets.map((bullet) => (
                <div key={bullet} className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  {bullet}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 md:grid-cols-4">
          {highlight.bullets.map((bullet) => (
            <Card key={bullet} className="border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Focus" : "Focus"}</div>
                <p className="text-sm leading-7 text-slate-700">{bullet}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {locale === "en" ? "Next step" : "Volgende stap"}
              </div>
              <p className="text-lg leading-8 text-slate-200">
                {locale === "en"
                  ? "If you want support from someone who combines performance, structure and calm, Willem is the conversation to start."
                  : "Als je iemand zoekt die prestatie, structuur en rust combineert, is Willem het gesprek om mee te beginnen."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to={`/${locale}/contact`}>{locale === "en" ? "Contact" : "Contact"}</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={`/${locale}/trainingsschemas`}>{locale === "en" ? "Training plans" : "Trainingsschema's"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export const BlogArticle = ({ locale, slug }: { locale: Locale; slug: string }) => {
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
            De blog-architectuur staat klaar. Later vullen we elk artikel met echte inhoud uit Google Sheets, in dezelfde locale structuur.
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
