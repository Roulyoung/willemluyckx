import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import darkRunImage from "@/assets/topfit/photos/willem-dark.jpg";
import { type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { LocaleContent } from "@/lib/topfitContent";

type HomeHeroBackgroundSectionProps = {
  locale: Locale;
  content: LocaleContent;
  planHref: string;
  loaded: boolean;
};

export const HomeHeroBackgroundSection = ({ locale, content, planHref, loaded }: HomeHeroBackgroundSectionProps) => {
  return (
    <section className={`mx-auto max-w-7xl px-5 pb-10 pt-10 md:px-8 lg:py-14 ${loaded ? "animate-fade-up" : "animate-fade-up"}`}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-950 text-white shadow-[0_30px_80px_rgba(13,46,102,0.2)]">
        <img
          src={darkRunImage}
          alt="Willem running in the dark"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-55 brightness-[0.72] contrast-[1.06] sm:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,120,242,0.28),transparent_38%),linear-gradient(180deg,rgba(8,26,58,0.28)_0%,rgba(8,26,58,0.88)_100%)]" />

        <div className="relative grid gap-8 px-6 py-10 md:px-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100 backdrop-blur">
              {content.hero.eyebrow}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]">
                {content.hero.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-100 md:text-xl">{content.hero.lead}</p>
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
          </div>

          <Card className="border-white/10 bg-white/8 text-white shadow-none backdrop-blur-md">
            <CardContent className="space-y-5 p-5 md:p-6">
              <div className="grid gap-3 text-sm text-slate-100 sm:grid-cols-3">
                {content.proof.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="mt-1 uppercase tracking-[0.28em] text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {content.offers.slice(0, 2).map((offer) => (
                  <div key={offer.title} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">{offer.price}</div>
                        <div className="mt-1 text-lg font-bold text-white">{offer.title}</div>
                      </div>
                      {offer.featured ? <span className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">Top</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{offer.summary}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
