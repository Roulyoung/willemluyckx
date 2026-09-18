import assert from "node:assert/strict";
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateKeyPairSync } from "node:crypto";

// Contract checks: never contact Google, Stripe, Brevo or a real subscriber.
const dir = await mkdtemp(path.join(tmpdir(), "topfit-proposition-check-"));
const originalFetch = globalThis.fetch;
let passed = 0;
try {
  await build({ entryPoints: ["functions/api/newsletter.ts", "functions/api/stripe-checkout.ts", "src/lib/topfitRemote.ts", "src/lib/topfitContent.ts", "src/lib/localeRoutes.ts"], bundle: true, platform: "node", format: "cjs", outdir: dir, outbase: ".", logLevel: "silent" });
  const require = createRequire(import.meta.url);
  const { onRequestPost: signup } = require(path.join(dir, "functions/api/newsletter.js"));
  const { onRequestPost: checkout } = require(path.join(dir, "functions/api/stripe-checkout.js"));
  const { getLocaleContent } = require(path.join(dir, "src/lib/topfitContent.js"));
  const { loadTopfitContent } = require(path.join(dir, "src/lib/topfitRemote.js"));
  const { getLocalizedPath } = require(path.join(dir, "src/lib/localeRoutes.js"));
  const request = payload => new Request("https://topfitrunning.com/api/newsletter", { method: "POST", body: typeof payload === "string" ? payload : JSON.stringify(payload) });
  const payload = { email: "Runner@Example.com", locale: "nl", consent: true, consentVersion: "2026-09-13" };
  globalThis.fetch = async () => { throw new Error("Unexpected external call"); };
  for (const bad of [{ ...payload, consent: false }, { ...payload, consent: "true" }, { ...payload, consentVersion: "old" }, { ...payload, email: "invalid" }, "{", "null"]) {
    assert.equal((await signup({ request: request(bad), env: {} })).status, 400);
  }
  passed++;
  assert.equal((await signup({ request: request(payload), env: {} })).status, 503);
  for (const slug of ["premium", "base", "basis", "clinic-ticket"]) {
    assert.equal((await checkout({ request: request({ slug }), env: {} })).status, 410);
  }
  passed++;

  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const env = { GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "test@example.invalid", private_key: privateKey.export({ format: "pem", type: "pkcs8" }) }) };
  for (const existing of [true, false]) {
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push([String(url), init]);
      if (String(url).includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-token" });
      if (String(url).includes("?fields=")) return Response.json({ sheets: existing ? [{ properties: { title: "Newsletter" } }] : [] });
      return Response.json({});
    };
    assert.equal((await signup({ request: request(payload), env })).status, 200);
    const writes = calls.filter(([url]) => url.includes(":append"));
    assert.equal(writes.length, 1);
    assert.match(writes[0][0], /Newsletter!A%3AG.*valueInputOption=RAW/);
    const row = JSON.parse(writes[0][1].body).values[0];
    assert.equal(row[1], "runner@example.com");
    assert.equal(row[3], "2026-09-13");
    assert.match(row[4], /Ja, ik ontvang graag/);
    assert.equal(row[6], "subscribed");
    const creations = calls.filter(([url]) => url.endsWith(":batchUpdate"));
    assert.equal(creations.length, existing ? 0 : 1);
    if (!existing) {
      const requests = JSON.parse(creations[0][1].body).requests;
      assert.deepEqual(Object.keys(requests[0].addSheet), ["properties"]);
      assert.equal(requests[0].addSheet.properties.sheetId, requests[1].updateCells.start.sheetId);
      assert.equal(requests[1].updateCells.rows[0].values[0].userEnteredValue.stringValue, "created_at");
    }
    passed++;
  }
  globalThis.fetch = async url => String(url).includes("oauth2.googleapis.com") ? Response.json({ access_token: "test" }) : new Response("private upstream details", { status: 500 });
  const failed = await signup({ request: request(payload), env });
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).error, "Newsletter temporarily unavailable");
  passed++;

  const race = { title: "Sheet race", date: "2026-10-01", distance: "10 km", location: "Test" };
  globalThis.fetch = async () => Response.json({ ok: true, content: { offers: [{ slug: "premium", price: "€99" }], hero: { title: "Old proposition" }, hardloopwedstrijden: [race] } });
  for (const locale of ["nl", "en", "he"]) {
    const content = await loadTopfitContent(locale, getLocaleContent(locale));
    assert.deepEqual(content.offers.map(offer => offer.slug), ["schema", "zoom", "fysiek", "clinic", "lezing"]);
    assert.match(content.offers[0].price, /€19/);
    assert.notEqual(content.hero.title, "Old proposition");
    assert.deepEqual(content.hardloopwedstrijden, [race]);
  }
  passed++;
  assert.equal(getLocalizedPath("/nl/aanbod/zoom", "en", getLocaleContent("nl")), "/en/offers/zoom");
  assert.equal(getLocalizedPath("/en/offers/lezing", "nl", getLocaleContent("en")), "/nl/aanbod/lezing");
  assert.equal(getLocalizedPath("/en/physical-coaching", "nl", getLocaleContent("en")), "/nl/fysieke-coaching");
  passed++;
  console.log(`${passed} proposition contract checks passed; no external requests made.`);
} finally {
  globalThis.fetch = originalFetch;
  assert.equal(path.dirname(path.resolve(dir)), path.resolve(tmpdir()));
  assert.ok(path.basename(dir).startsWith("topfit-proposition-check-"));
  await rm(dir, { recursive: true, force: true });
}
