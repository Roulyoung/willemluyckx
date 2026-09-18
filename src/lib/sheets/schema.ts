import type { Locale } from "@/lib/i18n";

export const topFitSheetsSchemaVersion = 1;

export type SiteConfigRow = {
  site_key: string;
  schema_version: number;
  brand_name: string;
  tagline_nl: string;
  tagline_en: string;
  tagline_he: string;
  primary_locale: Locale;
  secondary_locales: string;
  site_url: string;
  logo_url: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  support_email: string;
  contact_email: string;
};

export type NavigationRow = {
  key: string;
  label_nl: string;
  label_en: string;
  label_he: string;
  href: string;
  sort_order: number;
  visible: boolean;
};

export type OfferRow = {
  offer_id: string;
  offer_type: "subscription" | "coaching" | "clinic" | "analysis" | "nutrition" | "training_camp";
  slug_nl: string;
  slug_en: string;
  slug_he: string;
  title_nl: string;
  title_en: string;
  title_he: string;
  summary_nl: string;
  summary_en: string;
  summary_he: string;
  details_nl: string;
  details_en: string;
  details_he: string;
  price: string;
  currency: string;
  billing_cycle: string;
  min_commitment_months: string;
  featured: boolean;
  active: boolean;
};

export type ShopProductRow = {
  product_id: string;
  slug_nl: string;
  slug_en: string;
  slug_he: string;
  name_nl: string;
  name_en: string;
  name_he: string;
  description_nl: string;
  description_en: string;
  description_he: string;
  price: string;
  currency: string;
  product_type: "digital" | "physical" | "service" | "ticket" | "bundle";
  category_key: string;
  image_id: string;
  stock_status: string;
  download_url: string;
  active: boolean;
};

export type BlogPostRow = {
  post_id: string;
  slug_nl: string;
  slug_en: string;
  slug_he: string;
  title_nl: string;
  title_en: string;
  title_he: string;
  excerpt_nl: string;
  excerpt_en: string;
  excerpt_he: string;
  category_key: string;
  hero_image_id: string;
  published_at: string;
  updated_at: string;
  status: string;
  content_nl: string;
  content_en: string;
  content_he: string;
};

export type HardloopwedstrijdRow = {
  race_id: string;
  slug_nl: string;
  slug_en: string;
  slug_he: string;
  title_nl: string;
  title_en: string;
  title_he: string;
  location_nl: string;
  location_en: string;
  location_he: string;
  country_nl: string;
  country_en: string;
  country_he: string;
  date: string;
  distance_km: string;
  elevation_m: string;
  surface_nl: string;
  surface_en: string;
  surface_he: string;
  level_nl: string;
  level_en: string;
  level_he: string;
  website_url: string;
  registration_url: string;
  contact_url: string;
  featured: boolean;
  active: boolean;
};

export type IntakeRow = {
  name: string;
  email: string;
  phone: string;
  goal: string;
  race_distance: string;
  weekly_volume: string;
  main_challenge: string;
  injuries: string;
  support_type: string;
  runs_per_week: string;
  timeline: string;
  coaching_preference: string;
  extra_notes: string;
};
