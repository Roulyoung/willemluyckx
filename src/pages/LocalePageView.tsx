import { Link, Navigate, useLocation } from "react-router-dom";
import { BlogFeatureCard } from "@/components/BlogFeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import type { Locale } from "@/lib/i18n";
import type { LocaleContent } from "@/lib/topfitContent";
import { AboutWillemPage } from "@/pages/localeSections";
import { ContactPage } from "@/pages/ContactPage";
import { BlogIndexPage, HardloopCalendarPage, MuktiPage, TechniquePage } from "@/pages/localeRoutePages";
import { HomeHeroBackgroundSection } from "@/pages/HomeHeroBackgroundSection";
import { localizedPath } from "@/lib/localeRoutes";
import { offerPath } from "@/lib/proposition";
import { OfferCards, OfferDetailPage, OffersPage, PropositionIntro } from "./OfferPages";

export const LocalePageView = ({ locale, section, slug, content, loaded }: {
  locale: Locale; section: string; slug?: string; content: LocaleContent; loaded: boolean;
}) => {
  const location = useLocation();
  const nl = locale === "nl";
  const highlight = content.pageHighlights[section] ?? content.pageHighlights[nl ? "aanbod" : "offers"];
  const detailRoutes: Record<string, string> = {
    trainingsschemas: "schema", "training-plans": "schema",
    "online-coaching": "zoom", coaching: "zoom",
    "fysieke-coaching": "fysiek", "physical-coaching": "fysiek",
    clinics: "clinic", lezingen: "lezing", talks: "lezing",
  };
  if (section === "over-willem" || section === "about-willem") return <AboutWillemPage locale={locale} highlight={highlight} loaded={loaded} />;
  if (section === "blog") return <BlogIndexPage locale={locale} content={content} highlight={highlight} loaded={loaded} />;
  if (section === "contact") return <ContactPage locale={locale} loaded={loaded} />;
  if (section === "hardloopkalender" || section === "running-calendar") return <HardloopCalendarPage locale={locale} content={content} highlight={highlight} loaded={loaded} />;
  if (section === "trainingskampen" || section === "training-camps") return <Navigate to={localizedPath(locale, "clinics")} replace />;
  if (section === "abonnementen" || section === "subscriptions" || section === "shop") {
    const oldSlugs: Record<string, string> = { premium: "schema", basis: "schema", base: "schema", "clinic-ticket": "clinic", "physical-training-80": "fysiek" };
    return <Navigate to={`${offerPath(locale, slug ? oldSlugs[slug] : undefined)}${location.search}${location.hash}`} replace />;
  }
  if (section === "aanbod" || section === "offers") return slug ? <OfferDetailPage locale={locale} slug={slug} /> : <OffersPage locale={locale} />;
  if (detailRoutes[section]) return <OfferDetailPage locale={locale} slug={detailRoutes[section]} />;
  if (section === "looptechniek" || section === "running-technique") return <TechniquePage locale={locale} highlight={highlight} loaded={loaded} />;
  if (section === "mukti-running") return <MuktiPage locale={locale} highlight={highlight} loaded={loaded} />;
  if (section !== "home" && section !== "") return <Navigate to={offerPath(locale)} replace />;

  return <>
    <HomeHeroBackgroundSection locale={locale} content={content} subscriptionsHref={`${offerPath(locale)}#guidance`} loaded={loaded} />
    <PropositionIntro locale={locale} />
    <section id="offers" className="mx-auto max-w-7xl space-y-7 px-5 py-12 md:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">{nl ? "Van schema naar persoonlijke begeleiding" : "From a plan to personal guidance"}</p>
        <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{nl ? "Jouw start. Jouw volgende stap." : "Your start. Your next step."}</h2>
        <p className="text-lg leading-8 text-slate-600">{nl ? "Begin betaalbaar met een schema op maat. Persoonlijke begeleiding helpt je verder met vragen, techniek en trainingsopbouw. Clinics en lezingen brengen onze visie tot leven." : "Start with an affordable tailored plan. Personal guidance helps you with questions, technique and training progression. Clinics and talks bring our approach to life."}</p>
      </div>
      <OfferCards locale={locale} />
    </section>
    <section id="about" className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-2">
      <img src={portraitImage} alt={nl ? "Willem Luijckx, hardloopcoach" : "Willem Luijckx, running coach"} className="h-[32rem] w-full rounded-3xl object-cover object-center" />
      <div className="flex flex-col justify-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">{content.about.eyebrow}</p>
        <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{content.about.title}</h2>
        {content.about.paragraphs.map(paragraph => <p key={paragraph} className="text-lg leading-8 text-slate-600">{paragraph}</p>)}
        <div className="flex flex-wrap gap-6">{content.proof.stats.map(stat => <div key={stat.label}><p className="text-2xl font-black text-blue-700">{stat.value}</p><p className="text-sm text-slate-600">{stat.label}</p></div>)}</div>
        <Button asChild variant="heroOutline" className="self-start"><Link to={localizedPath(locale, "over-willem")}>{nl ? "Meer over Willem" : "More about Willem"}</Link></Button>
      </div>
    </section>
    <section id="blog-teaser" className="mx-auto max-w-7xl space-y-6 px-5 py-12 md:px-8">
      <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{nl ? "Kennis voor beter trainen" : "Knowledge for better training"}</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{content.blog.map(post => <BlogFeatureCard key={post.slug} locale={locale} post={post} imageHeightClassName="min-h-[16rem]" />)}</div>
    </section>
    <section id="race-calendar" className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <Card><CardContent className="flex flex-col justify-between gap-6 p-7 md:flex-row md:items-center md:p-9">
        <div className="max-w-3xl space-y-4"><h2 className="text-3xl font-black text-slate-950">{nl ? "Vind je volgende wedstrijd" : "Find your next race"}</h2><p className="leading-8 text-slate-600">{nl ? "Bekijk de volledige wedstrijdlijst uit onze hardloopkalender en kies een doel dat bij je past." : "Browse the complete race list in our calendar and choose a goal that suits you."}</p></div>
        <Button asChild variant="hero"><Link to={localizedPath(locale, "hardloopkalender")}>{nl ? "Bekijk de loopkalender" : "Explore the calendar"}</Link></Button>
      </CardContent></Card>
    </section>
    <section id="footer-cta" className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
      <Card className="border-blue-100 bg-blue-50"><CardContent className="space-y-5 p-7 md:p-9"><h2 className="text-3xl font-black text-slate-950">{content.cta.title}</h2><p className="max-w-3xl text-lg leading-8 text-slate-700">{content.cta.lead}</p><Button asChild variant="hero" className="h-auto min-h-12 max-w-full whitespace-normal px-4 text-center"><Link to={offerPath(locale, "schema")}>{content.cta.button}</Link></Button></CardContent></Card>
    </section>
  </>;
};
