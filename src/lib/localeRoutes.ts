import type { Locale } from "@/lib/i18n";
import type { LocaleContent } from "@/lib/topfitContent";

const sectionAliases: Record<string, string> = {
  offers: "aanbod",
  talks: "lezingen",
  subscriptions: "abonnementen",
  "physical-coaching": "fysieke-coaching",
  "about-willem": "over-willem",
  about: "over-willem",
  "training-plans": "trainingsschemas",
  "training-camps": "trainingskampen",
  trainingkamp: "trainingskampen",
  "running-calendar": "hardloopkalender",
  "running-technique": "looptechniek",
  coaching: "online-coaching",
};

const sectionByLocale: Record<Locale, Record<string, string>> = {
  nl: {
    home: "",
    "over-willem": "over-willem",
    abonnementen: "aanbod",
    aanbod: "aanbod",
    lezingen: "lezingen",
    hardloopkalender: "hardloopkalender",
    "fysieke-coaching": "fysieke-coaching",
    trainingsschemas: "trainingsschemas",
    looptechniek: "looptechniek",
    "mukti-running": "mukti-running",
    clinics: "clinics",
    trainingskampen: "trainingskampen",
    "online-coaching": "online-coaching",
    blog: "blog",
    contact: "contact",
    shop: "shop",
  },
  en: {
    home: "",
    "over-willem": "about-willem",
    abonnementen: "offers",
    aanbod: "offers",
    lezingen: "talks",
    hardloopkalender: "running-calendar",
    "fysieke-coaching": "physical-coaching",
    trainingsschemas: "training-plans",
    looptechniek: "running-technique",
    "mukti-running": "mukti-running",
    clinics: "clinics",
    trainingskampen: "training-camps",
    "online-coaching": "online-coaching",
    blog: "blog",
    contact: "contact",
    shop: "shop",
  },
  he: {
    home: "",
    "over-willem": "about-willem",
    abonnementen: "offers",
    aanbod: "offers",
    lezingen: "talks",
    hardloopkalender: "running-calendar",
    "fysieke-coaching": "physical-coaching",
    trainingsschemas: "training-plans",
    looptechniek: "running-technique",
    "mukti-running": "mukti-running",
    clinics: "clinics",
    trainingskampen: "training-camps",
    "online-coaching": "online-coaching",
    blog: "blog",
    contact: "contact",
    shop: "shop",
  },
};

const routeKeyBySection = (section: string) => sectionAliases[section] ?? section;

const localizedSectionFromKey = (locale: Locale, key: string) => sectionByLocale[locale][key] ?? key;

const blogSlugMap: Record<string, Record<Locale, string>> = {
  "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past": {
    nl: "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past",
    en: "mukti-running-what-it-is-and-why-it-fits-topfit",
    he: "mukti-running-what-it-is-and-why-it-fits-topfit",
  },
  "trainingsleer-in-de-praktijk": {
    nl: "trainingsleer-in-de-praktijk",
    en: "training-principles-in-practice",
    he: "training-principles-in-practice",
  },
  "blessurevrij-opbouwen": {
    nl: "blessurevrij-opbouwen",
    en: "building-without-injury",
    he: "building-without-injury",
  },
  "waarom-looptechniek-loont": {
    nl: "waarom-looptechniek-loont",
    en: "why-running-technique-pays-off",
    he: "why-running-technique-pays-off",
  },
};

const offerSlugMap: Record<string, Record<Locale, string>> = {
  premium: {
    nl: "premium",
    en: "premium",
    he: "premium",
  },
  basis: {
    nl: "basis",
    en: "base",
    he: "base",
  },
  base: {
    nl: "basis",
    en: "base",
    he: "base",
  },
  "clinic-ticket": {
    nl: "clinic-ticket",
    en: "clinic-ticket",
    he: "clinic-ticket",
  },
};

const shopSlugMap: Record<string, Record<Locale, string>> = {
  "runningbook-pdf": {
    nl: "runningbook-pdf",
    en: "runningbook-pdf",
    he: "runningbook-pdf",
  },
  "intake-call": {
    nl: "intake-call",
    en: "intake-call",
    he: "intake-call",
  },
  "clinic-ticket": {
    nl: "clinic-ticket",
    en: "clinic-ticket",
    he: "clinic-ticket",
  },
  "physical-training-80": {
    nl: "physical-training-80",
    en: "physical-training-80",
    he: "physical-training-80",
  },
};

const translateSlug = (sectionKey: string, targetLocale: Locale, slug: string) => {
  if (sectionKey === "aanbod") return slug;

  if (sectionKey === "blog") {
    return blogSlugMap[slug]?.[targetLocale];
  }

  if (sectionKey === "abonnementen" || sectionKey === "subscriptions") {
    return offerSlugMap[slug]?.[targetLocale];
  }

  if (sectionKey === "shop") {
    return shopSlugMap[slug]?.[targetLocale];
  }

  return undefined;
};

export const localizedPath = (locale: Locale, sectionKey: string, slug?: string) => {
  const normalizedSection = routeKeyBySection(sectionKey);
  const targetSection = localizedSectionFromKey(locale, normalizedSection);
  const basePath = targetSection ? `/${locale}/${targetSection}` : `/${locale}`;

  if (!slug) return basePath;

  const translatedSlug = translateSlug(normalizedSection, locale, slug);
  return translatedSlug ? `${basePath}/${translatedSlug}` : basePath;
};

export const getLocalizedPath = (currentPath: string, targetLocale: Locale, content: LocaleContent) => {
  const parts = currentPath.split("/").filter(Boolean);
  const rawSection = parts[1] ?? "home";
  const sectionKey = routeKeyBySection(rawSection);
  const slug = parts[2];
  return localizedPath(targetLocale, sectionKey, slug);
};
