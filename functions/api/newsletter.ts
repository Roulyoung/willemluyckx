import { getAccessToken, parseServiceAccount } from "../lib/googleSheets";
import { newsletterConsentText, newsletterConsentVersion } from "../../src/lib/newsletterConsent";

const sheetId = "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";
const headers = ["created_at", "email", "locale", "consent_version", "consent_text", "source", "status"];
const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 4096) return reply({ ok: false, error: "Request too large" }, 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply({ ok: false }, 400);
    payload = parsed as Record<string, unknown>;
  } catch { return reply({ ok: false, error: "Invalid request" }, 400); }
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const locale = payload.locale === "nl" ? "nl" : payload.locale === "he" ? "he" : "en";
  if (payload.website) return reply({ ok: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || payload.consent !== true || payload.consentVersion !== newsletterConsentVersion) {
    return reply({ ok: false, error: "Valid email and explicit newsletter consent required" }, 400);
  }
  const serviceAccount = parseServiceAccount(env as Record<string, unknown>);
  if (!serviceAccount?.client_email || !serviceAccount.private_key) return reply({ ok: false, error: "Newsletter temporarily unavailable" }, 503);
  try {
    const token = await getAccessToken(serviceAccount);
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
    const sheetsRequest = async (path: string, init?: RequestInit) => {
      const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Newsletter storage unavailable");
      return response.json();
    };
    const meta = await sheetsRequest("?fields=sheets.properties.title");
    const exists = (data: { sheets?: { properties?: { title?: string } }[] }) => data.sheets?.some(sheet => sheet.properties?.title === "Newsletter");
    if (!exists(meta)) {
      try {
        // Create only the new tab, including its headers atomically. Existing
        // content, calendar, intake and review tabs are never changed here.
        const tabId = crypto.getRandomValues(new Uint32Array(1))[0] & 0x7fffffff;
        await sheetsRequest(":batchUpdate", {
          method: "POST",
          body: JSON.stringify({ requests: [
            { addSheet: { properties: { title: "Newsletter", sheetId: tabId, gridProperties: { frozenRowCount: 1 } } } },
            { updateCells: { start: { sheetId: tabId, rowIndex: 0, columnIndex: 0 }, rows: [{ values: headers.map(stringValue => ({ userEnteredValue: { stringValue } })) }], fields: "userEnteredValue" } },
          ] }),
        });
      } catch {
        // Another signup may have created the tab concurrently.
        if (!exists(await sheetsRequest("?fields=sheets.properties.title"))) throw new Error("Newsletter storage unavailable");
      }
    }
    await sheetsRequest(`/values/${encodeURIComponent("Newsletter!A:G")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ values: [[new Date().toISOString(), email, locale, newsletterConsentVersion, newsletterConsentText(locale), "website-newsletter", "subscribed"]] }),
    });
    return reply({ ok: true });
  } catch { return reply({ ok: false, error: "Newsletter temporarily unavailable" }, 503); }
};
