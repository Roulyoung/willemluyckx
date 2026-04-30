import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

const getArg = (name, fallback = "") => {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  return value && !value.startsWith("--") ? value : fallback;
};

const SHEET_ID =
  getArg("--sheet-id") ||
  process.env.SHEET_ID ||
  "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";
const SERVICE_ACCOUNT_PATH =
  process.env.SERVICE_ACCOUNT_PATH ||
  path.resolve(__dirname, "..", "worker", "secretgogle", "service-account.json");
const RANGE = getArg("--range", "");
const TAB = getArg("--tab", "");
const VALUES_RAW = getArg("--values", "");

if (!command || !["info", "read", "write", "append", "bootstrap-topfit", "seed-topfit"].includes(command)) {
  console.error("Usage:");
  console.error("  node scripts/google-sheets-admin.js info --sheet-id <id>");
  console.error("  node scripts/google-sheets-admin.js read --range <Sheet!A1:B10>");
  console.error('  node scripts/google-sheets-admin.js write --range <Sheet!A1:B10> --values \'[["a","b"]]\'');
  console.error('  node scripts/google-sheets-admin.js append --tab <Sheet> --values \'[["a","b"]]\'');
  console.error("  node scripts/google-sheets-admin.js bootstrap-topfit");
  console.error("  node scripts/google-sheets-admin.js seed-topfit");
  process.exit(1);
}

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service account file: ${SERVICE_ACCOUNT_PATH}`);
  console.error("Set SERVICE_ACCOUNT_PATH to a local JSON key outside the repo.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
const TOPFIT_TABS = {
  SiteConfig: [
    "site_key",
    "schema_version",
    "brand_name",
    "tagline_nl",
    "tagline_en",
    "tagline_he",
    "primary_locale",
    "secondary_locales",
    "site_url",
    "logo_url",
    "color_primary",
    "color_secondary",
    "color_accent",
    "support_email",
    "contact_email",
    "phone_display",
    "phone_href",
    "whatsapp_href",
    "instagram_url",
    "status",
  ],
  Navigation: ["key", "label_nl", "label_en", "label_he", "href", "sort_order", "visible"],
  Pages: [
    "page_key",
    "slug_nl",
    "slug_en",
    "slug_he",
    "title_nl",
    "title_en",
    "title_he",
    "seo_title_nl",
    "seo_title_en",
    "seo_title_he",
    "seo_description_nl",
    "seo_description_en",
    "seo_description_he",
    "hero_title_nl",
    "hero_title_en",
    "hero_title_he",
    "body_nl",
    "body_en",
    "body_he",
    "status",
  ],
  Offers: [
    "offer_id",
    "offer_type",
    "slug_nl",
    "slug_en",
    "slug_he",
    "title_nl",
    "title_en",
    "title_he",
    "summary_nl",
    "summary_en",
    "summary_he",
    "details_nl",
    "details_en",
    "details_he",
    "price",
    "currency",
    "billing_cycle",
    "min_commitment_months",
    "featured",
    "cta_label_nl",
    "cta_label_en",
    "cta_label_he",
    "active",
  ],
  ShopProducts: [
    "product_id",
    "slug_nl",
    "slug_en",
    "slug_he",
    "name_nl",
    "name_en",
    "name_he",
    "description_nl",
    "description_en",
    "description_he",
    "price",
    "currency",
    "sku",
    "product_type",
    "category_key",
    "image_id",
    "stock_status",
    "download_url",
    "active",
  ],
  BlogCategories: ["category_key", "label_nl", "label_en", "label_he", "sort_order", "active"],
  BlogPosts: [
    "post_id",
    "slug_nl",
    "slug_en",
    "slug_he",
    "title_nl",
    "title_en",
    "title_he",
    "excerpt_nl",
    "excerpt_en",
    "excerpt_he",
    "category_key",
    "hero_image_id",
    "published_at",
    "updated_at",
    "status",
    "content_nl",
    "content_en",
    "content_he",
    "seo_title_nl",
    "seo_title_en",
    "seo_title_he",
    "seo_description_nl",
    "seo_description_en",
    "seo_description_he",
  ],
  Testimonials: ["testimonial_id", "quote_nl", "quote_en", "quote_he", "name", "role", "image_id", "active"],
  FAQ: ["faq_id", "question_nl", "question_en", "question_he", "answer_nl", "answer_en", "answer_he", "section_key", "sort_order", "active"],
  Media: ["media_id", "file_name", "file_type", "asset_type", "url", "alt_nl", "alt_en", "alt_he", "credit", "active"],
  Leads: ["lead_id", "created_at", "source", "name", "email", "phone", "locale", "interest_type", "message", "status", "notes"],
};

const TOPFIT_SEED_ROWS = {
  SiteConfig: [[
    "topfitrunning",
    1,
    "TopFit Running",
    "Loop je vrij, presteer vanzelf",
    "Run free, perform naturally",
    "רץ חופשי, בצע טבעי",
    "nl",
    "nl,en,he",
    "https://topfitrunning.com",
    "brand/logo-topfit.png",
    "#1778F2",
    "#0D2E66",
    "#4FA6FF",
    "info@topfitrunning.com",
    "info@topfitrunning.com",
    "WhatsApp",
    "",
    "/wa",
    "",
    "active",
  ]],
  Navigation: [
    ["home", "Home", "Home", "דף הבית", "/nl", 1, true],
    ["subscriptions", "Abonnementen", "Subscriptions", "מנויים", "/nl/abonnementen", 2, true],
    ["coaching", "Coaching", "Coaching", "אימון", "/nl/coaching", 3, true],
    ["clinics", "Clinics", "Clinics", "קליניקות", "/nl/clinics", 4, true],
    ["shop", "Shop", "Shop", "חנות", "/nl/shop", 5, true],
    ["blog", "Blog", "Blog", "בלוג", "/nl/blog", 6, true],
    ["about", "Over Willem", "About Willem", "אודות וילם", "/nl/over-willem", 7, true],
    ["contact", "Contact", "Contact", "צור קשר", "/nl/contact", 8, true],
  ],
  Pages: [
    [
      "home",
      "/nl",
      "/en",
      "/he",
      "TopFit Running",
      "TopFit Running",
      "TopFit Running",
      "TopFit Running | Loop je vrij, presteer vanzelf",
      "TopFit Running | Run free, perform naturally",
      "TopFit Running",
      "Abonnementen, coaching, clinics, shop en blog voor lopers die verder willen dan een schema.",
      "Subscriptions, coaching, clinics, shop and blog for runners who want more than a plan.",
      "מנויים, אימון, קליניקות, חנות ובלוג לרצים שרוצים יותר מתוכנית.",
      "Loop je vrij, presteer vanzelf",
      "Run free, perform naturally",
      "רץ חופשי, בצע טבעי",
      "Premium platform voor lopers met begeleiding, kennis en praktische tools.",
      "Premium platform for runners with guidance, knowledge and practical tools.",
      "פלטפורמת פרימיום לרצים עם ליווי, ידע וכלים מעשיים.",
      "active",
    ],
    [
      "subscriptions",
      "/nl/abonnementen",
      "/en/subscriptions",
      "/he/subscriptions",
      "Abonnementen",
      "Subscriptions",
      "מנויים",
      "TopFit Running abonnementen",
      "TopFit Running subscriptions",
      "מנויים של TopFit Running",
      "Premium en Basis met Runningbook en coaching.",
      "Premium and Base with Runningbook and coaching.",
      "פרימיום ובסיס עם Runningbook ואימון.",
      "Twee duidelijke pakketten met maandelijkse begeleiding, schema's en het Runningbook.",
      "Two clear packages with monthly guidance, plans and the Runningbook.",
      "שני מסלולים ברורים עם ליווי חודשי, תכניות ו-Runningbook.",
      "Alles draait om structuur, begeleiding en resultaat.",
      "Everything centers on structure, guidance and results.",
      "הכל בנוי סביב מבנה, ליווי ותוצאה.",
      "active",
    ],
    [
      "coaching",
      "/nl/coaching",
      "/en/coaching",
      "/he/coaching",
      "Coaching",
      "Coaching",
      "אימון",
      "Persoonlijke coaching voor hardlopers",
      "Personal coaching for runners",
      "אימון אישי לרצים",
      "Zoom-gesprekken over training, blessures, herstel en vragen.",
      "Zoom calls about training, injury, recovery and questions.",
      "שיחות זום על אימון, פציעות, התאוששות ושאלות.",
      "1-op-1 begeleiding als extra service of als onderdeel van een abonnement.",
      "1-on-1 guidance as an extra service or as part of a subscription.",
      "ליווי אישי כשירות נוסף או כחלק מהמנוי.",
      "Voor lopers die sparring en scherpte willen.",
      "For runners who want sparring and focus.",
      "לרצים שרוצים שיח מקצועי ומיקוד.",
      "active",
    ],
    [
      "clinics",
      "/nl/clinics",
      "/en/clinics",
      "/he/clinics",
      "Clinics",
      "Clinics",
      "קליניקות",
      "Maandelijkse clinics en trainingsdagen",
      "Monthly clinics and training days",
      "קליניקות וימי אימון חודשיים",
      "Theorie en praktijk in een bosrijke omgeving met lunch.",
      "Theory and practice in a natural setting with lunch.",
      "תיאוריה ופרקטיקה בסביבה טבעית עם ארוחת צהריים.",
      "Een vaste eventflow met publicatie op de site en e-mail naar abonnees.",
      "A recurring event flow with site publication and email updates for subscribers.",
      "מערך אירועים קבוע עם פרסום באתר ועדכון במייל למנויים.",
      "Leer, train en ervaar direct op locatie.",
      "Learn, train and experience on site.",
      "ללמוד, להתאמן ולהרגיש במקום.",
      "active",
    ],
    [
      "shop",
      "/nl/shop",
      "/en/shop",
      "/he/shop",
      "Shop",
      "Shop",
      "חנות",
      "Webshop voor digitale en fysieke producten",
      "Shop for digital and physical products",
      "חנות למוצרים דיגיטליים ופיזיים",
      "Runningbook, intake, clinic tickets en sportvoeding.",
      "Runningbook, intake, clinic tickets and sports nutrition.",
      "Runningbook, שיחת פתיחה, כרטיסים לקליניקה ותזונת ספורט.",
      "De shop staat naast de abonnementen en groeit mee met het merk.",
      "The shop sits alongside subscriptions and grows with the brand.",
      "החנות יושבת לצד המנויים וגדלה עם המותג.",
      "Alles wat een loper nodig heeft, op één plek.",
      "Everything a runner needs, in one place.",
      "כל מה שרץ צריך, במקום אחד.",
      "active",
    ],
    [
      "blog",
      "/nl/blog",
      "/en/blog",
      "/he/blog",
      "Blog",
      "Blog",
      "בלוג",
      "Blog over training, techniek en herstel",
      "Blog about training, technique and recovery",
      "בלוג על אימון, טכניקה והתאוששות",
      "SEO, autoriteit en inhoudelijke verdieping voor lopers.",
      "SEO, authority and deeper content for runners.",
      "SEO, סמכות ותוכן מעמיק לרצים.",
      "De blog ondersteunt het merk en trekt organisch verkeer.",
      "The blog supports the brand and attracts organic traffic.",
      "הבלוג תומך במותג ומביא תנועה אורגנית.",
      "Slimme kennis, helder uitgelegd.",
      "Smart knowledge, clearly explained.",
      "ידע חכם, מוסבר בפשטות.",
      "active",
    ],
    [
      "about-willem",
      "/nl/over-willem",
      "/en/about-willem",
      "/he/about-willem",
      "Over Willem",
      "About Willem",
      "אודות וילם",
      "Over Willem Luijckx",
      "About Willem Luijckx",
      "אודות וילם לויכס",
      "40+ jaar ervaring als coach, docent en begeleider.",
      "40+ years of experience as coach, teacher and guide.",
      "40+ שנות ניסיון כמאמן, מורה ומלווה.",
      "De persoonlijke autoriteit achter TopFit Running.",
      "The personal authority behind TopFit Running.",
      "הסמכות האישית מאחורי TopFit Running.",
      "Ervaring, visie en nuchtere begeleiding.",
      "Experience, vision and practical guidance.",
      "ניסיון, חזון וליווי מעשי.",
      "active",
    ],
    [
      "contact",
      "/nl/contact",
      "/en/contact",
      "/he/contact",
      "Contact",
      "Contact",
      "צור קשר",
      "Contact en WhatsApp",
      "Contact and WhatsApp",
      "יצירת קשר ו-WhatsApp",
      "Voor intake, vragen en samenwerkingen.",
      "For intake, questions and collaborations.",
      "לשיחת פתיחה, שאלות ושיתופי פעולה.",
      "WhatsApp en e-mail zijn de snelste routes.",
      "WhatsApp and email are the fastest routes.",
      "WhatsApp ואימייל הם הערוצים המהירים ביותר.",
      "Neem direct contact op.",
      "Get in touch directly.",
      "פנו ישירות.",
      "active",
    ],
  ],
  Offers: [
    [
      "premium-package",
      "subscription",
      "/nl/abonnementen",
      "/en/subscriptions",
      "/he/subscriptions",
      "Premium pakket",
      "Premium package",
      "חבילת פרימיום",
      "Voor lopers die maximale begeleiding willen.",
      "For runners who want maximum guidance.",
      "לרצים שרוצים ליווי מקסימלי.",
      "Minimaal 6 maanden, maandelijks schema, online gesprek en loopanalyse.",
      "Minimum 6 months, monthly plan, online call and running analysis.",
      "לפחות 6 חודשים, תכנית חודשית, שיחת אונליין וניתוח ריצה.",
      "99",
      "EUR",
      "monthly",
      "6",
      true,
      "Start je schema",
      "Start your plan",
      "התחל את התכנית שלך",
      true,
    ],
    [
      "base-package",
      "subscription",
      "/nl/abonnementen",
      "/en/subscriptions",
      "/he/subscriptions",
      "Basispakket",
      "Base package",
      "חבילת בסיס",
      "Voor lopers die zelfstandig willen trainen met ondersteuning.",
      "For runners who want to train independently with support.",
      "לרצים שרוצים להתאמן עצמאית עם תמיכה.",
      "Minimaal 3 maanden, maandelijks schema en eenmalig gesprek.",
      "Minimum 3 months, monthly plan and one call.",
      "לפחות 3 חודשים, תכנית חודשית ושיחה אחת.",
      "69",
      "EUR",
      "monthly",
      "3",
      false,
      "Kies basis",
      "Choose base",
      "בחר בסיס",
      true,
    ],
    [
      "clinic-ticket",
      "clinic",
      "/nl/clinics",
      "/en/clinics",
      "/he/clinics",
      "Clinic ticket",
      "Clinic ticket",
      "כרטיס לקליניקה",
      "Maandelijkse clinic met theorie, praktijk en lunch.",
      "Monthly clinic with theory, practice and lunch.",
      "קליניקה חודשית עם תיאוריה, פרקטיקה וארוחה.",
      "10:00 tot 16:00, met persoonlijke tips en begeleiding.",
      "10:00 to 16:00, with personal tips and guidance.",
      "10:00 עד 16:00, עם טיפים וליווי אישי.",
      "125",
      "EUR",
      "one_time",
      "0",
      false,
      "Reserveer plek",
      "Reserve a spot",
      "שריינו מקום",
      true,
    ],
  ],
  ShopProducts: [
    [
      "runningbook-pdf",
      "runningbook-pdf",
      "runningbook-pdf",
      "runningbook-pdf",
      "TopFit Runningbook PDF",
      "TopFit Runningbook PDF",
      "TopFit Runningbook PDF",
      "PDF met trainingsleer, opbouw, blessurepreventie, techniek en herstel.",
      "PDF covering training principles, progression, injury prevention, technique and recovery.",
      "PDF עם עקרונות אימון, בנייה, מניעת פציעות, טכניקה והתאוששות.",
      "0",
      "EUR",
      "runningbook-pdf",
      "digital",
      "core",
      "logo-topfit",
      "available",
      "download/runningbook.pdf",
      true,
    ],
    [
      "intake-call",
      "intake-call",
      "intake-call",
      "intake-call",
      "Persoonlijke intake",
      "Personal intake",
      "שיחת פתיחה אישית",
      "Kennismakingsgesprek en startanalyse voor het juiste traject.",
      "Intro call and initial assessment for the right journey.",
      "שיחת היכרות והערכה ראשונית למסלול הנכון.",
      "Op aanvraag",
      "EUR",
      "intake-call",
      "service",
      "services",
      "willem-portrait",
      "available",
      "",
      true,
    ],
    [
      "clinic-ticket",
      "clinic-ticket",
      "clinic-ticket",
      "clinic-ticket",
      "Clinic ticket",
      "Clinic ticket",
      "כרטיס לקליניקה",
      "Toegang tot de maandelijkse clinic dag.",
      "Access to the monthly clinic day.",
      "כניסה ליום הקליניקה החודשי.",
      "125",
      "EUR",
      "clinic-ticket",
      "ticket",
      "events",
      "willem-clinic",
      "available",
      "",
      true,
    ],
    [
      "sportrepen-pack",
      "sportrepen-pack",
      "sportrepen-pack",
      "sportrepen-pack",
      "Sportrepen pack",
      "Energy bars pack",
      "חבילת חטיפי ספורט",
      "Fysieke energie-snacks voor training en wedstrijd.",
      "Physical energy snacks for training and racing.",
      "חטיפי אנרגיה פיזיים לאימון ותחרות.",
      "14.95",
      "EUR",
      "sport-bars-pack",
      "physical",
      "nutrition",
      "sport-bars-pack",
      "in_stock",
      "",
      true,
    ],
    [
      "recovery-shake",
      "recovery-shake",
      "recovery-shake",
      "recovery-shake",
      "Recovery shake",
      "Recovery shake",
      "שייק התאוששות",
      "Herstelproduct voor na intensieve trainingen.",
      "Recovery product for after intense sessions.",
      "מוצר התאוששות לאחר אימונים אינטנסיביים.",
      "19.95",
      "EUR",
      "recovery-shake",
      "physical",
      "nutrition",
      "recovery-shake",
      "in_stock",
      "",
      true,
    ],
  ],
  BlogCategories: [
    ["training", "Training", "Training", "אימון", 1, true],
    ["technique", "Techniek", "Technique", "טכניקה", 2, true],
    ["recovery", "Herstel", "Recovery", "התאוששות", 3, true],
    ["nutrition", "Voeding", "Nutrition", "תזונה", 4, true],
    ["clinics", "Clinics", "Clinics", "קליניקות", 5, true],
  ],
  FAQ: [
    ["runningbook", "Is het Runningbook inbegrepen?", "Is the Runningbook included?", "האם ה-Runningbook כלול?", "Ja, voor abonnees zit het Runningbook PDF standaard inbegrepen.", "Yes, subscribers get the Runningbook PDF by default.", "כן, מנויים מקבלים את ה-Runningbook PDF כברירת מחדל.", "subscriptions", 1, true],
    ["expand", "Kan het aanbod later uitbreiden?", "Can the offer expand later?", "האם אפשר להרחיב את ההיצע בהמשך?", "Ja, het model is modulair en kan later met camps en extra upsells uitbreiden.", "Yes, the model is modular and can later expand with camps and extra upsells.", "כן, המודל מודולרי ויכול להתרחב בהמשך עם קאמפים ואפסיילים נוספים.", "strategy", 2, true],
    ["shop", "Komt er een webshop naast de abonnementen?", "Will there be a shop next to subscriptions?", "האם תתווסף חנות לצד המנויים?", "Ja, de shop krijgt losse producten en fysieke items naast de diensten.", "Yes, the shop gets separate products and physical items alongside services.", "כן, לחנות יהיו מוצרים נפרדים ופריטים פיזיים לצד השירותים.", "shop", 3, true],
    ["languages", "Ondersteunt de site meerdere talen?", "Will the site support multiple languages?", "האם האתר יתמוך בכמה שפות?", "Ja, Nederlands, Engels en Hebreeuws delen dezelfde structuur.", "Yes, Dutch, English and Hebrew share the same structure.", "כן, הולנדית, אנגלית ועברית חולקות את אותה מבנה.", "general", 4, true],
  ],
};

function base64url(input, skipEncode = false) {
  const str = skipEncode ? input : Buffer.from(input).toString("base64");
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGoogleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const unsigned = `${header}.${claimSet}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(serviceAccount.private_key, "base64");
  const jwt = `${unsigned}.${base64url(signature, true)}`;

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
  return data.access_token;
}

async function requestJson(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!res.ok) {
    throw new Error(`Google Sheets API request failed (${res.status}): ${typeof parsed === "string" ? parsed : JSON.stringify(parsed)}`);
  }
  return parsed;
}

async function clearRange(token, range) {
  await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:clear`,
    token,
    { method: "POST", body: JSON.stringify({}) },
  );
}

async function info(token) {
  const data = await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=spreadsheetId,properties.title,sheets.properties.title`,
    token,
  );
  console.log(JSON.stringify(data, null, 2));
}

async function readRange(token, range) {
  if (!range) throw new Error("--range is required for read");
  const data = await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`,
    token,
  );
  console.log(JSON.stringify(data, null, 2));
}

async function writeRange(token, range, values) {
  if (!range) throw new Error("--range is required for write");
  if (!Array.isArray(values)) throw new Error("--values must be a JSON array of rows");

  const data = await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({ values }),
    },
  );
  console.log(JSON.stringify(data, null, 2));
}

async function appendRows(token, tab, values) {
  if (!tab) throw new Error("--tab is required for append");
  if (!Array.isArray(values)) throw new Error("--values must be a JSON array of rows");

  const range = `${tab}!A:Z`;
  const data = await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ values }),
    },
  );
  console.log(JSON.stringify(data, null, 2));
}

async function bootstrapTopfit(token) {
  const sheetMeta = await requestJson(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties.title,sheets.properties.sheetId`,
    token,
  );
  const existingTabs = new Set((sheetMeta.sheets || []).map((sheet) => sheet.properties?.title));
  const requests = [];
  for (const tab of Object.keys(TOPFIT_TABS)) {
    if (!existingTabs.has(tab)) {
      requests.push({ addSheet: { properties: { title: tab } } });
    }
  }

  if (requests.length > 0) {
    await requestJson(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
      token,
      {
        method: "POST",
        body: JSON.stringify({ requests }),
      },
    );
  }

  for (const [tab, headers] of Object.entries(TOPFIT_TABS)) {
    await requestJson(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${tab}!A1`)}?valueInputOption=USER_ENTERED`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ values: [headers] }),
      },
    );
  }

  console.log(`Bootstrapped ${Object.keys(TOPFIT_TABS).length} tabs and header rows.`);
}

async function seedTopfit(token) {
  await bootstrapTopfit(token);

  for (const [tab, rows] of Object.entries(TOPFIT_SEED_ROWS)) {
    await clearRange(token, `${tab}!A2:Z1000`);
    await requestJson(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${tab}!A2`)}?valueInputOption=USER_ENTERED`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ values: rows }),
      },
    );
  }

  console.log(`Seeded ${Object.keys(TOPFIT_SEED_ROWS).length} TopFit tabs with initial rows.`);
}

async function main() {
  const token = await getGoogleAccessToken();

  switch (command) {
    case "info":
      await info(token);
      break;
    case "read":
      await readRange(token, RANGE);
      break;
    case "write":
      await writeRange(token, RANGE, JSON.parse(VALUES_RAW));
      break;
    case "append":
      await appendRows(token, TAB, JSON.parse(VALUES_RAW));
      break;
    case "bootstrap-topfit":
      await bootstrapTopfit(token);
      break;
    case "seed-topfit":
      await seedTopfit(token);
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
