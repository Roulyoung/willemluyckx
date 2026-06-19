import logoPath from "@/assets/topfit/brand/logo-topfit.png";

export const topFitSiteConfig = {
  siteKey: "topfitrunning",
  brandName: "TopFit Running",
  slogan: "Loop je vrij, presteer vanzelf",
  domain: "topfitrunning.com",
  redirectDomain: "topfitrunning.nl",
  canonicalUrl: "https://topfitrunning.com",
  localeDefault: "nl",
  locales: ["nl", "en", "he"] as const,
  logoPath,
  palette: {
    primary: "#1778F2",
    primaryDark: "#0D2E66",
    accent: "#4FA6FF",
    background: "#F8FBFF",
    surface: "#FFFFFF",
    muted: "#EAF2FF",
    text: "#081A3A",
  },
  contact: {
    email: "info@topfitrunning.com",
    phoneDisplay: "+31 6 47264454",
    phoneHref: "tel:+31647264454",
    whatsappHref: "https://wa.me/31647264454",
    instagramUrl: "",
  },
  social: {
    instagramHandle: "@topfitrunning",
  },
} as const;
