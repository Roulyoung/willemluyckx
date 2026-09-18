# Project Keys Register

## Scope

This file tracks where project credentials, IDs, and deployment settings live.
It must not contain raw secret values.

## Current Project

- Repo: `willemluyckx`
- App stack: Vite + React + TypeScript + Tailwind
- Content model: Google Sheets-backed TopFit content

## Known Integration IDs

- Google Sheet ID: `1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA`
- Primary site content source: `src/content/siteContent.ts`

## Secret Locations

### Google service account

- Local admin scripts:
  - expected path: `worker/secretgogle/service-account.json`
  - fallback env var: `SERVICE_ACCOUNT_PATH`
- Cloudflare Pages / Workers runtime env names:
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
  - `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`
- Local command-line tooling:
  - `scripts/google-sheets-admin.js`

### Stripe

- Cloudflare Pages secret names:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Cloudflare Pages runtime vars:
  - `SITE_URL`
  - `STRIPE_PRICE_PREMIUM`
  - `STRIPE_PRICE_BASE`
  - `STRIPE_PRICE_CLINIC`
- Optional Cloudflare Pages runtime vars:
  - `STRIPE_SUCCESS_URL_PREMIUM`
  - `STRIPE_CANCEL_URL_PREMIUM`
  - `STRIPE_SUCCESS_URL_BASE`
  - `STRIPE_CANCEL_URL_BASE`
  - `STRIPE_SUCCESS_URL_CLINIC_TICKET`
  - `STRIPE_CANCEL_URL_CLINIC_TICKET`
- Runtime files:
  - `functions/api/stripe-checkout.ts`
  - `functions/api/stripe-webhook.ts`

### Brevo email

- Cloudflare Pages secret names:
  - `BREVO_API_KEY`
- Cloudflare Pages runtime vars:
  - `BREVO_FROM_EMAIL`
  - `BREVO_FROM_NAME`
  - `BREVO_TO_EMAIL`
  - `BREVO_REPLY_TO_EMAIL`
- Runtime files:
  - `functions/lib/brevo.ts`
  - `functions/api/contact.ts`
  - `functions/api/stripe-webhook.ts`

## Sheet Tabs Used By The Project

- `SiteConfig`
- `Navigation`
- `Pages`
- `Offers`
- `ShopProducts`
- `BlogCategories`
- `BlogPosts`
- `Testimonials`
- `FAQ`
- `Media`
- `Leads`
- `Intake`

## Deployment Notes

- Cloudflare Pages build flow is present in the repo.
- Worker endpoint exists in `functions/api/topfit.ts`.
- Admin contact endpoint exists in `functions/api/contact.ts`.
- Checkout session endpoint exists in `functions/api/stripe-checkout.ts`.
- Stripe webhook endpoint exists in `functions/api/stripe-webhook.ts`.

## Open Items

- Confirm Stripe production secrets are present in Cloudflare Pages.
- Confirm the final live Stripe price IDs for all public products.
- Decide whether a dedicated `Payments` Google Sheet tab is needed after first live verification.
- Confirm whether legacy vars `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` should be removed from the Pages project config later.

## Confirmed Basics

- Production domain: `https://topfitrunning.com/`
- Worker model: shared worker
- Current checked Pages production secret list on 2026-08-26 confirmed:
  - `BREVO_API_KEY`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
- Current checked Pages production vars on 2026-08-26 confirmed:
  - `BREVO_FROM_EMAIL=info@topfitrunning.com`
  - `BREVO_FROM_NAME=TopFit Running`
  - `BREVO_TO_EMAIL=info@topfitrunning.com`
  - `BREVO_REPLY_TO_EMAIL=info@topfitrunning.com`
  - `SITE_URL=https://topfitrunning.com`
