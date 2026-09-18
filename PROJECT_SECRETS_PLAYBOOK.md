# Project Secrets Playbook

## Goal

Keep secrets out of chat, markdown, and git history.
Use local machine storage and deployment-secret tooling instead.

## Local Setup Pattern

1. Store the Google service-account JSON locally, outside the repo or in the expected local file path.
2. Do not commit JSON keys, Stripe secrets, Brevo API keys, or copied dashboard exports.
3. Use Cloudflare Pages secrets for runtime credentials.

## Existing Local Script

- Admin script: `scripts/google-sheets-admin.js`
- Expected local key path: `worker/secretgogle/service-account.json`
- Supported commands:
  - `info`
  - `read`
  - `write`
  - `append`
  - `bootstrap-topfit`
  - `seed-topfit`

## Cloudflare Runtime Secret Pattern

### Google Sheets

The worker in `functions/api/topfit.ts` reads the Google service account from one of these env vars:

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`

The value should be a JSON string with at least:

- `client_email`
- `private_key`

### Stripe

Store these in Cloudflare Pages secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Store these as runtime config vars:

- `SITE_URL`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRICE_BASE`
- `STRIPE_PRICE_CLINIC`

Optional per-product overrides:

- `STRIPE_SUCCESS_URL_PREMIUM`
- `STRIPE_CANCEL_URL_PREMIUM`
- `STRIPE_SUCCESS_URL_BASE`
- `STRIPE_CANCEL_URL_BASE`
- `STRIPE_SUCCESS_URL_CLINIC_TICKET`
- `STRIPE_CANCEL_URL_CLINIC_TICKET`

### Brevo

Store the API key in Cloudflare Pages secrets:

- `BREVO_API_KEY`

Store runtime config vars for sender and recipients:

- `BREVO_FROM_EMAIL`
- `BREVO_FROM_NAME`
- `BREVO_TO_EMAIL`
- `BREVO_REPLY_TO_EMAIL`

## Verification Flow

1. Confirm the Google service-account key exists locally.
2. Confirm Stripe price IDs are correct for the live products.
3. Confirm Cloudflare Pages secrets exist for Stripe and Brevo.
4. Confirm the contact form already sends real mail in production.
5. Run one checkout.
6. Confirm webhook success.
7. Confirm the customer and internal payment emails arrive.
8. Confirm `/intake?locale=nl&flow=checkout&product=...` works and writes to the `Intake` tab.

## Current Verified Runtime State - 2026-08-26

- Confirmed live in Cloudflare Pages secrets:
  - `BREVO_API_KEY`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
- Confirmed live in Cloudflare Pages vars:
  - `BREVO_FROM_EMAIL=info@topfitrunning.com`
  - `BREVO_FROM_NAME=TopFit Running`
  - `BREVO_TO_EMAIL=info@topfitrunning.com`
  - `BREVO_REPLY_TO_EMAIL=info@topfitrunning.com`
  - `SITE_URL=https://topfitrunning.com`
- Confirmed by live smoke test:
  - `POST https://topfitrunning.com/api/contact` returned `200` and delivered mail via Brevo
- Still missing for live Stripe checkout:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_PREMIUM`
  - `STRIPE_PRICE_BASE`
  - `STRIPE_PRICE_CLINIC`

## Rotation Notes

### Google

- Rotate the Google service-account key from the source provider.
- Update the local secret first.
- Update Cloudflare secret(s) after local verification.
- Remove any old environment variable names only after the new path is confirmed working.

### Stripe

- Rotate the Stripe live secret in Stripe.
- Update `STRIPE_SECRET_KEY` in Cloudflare Pages.
- If the webhook secret changes, update `STRIPE_WEBHOOK_SECRET` immediately after recreating the endpoint.
- Run one production checkout test after rotation.

### Brevo

- Rotate the Brevo API key in Brevo.
- Update `BREVO_API_KEY` in Cloudflare Pages.
- Verify the sender identity still matches `BREVO_FROM_EMAIL`.
- Re-test contact and payment emails after rotation.
