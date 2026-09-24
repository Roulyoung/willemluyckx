import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { isLocale, isRtlLocale, normalizeLocale, type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import { getLocaleContent, type LocaleContent } from "@/lib/topfitContent";
import { loadTopfitContent } from "@/lib/topfitRemote";
import { LocalePageView } from "./LocalePageView";
import { BlogArticle as LocaleBlogArticle } from "@/pages/localeSections";
import { propositionOffers } from "@/lib/proposition";
const pageTitleMap: Record<string, string> = {
  home: "Home",
  "over-willem": "Over Willem Luijckx",
  about: "About Willem Luijckx",
  abonnementen: "Aanbod",
  aanbod: "Aanbod",
  offers: "Offers",
  lezingen: "Lezingen",
  talks: "Talks",
  subscriptions: "Offers",
  hardloopkalender: "Hardloopkalender",
  "running-calendar": "Running calendar",
  "fysieke-coaching": "Fysieke coaching",
  "physical-coaching": "Physical coaching",
  trainingsschemas: "Trainingsschema's",
  "training-plans": "Training plans",
  looptechniek: "Looptechniek",
  "running-technique": "Running technique",
  "mukti-running": "Mukti Running",
  clinics: "Clinics",
  trainingskampen: "Trainingskampen",
  trainingkamp: "Trainingskampen",
  "training-camps": "Training camps",
  "online-coaching": "Online coaching",
  coaching: "Online coaching",
  contact: "Contact",
  shop: "Shop",
  blog: "Blog",
};

const sectionAliases: Record<string, string> = {
  trainingkamp: "trainingskampen",
};

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

  const parts = location.pathname.split("/").filter(Boolean);
  const rawSection = parts[1] ?? "home";
  const section = sectionAliases[rawSection] ?? rawSection;
  const slug = parts.slice(2).join("/") || undefined;

  const hashTarget = useMemo(() => {
    const rawHash = location.hash?.replace(/^#/, "").trim();
    return rawHash || "";
  }, [location.hash]);

  useEffect(() => {
    const routeKey = section === "blog" && slug ? "blog" : section;
    const sectionTitle = pageTitleMap[routeKey] ?? pageTitleMap.home;
    const blogPost = section === "blog" && slug ? content.blog.find((entry) => entry.slug === slug) : undefined;
    const offer = (section === "aanbod" || section === "offers") && slug
      ? propositionOffers(locale).find(entry => entry.slug === slug)
      : undefined;
    const descriptionSource =
      routeKey === "blog" && slug
        ? blogPost?.excerpt ?? content.pageHighlights.blog.intro
        : content.pageHighlights[section] ?? content.pageHighlights[routeKey] ?? content.pageHighlights.home;

    const title = offer
      ? `${offer.title} | ${offer.price} | ${topFitSiteConfig.brandName}`
      : routeKey === "home"
          ? `${topFitSiteConfig.brandName} | ${topFitSiteConfig.slogan}`
        : routeKey === "blog" && blogPost
          ? `${blogPost.title} | ${sectionTitle} | ${topFitSiteConfig.brandName}`
          : `${sectionTitle} | ${topFitSiteConfig.brandName}`;
    const description = offer?.summary ?? (typeof descriptionSource === "string" ? descriptionSource : descriptionSource.intro || content.hero.lead);

    document.title = title;

    const setMeta = (selector: string, value: string) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector);
      if (element) {
        element.setAttribute("content", value);
      }
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [content, locale, section, slug]);

  useEffect(() => {
    if (!loaded || !hashTarget) return;

    const target = document.getElementById(hashTarget);
    if (!target) return;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hashTarget, loaded, location.pathname, location.search, section, slug, content]);

  if (!isLocale(params.locale)) {
    return <Navigate to="/nl" replace />;
  }

  return (
    <div
      dir={isRtlLocale(locale) ? "rtl" : "ltr"}
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(23,120,242,0.16),_transparent_36%),linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fbff_100%)] text-slate-950"
    >
      <SiteHeader locale={locale} content={content} currentPath={location.pathname} />
      <main className="animate-fade-in">
        {section === "blog" && slug ? (
          <LocaleBlogArticle locale={locale} slug={slug} />
        ) : (
          <LocalePageView locale={locale} section={section} slug={slug} content={content} loaded={loaded} />
        )}
      </main>
      <SiteFooter locale={locale} content={content} />
    </div>
  );
};

export default LocalePage;
