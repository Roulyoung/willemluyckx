import { ChevronDown, MessageCircle, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeLabels, type Locale } from "@/lib/i18n";
import { topFitSiteConfig } from "@/lib/siteConfig";
import type { LocaleContent } from "@/lib/topfitContent";

type SiteHeaderProps = {
  locale: Locale;
  content: LocaleContent;
  currentPath: string;
};

const menuButtonClass =
  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-blue-600";

const menuLinkClass =
  "rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700";

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

  const closeMenu = () => setOpen(false);

  const renderDesktopMenuItem = (item: LocaleContent["menu"][number]) => {
    if (!item.children?.length) {
      return (
        <Link key={item.href} to={item.href} className={menuButtonClass}>
          {item.label}
        </Link>
      );
    }

    return (
      <DropdownMenu key={item.label}>
        <DropdownMenuTrigger asChild>
          <button type="button" className={menuButtonClass}>
            {item.label}
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 rounded-3xl border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/10">
          <DropdownMenuLabel className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            {item.label}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={item.href} className="rounded-2xl px-3 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              {locale === "nl" ? "Bekijk overzicht" : locale === "he" ? "View overview" : "View overview"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 bg-slate-100" />
          {item.children.map((child) => (
            <DropdownMenuItem key={child.href} asChild>
              <Link to={child.href} className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                {child.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to={`/${locale}`} className="flex items-center gap-3">
          <img src={topFitSiteConfig.logoPath} alt={topFitSiteConfig.brandName} className="h-[3.96rem] w-[3.96rem] rounded-full object-cover shadow-sm" />
          <div className="leading-none">
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">TopFit</div>
            <div className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Running</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {content.menu.map((item) => renderDesktopMenuItem(item))}
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
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`overflow-hidden border-t border-slate-200 bg-white lg:hidden ${open ? "max-h-[34rem]" : "max-h-0"}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:px-8">
          {content.menu.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Link to={item.href} onClick={closeMenu} className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {item.label}
                  </Link>
                  <Link to={item.href} onClick={closeMenu} className="text-sm font-semibold text-blue-700">
                    {locale === "nl" ? "Bekijk" : "Open"}
                  </Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={closeMenu}
                      className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMenu}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                {item.label}
              </Link>
            ),
          )}
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
          <Button variant="hero" className="mt-2 w-full justify-center" asChild>
            <Link to={`/${locale}/contact`} onClick={closeMenu}>
              {content.hero.primaryCta}
            </Link>
          </Button>
          <Button variant="heroOutline" className="w-full justify-center" asChild>
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
