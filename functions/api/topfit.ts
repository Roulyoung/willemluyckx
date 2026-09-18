import { normalizeLocale, type Locale } from "@/lib/i18n";
import { TOPFIT_SHEETS_RANGES } from "@/lib/sheets/topfitSheets";

type LocaleContent = {
  nav: Array<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: string; secondaryCta: string };
  proof: { headline: string; description: string; stats: Array<{ value: string; label: string }> };
  offers: Array<{ slug: string; title: string; price: string; summary: string; bullets: string[]; featured?: boolean }>;
  services: Array<{ title: string; summary: string; tag: string }>;
  shop: Array<{ slug: string; title: string; summary: string; price: string; type: string }>;
  blog: Array<{ slug: string; title: string; excerpt: string; category: string; readTime: string }>;
  hardloopwedstrijden: Array<{
    title: string;
    location: string;
    country: string;
    date: string;
    distance: string;
    elevation: string;
    surface: string;
    level: string;
    websiteUrl: string;
    registrationUrl: string;
    contactUrl: string;
    featured?: boolean;
  }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  cta: { title: string; lead: string; button: string };
  pageHighlights: Record<string, { title: string; intro: string; bullets: string[] }>;
  faq: Array<{ q: string; a: string }>;
  footer: { title: string; lead: string };
};

type SheetRow = Record<string, string>;

const SHEET_ID =
  "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";
const LIVE_HOSTS = new Set(["topfitrunning.com", "www.topfitrunning.com", "localhost", "127.0.0.1"]);
const HIDDEN_NAV_SEGMENTS = ["/trainingskampen", "/training-camps"];

const parseBoolean = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .match(/^(1|true|yes|y|on)$/) !== null;

const getLocaleValue = (row: SheetRow, key: string, locale: Locale) =>
  row[`${key}_${locale}`] ?? row[`${key}_nl`] ?? row[key] ?? "";

const getAnyValue = (row: SheetRow, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && String(value).trim() !== "") return String(value);
  }
  return "";
};

const isTruthyRow = (value: unknown) => {
  if (value === undefined || value === null || String(value).trim() === "") return true;
  return parseBoolean(value);
};

const looksLikeEuropeanDate = (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim());

const cleanCompactCell = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/^\*+/, "");

const inferCompactRaceTitle = (location: string, distance: string, surface: string) => {
  if (!location) return "";

  const normalizedLocation = location.toLowerCase();
  const normalizedDistance = distance.toLowerCase();
  const normalizedSurface = surface.toLowerCase();

  if (normalizedLocation === "vrouwenpolder") return "Kustloop Vrouwenpolder";
  if (normalizedLocation === "amsterdam" && normalizedDistance.includes("16,1")) return "Amsterdam Loop 16K";
  if (normalizedLocation === "terschelling" && normalizedDistance.includes("21,1")) return "Terschelling Halve Marathon";
  if (normalizedLocation === "nijmegen" && normalizedSurface.includes("bos")) return "Nijmegen Trail";
  if (normalizedLocation === "etten-leur") return "Etten-Leur Halve Marathon";
  if (normalizedDistance.includes("42,2")) return `${location} Marathon`;
  if (normalizedDistance.includes("21,1")) return `${location} Halve Marathon`;
  if (normalizedSurface.includes("trail") || normalizedSurface.includes("onverhard")) return `${location} Trail`;

  return location;
};

const isSectionSlug = (value: string) =>
  new Set(["nl", "en", "he", "abonnementen", "subscriptions", "clinics"]).has(value.toLowerCase());

const deriveOfferSlug = (value: string, locale: Locale) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("premium")) return "premium";
  if (normalized.includes("base") || normalized.includes("basis")) return locale === "nl" ? "basis" : "base";
  if (normalized.includes("clinic")) return "clinic-ticket";
  return "";
};

const normalizeOfferSlug = (row: SheetRow, locale: Locale) => {
  const candidates = [
    row[`slug_${locale}`],
    row.slug_nl,
    row.slug_en,
    row.slug_he,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate.includes("/")) return candidate;

    const lastSegment = candidate.split("/").filter(Boolean).at(-1) ?? "";
    if (lastSegment && !isSectionSlug(lastSegment)) return lastSegment;
  }

  return deriveOfferSlug(String(row.offer_id ?? ""), locale) || deriveOfferSlug(getLocaleValue(row, "title", locale), locale);
};

const mapHardloopwedstrijd = (row: SheetRow, locale: Locale) => {
  const legacyCompactRow =
    looksLikeEuropeanDate(String(row.race_id ?? "")) &&
    !getAnyValue(row, ["date", "datum"]) &&
    !getLocaleValue(row, "location", locale) &&
    !getLocaleValue(row, "country", locale);

  if (legacyCompactRow) {
    const location = cleanCompactCell(row.slug_nl);
    const country = cleanCompactCell(row.slug_en) || (locale === "en" ? "Netherlands" : "Nederland");
    const distance = cleanCompactCell(row.slug_he);
    const surface = cleanCompactCell(row.title_nl);

    return {
      title: inferCompactRaceTitle(location, distance, surface),
      location,
      country,
      date: cleanCompactCell(row.race_id),
      distance,
      elevation: "",
      surface,
      level: locale === "en" ? "Race" : "Wedstrijd",
      websiteUrl: "",
      registrationUrl: "",
      contactUrl: "",
      featured: false,
    };
  }

  const location =
    getLocaleValue(row, "location", locale) ||
    getAnyValue(row, ["stad", "city", "plaats", "locatie", "location"]);
  const country =
    getLocaleValue(row, "country", locale) ||
    getAnyValue(row, ["land", "country"]);
  const distance = getAnyValue(row, ["distance_km", "afstand", "distance"]);
  const surface = getLocaleValue(row, "surface", locale) || getAnyValue(row, ["ondergrond", "surface"]);

  return {
    title:
      getLocaleValue(row, "title", locale) ||
      getAnyValue(row, ["titel", "naam", "race", "event", "wedstrijd", "title"]) ||
      inferCompactRaceTitle(location, distance, surface),
    location,
    country,
    date: getAnyValue(row, ["date", "datum"]),
    distance,
    elevation: getAnyValue(row, ["elevation_m", "hoogtemeters", "elevation"]),
    surface,
    level: getLocaleValue(row, "level", locale) || getAnyValue(row, ["niveau", "level"]) || (locale === "en" ? "Race" : "Wedstrijd"),
    websiteUrl: getAnyValue(row, ["website_url", "website", "url"]),
    registrationUrl: getAnyValue(row, ["registration_url", "inschrijven_url", "registration"]),
    contactUrl: getAnyValue(row, ["contact_url", "contact", "email"]),
    featured: parseBoolean(row.featured),
  };
};

const rowsToObjects = (rows: string[][]): SheetRow[] => {
  if (!rows.length) return [];
  const [headers, ...dataRows] = rows;
  return dataRows.map((row) =>
    headers.reduce<SheetRow>((acc, header, index) => {
      acc[header] = String(row[index] ?? "");
      return acc;
    }, {}),
  );
};

const getServiceAccount = (env: Record<string, unknown>) => {
  const raw = [env.GOOGLE_SERVICE_ACCOUNT_JSON, env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON]
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

  if (!raw) return null;
  try {
    return JSON.parse(raw) as { client_email: string; private_key: string };
  } catch {
    return null;
  }
};

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const stringToBase64Url = (value: string) =>
  bytesToBase64Url(new TextEncoder().encode(value));

const pemToArrayBuffer = (pem: string) => {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
};

async function getAccessToken(serviceAccount: { client_email: string; private_key: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = stringToBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = stringToBase64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const unsigned = `${header}.${claimSet}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${bytesToBase64Url(new Uint8Array(signature))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Token request failed: ${JSON.stringify(data)}`);
  return data.access_token as string;
}

async function requestJson(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`Google Sheets API request failed (${res.status})`);
  return json as { values?: string[][] };
}

const normalizePrice = (price: string, currency: string) => {
  const value = String(price ?? "").trim();
  if (!value) return "";
  if (/^€|EUR/i.test(value) || /\bEUR\b/.test(value)) return value;
  if (value === "0") return "Inbegrepen";
  if (currency === "EUR") return `€${value}`;
  return value;
};

const formatOfferPrice = (price: string, currency: string, billingCycle: string, locale: Locale) => {
  const base = normalizePrice(price, currency);
  if (!base || base === "Inbegrepen" || /op aanvraag/i.test(base)) return base;

  const cycle = String(billingCycle ?? "").trim().toLowerCase();
  if (cycle === "monthly") {
    return locale === "en" ? `${base} / month` : `${base} / maand`;
  }
  if (cycle === "one_time") {
    return locale === "en" ? `${base} one-time` : `${base} eenmalig`;
  }
  return base;
};

const splitOfferBullets = (details: string, minCommitmentMonths: string, locale: Locale) => {
  const normalizedDetails = String(details ?? "").trim();
  const segments = normalizedDetails
    ? (normalizedDetails.includes("\n") || normalizedDetails.includes(";") || normalizedDetails.includes("•")
        ? normalizedDetails.split(/\r?\n|;|•/g)
        : normalizedDetails.split(/\s*,\s*/g)
      )
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  const minCommitment = Number(minCommitmentMonths);
  if (Number.isFinite(minCommitment) && minCommitment > 0) {
    const commitmentText = locale === "en" ? `Minimum ${minCommitment} months` : `Minimaal ${minCommitment} maanden`;
    const hasCommitmentAlready = segments.some((segment) => /\b(minimum|minimaal)\b/i.test(segment));
    if (!hasCommitmentAlready) {
      segments.unshift(commitmentText);
    }
  }

  return segments;
};

const isVisibleShopRow = (row: SheetRow) => {
  const productType = String(row.product_type ?? "").trim().toLowerCase();
  return productType !== "physical" && productType !== "bundle";
};

const buildPartialContent = (locale: Locale, data: Record<string, SheetRow[] | undefined>): Partial<LocaleContent> => {
  const siteConfig = data.SiteConfig?.[0];
  const navRows = (data.Navigation || []).filter((row) => parseBoolean(row.visible));
  const offers = data.Offers || [];
  const shop = data.ShopProducts || [];
  const faqRows = data.FAQ || [];
  const pages = data.Pages || [];
  const blogCategories = data.BlogCategories || [];
  const blogPosts = data.BlogPosts || [];
  const hardloopwedstrijden = data.Hardloopwedstrijden || [];

  const pageMap = new Map(
    pages.map((row) => [
      row.page_key,
      {
        title: getLocaleValue(row, "title", locale),
        intro: getLocaleValue(row, "seo_description", locale) || getLocaleValue(row, "body", locale),
        bullets: [getLocaleValue(row, "hero_title", locale), getLocaleValue(row, "seo_title", locale)].filter(Boolean),
      },
    ]),
  );

  const categoryLabel = new Map(
    blogCategories.map((row) => [row.category_key, getLocaleValue(row, "label", locale)]),
  );

  return {
    nav: navRows
      .map((row) => ({
        label: getLocaleValue(row, "label", locale),
        href: row.href || `/${locale}`,
      }))
      .filter((item) => !HIDDEN_NAV_SEGMENTS.some((segment) => item.href.includes(segment))),
    hero: {
      eyebrow: siteConfig?.brand_name || "TopFit Running",
      title: getLocaleValue(siteConfig ?? {}, "tagline", locale) || "Loop je vrij, presteer met plezier",
      lead:
        pageMap.get("home")?.intro ||
        (locale === "en"
          ? "For runners who want to run better with more enjoyment, stronger technique and direct guidance from Willem."
          : "Voor lopers die met meer plezier, betere techniek en gerichte begeleiding van Willem duurzaam beter willen lopen."),
      primaryCta: locale === "en" ? "Run better" : locale === "he" ? "???????? ???? ???????????? ??????" : "Ren beter",
      secondaryCta: locale === "en" ? "View subscriptions" : locale === "he" ? "?????? ??????????????" : "Bekijk abonnementen",
    },
    proof: {
      headline: locale === "en" ? "A complete system, not just a training plan" : "Een compleet systeem, geen los trainingsschema",
      description:
        locale === "en"
          ? "TopFit Running combines guidance, knowledge and practical tools."
          : "TopFit Running combineert begeleiding, kennis en praktische tools.",
      stats: [
        { value: "40+", label: locale === "en" ? "years of experience" : "jaar ervaring" },
        { value: "PDF", label: locale === "en" ? "Runningbook included" : "Runningbook inbegrepen" },
        { value: "NL", label: locale === "en" ? "Dutch, English, Hebrew" : "Nederlands, Engels, Hebreeuws" },
      ],
    },
    offers: offers
      .filter((row) => parseBoolean(row.active))
      .map((row) => ({
        slug: normalizeOfferSlug(row, locale),
        title: getLocaleValue(row, "title", locale),
        price: formatOfferPrice(row.price, row.currency, row.billing_cycle, locale),
        summary: getLocaleValue(row, "summary", locale),
        bullets: splitOfferBullets(getLocaleValue(row, "details", locale), row.min_commitment_months, locale),
        featured: parseBoolean(row.featured),
      }))
      .filter((row) => row.slug),
    services: [],
    shop: shop
      .filter((row) => parseBoolean(row.active) && isVisibleShopRow(row))
      .map((row) => ({
        slug: row.slug_nl || row.slug_en || row.product_id,
        title: getLocaleValue(row, "name", locale),
        summary: getLocaleValue(row, "description", locale),
        price: normalizePrice(row.price, row.currency),
        type: row.product_type,
      })),
    blog: blogPosts
      .filter((row) => row.status === "published")
      .map((row) => ({
        slug: row.slug_nl || row.slug_en || row.post_id,
        title: getLocaleValue(row, "title", locale),
        excerpt: getLocaleValue(row, "excerpt", locale),
        category: categoryLabel.get(row.category_key) || row.category_key,
        readTime: "5 min",
      })),
    hardloopwedstrijden: hardloopwedstrijden
      .filter((row) => isTruthyRow(row.active))
      .map((row) => mapHardloopwedstrijd(row, locale))
      .filter((row) => row.title || row.location || row.date),
    about: {
      eyebrow: locale === "en" ? "About Willem" : "Over Willem",
      title: locale === "en" ? "40+ years of coaching and teaching experience" : "40+ jaar ervaring als coach en docent",
      paragraphs: [
        locale === "en"
          ? "Willem Luijckx brings performance, pleasure and awareness together in a direct coaching style."
          : "Willem Luijckx combineert prestatie, plezier en bewustzijn in een nuchtere aanpak.",
      ],
    },
    cta: {
      title: locale === "en" ? "Start your intake now" : "Begin nu met je intake",
      lead:
        locale === "en"
          ? "Tell Willem where you are now, where you want to go and what your body can handle so your guidance starts from the right place."
          : "Vertel Willem waar je nu staat, waar je naartoe wilt en wat jouw lichaam aankan, zodat je gericht kunt starten met begeleiding die bij je past.",
      button: locale === "en" ? "Start your intake now" : "Begin nu met je intake",
    },
    pageHighlights: Object.fromEntries(pageMap.entries()),
    faq: faqRows
      .filter((row) => parseBoolean(row.active))
      .map((row) => ({
        q: getLocaleValue(row, "question", locale),
        a: getLocaleValue(row, "answer", locale),
      })),
    footer: {
      title: siteConfig?.brand_name || "TopFit Running",
      lead: locale === "en" ? "Subscriptions, coaching, clinics, shop and blog in one brand platform." : "Abonnementen, coaching, clinics, shop en blog in één merkplatform.",
    },
  };
};

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    if (!LIVE_HOSTS.has(url.hostname)) {
      return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const locale = normalizeLocale(url.searchParams.get("locale")?.toLowerCase()) as Locale;
    const serviceAccount = getServiceAccount(env as Record<string, unknown>);
    if (!serviceAccount?.client_email || !serviceAccount.private_key) {
      return Response.json({ error: "Missing Google service account secret." }, { status: 503 });
    }

    const token = await getAccessToken(serviceAccount);
    const ranges = [
      TOPFIT_SHEETS_RANGES.siteConfig,
      TOPFIT_SHEETS_RANGES.navigation,
      TOPFIT_SHEETS_RANGES.pages,
      TOPFIT_SHEETS_RANGES.offers,
      TOPFIT_SHEETS_RANGES.shopProducts,
      TOPFIT_SHEETS_RANGES.blogCategories,
      TOPFIT_SHEETS_RANGES.blogPosts,
      TOPFIT_SHEETS_RANGES.hardloopwedstrijden,
      TOPFIT_SHEETS_RANGES.faq,
    ];

    const valuesByTab = await Promise.all(
      ranges.map(async (range) => {
        const tab = range.split("!")[0];
        const sheet = await requestJson(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`,
          token,
        );
        return [tab, rowsToObjects(sheet.values || [])] as const;
      }),
    );

    const data = Object.fromEntries(valuesByTab) as Record<string, SheetRow[]>;
    const content = buildPartialContent(locale, data);

    return Response.json({ ok: true, locale, content });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
