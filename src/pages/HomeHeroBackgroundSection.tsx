import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
          className="absolute inset-0 h-full w-full object-cover object-[center_22%] opacity-60 brightness-[0.68] contrast-[1.08] sm:object-[center_18%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,120,242,0.32),transparent_38%),linear-gradient(180deg,rgba(8,26,58,0.2)_0%,rgba(8,26,58,0.9)_100%)]" />

        <div className="relative px-6 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14">
          <div className="max-w-4xl space-y-7">
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
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white/35 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white"
              >
                <Link to={planHref}>{content.hero.secondaryCta}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white/35 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white"
              >
                <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-200">
              {locale === "nl"
                ? "Gezondheid eerst, prestaties als gevolg."
                : "Health first, performance as a result."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
