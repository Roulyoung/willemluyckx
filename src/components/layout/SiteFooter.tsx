import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { Locale } from "@/lib/i18n";
import type { LocaleContent } from "@/lib/topfitContent";
import { NewsletterSignup } from "@/components/NewsletterSignup";

type SiteFooterProps = {
  locale: Locale;
  content: LocaleContent;
};

export const SiteFooter = ({ locale, content }: SiteFooterProps) => {
  const menuItems = content.menu;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-5 pt-12 md:px-8"><NewsletterSignup locale={locale} /></div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{content.footer.title}</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{content.footer.lead}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{locale === "he" ? "ניווט" : locale === "en" ? "Navigation" : "Navigatie"}</h3>
          <div className="mt-4 grid gap-3">
            {menuItems.map((item) => (
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
            <Link to={`/${locale}/contact`} className="flex items-center gap-3 transition-colors hover:text-blue-600">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span>{locale === "he" ? "עמוד יצירת קשר" : locale === "en" ? "Contact page" : "Contactpagina"}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 text-xs text-slate-500 md:px-8">
          <nav aria-label={locale === "he" ? "מידע משפטי" : locale === "nl" ? "Juridisch" : "Legal"} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="underline-offset-4 hover:underline" to={`/${locale}/privacy`}>{locale === "he" ? "פרטיות" : "Privacy"}</Link>
            <Link className="underline-offset-4 hover:underline" to={`/${locale}/${locale === "nl" ? "algemene-voorwaarden" : "terms"}`}>{locale === "he" ? "תנאי שימוש" : locale === "nl" ? "Algemene voorwaarden" : "Terms"}</Link>
            <Link className="underline-offset-4 hover:underline" to={`/${locale}/cookies`}>{locale === "he" ? "קובצי Cookie" : "Cookies"}</Link>
            <Link className="font-semibold underline-offset-4 hover:underline" to={`/${locale}/${locale === "nl" ? "overeenkomst-ontbinden" : "withdraw"}`}>{locale === "he" ? "ביטול ההסכם" : locale === "nl" ? "Overeenkomst ontbinden" : "Withdraw from contract"}</Link>
          </nav>
          <p className="leading-6">{topFitSiteConfig.legal.tradeName} · {topFitSiteConfig.legal.address} · KvK {topFitSiteConfig.legal.chamberOfCommerce} · Btw-id {topFitSiteConfig.legal.vatId}</p>
          <div className="flex flex-col gap-2 uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} TopFit Running</span>
          <span>
            {locale.toUpperCase()} / {topFitSiteConfig.slogan}
          </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
