import type { Locale } from "@/lib/i18n";
import type { BlogPostRow, NavigationRow, OfferRow, ShopProductRow, SiteConfigRow } from "./schema";

export const TOPFIT_SHEETS = {
  siteConfig: "SiteConfig",
  navigation: "Navigation",
  pages: "Pages",
  offers: "Offers",
  shopProducts: "ShopProducts",
  blogCategories: "BlogCategories",
  blogPosts: "BlogPosts",
  testimonials: "Testimonials",
  faq: "FAQ",
  media: "Media",
  leads: "Leads",
} as const;

export const TOPFIT_SHEETS_RANGES = {
  siteConfig: "SiteConfig!A:Z",
  navigation: "Navigation!A:Z",
  pages: "Pages!A:Z",
  offers: "Offers!A:Z",
  shopProducts: "ShopProducts!A:Z",
  blogCategories: "BlogCategories!A:Z",
  blogPosts: "BlogPosts!A:Z",
  testimonials: "Testimonials!A:Z",
  faq: "FAQ!A:Z",
  media: "Media!A:Z",
  leads: "Leads!A:Z",
} as const;

export type SheetLocaleKey = Locale;

export const parseBoolean = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .match(/^(1|true|yes|y|on)$/) !== null;

export const mapSiteConfigRow = (row: Record<string, unknown>): SiteConfigRow => ({
  site_key: String(row.site_key ?? ""),
  schema_version: Number(row.schema_version ?? 1),
  brand_name: String(row.brand_name ?? ""),
  tagline_nl: String(row.tagline_nl ?? ""),
  tagline_en: String(row.tagline_en ?? ""),
  tagline_he: String(row.tagline_he ?? ""),
  primary_locale: String(row.primary_locale ?? "nl") as Locale,
  secondary_locales: String(row.secondary_locales ?? ""),
  site_url: String(row.site_url ?? ""),
  logo_url: String(row.logo_url ?? ""),
  color_primary: String(row.color_primary ?? ""),
  color_secondary: String(row.color_secondary ?? ""),
  color_accent: String(row.color_accent ?? ""),
  support_email: String(row.support_email ?? ""),
  contact_email: String(row.contact_email ?? ""),
});

export const mapNavigationRow = (row: Record<string, unknown>): NavigationRow => ({
  key: String(row.key ?? ""),
  label_nl: String(row.label_nl ?? ""),
  label_en: String(row.label_en ?? ""),
  label_he: String(row.label_he ?? ""),
  href: String(row.href ?? ""),
  sort_order: Number(row.sort_order ?? 0),
  visible: parseBoolean(row.visible ?? true),
});

export const mapOfferRow = (row: Record<string, unknown>): OfferRow => ({
  offer_id: String(row.offer_id ?? ""),
  offer_type: (String(row.offer_type ?? "subscription") as OfferRow["offer_type"]),
  slug_nl: String(row.slug_nl ?? ""),
  slug_en: String(row.slug_en ?? ""),
  slug_he: String(row.slug_he ?? ""),
  title_nl: String(row.title_nl ?? ""),
  title_en: String(row.title_en ?? ""),
  title_he: String(row.title_he ?? ""),
  summary_nl: String(row.summary_nl ?? ""),
  summary_en: String(row.summary_en ?? ""),
  summary_he: String(row.summary_he ?? ""),
  details_nl: String(row.details_nl ?? ""),
  details_en: String(row.details_en ?? ""),
  details_he: String(row.details_he ?? ""),
  price: String(row.price ?? ""),
  currency: String(row.currency ?? "EUR"),
  billing_cycle: String(row.billing_cycle ?? ""),
  min_commitment_months: String(row.min_commitment_months ?? ""),
  featured: parseBoolean(row.featured ?? false),
  active: parseBoolean(row.active ?? true),
});

export const mapShopProductRow = (row: Record<string, unknown>): ShopProductRow => ({
  product_id: String(row.product_id ?? ""),
  slug_nl: String(row.slug_nl ?? ""),
  slug_en: String(row.slug_en ?? ""),
  slug_he: String(row.slug_he ?? ""),
  name_nl: String(row.name_nl ?? ""),
  name_en: String(row.name_en ?? ""),
  name_he: String(row.name_he ?? ""),
  description_nl: String(row.description_nl ?? ""),
  description_en: String(row.description_en ?? ""),
  description_he: String(row.description_he ?? ""),
  price: String(row.price ?? ""),
  currency: String(row.currency ?? "EUR"),
  product_type: String(row.product_type ?? "digital") as ShopProductRow["product_type"],
  category_key: String(row.category_key ?? ""),
  image_id: String(row.image_id ?? ""),
  stock_status: String(row.stock_status ?? ""),
  download_url: String(row.download_url ?? ""),
  active: parseBoolean(row.active ?? true),
});

export const mapBlogPostRow = (row: Record<string, unknown>): BlogPostRow => ({
  post_id: String(row.post_id ?? ""),
  slug_nl: String(row.slug_nl ?? ""),
  slug_en: String(row.slug_en ?? ""),
  slug_he: String(row.slug_he ?? ""),
  title_nl: String(row.title_nl ?? ""),
  title_en: String(row.title_en ?? ""),
  title_he: String(row.title_he ?? ""),
  excerpt_nl: String(row.excerpt_nl ?? ""),
  excerpt_en: String(row.excerpt_en ?? ""),
  excerpt_he: String(row.excerpt_he ?? ""),
  category_key: String(row.category_key ?? ""),
  hero_image_id: String(row.hero_image_id ?? ""),
  published_at: String(row.published_at ?? ""),
  updated_at: String(row.updated_at ?? ""),
  status: String(row.status ?? "draft"),
  content_nl: String(row.content_nl ?? ""),
  content_en: String(row.content_en ?? ""),
  content_he: String(row.content_he ?? ""),
});

