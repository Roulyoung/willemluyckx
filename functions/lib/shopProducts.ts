type ServiceAccount = { client_email: string; private_key: string };
type ShopProduct = { product_id: string; slug_nl: string; slug_en: string; slug_he: string; name_nl: string; name_en: string; name_he: string; description_nl: string; description_en: string; description_he: string; price: string; currency: string; active: string };

const SHEET_ID = "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";

const base64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const pemToArrayBuffer = (pem: string) => {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
};

const readServiceAccount = (env: Record<string, unknown>) => {
  const raw = [env.GOOGLE_SERVICE_ACCOUNT_JSON, env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON].map(value => String(value ?? "").trim()).find(Boolean);
  if (!raw) return null;
  try { return JSON.parse(raw) as ServiceAccount; } catch { return null; }
};

const getAccessToken = async (serviceAccount: ServiceAccount) => {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: string) => base64Url(new TextEncoder().encode(value));
  const unsigned = `${encode(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${encode(JSON.stringify({ iss: serviceAccount.client_email, scope: "https://www.googleapis.com/auth/spreadsheets.readonly", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now }))}`;
  const key = await crypto.subtle.importKey("pkcs8", pemToArrayBuffer(serviceAccount.private_key), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${base64Url(new Uint8Array(signature))}` }) });
  const data = await response.json() as { access_token?: string; error?: string };
  if (!response.ok || !data.access_token) throw new Error(data.error || "Google access token failed");
  return data.access_token;
};

const parsePrice = (value: string) => {
  const normalized = String(value).trim().replace(/[^0-9,.-]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", ".");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) return null;
  return Math.round(amount * 100);
};

const isActive = (value: string) => /^(1|true|yes|y|on)$/i.test(String(value).trim());

export const getActiveShopProduct = async (env: Record<string, unknown>, slug: string, locale: string) => {
  const account = readServiceAccount(env);
  if (!account?.client_email || !account.private_key) throw new Error("Missing Google service account secret");
  const token = await getAccessToken(account);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("ShopProducts!A:Z")}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json() as { values?: string[][] };
  if (!response.ok) throw new Error("ShopProducts read failed");
  const rows = data.values ?? [];
  const headers = rows[0] ?? [];
  const products = rows.slice(1).map(row => headers.reduce<Record<string, string>>((result, header, index) => { result[header] = String(row[index] ?? ""); return result; }, {}));
  const product = products.find(row => isActive(row.active) && [row.product_id, row.slug_nl, row.slug_en, row.slug_he].some(candidate => String(candidate ?? "").trim() === slug));
  if (!product) return null;
  const amount = parsePrice(product.price);
  if (!amount) throw new Error(`Invalid ShopProducts price for ${slug}`);
  const localized = locale === "he" ? "he" : locale === "en" ? "en" : "nl";
  return {
    productId: product.product_id,
    name: product[`name_${localized}`] || product.name_nl || slug,
    description: product[`description_${localized}`] || product.description_nl || "",
    currency: (product.currency || "EUR").toLowerCase(),
    amount,
  };
};
