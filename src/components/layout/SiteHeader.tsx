import { MessageCircle, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { localeLabels, type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { LocaleContent } from "@/lib/topfitContent";

type SiteHeaderProps = {
  locale: Locale;
  content: LocaleContent;
  currentPath: string;
};

export const SiteHeader = ({ locale, content, currentPath }: SiteHeaderProps) => {
  const [open, setOpen] = useState(false);

  const localeLinks = useMemo(
    () =>
      topFitSiteConfig.locales.map((value) => ({
        value,
        label: localeLabels[value],
        href: currentPath.replace(/^\/(nl|en|he)/, `/${value}`) || `/${value}`,
      })),
    [currentPath],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to={`/${locale}`} className="flex items-center gap-3">
          <img src={topFitSiteConfig.logoPath} alt={topFitSiteConfig.brandName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
          <div className="leading-none">
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">TopFit</div>
            <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Running</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex">
          {content.nav.map((item) => (
            <Link key={item.href} to={item.href} className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {localeLinks.map((item) => (
            <Link
              key={item.value}
              to={item.href}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition-colors ${
                item.value === locale ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {item.value}
            </Link>
          ))}
          <Button variant="hero" size="sm" asChild>
            <Link to={`/${locale}/contact`}>{content.hero.primaryCta}</Link>
          </Button>
          <Button variant="heroOutline" size="sm" asChild>
            <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`overflow-hidden border-t border-slate-200 bg-white lg:hidden ${open ? "max-h-[32rem]" : "max-h-0"}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:px-8">
          {content.nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {localeLinks.map((item) => (
              <Link
                key={item.value}
                to={item.href}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                  item.value === locale ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {item.value}
              </Link>
            ))}
          </div>
          <Button variant="heroOutline" className="mt-2 w-full justify-center" asChild>
            <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
