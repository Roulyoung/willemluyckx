import type { Locale } from "@/lib/i18n";
import type { LocaleContent } from "@/lib/topfitContent";

type ApiResponse = {
  ok: boolean;
  locale?: Locale;
  content?: Partial<LocaleContent>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeContent = (base: LocaleContent, patch?: Partial<LocaleContent> | null): LocaleContent => {
  if (!patch) return base;

  return {
    ...base,
    ...patch,
    hero: { ...base.hero, ...(patch.hero ?? {}) },
    proof: { ...base.proof, ...(patch.proof ?? {}) },
    about: { ...base.about, ...(patch.about ?? {}) },
    cta: { ...base.cta, ...(patch.cta ?? {}) },
    footer: { ...base.footer, ...(patch.footer ?? {}) },
    nav: Array.isArray(patch.nav) && patch.nav.length > 0 ? patch.nav : base.nav,
    offers: Array.isArray(patch.offers) && patch.offers.length > 0 ? patch.offers : base.offers,
    services: Array.isArray(patch.services) && patch.services.length > 0 ? patch.services : base.services,
    shop: Array.isArray(patch.shop) && patch.shop.length > 0 ? patch.shop : base.shop,
    blog: Array.isArray(patch.blog) && patch.blog.length > 0 ? patch.blog : base.blog,
    pageHighlights:
      isObject(patch.pageHighlights) && Object.keys(patch.pageHighlights).length > 0
        ? { ...base.pageHighlights, ...(patch.pageHighlights as LocaleContent["pageHighlights"]) }
        : base.pageHighlights,
    faq: Array.isArray(patch.faq) && patch.faq.length > 0 ? patch.faq : base.faq,
  };
};

export const loadTopfitContent = async (locale: Locale, fallback: LocaleContent): Promise<LocaleContent> => {
  try {
    const response = await fetch(`/api/topfit?locale=${locale}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return fallback;

    const payload = (await response.json()) as ApiResponse;
    if (!payload.ok || !payload.content) return fallback;

    return mergeContent(fallback, payload.content);
  } catch {
    return fallback;
  }
};

