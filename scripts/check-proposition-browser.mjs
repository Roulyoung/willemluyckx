import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(path.join(process.env.TEMP, "topfit-browser-tools/package.json"));
const { chromium } = require("playwright");
const baseUrl = process.env.TOPFIT_PREVIEW_URL || "http://127.0.0.1:5173";
const artifacts = path.join(process.env.TEMP, "topfit-proposition-review");
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  // Read the real calendar once. Further navigation uses this response to avoid
  // repeatedly querying Google; no contact/intake/newsletter data is sent.
  const response = await page.request.get(`${baseUrl}/api/topfit?locale=nl`);
  assert.equal(response.status(), 200, "Local Google Sheets content endpoint");
  const sheetContent = await response.json();
  assert.equal(sheetContent.ok, true);
  const raceCount = sheetContent.content.hardloopwedstrijden.length;
  await page.route("**/api/topfit?*", route => route.fulfill({ json: sheetContent }));
  const paths = [
    ["/nl", "Gezond, efficiënt en met plezier hardlopen"],
    ["/nl/aanbod", "Een betaalbare start."],
    ["/nl/aanbod/schema", "12 weken TopFit Running"],
    ["/nl/aanbod/zoom", "Persoonlijke Zoom Check"],
    ["/nl/aanbod/fysiek", "Persoonlijke fysieke training"],
    ["/nl/aanbod/clinic", "TopFit Running Clinic"],
    ["/nl/aanbod/lezing", "Lezingen"],
    ["/nl/abonnementen/premium", "12 weken TopFit Running"],
    ["/nl/abonnementen/basis", "12 weken TopFit Running"],
    ["/nl/abonnementen/clinic-ticket", "TopFit Running Clinic"],
    ["/nl/clinics", "TopFit Running Clinic"],
    ["/nl/online-coaching", "Persoonlijke Zoom Check"],
    ["/nl/fysieke-coaching", "Persoonlijke fysieke training"],
    ["/en/offers/schema", "12 weeks of TopFit Running"],
    ["/en/subscriptions/premium", "12 weeks of TopFit Running"],
    ["/he/offers/zoom", "Personal Zoom Check"],
  ];
  for (const [url, heading] of paths) {
    await page.goto(baseUrl + url);
    await page.getByRole("heading", { level: 1 }).filter({ hasText: heading }).waitFor();
    await page.waitForTimeout(150);
    const text = await page.locator("body").innerText();
    assert.doesNotMatch(text, /Premium pakket|Basispakket|€69|€99|€125|View Premium|Bekijk Premium/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Desktop overflow: ${url}`);
  }
  await page.goto(`${baseUrl}/nl/hardloopkalender`);
  await page.getByRole("heading", { level: 1, name: "Hardloopkalender" }).waitFor();
  await page.waitForTimeout(500);
  const calendarText = await page.locator("main").innerText();
  for (const race of sheetContent.content.hardloopwedstrijden) assert.ok(calendarText.toLowerCase().includes(race.title.toLowerCase()), `Missing race: ${race.title}`);
  assert.doesNotMatch(calendarText, /Premium|Bekijk Basis/);

  await page.goto(`${baseUrl}/nl/aanbod/lezing`);
  await page.getByRole("link", { name: "Informeer naar mogelijkheden" }).click();
  await page.locator("#message").waitFor();
  assert.match(await page.locator("#message").inputValue(), /Lezingen/);

  let signupPayload;
  let signupCount = 0;
  await page.route("**/api/newsletter", async route => {
    signupCount++;
    signupPayload = route.request().postDataJSON();
    await route.fulfill({ status: 503, json: { ok: false } });
  });
  const footer = page.locator("footer");
  await footer.getByLabel("E-mailadres", { exact: true }).fill("test@example.invalid");
  await footer.getByRole("button", { name: "Aanmelden voor nieuwsbrief" }).click();
  assert.equal(signupCount, 0, "Consent must be explicit");
  await footer.getByRole("checkbox").check();
  await footer.getByRole("button", { name: "Aanmelden voor nieuwsbrief" }).click();
  await footer.getByRole("alert").waitFor();
  assert.equal(signupPayload.consent, true);
  assert.equal(signupPayload.consentVersion, "2026-09-13");
  await page.unroute("**/api/newsletter");
  await page.route("**/api/newsletter", route => route.fulfill({ json: { ok: true } }));
  await footer.getByRole("button", { name: "Aanmelden voor nieuwsbrief" }).click();
  await footer.getByRole("status").filter({ hasText: "aangemeld" }).waitFor();

  let intakePayload;
  await page.route("**/api/intake", route => {
    intakePayload = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto(`${baseUrl}/intake?locale=nl&product=schema`);
  for (let step = 0; step < 14; step++) {
    const control = page.locator("input, textarea").first();
    if (await control.count()) {
      const type = await control.getAttribute("type");
      await control.fill(type === "email" ? "test@example.invalid" : step === 5 ? "2 jaar hardloopervaring" : "Testantwoord");
    }
    await page.getByRole("button", { name: step === 13 ? "Verstuur intake" : "Volgende", exact: true }).click();
  }
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "intake ontvangen" }).waitFor();
  assert.equal(intakePayload.product, "schema");
  assert.match(intakePayload.extra_notes, /2 jaar hardloopervaring/);
  assert.match(intakePayload.extra_notes, /12 weken, €19/);
  assert.doesNotMatch(await page.locator("body").innerText(), /Premium|Bekijk Basis|betaling.*ontvangen/);

  await page.goto(`${baseUrl}/nl/blog/waarom-looptechniek-loont`);
  const aside = page.getByText("Wie efficienter leert bewegen, verspilt minder energie per stap en geeft overbelasting minder kans om zich op te stapelen.");
  await aside.waitFor();
  assert.equal(await aside.evaluate(element => getComputedStyle(element).color), "rgb(255, 255, 255)");
  await page.screenshot({ path: path.join(artifacts, "technique-desktop.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  for (const url of ["/nl", "/nl/aanbod", "/nl/aanbod/schema", "/nl/aanbod/clinic", "/nl/aanbod/lezing", "/nl/contact", "/nl/hardloopkalender"]) {
    await page.goto(baseUrl + url);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Mobile overflow: ${url}`);
  }
  await page.goto(`${baseUrl}/nl`);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(artifacts, "home-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "Lezingen", exact: true }).click();
  await page.getByRole("heading", { name: "Lezingen", exact: true, level: 1 }).waitFor();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/nl/aanbod`);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(artifacts, "offers-desktop.png"), fullPage: true });
  assert.deepEqual(errors, []);
  console.log(`Browser checks passed: ${paths.length} routes, ${raceCount} Sheet races, enquiry context, consent/error/success, mobile layout and navigation, technique contrast.`);
  console.log(`Screenshots: ${artifacts}`);
} finally { await browser.close(); }
