import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { Locale } from "@/lib/i18n";
import type { LocaleContent } from "@/lib/topfitContent";

type SiteFooterProps = {
  locale: Locale;
  content: LocaleContent;
};

export const SiteFooter = ({ locale, content }: SiteFooterProps) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{content.footer.title}</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{content.footer.lead}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Navigatie</h3>
          <div className="mt-4 grid gap-3">
            {content.nav.map((item) => (
              <Link key={item.href} to={item.href} className="text-sm text-slate-700 transition-colors hover:text-blue-600">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>TopFit Running HQ</span>
            </div>
            <a href={`mailto:${topFitSiteConfig.contact.email}`} className="flex items-center gap-3 transition-colors hover:text-blue-600">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>{topFitSiteConfig.contact.email}</span>
            </a>
            <a href={topFitSiteConfig.contact.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-blue-600">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-xs uppercase tracking-[0.28em] text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {new Date().getFullYear()} TopFit Running</span>
          <span>
            {locale.toUpperCase()} / {topFitSiteConfig.slogan}
          </span>
        </div>
      </div>
    </footer>
  );
};
