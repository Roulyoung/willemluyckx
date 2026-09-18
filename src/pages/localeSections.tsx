import { ChevronRight, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
import { getBlogMedia } from "@/lib/blogMedia";
import { type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/localeRoutes";
import { topFitSiteConfig } from "@/lib/siteConfig";
import { getLocaleContent } from "@/lib/topfitContent";
import type { LocaleContent } from "@/lib/topfitContent";

const fadeClass = (_loaded: boolean) => "animate-fade-up";

type BlogHeroBannerProps = {
  eyebrow: string;
  category: string;
  readTime: string;
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  asideLabel: string;
  asideText: string;
};

const BlogHeroBanner = ({
  eyebrow,
  category,
  readTime,
  title,
  summary,
  imageSrc,
  imageAlt,
  asideLabel,
  asideText,
}: BlogHeroBannerProps) => (
  <div className="space-y-5">
    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{eyebrow}</div>
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-[0_35px_90px_rgba(8,26,58,0.22)]">
      <img src={imageSrc} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,58,0.08)_0%,rgba(8,26,58,0.2)_28%,rgba(8,26,58,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,26,58,0.88)_0%,rgba(8,26,58,0.54)_44%,rgba(8,26,58,0.12)_82%)]" />

      <div className="relative flex min-h-[24rem] flex-col justify-between p-6 md:min-h-[32rem] md:p-8 lg:min-h-[38rem] lg:p-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            {category}
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
            {readTime}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-[0.04em] text-white md:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg md:leading-8">{summary}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/15 bg-slate-950/95 p-4 text-white">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-100">{asideLabel}</div>
            <p className="mt-3 text-sm leading-7 text-white">{asideText}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AboutWillemPage = ({
  locale,
  highlight,
  loaded,
}: {
  locale: Locale;
  highlight: { title: string; intro: string; bullets: string[] };
  loaded: boolean;
}) => {
  const heroRoles =
    locale === "en"
      ? "Athletics coach | Conditioning coach | Coach educator | Teacher | Author"
      : "Atletiektrainer | Conditietrainer | Opleider | Docent | Auteur";

  const heroSecondary =
    locale === "en"
      ? "From 1990 to 2023 he lived and worked in Israel. His specialisms include distance running, training theory, running technique, conditioning, talent development and coach education."
      : "Van 1990 tot 2023 woonde en werkte hij in Israel. Zijn specialisaties zijn langeafstandslopen, trainingsleer, looptechniek, conditietraining, talentontwikkeling en het opleiden van trainers.";

  const sections =
    locale === "en"
      ? [
          {
            title: "Top-level sport and coaching",
            text: "Willem worked with Paralympic athletes, Special Olympics athletes, football teams and runners who needed structure, feedback and sustainable progress.",
          },
          {
            title: "Educating the next coaches",
            text: "He trained running coaches, taught training theory for more than 20 years and built programs for conditioning coaches and distance-running coaches.",
          },
          {
            title: "Performance with a holistic base",
            text: "Performance matters, but durable development, health, enjoyment, mental balance and injury prevention remain the foundation.",
          },
        ]
      : [
          {
            title: "Topniveau in sport en coaching",
            text: "Willem werkte met Paralympische atleten, Special Olympics sporters, voetbalteams en lopers die structuur, feedback en duurzame progressie nodig hebben.",
          },
          {
            title: "Trainers opleiden",
            text: "Hij leidde hardlooptrainers op, gaf meer dan 20 jaar trainingsleer en bouwde opleidingen voor conditietrainers en langeafstandscoaches.",
          },
          {
            title: "Presteren met een holistische basis",
            text: "Presteren is belangrijk, maar duurzame ontwikkeling, gezondheid, plezier, mentale balans en blessurepreventie blijven de basis.",
          },
        ];

  const profilePoints =
    locale === "en"
      ? [
          "Head coach of Israel’s middle- and long-distance selection for many years",
          "Head coach of the Israeli Paralympic athletics team",
          "Ten years coaching middle- and long-distance runners at A.V. Castricum and DEM in the Netherlands",
          "Head coach athletics at Special Olympics Israel",
          "20+ years teaching training theory at Wingate Institute",
          "Author of Fitness voor Voetbal and TopFit Hardloopboek",
        ]
      : [
          "Jarenlang hoofdtrainer van de midden- en langeafstandselectie van Israël",
          "Hoofdtrainer van de Israelische Paralympische atletiekploeg",
          "Tien jaar trainer voor de midden- en lange afstand bij A.V. Castricum en DEM",
          "Hoofdtrainer atletiek bij Special Olympics Israel",
          "Meer dan 20 jaar docent trainingsleer aan het Wingate Institute",
          "Auteur van Fitness voor Voetbal en TopFit Hardloopboek",
        ];

  const focusCards =
    locale === "en"
      ? [
          { label: "Profile", value: "40+ years in sport, coaching and education" },
          { label: "Regions", value: "Netherlands and Israel" },
          { label: "Specialisms", value: "Distance running, technique and conditioning" },
        ]
      : [
          { label: "Profiel", value: "40+ jaar in sport, coaching en onderwijs" },
          { label: "Werkgebied", value: "Nederland en Israel" },
          { label: "Specialisaties", value: "Langeafstandslopen, techniek en conditie" },
        ];

  const storyHighlights =
    locale === "en"
      ? [
          { title: "Sport & coaching", text: "Head coach roles, conditioning work and direct athlete guidance in multiple performance settings." },
          { title: "Coach education", text: "Programs, training theory and practical education for coaches who want more depth." },
          { title: "Teaching & writing", text: "Books, articles and classroom experience that translate practice into understandable coaching." },
        ]
      : [
          { title: "Sport & coaching", text: "Hoofdtrainerschap, conditiewerk en directe begeleiding van atleten in meerdere prestatieomgevingen." },
          { title: "Opleiden", text: "Opleidingen, trainingsleer en praktijkonderwijs voor trainers die meer diepgang willen." },
          { title: "Onderwijs & auteur", text: "Boeken, artikelen en leservaring die praktijk vertalen naar begrijpelijke coaching." },
        ];

  const experienceBullets =
    locale === "en"
      ? [
          "Head coach of Israel’s middle- and long-distance selection for many years",
          "Head coach of the Israeli Paralympic athletics team",
          "Ten years coaching middle- and long-distance runners at A.V. Castricum and DEM in the Netherlands",
          "Head coach athletics at Special Olympics Israel",
          "Conditioning coach for Israeli top-division clubs, including Beitar Jerusalem",
          "Assistant coach of the Israeli national women's football team",
          "Israeli 800 meter champion in 1993",
          "Co-founder of the Castricumse Loopweken",
        ]
      : [
          "Jarenlang hoofdtrainer van de midden- en langeafstandselectie van Israël",
          "Hoofdtrainer van de Israelische Paralympische atletiekploeg",
          "Tien jaar trainer voor de midden- en lange afstand bij A.V. Castricum en DEM",
          "Hoofdtrainer atletiek bij Special Olympics Israel",
          "Conditietrainer bij meerdere Israelische eredivisieclubs, waaronder Beitar Jerusalem",
          "Assistent-trainer van het Israelische nationale damesvoetbalelftal",
          "Israelisch kampioen 800 meter in 1993",
          "Mede-oprichter van de Castricumse Loopweken",
        ];

  const educationCards =
    locale === "en"
      ? [
          {
            eyebrow: "Coach education",
            title: "Training the people behind the athletes",
            bullets: [
              "Educator of running coaches for the Dutch Athletics Federation",
              "More than 20 years teaching training theory at the Wingate Institute",
              "Founder of the Conditioning Coach for Football program",
              "Founder of the distance-running coach education program",
              "Experienced educator in training theory, conditioning, technique and coaching",
            ],
          },
          {
            eyebrow: "Teaching and authorship",
            title: "Writing, teaching and sharing practical knowledge",
            bullets: [
              "Author of Fitness voor Voetbal",
              "Author of TopFit Hardloopboek",
              "Writer of many articles on training theory, running, conditioning and technique",
              "Broad experience as a teacher and movement educator",
              "After returning to the Netherlands, active in education including work with multilingual students",
            ],
          },
        ]
      : [
          {
            eyebrow: "Opleiding van trainers",
            title: "De trainers achter de sporters sterker maken",
            bullets: [
              "Opleider van hardlooptrainers bij de Atletiekunie",
              "Meer dan 20 jaar docent trainingsleer aan het Wingate Institute",
              "Oprichter van de opleiding Conditietrainer voor Voetbal",
              "Oprichter van de opleiding voor trainers van langeafstandslopers",
              "Ervaren docent in trainingsleer, conditietraining, looptechniek en coaching",
            ],
          },
          {
            eyebrow: "Onderwijs en auteurschap",
            title: "Kennis praktisch maken voor sporters en trainers",
            bullets: [
              "Auteur van Fitness voor Voetbal",
              "Auteur van TopFit Hardloopboek",
              "Schreef talrijke artikelen over trainingsleer, hardlopen, conditietraining en looptechniek",
              "Ruime ervaring als docent en bewegingsdocent",
              "Na terugkeer in Nederland opnieuw actief in het onderwijs, onder andere met anderstalige leerlingen",
            ],
          },
        ];

  const expertiseTags =
    locale === "en"
      ? [
          "Training theory",
          "Distance running",
          "Athletics",
          "Running technique",
          "Conditioning",
          "Football",
          "Coach education",
          "Talent development",
          "Coaching",
          "Injury prevention",
          "Recovery",
          "Nutrition",
        ]
      : [
          "Trainingsleer",
          "Langeafstandslopen",
          "Atletiek",
          "Looptechniek",
          "Conditietraining",
          "Voetbal",
          "Traineropleidingen",
          "Talentontwikkeling",
          "Coaching",
          "Blessurepreventie",
          "Herstel",
          "Voeding",
        ];

  const visionText =
    locale === "en"
      ? "At the center of Willem's work is a holistic approach to sport and health. Performance matters, but durable development, health, enjoyment, mental balance and injury prevention create the base for lasting success."
      : "Centraal in Willems werk staat een holistische benadering van sport en gezondheid. Presteren is belangrijk, maar duurzame ontwikkeling, gezondheid, plezier, mentale balans en het voorkomen van blessures vormen de basis voor langdurig sportief succes.";

  const visionValues =
    locale === "en"
      ? ["Performance", "Health", "Enjoyment", "Mental balance", "Injury prevention"]
      : ["Prestatie", "Gezondheid", "Plezier", "Mentale balans", "Blessurepreventie"];

  const photoCaption =
    locale === "en"
      ? "A coach who combines athletics, conditioning, education and calm in one practical system."
      : "Een coach die atletiek, conditie, onderwijs en rust samenbrengt in een praktisch systeem.";
  const packagesHref = localizedPath(locale, "abonnementen");
  const plansHref = localizedPath(locale, "trainingsschemas");
  const runnersworldPdfHref = "/pdf/Willem-in-Runnersworld.pdf";
  const embassyVideoHref = "/video/dutch-embassy-willem-luyckx.mp4";
  const mediaIntro =
    locale === "en"
      ? "Here you can see a video about Willem's work with visually impaired runners through the embassy, plus a Runnersworld interview."
      : "Hier zie je een video over Willems werk met slechtziende hardlopers via de ambassade, plus een interview met Runnersworld.";
  const videoDescription =
    locale === "en"
      ? "Willem coached visually impaired runners through the embassy."
      : "Willem trainde via de ambassade hardlopers die slechtziend zijn.";
  const pdfDescription =
    locale === "en"
      ? "A Runnersworld interview featuring Willem."
      : "Een interview met Runnersworld waarin Willem geinterviewd wordt.";

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
                Willem Luijckx
              </h1>
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700 md:text-base">{heroRoles}</p>
                <p className="text-lg leading-8 text-slate-600 md:text-xl">{highlight.intro}</p>
                <p className="text-base leading-8 text-slate-500 md:text-lg">{heroSecondary}</p>
              </div>
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
                  <Link to={`/${locale}/contact`}>{locale === "en" ? "Get in touch" : "Neem contact op"}</Link>
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
                  <div className="relative min-h-[18rem]">
                    <img
                      src={darkRunImage}
                      alt="Willem running in the dark"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,58,0.1)_0%,rgba(8,26,58,0.72)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-200">{locale === "en" ? "Training background" : "Trainingsachtergrond"}</div>
                      <div className="mt-2 text-lg font-black uppercase tracking-[0.04em]">
                        {locale === "en" ? "Netherlands and Israel" : "Nederland en Israel"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <div className="relative min-h-[18rem]">
                    <img
                      src={runningImage}
                      alt="Willem running"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(8,26,58,0.34)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-100">{locale === "en" ? "Vision" : "Visie"}</div>
                      <div className="mt-2 rounded-2xl border border-white/20 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                        {locale === "en" ? "Holistic, durable and performance-driven" : "Holistisch, duurzaam en prestatiegericht"}
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
            {locale === "en" ? "Profile" : "Profiel"}
          </div>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            {locale === "en"
              ? "This page shows the combination that defines Willem: elite sport experience, coach education, teaching and a practical view on long-term performance."
              : "Op deze pagina zie je de combinatie die Willem typeert: topsportervaring, traineropleidingen, onderwijs en een praktische kijk op prestaties op de lange termijn."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="space-y-3 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{locale === "en" ? "Profile" : "Profiel"}</div>
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
                {locale === "en" ? "Sport and coaching background" : "Sport- en coachingsachtergrond"}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "These roles and achievements show the range of environments in which Willem coached: elite sport, football, para athletics and long-distance running."
                  : "Deze rollen en prestaties laten zien in hoeveel verschillende omgevingen Willem coachte: topsport, voetbal, para-atletiek en langeafstandslopen."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {experienceBullets.map((bullet) => (
                <div key={bullet} className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  {bullet}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="about-education" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="grid gap-4 lg:grid-cols-2">
          {educationCards.map((card) => (
            <Card key={card.title} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-5 p-6 md:p-8">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">{card.eyebrow}</div>
                  <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950">{card.title}</h2>
                </div>
                <div className="space-y-3">
                  {card.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                      {bullet}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="about-focus" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-5 max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
            {locale === "en" ? "Expertise" : "Expertise"}
          </div>
          <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
            {locale === "en" ? "Fields Willem works in" : "Vakgebieden waarin Willem werkt"}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {locale === "en"
              ? "From training theory to recovery, the expertise stays broad so the coaching can remain specific."
              : "Van trainingsleer tot herstel: de expertise blijft breed, zodat de coaching juist specifiek kan zijn."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {expertiseTags.map((bullet) => (
            <Card key={bullet} className="border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "en" ? "Expertise" : "Expertise"}</div>
                <p className="text-sm leading-7 text-slate-700">{bullet}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="about-vision" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <Card className="border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                {locale === "en" ? "Vision" : "Visie"}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] md:text-5xl">
                {locale === "en" ? "Long-term success starts with the whole picture" : "Langdurig succes begint bij het hele plaatje"}
              </h2>
              <p className="max-w-4xl text-base leading-8 text-slate-200 md:text-lg">{visionText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {visionValues.map((value) => (
                <div key={value} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                  {value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="about-media" className={`mx-auto max-w-7xl px-5 py-8 md:px-8 ${fadeClass(loaded)}`}>
        <div className="mb-5 max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
            {locale === "en" ? "Media and background" : "Media en achtergrond"}
          </div>
          <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
            {locale === "en" ? "Video and interview with Willem" : "Video en interview met Willem"}
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
                    {locale === "en" ? "Training visually impaired runners" : "Trainen met blinde hardlopers"}
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
                className="border-white bg-white text-slate-950 shadow-sm hover:border-blue-100 hover:bg-blue-50 hover:text-slate-950"
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
  const blogMedia = getBlogMedia(slug);
  const blogHref = `/${locale}/blog`;
  const contactHref = `/${locale}/contact`;
  const subscriptionsHref = localizedPath(locale, "abonnementen");
  const isMuktiArticle = slug === "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past";
  const isNutritionArticle = slug === "voeding-voor-langeafstandslopers";
  const isTrainingTheoryArticle = slug === "trainingsleer-in-de-praktijk";
  const isInjuryFreeArticle = slug === "blessurevrij-opbouwen";
  const isTechniqueArticle = slug === "waarom-looptechniek-loont";

  if (isNutritionArticle && locale === "nl") {
    const foundationFoods = [
      "vers fruit",
      "rauwe groenten en grote salades",
      "peulvruchten",
      "volkoren granen en aardappelen",
      "noten, zaden en pitten",
      "olijfolie, avocado en gefermenteerde producten als ze passen",
    ];

    const limitFoods = [
      "ultrabewerkte producten",
      "frisdranken",
      "koek en snoep",
      "wit brood",
      "fastfood",
      "sterk gezoete ontbijtgranen en kant-en-klaarmaaltijden",
    ];

    const mealOrder = [
      { step: "1", title: "Begin met fruit", text: "Fruit levert snelle koolhydraten, antioxidanten, hydratatie en vitamines zonder je maaltijd direct zwaar te maken." },
      { step: "2", title: "Ga door met rauwe groenten of een grote salade", text: "De vezels voeden je darmflora, geven verzadiging en helpen je bloedsuiker stabieler te houden." },
      { step: "3", title: "Voeg daarna groenten, koolhydraten en eiwitten toe", text: "Denk aan havermout, volkoren pasta, rijst, quinoa, aardappelen, peulvruchten, eieren, yoghurt, tofu, tempeh of vis." },
      { step: "4", title: "Sluit af met gezonde vetten en rust", text: "Olijfolie, avocado, noten en zaden ondersteunen opname van vitamines en maken de maaltijd compleet." },
    ];

    const eatingHabits = [
      {
        title: "Kauw langzaam",
        text: "De vertering begint in je mond. Goed kauwen ontlast maag en darmen en helpt voedingsstoffen beter op te nemen.",
      },
      {
        title: "Eet met aandacht",
        text: "Niet achter je laptop, telefoon of televisie. Wie aandachtig eet, merkt verzadiging eerder en verteert vaak rustiger.",
      },
      {
        title: "Houd de sfeer rustig",
        text: "Stress en zware gesprekken activeren je vecht-of-vluchtsysteem, terwijl goede spijsvertering juist rust nodig heeft.",
      },
      {
        title: "Drinken rondom de maaltijd",
        text: "Drink niet tijdens de maaltijd. Drink een uur vóór en een uur na de maaltijd geen koffie of zwarte thee; die kunnen met name de opname van ijzer vertragen.",
      },
    ];

    const performancePillars = [
      {
        title: "Koolhydraten blijven essentieel",
        text: "Voor de meeste langeafstandslopers blijven havermout, aardappelen, zilvervliesrijst, quinoa, volkoren pasta, fruit en peulvruchten belangrijk voor glycogeenaanvulling.",
      },
      {
        title: "Eiwitten helpen herstel",
        text: "Verdeel eiwitten over de dag. Yoghurt, kwark, peulvruchten, eieren, tofu, tempeh en vis ondersteunen spierherstel na training.",
      },
      {
        title: "Gezonde vetten bouwen mee",
        text: "Olijfolie, noten, zaden, avocado en vette vis ondersteunen hormonen, hersenfunctie, herstel en opname van vitamines.",
      },
      {
        title: "Niet te veel, maar genoeg",
        text: "Te veel eten belast je spijsvertering en herstel. Eet wat nodig is en stop rond verzadiging, niet pas wanneer je helemaal vol zit.",
      },
    ];

    return (
      <section id="article" className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <BlogHeroBanner
          eyebrow="Blog / Voeding"
          category={post?.category ?? "Voeding"}
          readTime={post?.readTime ?? "9 min"}
          title={post?.title ?? "Voeding voor langeafstandslopers: herstel, gezondheid en duurzame prestaties"}
          summary="Waarom onbewerkte voeding, maaltijdvolgorde en rustig eten directe invloed hebben op herstel, darmgezondheid en duurzame prestaties."
          imageSrc={blogMedia.imageSrc}
          imageAlt={blogMedia.imageAlt}
          asideLabel="Waarom dit telt"
          asideText="Wie beter wil lopen, heeft niet alleen training nodig, maar ook voeding die herstel, belastbaarheid en energie echt ondersteunt."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Veel lopers besteden veel aandacht aan schema&apos;s, hartslagzones en schoenen, maar vergeten dat voeding minstens zo bepalend is.
              Niet alleen voor energie tijdens het lopen, maar ook voor herstel, immuunsysteem, darmgezondheid en blessuregevoeligheid.
            </p>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              De kern is niet alleen wat je eet, maar ook hoe, wanneer en in welke volgorde je eet. Wie voeding rustiger, natuurlijker en slimmer benadert,
              ondersteunt niet alleen prestaties, maar ook gezondheid op de lange termijn.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rode draad</div>
              <div className="grid gap-3">
                {[
                  "Onbewerkte voeding als basis",
                  "Maaltijdvolgorde die opname ondersteunt",
                  "Aandachtig eten voor betere vertering",
                  "Herstel en prestaties als gevolg van gezonde gewoonten",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Kernidee</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  De beste sportvoeding is meestal niet ingewikkeld. Eenvoud, aandacht en consistentie leveren vaak meer op dan dure sportproducten of strenge diëten.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50/70 shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">Eet vooral meer van dit</div>
              <div className="grid gap-3">
                {foundationFoods.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                      ✅
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50/70 shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-700">Beperk liever dit</div>
              <div className="grid gap-3">
                {limitFoods.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white/90 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                      ❌
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Slimme maaltijdvolgorde</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
                Eerst licht en levend, daarna pas zwaar en vullend
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Vanuit een holistische visie werkt het vaak beter om je spijsvertering stap voor stap op gang te brengen, in plaats van direct zwaar te eten.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mealOrder.map((item) => (
                <Card key={item.step} className="border-slate-200 bg-slate-50 shadow-none">
                  <CardContent className="space-y-3 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Stap {item.step}</div>
                    <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Hoe je eet telt ook</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Je spijsvertering houdt van rust, aandacht en ritme
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {eatingHabits.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Gewoonte</div>
                  <h3 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Rond training en herstel</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Vier pijlers die prestaties echt ondersteunen
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {performancePillars.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Pijler</div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-10 border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Conclusie</div>
            <p className="text-base leading-8 text-slate-200 md:text-lg">
              Voor de langeafstandsloper geldt hier hetzelfde als in training: consistentie wint van perfectie. Niet de strengste aanpak wint,
              maar de aanpak die je dagelijks kunt volhouden met kwaliteit, rust en aandacht.
            </p>
            <p className="text-base leading-8 text-slate-300 md:text-lg">
              Gezonde voeding is daarom niet alleen brandstof. Het is een manier om herstel, weerstand, concentratie, darmgezondheid en duurzame prestaties samen te ondersteunen.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-blue-200 bg-[linear-gradient(135deg,#f8fbff_0%,#e8f2ff_100%)] shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Begin nu met je intake</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-4xl">Begin nu met je intake</h2>
              <p className="text-sm leading-7 text-slate-600 md:text-base">
                Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to="/intake">Begin nu met je intake</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={subscriptionsHref}>Bekijk aanbod</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to={blogHref}>Terug naar blog</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to="/intake">Start intake</Link>
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

  if (isTrainingTheoryArticle && locale === "nl") {
    const principles = [
      {
        title: "Supercompensatie",
        text: "Na een trainingsprikkel daalt je niveau eerst tijdelijk. Pas in herstel bouwt het lichaam zich op naar een hoger niveau.",
      },
      {
        title: "Progressieve belasting",
        text: "Je moet genoeg prikkel geven om beter te worden, maar niet zo veel dat herstel achterblijft.",
      },
      {
        title: "Specificiteit",
        text: "Je lichaam past zich aan aan het soort belasting dat je vraagt. Een marathonloper traint dus anders dan een 5 km-loper.",
      },
      {
        title: "Individualiteit",
        text: "Leeftijd, trainingsachtergrond, slaap, stress en belastbaarheid bepalen hoe snel iemand zich aanpast.",
      },
      {
        title: "Reversibiliteit",
        text: "Wat je niet onderhoudt, verlies je weer. Daarom wint een consistente loper het vaak van een piekende loper.",
      },
      {
        title: "Variatie",
        text: "Afwisseling in tempo, duur en trainingsvorm voorkomt stagnatie en houdt verschillende energiesystemen scherp.",
      },
    ];

    const trainingTypes = [
      {
        title: "Rustige duurlopen",
        text: "Bouwen je aerobe basis op, verbeteren vetverbranding en vormen het grootste deel van de trainingsweek.",
      },
      {
        title: "Lange duurlopen",
        text: "Vergroten uithoudingsvermogen, mentale weerbaarheid en wedstrijdspecifieke belastbaarheid.",
      },
      {
        title: "Drempeltraining",
        text: "Helpt je harder lopen zonder snel te verzuren en schuift je duurzame tempo omhoog.",
      },
      {
        title: "Intervaltraining",
        text: "Verbetert VO2max, snelheid en het vermogen om hoge inspanning te herhalen.",
      },
      {
        title: "Hersteltraining",
        text: "Bevordert doorbloeding en herstel zonder nieuwe vermoeidheid op te stapelen.",
      },
    ];

    const phases = [
      {
        title: "Basisfase",
        text: "Je bouwt volume, ritme en aerobe capaciteit op zodat latere trainingsprikkels beter landen.",
      },
      {
        title: "Opbouwfase",
        text: "Tempo en interval krijgen meer ruimte, terwijl de basisomvang overeind blijft.",
      },
      {
        title: "Specifieke fase",
        text: "De trainingen sluiten nauwer aan op wedstrijdtempo, afstand en beoogde inspanning.",
      },
      {
        title: "Taperfase",
        text: "Het volume daalt, de scherpte blijft, en je arriveert frisser aan de startlijn.",
      },
    ];

    const mistakes = [
      "Te snel volume verhogen",
      "Te veel intensieve trainingen combineren",
      "Herstelweken overslaan",
      "Geen duidelijke trainingsstructuur hebben",
    ];

    return (
      <section id="article" className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <BlogHeroBanner
          eyebrow="Blog / Training"
          category={post?.category ?? "Training"}
          readTime={post?.readTime ?? "8 min"}
          title={post?.title ?? "Trainingsleer voor langeafstandslopen: principes voor effectieve duurtraining"}
          summary="Duurzaam beter lopen ontstaat niet door willekeurig meer te doen, maar door belasting, herstel en opbouw bewust te sturen."
          imageSrc={blogMedia.imageSrc}
          imageAlt={blogMedia.imageAlt}
          asideLabel="De kern"
          asideText="Wie begrijpt hoe supercompensatie, specificiteit en herstel samenwerken, kan slimmer trainen en langer progressie vasthouden."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Langeafstandslopen vraagt om meer dan alleen discipline. Prestatieverbetering ontstaat wanneer trainingsprikkels op het juiste moment,
              in de juiste dosering en met voldoende herstel worden toegepast.
            </p>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Goede trainingsleer maakt van losse kilometers een systeem. Je bouwt belastbaarheid op, stuurt adaptatie en voorkomt dat enthousiasme
              sneller groeit dan je lichaam aankan.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rode draad</div>
              <div className="grid gap-3">
                {[
                  "Belasting krijgt pas waarde door herstel",
                  "Rustige kilometers blijven de basis",
                  "Specifieke prikkels horen bij een specifiek doel",
                  "Consistentie wint het van losse pieken",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Belangrijkste inzicht</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Meer doen is niet hetzelfde als beter trainen. Juist de juiste volgorde en verhouding maken duurtraining effectief.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Basisprincipes</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Dit zijn de regels waar elke goede trainingsweek op leunt
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Principe</div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Weekopbouw</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Een goede week combineert verschillende prikkels
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trainingTypes.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-slate-50 shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Training</div>
                  <h3 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Periodisering</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
                Je piekt niet door toeval, maar door faseren
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Wie op het juiste moment scherp wil zijn, moet vooraf de juiste fases doorlopen en niet elke week hetzelfde blijven doen.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {phases.map((item) => (
                <Card key={item.title} className="border-slate-200 bg-slate-50 shadow-none">
                  <CardContent className="space-y-3 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Fase</div>
                    <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mt-10 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Adaptatie van het lichaam</div>
              <p className="text-sm leading-7 text-slate-600">
                Door regelmatige en goed gedoseerde prikkels verbetert je lichaam op meerdere niveaus tegelijk: zuurstofgebruik, loopeconomie,
                vetverbranding, capillaire dichtheid en de sterkte van pezen en spieren.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Die aanpassingen ontstaan niet in een losse toptijd, maar in weken en maanden waarin opbouw, rust en ritme samenkomen.
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/70 shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Veelgemaakte fouten</div>
              <div className="grid gap-3">
                {mistakes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-white/90 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                      !
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-10 border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Conclusie</div>
            <p className="text-base leading-8 text-slate-200 md:text-lg">
              Goede duurtraining is geen verzameling losse sessies. Het is een doordachte opbouw waarin belasting, herstel en timing elkaar versterken.
            </p>
            <p className="text-base leading-8 text-slate-300 md:text-lg">
              Wie volgens deze principes traint, bouwt niet alleen conditie op, maar ook structuur, belastbaarheid en een veel duurzamere vorm van progressie.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-blue-200 bg-[linear-gradient(135deg,#f8fbff_0%,#e8f2ff_100%)] shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Begin nu met je intake</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-4xl">Begin nu met je intake</h2>
              <p className="text-sm leading-7 text-slate-600 md:text-base">
                Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to="/intake">Begin nu met je intake</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={subscriptionsHref}>Bekijk aanbod</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to={blogHref}>Terug naar blog</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to="/intake">Start intake</Link>
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

  if (isInjuryFreeArticle && locale === "nl") {
    const goldenRules = [
      "Train met geduld en verhoog geleidelijk",
      "Luister naar pijnsignalen in plaats van ze weg te duwen",
      "Loop het grootste deel van je trainingen rustig",
      "Varieer in trainingsvormen en ondergrond",
      "Investeer twee keer per week in kracht",
      "Werk aan de mobiliteit van met name je enkel-, heup-, schouder- en nekgewrichten",
      "Behandel rustdagen als echte trainingsdagen",
      "Eet om herstel te ondersteunen",
      "Slaap genoeg: de behoefte is individueel, maar ga uit van minstens 8 uur en, indien mogelijk, een powernap. Dat ondersteunt het herstel van lichaam en geest, zodat je weer opgeladen bent",
      "Blijf genieten zodat prestatiedruk niet de overhand krijgt",
    ];

    const injuries = [
      {
        title: "Runners knee",
        text: "Ontstaat vaak door overbelasting, zwakke heupspieren en minder stabiliteit in de keten.",
      },
      {
        title: "Achillespeesklachten",
        text: "Worden vaak gevoed door te snelle opbouw, stijve kuiten en beperkte enkelmobiliteit.",
      },
      {
        title: "Shin splints",
        text: "Ontstaan sneller bij plots meer kilometers, harde ondergrond en zwakke onderbeenspieren.",
      },
      {
        title: "Plantaire fasciitis",
        text: "Hangt vaak samen met een stijve voetzool, vermoeide kuiten en langdurige overbelasting.",
      },
      {
        title: "Kuit- en hamstringklachten",
        text: "Ontstaan sneller bij vermoeidheid, te weinig warming-up of een tekort aan kracht en coordinatie.",
      },
    ];

    const routine = [
      "5 minuten wandelen of rustig joggen",
      "10 knieheffingen",
      "10 hakken-billen",
      "10 walking lunges",
      "20 kuitheffingen",
      "15 squats",
      "30 seconden plank",
      "30 seconden zijplank links",
      "30 seconden zijplank rechts",
      "Balansoefeningen op een been",
    ];

    const overloadSignals = [
      "De pijn neemt toe tijdens het lopen",
      "De pijn is de volgende ochtend erger",
      "Je loopstijl verandert door de klacht",
      "Vermoeidheid blijft dagen hangen",
      "Je motivatie zakt opvallend weg",
    ];

    return (
      <section id="article" className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <BlogHeroBanner
          eyebrow="Blog / Herstel"
          category={post?.category ?? "Herstel"}
          readTime={post?.readTime ?? "8 min"}
          title={post?.title ?? "Blessurevrij hardlopen: een holistische benadering voor een leven lang hardloopplezier"}
          summary="Blessurevrij blijven vraagt niet om geluk, maar om een betere balans tussen belasting, herstel, kracht, slaap en dagelijkse gewoonten."
          imageSrc={blogMedia.imageSrc}
          imageAlt={blogMedia.imageAlt}
          asideLabel="Waarom dit telt"
          asideText="Jaarlijks krijgt een groot deel van de lopers met klachten te maken, terwijl veel overbelastingsblessures juist te voorkomen zijn."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Hardlopen verbetert conditie, hartgezondheid en mentale rust, maar een groot deel van de lopers wordt ieder jaar toch onderbroken door klachten.
              Dat maakt blessurepreventie geen detail, maar een kernonderdeel van slim trainen.
            </p>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Blessurevrij hardlopen ontstaat wanneer belasting en belastbaarheid met elkaar in evenwicht blijven. Daar horen training, herstel, voeding, slaap,
              kracht, mobiliteit en mentale rust allemaal bij.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rode draad</div>
              <div className="grid gap-3">
                {[
                  "Overbelasting bouwt vaak stil op",
                  "Herstel is een actief onderdeel van trainen",
                  "Spanning en slaap hebben direct effect op belastbaarheid",
                  "Kleine routines voorkomen vaak grote terugval",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Holistische blik</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Wie alleen naar kilometers kijkt, mist vaak de echte oorzaak. Juist het totaalplaatje bepaalt of je lichaam de training blijft dragen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Tien gouden regels</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Dit zijn de gewoonten die je blessurerisico structureel verlagen
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {goldenRules.map((item, index) => (
              <Card key={item} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Regel {index + 1}</div>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Veelvoorkomende klachten</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Veel blessures beginnen met een voorspelbaar patroon
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {injuries.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-slate-50 shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Klacht</div>
                  <h3 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Dagelijkse preventieroutine</div>
              <p className="text-sm leading-7 text-slate-600">
                Met vijftien minuten per dag kun je kracht, coordinatie en stabiliteit al merkbaar ondersteunen.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {routine.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                      +
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50/70 shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-700">Herken overbelasting op tijd</div>
              <div className="grid gap-3">
                {overloadSignals.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white/90 p-4 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                      !
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rol van de geest</div>
              <p className="text-sm leading-7 text-slate-600">
                Chronische stress verhoogt spierspanning, vertraagt herstel en vermindert coordinatie. Een ontspannen loper beweegt vaak efficienter en herstelt beter.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Wandelingen, ademhalingsoefeningen, yoga en rustmomenten met vrienden of familie zijn geen luxe, maar hersteltools.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Wat onderzoek laat zien</div>
              <p className="text-sm leading-7 text-slate-600">
                Blessurerisico daalt wanneer hardlopers krachttraining doen, trainingsbelasting geleidelijk verhogen, voldoende slapen,
                genoeg energie en eiwitten binnenkrijgen en bewust herstelweken inplannen.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-10 border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Conclusie</div>
            <p className="text-base leading-8 text-slate-200 md:text-lg">
              Blessurevrij hardlopen is geen kwestie van geluk. Het is het resultaat van bewust opbouwen, goed herstellen en op tijd ingrijpen wanneer signalen veranderen.
            </p>
            <p className="text-base leading-8 text-slate-300 md:text-lg">
              Wie jarenlang gezond wil blijven lopen, investeert niet alleen in kilometers, maar net zo goed in slaap, kracht, mobiliteit, voeding en rust.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-blue-200 bg-[linear-gradient(135deg,#f8fbff_0%,#e8f2ff_100%)] shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Begin nu met je intake</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-4xl">Begin nu met je intake</h2>
              <p className="text-sm leading-7 text-slate-600 md:text-base">
                Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to="/intake">Begin nu met je intake</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={subscriptionsHref}>Bekijk aanbod</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to={blogHref}>Terug naar blog</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to="/intake">Start intake</Link>
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

  if (isTechniqueArticle && locale === "nl") {
    const whyTechniqueMatters = [
      {
        title: "Efficienter energiegebruik",
        text: "Een betere pas laat je langer tempo vasthouden zonder dat de inspanning onnodig oploopt.",
      },
      {
        title: "Minder blessurerisico",
        text: "Goede techniek verdeelt impact beter over spieren en gewrichten en voorkomt onnodige compensatie.",
      },
      {
        title: "Meer snelheid en uithoudingsvermogen",
        text: "Als je minder energie verliest per stap, kun je sneller lopen zonder dat de vermoeidheid even snel oploopt.",
      },
      {
        title: "Betere houding en ademhaling",
        text: "Een lange, ontspannen houding geeft je meer ruimte om zuurstof op te nemen en spanning kwijt te raken.",
      },
    ];

    const goals = [
      {
        title: "Houding",
        text: "Recht, lang en ontspannen lopen zodat nek, schouders en rug geen onnodige spanning vasthouden.",
      },
      {
        title: "Cadans",
        text: "Vind de juiste cadans: een goed evenwicht tussen paslengte en pasfrequentie, met niet te korte en niet te lange passen.",
      },
      {
        title: "Grondcontact",
        text: "Sneller en dynamischer afzetten helpt om minder energie in de grond te laten verdwijnen.",
      },
      {
        title: "Stabiliteit",
        text: "Een sterk bekken, actieve core en stabiele heupen houden je stap rustiger en beter herhaalbaar.",
      },
    ];

    const drills = [
      "Versnellingslopen van 80, 60 en 40 meter",
      "Kaatssprongen voor ritme en kort grondcontact",
      "Verschillende vormen van knieheffen (skipping) om de pasfrequentie te verbeteren",
      "Hoge knieheffingen met actieve armactie",
      "Hakken-billen om de achterzwaai losser te maken",
      "Loopsprongen voor een lichte en verende afzet om de paslengte te verbeteren",
    ];

    const exercises = [
      {
        title: "Plank",
        text: "Versterkt de rompspanning die nodig is om lang en stabiel te blijven lopen.",
      },
      {
        title: "Cadansdrills",
        text: "Helpen je een passende balans tussen pasfrequentie en paslengte te vinden, zonder te forceren.",
      },
      {
        title: "Snelle sprongetjes",
        text: "Train je grondcontacttijd en leer sneller uit de enkel en voet terug te veren.",
      },
      {
        title: "Zijwaartse lunge",
        text: "Verbetert heupstabiliteit en controle in de keten die tijdens hardlopen moet opvangen.",
      },
      {
        title: "Heupmobiliteit",
        text: "Meer ruimte in de heup maakt een lossere pas mogelijk en voorkomt dat spanning zich ophoopt.",
      },
    ];

    return (
      <section id="article" className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <BlogHeroBanner
          eyebrow="Blog / Techniek"
          category={post?.category ?? "Techniek"}
          readTime={post?.readTime ?? "9 min"}
          title={post?.title ?? "Looptechniek voor langeafstandslopers: verbeter je prestaties en vermijd blessures"}
          summary="Een betere looptechniek maakt je pas lichter, rustiger en duurzamer, zodat snelheid en belastbaarheid tegelijk kunnen groeien."
          imageSrc={blogMedia.imageSrc}
          imageAlt={blogMedia.imageAlt}
          asideLabel="Wat techniek doet"
          asideText="Wie efficienter leert bewegen, verspilt minder energie per stap en geeft overbelasting minder kans om zich op te stapelen."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Looptechniek wordt vaak onderschat, terwijl juist daar een groot deel van je efficientie en belastbaarheid verscholen ligt. De manier waarop je landt,
              afzet en je houding vasthoudt, bepaalt hoeveel energie je onderweg verliest.
            </p>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Bij lange afstanden telt dat extra zwaar mee. Een kleine technische winst per stap wordt over duizenden stappen ineens een merkbaar verschil in snelheid,
              vermoeidheid en blessurerisico.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rode draad</div>
              <div className="grid gap-3">
                {[
                  "Techniek is zowel aangeleerd als trainbaar",
                  "Cadans en houding zijn vaak de snelste winstpunten",
                  "Loopscholing scherpt coordinatie en ritme aan",
                  "Sterkere heupen en core maken techniek houdbaar",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Belangrijk inzicht</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  De beste loopstijl voelt zelden geforceerd. Hij oogt juist rustig, licht en ritmisch, ook wanneer het tempo hoog ligt.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Waarom techniek telt</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              De winst van een betere pas voel je in tempo, rust en belastbaarheid
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {whyTechniqueMatters.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Effect</div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 max-w-3xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Doelen van goede techniek</div>
            <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
              Vier punten waar bijna elke loper winst kan pakken
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {goals.map((item) => (
              <Card key={item.title} className="border-slate-200 bg-slate-50 shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Doel</div>
                  <h3 className="text-xl font-black uppercase tracking-[0.04em] text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Loopscholing die werkt</div>
              <p className="text-sm leading-7 text-slate-600">
                Loopscholing leert je niet alleen betere bewegingen, maar ook betere timing. Je traint spieren en hersenen tegelijk.
              </p>
              <div className="grid gap-3">
                {drills.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Oefeningen om techniek houdbaar te maken</div>
              <div className="grid gap-3">
                {exercises.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Efficientie in de praktijk</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-5xl">
                Een lichtere pas is vaak sneller dan een hardere pas
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Efficient hardlopen draait om de balans tussen fysiologie en biomechanica. Je wilt genoeg staplengte en afzet, maar zonder dat je lichaam
                elke stap te veel moet optillen, afremmen of corrigeren.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                Daarom voelen wereldtoppers vaak moeiteloos. Ze bewegen niet per se harder, maar schoner, ritmischer en economischer.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-10 border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(8,26,58,0.25)]">
          <CardContent className="space-y-4 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Conclusie</div>
            <p className="text-base leading-8 text-slate-200 md:text-lg">
              Looptechniek is geen cosmetische extra. Het is een van de snelste manieren om je pas efficienter, rustiger en duurzamer te maken.
            </p>
            <p className="text-base leading-8 text-slate-300 md:text-lg">
              Wie regelmatig aan ritme, houding, coordinatie en stabiliteit werkt, merkt vaak dat prestaties verbeteren zonder dat training zwaarder hoeft te voelen.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-10 border-blue-200 bg-[linear-gradient(135deg,#f8fbff_0%,#e8f2ff_100%)] shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">Begin nu met je intake</div>
              <h2 className="text-3xl font-black uppercase tracking-[0.04em] text-slate-950 md:text-4xl">Begin nu met je intake</h2>
              <p className="text-sm leading-7 text-slate-600 md:text-base">
                Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to="/intake">Begin nu met je intake</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to={subscriptionsHref}>Bekijk aanbod</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to={blogHref}>Terug naar blog</Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to="/intake">Start intake</Link>
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

  if (isMuktiArticle && locale === "nl") {
    return (
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <BlogHeroBanner
          eyebrow="Blog / Mukti Running"
          category={post?.category ?? "Mukti"}
          readTime={post?.readTime ?? "6 min"}
          title={post?.title ?? "Mukti Running: hardlopen met vrijheid, rust en minder druk"}
          summary="Mukti Running verschuift de focus van moeten presteren naar bewuster lopen, zodat plezier, rust en duurzame progressie weer samen kunnen vallen."
          imageSrc={blogMedia.imageSrc}
          imageAlt={blogMedia.imageAlt}
          asideLabel="Waarom dit past"
          asideText="Voor lopers die wel serieus willen trainen, maar niet willen vastlopen in druk, vergelijking en voortdurende prestatiedwang."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
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

          <Card className="border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">De rode draad</div>
              <div className="grid gap-3">
                {[
                  "Meer lopen vanuit aandacht dan vanuit druk",
                  "Structuur en ontspanning hoeven elkaar niet uit te sluiten",
                  "Rust is geen tegenpool van progressie",
                  "Duurzaam presteren begint vaak met minder forceren",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Kernidee</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Mukti Running is lopen als middel om vrijer te leven, niet als systeem om jezelf voortdurend op te jagen.
                </p>
              </div>
            </CardContent>
          </Card>
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
            <Link to={blogHref}>Terug naar blog</Link>
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
