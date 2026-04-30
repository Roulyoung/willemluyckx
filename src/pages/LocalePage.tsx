import { BookOpen, Check, ChevronRight, Clock3, Globe2, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import portraitImage from "@/assets/topfit/photos/willem-portrait.jpg";
import runningImage from "@/assets/topfit/photos/willem-running.jpg";
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
  const isSubscriptions = section === "abonnementen" || section === "subscriptions";
  const isShop = section === "shop";
  const fallbackKey = locale === "nl" ? "abonnementen" : "subscriptions";
  const highlight = content.pageHighlights[section] ?? content.pageHighlights[fallbackKey];

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
              <Link to={`/${locale}/shop`}>{content.hero.secondaryCta}</Link>
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
              <img src={runningImage} alt="Willem running" className="absolute inset-0 h-full w-full object-cover opacity-40" />
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
