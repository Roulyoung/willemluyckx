import { ChevronRight, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import { type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localeRoutes";
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
            text: "You work with structure, rhythm and feedback so you improve without drowning in details.",
          },
          {
            title: "A coach with a teacher's eye",
            text: "You do not only receive training plans. You also hear why a choice works and what it does to your running style.",
          },
          {
            title: "Freedom as the end goal",
            text: "The method is serious, but what you feel is more lightness: more trust, more control and more pleasure.",
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
      ? ["Former national 800m champion", "Trained internationally with world-class athletes", "Working from the Leiden area", "40+ years of experience"]
      : ["Voormalig nationaal 800m kampioen", "Internationaal getraind met wereldtop", "Werkzaam vanuit omgeving Leiden", "40+ jaar ervaring"];

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
  const packagesHref = localizedPath(locale, "abonnementen");
  const plansHref = localizedPath(locale, "trainingsschemas");
  const runnersworldPdfHref = "/pdf/Willem-in-Runnersworld.pdf";
  const embassyVideoHref = "/video/dutch-embassy-willem-luyckx.mp4";
  const mediaIntro =
    locale === "en"
      ? "Archive material, published coverage and a direct video impression now live again on the page."
      : "Archiefmateriaal, gepubliceerde media en een directe video-impressie staan nu weer zichtbaar op deze pagina.";
  const videoDescription =
    locale === "en"
      ? "Short archive footage of Willem in motion, useful when you want to see the person behind the coaching more directly."
      : "Korte archiefbeelden van Willem in beweging, zodat je directer ziet wie er achter de coaching staat.";
  const pdfDescription =
    locale === "en"
      ? "A viewable PDF document that can be opened, read and downloaded directly from the page."
      : "Een direct leesbaar PDF-document dat je vanaf deze pagina kunt openen, bekijken en downloaden.";

  return (
    <>
      <section id="about-hero" className={`mx-auto max-w-7xl px-5 pb-10 pt-10 md:px-8 ${fadeClass(loaded)}`}>
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
                  <Link to={packagesHref}>{locale === "en" ? "View packages" : "Bekijk pakketten"}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_30px_80px_rgba(13,46,102,0.16)]">
              <CardContent className="p-0">
                <div className="relative min-h-[24rem]">
                  <img
                    src={portraitImage}
                    alt="Willem portrait"
                    className="absolute inset-0 h-full w-full object-cover object-[center_18%] md:object-[center_14%]"
                  />
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
                    <img
                      src={darkRunImage}
                      alt="Willem running in the dark"
                      className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,58,0.1)_0%,rgba(8,26,58,0.72)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-200">{locale === "en" ? "Training background" : "Trainingsachtergrond"}</div>
                      <div className="mt-2 text-lg font-black uppercase tracking-[0.04em]">
                        {locale === "en" ? "Leiden area" : "Omgeving Leiden"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="relative min-h-[12rem]">
                    <img
                      src={runningImage}
                      alt="Willem running"
                      className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
                    />
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

      <section id="about-why" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
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

      <section id="about-experience" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
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

      <section id="about-focus" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
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

      <section id="about-media" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-5 max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
            {locale === "en" ? "Archive and media" : "Archief en media"}
          </div>
          <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
            {locale === "en" ? "See the material behind the story" : "Bekijk het materiaal achter het verhaal"}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">{mediaIntro}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                    {locale === "en" ? "Embassy video" : "Embassy video"}
                  </div>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">
                    {locale === "en" ? "Archive footage of Willem" : "Archiefbeelden van Willem"}
                  </h3>
                </div>
                <PlayCircle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm leading-7 text-slate-600">{videoDescription}</p>
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950">
                <video controls preload="metadata" playsInline className="h-full max-h-[36rem] w-full bg-black object-contain">
                  <source src={embassyVideoHref} type="video/mp4" />
                </video>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="heroOutline" asChild>
                  <a href={embassyVideoHref} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {locale === "en" ? "Open video" : "Open video"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                    {locale === "en" ? "Runnersworld PDF" : "Runnersworld PDF"}
                  </div>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-slate-950">Willem in Runnersworld</h3>
                </div>
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm leading-7 text-slate-600">{pdfDescription}</p>
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                <iframe
                  title="Willem in Runnersworld PDF"
                  src={`${runnersworldPdfHref}#view=FitH`}
                  className="h-[36rem] w-full bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="minimal" size="sm" asChild>
                  <a href={runnersworldPdfHref} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {locale === "en" ? "Open PDF" : "Open PDF"}
                  </a>
                </Button>
                <Button variant="minimal" size="sm" asChild>
                  <a href={runnersworldPdfHref} download>
                    <FileText className="h-4 w-4" />
                    {locale === "en" ? "Download PDF" : "Download PDF"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="about-cta" className={`mx-auto max-w-7xl px-5 py-10 md:px-8 ${fadeClass(loaded)}`}>
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
              <Button
                variant="heroOutline"
                className="border-white/30 bg-white text-slate-950 hover:bg-slate-100 hover:text-slate-950"
                asChild
              >
                <Link to={plansHref}>{locale === "en" ? "Training plans" : "Trainingsschema's"}</Link>
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
  const blogHref = `/${locale}/blog`;
  const contactHref = `/${locale}/contact`;
  const isMuktiArticle = slug === "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past";

  if (isMuktiArticle && locale === "nl") {
    return (
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        <div className="space-y-6">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Blog / Mukti Running</div>
          <h1 className="max-w-3xl text-4xl font-black uppercase tracking-[0.04em] md:text-6xl">
            Mukti Running: hardlopen met vrijheid, rust en minder druk
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Mukti Running gaat over hardlopen met meer vrijheid, meer aandacht en minder onnodige druk. Niet rennen om altijd harder,
            strakker of voller te trainen, maar lopen op een manier die je energie geeft, je hoofd leegmaakt en je training duurzaam houdt.
          </p>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Het woord <span className="font-semibold text-slate-900">mukti</span> komt uit het Sanskriet en betekent bevrijding of vrijmaking.
            In deze context betekent dat: loskomen van prestatiedruk, meer contact maken met je ademhaling en ritme, en hardlopen opnieuw
            ervaren als iets dat je versterkt in plaats van uitput.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Meer vrijheid",
              text: "Mukti Running verschuift de focus van moeten presteren naar bewust lopen. Je kiest voor kwaliteit van beweging en aandacht in plaats van alleen volume of snelheid.",
            },
            {
              title: "Rust in je training",
              text: "Bij TopFit past dit bij een trainingsaanpak waarin opbouw, herstel en slimme belasting belangrijker zijn dan gejaagd veel doen.",
            },
            {
              title: "Beter voor de lange termijn",
              text: "Wie duurzaam wil blijven lopen, heeft baat bij structuur én ontspanning. Mukti Running helpt je beide kanten samen te brengen.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{item.title}</div>
                <p className="text-sm leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.04em] md:text-4xl">Waarom dit relevant is voor hardlopers</h2>
            <div className="space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Hardlopen wordt vaak sterker zodra je minder probeert te forceren. Wie alleen traint op basis van druk, vergelijking en steeds
                harder willen, verliest meestal vanzelf de ontspanning en de natuurlijke loopkwaliteit.
              </p>
              <p>
                Mukti Running zet daarom een andere vraag centraal: hoe voelt je loop, hoe herstel je, en hoe houd je dit jarenlang vol?
                Dat is geen zachte omweg, maar juist een slimme manier om beter te worden zonder onnodige spanning op te bouwen.
              </p>
              <p>
                Binnen TopFit betekent dat concreet: duidelijke schema's, slimme belasting, aandacht voor herstel en ruimte om als loper
                niet alleen sneller of fitter te worden, maar ook rustiger en consistenter.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-10 border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Kernidee</div>
            <p className="text-lg leading-8 text-slate-200">
              Mukti Running is lopen als middel om vrijer te leven, niet als systeem om jezelf voortdurend op te jagen.
              Dat maakt het relevant voor lopers die structuur willen, maar ook voelen dat sport energie moet geven in plaats van leeg te trekken.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6 md:p-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.04em]">Voor wie is Mukti Running bedoeld?</h2>
            <p className="text-sm leading-7 text-slate-600">
              Mukti Running is interessant voor lopers die merken dat ze meer willen dan alleen een schema afwerken. Het past bij mensen die
              beter willen trainen, maar ook willen blijven genieten van het lopen zelf. Denk aan lopers die structureel willen opbouwen,
              maar tegelijkertijd zoeken naar rust, overzicht en een gezondere verhouding met prestatie.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6 md:p-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.04em]">Mukti Running in 1 zin</h2>
            <p className="text-sm leading-7 text-slate-600">
              Mukti Running is hardlopen met meer vrijheid, meer aandacht en minder onnodige druk.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to={blogHref}>{locale === "en" ? "Back to blog" : "Terug naar blog"}</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to={contactHref}>Contact</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </section>
    );
  }

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
