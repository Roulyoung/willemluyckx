export const supportedLocales = ["nl", "en", "he"] as const;

export type Locale = (typeof supportedLocales)[number];

export const localeLabels: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
  he: "HE",
};

export const isLocale = (value: string | undefined): value is Locale =>
  supportedLocales.includes(value as Locale);

export const normalizeLocale = (value: string | undefined): Locale => {
  if (isLocale(value)) return value;
  return "nl";
};

export const isRtlLocale = (locale: Locale) => locale === "he";

export const localeDirection = (locale: Locale) => (isRtlLocale(locale) ? "rtl" : "ltr");

