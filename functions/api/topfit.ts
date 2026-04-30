type Locale = "nl" | "en" | "he";

type LocaleContent = {
  nav: Array<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: string; secondaryCta: string };
  proof: { headline: string; description: string; stats: Array<{ value: string; label: string }> };
  offers: Array<{ title: string; price: string; summary: string; bullets: string[]; featured?: boolean }>;
  services: Array<{ title: string; summary: string; tag: string }>;
  shop: Array<{ slug: string; title: string; summary: string; price: string; type: string }>;
  blog: Array<{ slug: string; title: string; excerpt: string; category: string; readTime: string }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  cta: { title: string; lead: string; button: string };
  pageHighlights: Record<string, { title: string; intro: string; bullets: string[] }>;
  faq: Array<{ q: string; a: string }>;
  footer: { title: string; lead: string };
};

type SheetRow = Record<string, string>;

const SHEET_ID =
  "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";

const parseBoolean = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .match(/^(1|true|yes|y|on)$/) !== null;

const getLocaleValue = (row: SheetRow, key: string, locale: Locale) =>
  row[`${key}_${locale}`] ?? row[`${key}_nl`] ?? row[key] ?? "";

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
  const raw =
    String(env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "").trim() ||
    String(env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON ?? "").trim();

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

const buildPartialContent = (locale: Locale, data: Record<string, SheetRow[] | undefined>): Partial<LocaleContent> => {
  const siteConfig = data.SiteConfig?.[0];
  const navRows = (data.Navigation || []).filter((row) => parseBoolean(row.visible));
  const offers = data.Offers || [];
  const shop = data.ShopProducts || [];
  const faqRows = data.FAQ || [];
  const pages = data.Pages || [];
  const blogCategories = data.BlogCategories || [];
  const blogPosts = data.BlogPosts || [];

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
    nav: navRows.map((row) => ({
      label: getLocaleValue(row, "label", locale),
      href: row.href || `/${locale}`,
    })),
    hero: {
      eyebrow: siteConfig?.brand_name || "TopFit Running",
      title: getLocaleValue(siteConfig ?? {}, "tagline", locale) || "Loop je vrij, presteer vanzelf",
      lead:
        pageMap.get("home")?.intro ||
        "Abonnementen, coaching, clinics, webshop en kennis in één premium platform voor lopers die meer willen dan een schema.",
      primaryCta: locale === "en" ? "Start your plan" : locale === "he" ? "התחל את התכנית שלך" : "Start je schema",
      secondaryCta: locale === "en" ? "Visit the shop" : locale === "he" ? "למדו בחנות" : "Bekijk de shop",
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
        title: getLocaleValue(row, "title", locale),
        price: normalizePrice(row.price, row.currency),
        summary: getLocaleValue(row, "summary", locale),
        bullets: [getLocaleValue(row, "details", locale)]
          .concat(row.min_commitment_months ? [`Minimaal ${row.min_commitment_months} maanden`] : [])
          .filter(Boolean),
        featured: parseBoolean(row.featured),
      })),
    services: [],
    shop: shop
      .filter((row) => parseBoolean(row.active))
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
      title: locale === "en" ? "Ready for a system that goes beyond a plan?" : "Klaar voor een traject dat verder gaat dan een schema?",
      lead:
        locale === "en"
          ? "Start with a subscription, book an intake or go straight to a clinic or shop item."
          : "Start met een abonnement, boek een intake of kies direct een clinic of shopproduct.",
      button: locale === "en" ? "Book your intake" : "Plan je intake",
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
    const locale = (url.searchParams.get("locale") || "nl").toLowerCase() as Locale;
    const serviceAccount = getServiceAccount(env as Record<string, unknown>);
    if (!serviceAccount?.client_email || !serviceAccount.private_key) {
      return Response.json({ error: "Missing Google service account secret." }, { status: 503 });
    }

    const token = await getAccessToken(serviceAccount);
    const ranges = [
      "SiteConfig!A1:Z10",
      "Navigation!A1:Z100",
      "Pages!A1:Z100",
      "Offers!A1:Z100",
      "ShopProducts!A1:Z100",
      "BlogCategories!A1:Z50",
      "BlogPosts!A1:Z100",
      "FAQ!A1:Z100",
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
