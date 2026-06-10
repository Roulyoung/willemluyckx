import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { isLocale, isRtlLocale, normalizeLocale, type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import { getLocaleContent, type LocaleContent } from "@/lib/topfitContent";
import { loadTopfitContent } from "@/lib/topfitRemote";
import { LocalePageView } from "./LocalePageView";
import { BlogArticle as LocaleBlogArticle } from "@/pages/localeSections";
const pageTitleMap: Record<string, string> = {
  home: "Home",
  "over-willem": "Over Willem",
  about: "Over Willem",
  abonnementen: "Abonnementen",
  subscriptions: "Subscriptions",
  trainingsschemas: "Trainingsschema's",
  "training-plans": "Training plans",
  looptechniek: "Looptechniek",
  "running-technique": "Running technique",
  "mukti-running": "Mukti Running",
  "clinics-en-trainingskampen": "Clinics & trainingskampen",
  "clinics-and-training-camps": "Clinics & training camps",
  "online-coaching": "Online coaching",
  coaching: "Online coaching",
  contact: "Contact",
  shop: "Shop",
  blog: "Blog",
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
  const section = parts[1] ?? "home";
  const slug = parts[2];

  useEffect(() => {
    const routeKey = slug ? "blog" : section;
    const sectionTitle = pageTitleMap[routeKey] ?? pageTitleMap.home;
    const blogPost = slug ? content.blog.find((entry) => entry.slug === slug) : undefined;
    const descriptionSource =
      routeKey === "blog" && slug
        ? blogPost?.excerpt ?? content.pageHighlights.blog.intro
        : content.pageHighlights[section] ?? content.pageHighlights[routeKey] ?? content.pageHighlights.home;

    const title =
      routeKey === "home"
        ? `${topFitSiteConfig.brandName} | ${topFitSiteConfig.slogan}`
        : routeKey === "blog" && blogPost
          ? `${blogPost.title} | ${sectionTitle} | ${topFitSiteConfig.brandName}`
          : `${sectionTitle} | ${topFitSiteConfig.brandName}`;
    const description = typeof descriptionSource === "string" ? descriptionSource : descriptionSource.intro || content.hero.lead;

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
  }, [content, section, slug]);

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
          <LocalePageView locale={locale} section={section} content={content} loaded={loaded} />
        )}
      </main>
      <SiteFooter locale={locale} content={content} />
    </div>
  );
};

export default LocalePage;