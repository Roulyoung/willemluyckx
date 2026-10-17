> Update 2026-09-13: de nieuwe propositie vervangt Basis/Premium. Lees eerst [PROPOSITION_UPDATE_2026-09-13.md](PROPOSITION_UPDATE_2026-09-13.md). Websitewijzigingen zijn lokaal; de lege nieuwsbrief-tab is voorbereid. Oudere betaalinstructies hieronder zijn historische context.

# Session Close - TopFit Running / Willemluyckx

Date: 2026-08-28

## Mandatory Session-Close Rollback Rule

Every session close must leave an exact, named rollback point before the session is considered closed.

- For code changes, create a focused checkpoint commit or an exact patch plus status file.
- Never include unrelated dirty files such as `CON` or `TopFit Running Boek.pdf` in that checkpoint.
- Record the checkpoint commit/patch, changed files, deployment to restore, and any external Google Sheets changes.
- For Google Sheets changes, record the exact tab and row/range and the safe reversal action.
- Confirm `npm run build` and `git diff --check` before closing when code was changed.
- Do not store secrets in the checkpoint, patch, status file or session document.

## Session Update - 2026-10-18 - Stripe live and Sheets-driven checkout

### Final outcome

- Stripe Live mode is active and was verified with a real successful test payment.
- The successful payment was made through a Stripe Live Payment Link for the €1 test product. It was a real payment, not a test-mode payment.
- Do not store or write any Stripe secret values in this document, chat, source code or git.

### Secure Stripe configuration

- Wrangler OAuth login was completed using the device flow and Windows keyring:
  - `npx wrangler login --device --use-keyring`
- Cloudflare Pages project: `willemluyckx`
- Runtime secrets configured through Wrangler Pages secrets:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PUBLISHABLE_KEY`
- The public config function now prefers `STRIPE_PUBLISHABLE_KEY` over the older `VITE_STRIPE_PUBLISHABLE_KEY`, preventing the old `pk_test_...` value from overriding the Live key.
- The live webhook endpoint is:
  - `https://topfitrunning.com/api/stripe-webhook`
- Webhook events selected in Stripe:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.expired` and `checkout.session.async_payment_failed` may also be selected; the current handler safely ignores them.

### Google Sheets product catalog

- `ShopProducts` now contains the €1 test product in row 7:
  - `product_id`: `stripe-test-1-eur`
  - `price`: `1`
  - `currency`: `EUR`
  - `active`: `TRUE`
- `ShopProducts` now contains the real personal-plan product in row 8:
  - `product_id`: `schema`
  - slug: `schema`
  - name: `Persoonlijk hardloopschema (12 weken)`
  - `price`: `19`
  - `currency`: `EUR`
  - `active`: `TRUE`
- The €19 product does not need a manually maintained Stripe Product or Price in the dashboard.
- `functions/lib/shopProducts.ts` reads active product data server-side from `ShopProducts` using the existing Google service-account runtime secret.
- `functions/api/stripe-checkout.ts` uses the Sheets value to create Stripe `price_data` dynamically. The browser cannot provide or override the amount.
- The existing `STRIPE_PRICE_TEST` value in `wrangler.toml` remains only as a fallback; active matching `ShopProducts` rows take precedence. `STRIPE_PRICE_SCHEMA` is no longer required for the €19 product.

### Hidden Stripe test page

- Route:
  - `https://topfitrunning.com/nl/stripe-test-1-eur`
- It is not linked from navigation or public content.
- It sets `noindex,nofollow,noarchive` dynamically.
- It uses the `stripe-test-1-eur` ShopProducts row and the same embedded Checkout flow.
- It is intended only for controlled payment checks and must not be exposed through menus or CTAs.

### Checkout compatibility findings

- The deployed account/API environment rejected `automatic_payment_methods`; the live endpoint returned `Received unknown parameter: automatic_payment_methods`.
- The final implementation therefore explicitly sends:
  - `payment_method_types[0]=card`
  - `payment_method_types[1]=ideal`
- The live API environment requires `ui_mode=embedded_page` for the existing embedded Checkout integration. Keep this value unless the Stripe API version is deliberately upgraded and tested.
- Embedded Checkout uses `redirect_on_completion=if_required` and a `return_url` so redirect-based methods such as iDEAL can work.
- A live Checkout Session was successfully created from the production endpoint using `slug=schema`; the response was `ok=true`, `productSlug=schema`, and contained a live client secret. No payment was made during that diagnostic request.

### Latest deployment and verification

- Latest deployment after the Sheets-driven checkout change:
  - `https://8c56f984.willemluyckx.pages.dev`
- `npm run build` passed after the final checkout changes.
- The production publishable-key endpoint was previously verified to return a `pk_live_...` key without exposing the full value.
- The final live Checkout Session creation was verified against:
  - `https://topfitrunning.com/api/stripe-checkout`
  - payload slug: `schema`
  - amount source: `ShopProducts` row 8

### Next session: safest remaining smoke test

1. Open the real €19 checkout page:
   - `https://topfitrunning.com/nl/aanbod/schema/afrekenen`
2. Start a fresh checkout session.
3. Confirm the Stripe panel shows €19,00 and the enabled payment methods.
4. Complete one controlled real payment only if needed.
5. Confirm the Stripe webhook, internal email, customer email and intake flow.
6. Refund the payment immediately if it was only a test.

### Files changed in this Stripe/Sheets session

- `functions/api/stripe-checkout.ts`
- `functions/api/stripe-webhook.ts`
- `functions/api/stripe-public-config.ts`
- `functions/lib/shopProducts.ts`
- `src/pages/StripeTestPage.tsx`
- `src/pages/LocalePageView.tsx`
- `src/pages/LocalePage.tsx`
- `index.html`
- `wrangler.toml`

### Working-tree reminder

- Existing unrelated untracked files remain:
  - `CON`
  - `TopFit Running Boek.pdf`
- Do not modify the sibling `rolexbugatti` project.

### Rollback checkpoint for this session

- This session's focused checkpoint commit: `a592edb` (`Checkpoint live Stripe Sheets checkout`).
- The checkpoint includes only the Stripe/Sheets implementation and session documentation.
- It intentionally excludes the unrelated untracked files `CON` and `TopFit Running Boek.pdf`.
- Code rollback target: revert the focused checkpoint commit, or restore its parent commit and keep the external Sheet rows under review.
- External Sheet rollback rows created in this session:
  - `ShopProducts!A7:S7`: `stripe-test-1-eur`
  - `ShopProducts!A8:S8`: `schema`
- To remove only the new catalog rows, clear rows 7 and 8 after confirming no later data was added below them. Prefer a targeted row-level edit over resetting the entire tab.

## Session Update - 2026-10-15 - Hardloopkalenderimport

- Added the supplied running-race list to the `Hardloopwedstrijden` Google Sheets tab.
- Parsed 217 supplied race blocks and added 215 unique rows.
- Skipped the two embedded advertisement blocks beginning with `Vandaag!`.
- Merged the two `LPR - Last Pirate Running` rows into one event with both distance sets.
- Removed the exact duplicate `RDG Night trail 2027` row.
- Stored every new row in the existing 27-column multilingual format with `active=true`.
- Verified the result in Sheets:
  - new rows: `A14:AA228`
  - first event: `Amsterdam Marathon SHAKE-OUT`, `15/10/2026`
  - last event: `Jasperloop`, `28/11/2027`
  - all new rows have 27 columns
  - no advertisement text was imported
  - no duplicate RDG row remains
- The source list did not contain event detail URLs, so `website_url`, `registration_url` and `contact_url` remain empty.
- The source values were preserved as supplied, including entries that may need later editorial checking such as `200 km` and `Maasloop 2025` dated in 2026.

### Code checkpoint and rollback

- Commit containing the import tooling fix: `003fd41` (`Support full-width Google Sheets imports`).
- The admin importer now supports `--values-file` and appends through column `AA`, matching the sheet schema.
- Local rollback of the code change: revert commit `003fd41` or restore the preceding commit `666e8ad`.
- The Google Sheets change is external to Git. To undo only this import before adding later rows, remove rows `14:228` from the `Hardloopwedstrijden` tab. Keep rows `1:13` intact; those were the pre-existing rows.
- No repository files containing credentials or the temporary import JSON were committed.

## Rollback Snapshots - 2026-08-24

- On Monday, August 24, 2026, two local rollback snapshots were captured around the about-page publish.
- Base commit at snapshot time: `ec5dd31`.
- Pre-about snapshot:
  - `rollback-status-2026-08-24-before-about.txt`
  - `rollback-2026-08-24-before-about.patch`
- Current post-deploy snapshot:
  - `rollback-status-2026-08-24-after-about-deploy.txt`
  - `rollback-2026-08-24-after-about-deploy.patch`
- To return to the exact current post-deploy working state later:
  - start from commit `ec5dd31` in a clean checkout or temporary branch
  - apply `rollback-2026-08-24-after-about-deploy.patch`
- The repo already contained broader uncommitted work, so the patch files are the reliable rollback reference for this session.

## Rollback Snapshots - 2026-08-26

- On Wednesday, August 26, 2026, two more rollback snapshots were captured around the payment/email live work.
- Pre-payments-live snapshot:
  - `rollback-status-2026-08-26-before-payments-live.txt`
  - `rollback-2026-08-26-before-payments-live.patch`
- Current post-deploy snapshot:
  - `rollback-status-2026-08-26-after-brevo-live.txt`
  - `rollback-2026-08-26-after-brevo-live.patch`
- These snapshots sit on top of the earlier August 24 baseline and are the fastest local restore points for the current live mail state.

## What Was Done

### Payments and emails
- Added dedicated docs for the Stripe and Brevo implementation and live runbook.
- Added a shared Brevo helper in `functions/lib/brevo.ts`.
- Wired the contact route to send internal and customer emails through Brevo.
- Updated the Stripe webhook so it can send internal and customer payment emails once Stripe secrets and price IDs are present.
- Fixed Stripe success redirects to the real `/intake?locale=...&flow=checkout&product=...` route.
- Updated the intake page to honor the `locale` query parameter.
- Removed the fake local coupon field in favor of Stripe-hosted promo code entry.
- Confirmed live that `POST https://topfitrunning.com/api/contact` returns `200` and sends mail through Brevo.
- Confirmed that Stripe is still blocked in production until the missing Stripe runtime config is added.
- On Friday, August 28, 2026, completed the interrupted checkout conversion pass from `Sessie 27082026.txt`.
- Removed the extra pre-checkout form from the inline package checkout so visitors no longer need to fill local name/email/phone fields before payment.
- Kept the Stripe payment step embedded on the TopFit product page so the checkout stays visually inside the site experience.
- Enabled Stripe phone collection directly in checkout via `functions/api/stripe-checkout.ts`.
- Updated the Stripe webhook to read `customer_details.phone` first, with metadata fallback for older sessions.
- Kept the post-payment behavior where users first see confirmation on the same product page and then continue to intake when ready.

### About page
- Expanded `/nl/over-willem` and `/en/about-willem` with Willem Luijckx profile content.
- Added sport & coaching, trainer education, authorship/teaching, expertise and vision sections.
- Aligned route snippet copy and page titles with the fuller Willem profile.

### Training pages
- Added the 10-week training schedule table to the training schemas page.
- Translated the abbreviations into visitor-friendly Dutch/English labels.
- Wrapped the table in a horizontal scroll container for mobile.
- Styled the first column, header row, and total row for clarity.
- Kept the title/intro visible for SEO and user context.

### Route and locale cleanup
- Fixed route alias handling for `/nl/trainingkamp` and related paths.
- Added route mapping helpers so locale-aware links are more stable.
- Cleaned up hardcoded locale links in content and CTA paths where needed.
- Added route smoke test docs and locale test docs for later reuse.

### Blog content
- Added and refined a Mukti Running blog post.
- Tightened the title and headings for reader value and SEO.
- Kept the framing focused on the reader, not on internal brand or author logic.

### Review flow
- Built a full review wizard for client feedback.
- Added token-based review links.
- Added server-side save/load and local draft fallback.
- Restored multi-version rounds so `V1`, `V2`, `V3`, etc. can be created again from the admin.
- Added summary screen with:
  - open items
  - copyable Codex prompt
  - approve version action
- Added an admin overview page for review tokens and rounds.
- Added admin key protection path.
- Normalized review sheet storage into:
  - `ReviewRounds`
  - `ReviewItems`
  - `ReviewApprovals`
- Cleaned old test rounds `V2` through `V6` out of the live Google Sheet so only the real `V1` baseline remains.
- Added `scripts/cleanup-review-v1.mjs` to clear test versions from the three review tabs when needed.
- Added review templates and build docs so the flow can be reused on other projects.

### Review UX improvements
- Added page and section previews.
- Changed preview behavior so it no longer auto-jumps all over the place on load.
- Made the active preview clearer and more desktop-like.
- Restored section-level preview windows inside each section card.
- Kept one larger active preview area for context.
- Added anchors on relevant sections so previews land on the right part of the page.
- Fixed live hash links so direct URLs like `/nl#services` scroll correctly to the matching section.

### Client handoff
- Wrote a WhatsApp message template for the client.
- Wrote a full client implementation guide.
- Wrote reusable review message templates and handoff docs.

### Template propagation
- Added the review-flow lessons and implementation pattern to the template root.
- Updated `TEMPLATE_START.md` so future projects inherit the review-flow setup.
- Added `REVIEW_FLOW_TEMPLATE.md` in the template root for reuse across new projects.

### Site content and layout updates
- Reworked large parts of the homepage copy and CTA flow.
- Removed visible phone-number exposure and direct call links from the site.
- Restored and refined the over-Willem media section, including the PDF and video embeds.
- Added and styled multiple real blog articles with image-based hero templates.
- Added matching image-card styling to the blog index and homepage blog teaser.
- Hid `Trainingskampen` from the live menu and route flow while keeping the code available for later reuse.
- Reduced the repeated standalone TopFit logo section so it takes less vertical space before CTA blocks.

## Current Working Flow

### For the client
- Client opens the review link:
  - `https://topfitrunning.com/review/<token>`
- Client reviews the source language only.
- Client clicks through pages and sections.
- Client marks items as:
  - approved
  - needs changes
  - not applicable
- Client can stop and return later using the same link.
- Client finishes in the summary and approves the round.

### For me
- Use `/review-admin` to manage rounds and tokens.
- Generate a token and share the review link.
- Read the summary or Codex prompt after the client reviews.
- Create a new round when changes are made.
- If test rounds pollute the sheet later, use `scripts/cleanup-review-v1.mjs` to keep only `V1`.

## Important Files Added or Updated

- `src/pages/LocalePage.tsx`
- `src/pages/ReviewWizardPage.tsx`
- `src/pages/ReviewAdminPage.tsx`
- `src/lib/reviewFlow.ts`
- `src/lib/localeRoutes.ts`
- `src/pages/localeSections.tsx`
- `functions/api/review.ts`
- `scripts/cleanup-review-v1.mjs`
- `REVIEW_CLIENT_IMPLEMENTATION_GUIDE.md`
- `REVIEW_FLOW_BUILD_PLAN.md`
- `REVIEW_SHEETS_TEMPLATE.md`
- `ROUTE_LOCALE_TEST_PLAN.md`
- `ROUTE_SMOKE_TESTS.md`
- `CLIENT_REVIEW_MESSAGE.md`
- `CLIENT_REVIEW_MESSAGE_TEMPLATE.md`
- `SESSION_COMMANDS.md`

## Live Deploy Status

Latest successful deploy at the end of the session:
- `https://ee7fc40c.willemluyckx.pages.dev`

## Notes / Remaining Considerations

- `Trainingskampen` is intentionally hidden from the live menu and route flow for now.
- The underlying page/component is kept in code for later reuse.
- When it needs to return, restore the menu/nav entries and remove the redirect from `src/pages/LocalePageView.tsx`.
- The public site was verified on the current production bundle after the last deploy:
  - `assets/index-CcBMh3TT.js`
- On Friday, August 28, 2026, both the preview deploy and production returned `200` for:
  - `https://topfitrunning.com/nl/abonnementen/premium`
  - `https://topfitrunning.com/en/subscriptions/premium`
- The deployed JS bundle was checked directly and contains the new inline-checkout copy, confirming the redesigned flow is live.
- The review flow is intentionally centered on one source language to avoid chaos.
- If multi-language review is ever needed, it should be a separate flow, not mixed into the main customer wizard.
- The preview system is functional again and section previews are visible inside each section card.
- Hash anchors on the public site now scroll properly to the correct section.
- The review template and handoff pattern are now also available in the template folder for future projects.
- Important open issue:
  - review autosave still appends rows in Google Sheets for the same `token + version`
  - it does not overwrite or upsert the existing rows for that version
  - so `ReviewRounds` and `ReviewItems` can grow duplicate entries for one version during normal use
  - the UI is usable and versioning works, but the sheet storage is not normalized yet
- Current chosen tradeoff:
  - keep version functionality working
  - accept duplicate rows in Sheets for now
  - clean test versions manually when needed

## Customer Message Ready

Use this WhatsApp text:

```text
Hi [naam],

Ik heb de review-versie klaarstaan. Je kunt per pagina feedback geven via deze link:

https://topfitrunning.com/review/<token>

Werkwijze:
- open de link op je computer
- klik door de pagina’s
- geef per onderdeel aan wat goed is en wat aangepast moet worden
- je kunt tussendoor stoppen en later verdergaan met dezelfde link
- helemaal op het einde kun je de versie goedkeuren

Als je ergens op vastloopt, stuur me even een bericht.
```
