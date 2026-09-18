> Update 2026-09-13: de nieuwe propositie vervangt Basis/Premium. Lees eerst [PROPOSITION_UPDATE_2026-09-13.md](PROPOSITION_UPDATE_2026-09-13.md). Websitewijzigingen zijn lokaal; de lege nieuwsbrief-tab is voorbereid. Oudere betaalinstructies hieronder zijn historische context.

# Session Close - TopFit Running / Willemluyckx

Date: 2026-08-28

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
