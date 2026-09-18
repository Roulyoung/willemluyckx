> Update 2026-09-13: de nieuwe propositie vervangt Basis/Premium. Lees eerst [PROPOSITION_UPDATE_2026-09-13.md](PROPOSITION_UPDATE_2026-09-13.md). Websitewijzigingen zijn lokaal; de lege nieuwsbrief-tab is voorbereid. Oudere betaalinstructies hieronder zijn historische context.

> Deployment update 2026-09-14: nieuwe propositie gedeployed naar `https://ab27e4f8.willemluyckx.pages.dev`; de bundle is ook gecontroleerd via `https://topfitrunning.com`.

# TopFit Running Handoff

Last updated: 2026-08-28

## Current State

- Project: `willemluyckx / TopFit Running`
- Branch: `main`
- Current checkpoint commit: `ec5dd31` (latest Pages deploy used `--commit-dirty true`)
- Live site: `https://topfitrunning.com/`
- Review flow is live again with multi-version rounds enabled.
- Latest verified production bundle:
  - `assets/index-D1Ysm7kA.js`
- Latest Pages deploy:
  - `https://cd1a9ee9.willemluyckx.pages.dev`

## What Is Done

- TopFit branding and core project docs are in place.
- Google Sheets access docs are added.
- TopFit content and page copy were cleaned up.
- The over-willem page layout was reworked and stabilized.
- The about page was expanded with Willem Luijckx profile content, sport/coaching history, trainer education, authorship, expertise and vision.
- Route snippet copy and page titles now match the fuller Willem profile.
- A new post-deploy rollback snapshot was captured at:
  - `rollback-2026-08-26-after-brevo-live.patch`
- The Trainingswortels image holder was normalized to match the working homepage-style crop behavior.
- Subscription product pages were added.
- Stripe checkout and webhook endpoints were added for the product flow.
- Intake flow added:
  - `/intake`
  - one-question-at-a-time form
  - Google Sheets write to `Intake` tab
  - post-purchase and sales-oriented success modes via `flow=checkout`
- Hardloopkalender page added and connected to Google Sheets-backed race data.
- Clinics and trainingskampen were split into separate pages.
- Physical coaching page was added and priced.
- Homepage offer cards now link to their correct pages.
- Homepage contains a small intake trust link block.
- PDF reader and archive video were added to the over-Willem page.
- Cloudflare Pages project `willemluyckx` was found and updated with:
  - `SITE_URL=https://topfitrunning.com`
  - `STRIPE_SUCCESS_URL=https://topfitrunning.com/nl/abonnementen/premium?success=1`
  - `STRIPE_CANCEL_URL=https://topfitrunning.com/nl/abonnementen/premium?canceled=1`
- The repository currently builds and lints successfully.
- Homepage copy, CTA flow, and package presentation were reworked live.
- Multiple blog articles were added with reusable hero-image styling.
- The blog index and homepage teaser now use image-based cards with readable title overlays.
- Review flow work stabilized enough for use:
  - `/review-admin`
  - `/review/:token`
  - `/review/:token/summary?version=Vx`
- Multi-version rounds were restored:
  - `V1`
  - `V2`
  - `V3`
  - etc.
- Existing test review data for `V2` through `V6` was removed from the live Google Sheet.
- The cleanup helper now exists at:
  - `scripts/cleanup-review-v1.mjs`
- `Trainingskampen` is temporarily hidden from the public menu and live route flow.
- The `TrainingCampsPage` implementation is still kept in the codebase for later reactivation.
- The repeated standalone TopFit logo block near lower CTA stacks was reduced in size and spacing across pages.

## What Is Still Open

- Review storage is still an open backend issue:
  - autosave appends rows to Google Sheets
  - it does not overwrite existing rows for the same `token + version`
  - this means one version can create duplicate rows in `ReviewRounds` and `ReviewItems`
  - the review UI works, but the Sheets layer is still messy by design right now
- If this must be fixed later, the fix belongs in:
  - `functions/api/review.ts`
  - the write strategy per `token + version`
  - not in more client-side patching
- Stripe secrets still need to be supplied in Cloudflare:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_PREMIUM`
- If you want the other packages live too, also:
  - `STRIPE_PRICE_BASE`
  - `STRIPE_PRICE_CLINIC`
- The actual Stripe checkout flow still needs a live/test payment run once those vars are present.
- Brevo mail is now wired and verified live:
  - `BREVO_API_KEY` secret is present in Cloudflare Pages
  - production vars for sender and destination are present
  - `POST https://topfitrunning.com/api/contact` returned `200` on Wednesday, August 26, 2026
  - internal and customer Brevo delivery succeeded
- Intake is functionally ready, but the live deployment still needs to be refreshed so `/api/intake` and the new routes are available on production.
- If Cloudflare Pages has not yet picked up the latest functions, the live intake route may still need a redeploy.

## Current Coding Notes

- The Stripe checkout route now accepts the Dutch `basis` slug by mapping it to the internal `base` config.
- Stripe success now returns to the same product page with `?success=1#checkout`, and intake is offered afterward as an optional next step.
- The intake page now respects `?locale=` on the non-localized `/intake` route.
- Stripe promotion codes now belong in the embedded Stripe checkout panel, not in a fake local coupon field.
- On Friday, August 28, 2026, the inline success state was improved so a successful payment first returns to the same product page with a confirmation block instead of jumping straight into intake.
- The interrupted conversion pass from Friday, August 28, 2026 was then completed: the package checkout now removes the extra pre-checkout form and keeps the Stripe step inline inside the styled product page.
- `src/components/EmbeddedPackageCheckout.tsx` now opens the embedded checkout directly from the product page instead of first asking for name, email and phone in local fields.
- `functions/api/stripe-checkout.ts` now enables Stripe phone collection so contact details are gathered inside Stripe checkout itself.
- `functions/api/stripe-webhook.ts` now reads the phone from `customer_details.phone` first, with metadata fallback for older sessions.
- The remaining practical next step is a live smoke test and deploy, not more redesign work.
- The Stripe webhook now handles invalid JSON payloads safely and can send Brevo payment emails after Stripe is configured.
- The contact route now rejects malformed email addresses earlier and sends real Brevo mail in production.
- Review admin cache key was bumped so old test rounds do not linger from browser session storage.
- The live review data was intentionally cleaned back to a `V1` baseline while keeping future `V2+` creation enabled.
- The standalone logo block that appears near the lower CTA stack was reduced in size and vertical spacing to reduce dead space before the final CTAs.
- `npm run lint` and `npm run build` both pass after these changes.
- `Trainingskampen` should stay hidden for now, but the underlying implementation should not be deleted.

## Safe Next Steps

1. Add Stripe env vars in Cloudflare Pages for the `willemluyckx` project.
2. Redeploy and test `/nl/abonnementen/premium`.
3. Confirm the embedded Stripe checkout opens on the TopFit Running page.
4. Confirm the webhook returns success for `checkout.session.completed`.
5. Wire Brevo for the contact form if that is the next priority.
6. Redeploy the current branch to Cloudflare Pages so the new intake route and content changes go live.
7. Test `/intake?flow=checkout` from a paid-flow URL and `/intake` from a direct entry.
8. Continue with front-end and content improvements once payment/email backend and intake are parked.
9. Only return to review storage if duplicate Google Sheets rows become worth fixing.
10. If `Trainingskampen` needs to return later:
   - restore menu/nav entries
   - remove the redirect in `src/pages/LocalePageView.tsx`
   - keep using the existing `TrainingCampsPage`

## Manual Stripe Test

Use this exact manual test on Thursday, August 27, 2026:

1. Open:
   - `https://topfitrunning.com/nl/abonnementen/premium`
2. Scroll to the checkout section.
3. Fill in:
   - name
   - email
   - phone
4. Click:
   - `Open premium betaling hier`
5. Confirm the Stripe payment panel opens below on the same TopFit Running page.
6. Optional quick UI check:
   - confirm a promo code field/link exists inside the Stripe panel
   - confirm you did not leave `topfitrunning.com` before the final payment step
7. Complete the payment only in Stripe test mode.
8. After success, confirm you land on:
   - `https://topfitrunning.com/intake?locale=nl&flow=checkout&product=premium`
9. Fill in and submit the intake.
10. Confirm the follow-up results:
   - the intake row appears in the `Intake` Google Sheet tab
   - the Stripe webhook processes successfully
   - the internal payment email arrives
   - the customer payment confirmation email arrives

### Useful test inputs

- Product page:
  - `https://topfitrunning.com/nl/abonnementen/premium`
- Name:
  - `Stripe Test Premium`
- Email:
  - `test+premium@topfitrunning.com`
- Phone:
  - `+31600000001`

### Pass criteria

- The Stripe panel opens inline on the same page.
- The checkout session is created without a redirect to the old hosted flow.
- The payment completes in test mode.
- The intake redirect works.
- The intake submit works.
- The email/webhook follow-up works.

## Live Release Protocol

- Before pushing live, capture the current rollback point:
  - current known good checkpoint commit: `d578683`
  - create a new tagged checkpoint or commit after verification if you want a clean revert target
- Verify locally first:
  - `npm run lint`
  - `npm run build`
- Verify the sheets-backed routes:
  - `/intake`
  - `/intake?flow=checkout`
  - `/nl/hardloopkalender`
- Verify Stripe-related pages only after the missing Stripe env vars are present in Cloudflare.
- Keep changes scoped to this repo only; do not touch sibling projects.

## Rollback Notes

- Fastest rollback target:
  - restore deployment to commit `d578683`
- If a live issue is isolated to intake:
  - revert `src/pages/IntakePage.tsx`
  - revert `functions/api/intake.ts`
  - revert `vite.config.ts`
  - revert `functions/api/stripe-checkout.ts` if the intake redirect path must be undone
- If a live issue is isolated to the calendar:
  - revert `src/pages/localeRoutePages.tsx`
  - revert `src/data/hardloopwedstrijden.ts`
- If a live issue is isolated to content only:
  - revert `src/lib/topfitContent.ts`
  - revert `src/pages/LocalePageView.tsx`

## Live Checklist

1. Confirm local checks are green:
   - `npm run lint`
   - `npm run build`
2. Confirm the live-ready files are the only ones you intend to ship.
3. Deploy the current branch to Cloudflare Pages for `willemluyckx`.
4. Smoke test these live routes:
   - `/nl`
   - `/nl/abonnementen`
   - `/nl/hardloopkalender`
   - `/intake`
   - `/intake?flow=checkout`
   - `/nl/clinics`
5. Test the intake submit once on live and confirm the Google Sheet writes a row.
6. Test one Stripe purchase flow only after the Stripe env vars are present.
7. If anything breaks, roll back first at the deployment level, then revert only the relevant file set.

## Live Route Map

Check these first after deploy:
- `https://topfitrunning.com/nl`
- `https://topfitrunning.com/nl/abonnementen`
- `https://topfitrunning.com/nl/hardloopkalender`
- `https://topfitrunning.com/intake`
- `https://topfitrunning.com/intake?flow=checkout`
- `https://topfitrunning.com/nl/clinics`

## Latest Deploy

- Cloudflare Pages deployment completed successfully.
- Preview deployment URL:
  - `https://cd1a9ee9.willemluyckx.pages.dev`
- Earlier review-flow deploys that matter for debugging:
  - `https://1ffb0978.willemluyckx.pages.dev`
  - `https://a5c92371.willemluyckx.pages.dev`

## Session Closeout

- Latest manual Pages deploy on Wednesday, August 26, 2026:
  - `https://cd1a9ee9.willemluyckx.pages.dev`
- Production is serving the current bundle:
  - `assets/index-D1Ysm7kA.js`
- Exact current workspace rollback snapshots:
  - `rollback-status-2026-08-26-before-payments-live.txt`
  - `rollback-2026-08-26-before-payments-live.patch`
  - `rollback-status-2026-08-26-after-brevo-live.txt`
  - `rollback-2026-08-26-after-brevo-live.patch`

- Latest deploy was made from a dirty workspace on top of `ec5dd31`; the older fully committed review checkpoint remains `53328a0`.
- The review system is usable for clients right now.
- Known unresolved review issue remains the Google Sheets append behavior described above.
- The immediate next step is the interrupted checkout conversion redesign from Friday, August 28, 2026.
- The interrupted checkout conversion redesign from Friday, August 28, 2026 is now complete locally.
- Safe resume point:
  - open this handoff
  - ignore old review test rounds because they were removed from Sheets
  - continue from the intake / checkout / content / deploy state noted above
  - remember that `Trainingskampen` is hidden on purpose, not removed permanently
  - for checkout work, continue from the now-finished inline embedded flow in `src/components/EmbeddedPackageCheckout.tsx`
  - next useful action is deploy plus smoke test on `/nl/abonnementen/premium` and `/en/subscriptions/premium`

## Latest Local Verification

- On Friday, August 28, 2026, `npm run build` completed successfully after the checkout redesign.
- On Friday, August 28, 2026, `npm run lint` completed with warnings only and no errors.
- The remaining lint warnings are unrelated to this checkout task and currently sit in:
  - `src/components/layout/SiteHeader.tsx`
  - `src/pages/ReviewAdminPage.tsx`
  - `src/pages/ReviewWizardPage.tsx`

## Files Most Likely To Matter Next

- `functions/api/stripe-checkout.ts`
- `functions/api/stripe-webhook.ts`
- `src/pages/localeRoutePages.tsx`
- `src/pages/LocalePageView.tsx`
- `src/pages/LocalePage.tsx`
- `src/lib/topfitContent.ts`
- `src/lib/siteConfig.ts`
- `src/pages/ContactPage.tsx`
- `functions/api/contact.ts`
- `functions/api/review.ts`
- `src/pages/ReviewAdminPage.tsx`
- `src/pages/ReviewWizardPage.tsx`
- `src/lib/reviewFlow.ts`

## Notes

- Do not modify the sibling `rolexbugatti` folder.
- Keep any unrelated dirty files untouched unless they are part of the task at hand.
