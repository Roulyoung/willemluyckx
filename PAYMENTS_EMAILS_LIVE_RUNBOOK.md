# Payments & Emails Live Runbook

Updated: 2026-08-26

## Goal

Bring the Stripe checkout and the related email flows live for `https://topfitrunning.com/` without losing a rollback path.

## Verified Starting Point

As of Wednesday, August 26, 2026:

- The codebase contains Stripe checkout endpoints and a Brevo-based email implementation.
- The intake flow exists and writes to Google Sheets.
- The current Cloudflare Pages production secret list for `willemluyckx` now confirms:
  - `BREVO_API_KEY`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
- The current Cloudflare Pages production vars confirm:
  - `BREVO_FROM_EMAIL=info@topfitrunning.com`
  - `BREVO_FROM_NAME=TopFit Running`
  - `BREVO_TO_EMAIL=info@topfitrunning.com`
  - `BREVO_REPLY_TO_EMAIL=info@topfitrunning.com`
  - `SITE_URL=https://topfitrunning.com`
- Live verification on Wednesday, August 26, 2026:
  - contact email flow is live
  - Stripe checkout is still blocked by missing Stripe runtime config.

## Required Cloudflare Pages Config

### Secrets

Already confirmed live:

- `BREVO_API_KEY`

Still required for live Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Variables

Add these as runtime vars for production:

- `SITE_URL=https://topfitrunning.com`
- `STRIPE_PRICE_PREMIUM=price_...`
- `STRIPE_PRICE_BASE=price_...`
- `STRIPE_PRICE_CLINIC=price_...`
- `BREVO_FROM_EMAIL=info@topfitrunning.com`
- `BREVO_FROM_NAME=TopFit Running`
- `BREVO_TO_EMAIL=info@topfitrunning.com`
- `BREVO_REPLY_TO_EMAIL=info@topfitrunning.com`

### Optional per-product overrides

Only add these if the default generated URLs are not enough:

- `STRIPE_SUCCESS_URL_PREMIUM`
- `STRIPE_CANCEL_URL_PREMIUM`
- `STRIPE_SUCCESS_URL_BASE`
- `STRIPE_CANCEL_URL_BASE`
- `STRIPE_SUCCESS_URL_CLINIC_TICKET`
- `STRIPE_CANCEL_URL_CLINIC_TICKET`

## Stripe Dashboard Setup

### Products and prices

Confirm Stripe has active prices for:

- Premium
- Base
- Clinic ticket

Copy the final live `price_...` IDs into Cloudflare Pages.

### Webhook endpoint

Create or update the webhook endpoint to:

- `https://topfitrunning.com/api/stripe-webhook`

Subscribe at minimum to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

### Promotion codes

Promotion codes are entered on Stripe Checkout itself.
The local coupon field was removed because it was not connected to Stripe.

## Brevo Setup

### Sender identity

Before go-live, verify the sender domain or sender inbox in Brevo for:

- `BREVO_FROM_EMAIL`

### Internal inbox

Set the internal destination to the inbox Willem should actually monitor:

- `BREVO_TO_EMAIL`

### Reply handling

Use:

- `BREVO_REPLY_TO_EMAIL`

That keeps customer replies flowing to the right mailbox.

## Current Result

As of Wednesday, August 26, 2026:

- `POST https://topfitrunning.com/api/contact` succeeds and sends mail through Brevo.
- `POST https://topfitrunning.com/api/stripe-checkout` still fails until Stripe config is added in Cloudflare Pages.
- A new live rollback snapshot exists:
  - `rollback-status-2026-08-26-after-brevo-live.txt`
  - `rollback-2026-08-26-after-brevo-live.patch`

## Go-Live Procedure

1. Confirm the latest rollback reference files exist:
   - `rollback-status-2026-08-26-after-brevo-live.txt`
   - `rollback-2026-08-26-after-brevo-live.patch`
2. Add the missing Stripe config in Cloudflare Pages.
3. Deploy the current branch again after Stripe config is present.
4. Open and test:
   - `https://topfitrunning.com/nl/abonnementen/premium`
   - `https://topfitrunning.com/nl/abonnementen/basis`
   - `https://topfitrunning.com/nl/abonnementen/clinic-ticket`
5. Start one checkout and confirm the embedded Stripe panel opens on `topfitrunning.com`.
6. Complete a payment in the intended Stripe mode.
7. Confirm the webhook returns success.
8. Confirm these emails arrive:
   - internal payment email
   - customer payment confirmation email
   - contact form internal email
   - contact form customer autoreply
9. Confirm post-payment redirect lands on:
   - the same product page with `?success=1#checkout`
10. Confirm the intake remains available as an optional next step from the confirmation state.
11. Submit the intake once and confirm a row appears in the `Intake` Google Sheet tab.

## Smoke Checklist

### Checkout

- Product button creates a Stripe Checkout Session.
- Promo code entry is available in the embedded Stripe checkout panel.
- Cancel returns to the correct localized product page.
- Success returns to the same localized product page with a confirmation state.
- Intake stays available from that confirmation state.

### Emails

- Internal payment email contains:
  - product
  - amount
  - customer email
  - intake URL
- Customer payment email contains the intake link.
- Contact form no longer returns false success when email delivery is missing.

### Intake

- Intake page shows the expected language from `?locale=`.
- Intake submit writes to Google Sheets.

## Rollback

### Fastest rollback

- Restore the previous Pages deployment in Cloudflare Pages.

### File rollback if payment/email changes must be undone

Revert these files first:

- `functions/api/stripe-checkout.ts`
- `functions/api/stripe-webhook.ts`
- `functions/api/contact.ts`
- `functions/lib/brevo.ts`
- `src/pages/IntakePage.tsx`
- `src/pages/localeRoutePages.tsx`

### Snapshot rollback

To return to the exact workspace state captured after the Brevo-live deploy on Wednesday, August 26, 2026:

- start from commit `ec5dd31` in a clean checkout or temporary branch
- apply `rollback-2026-08-26-after-brevo-live.patch`

## Notes

- The current email implementation is intentionally simple and transactional.
- The webhook does not yet store an idempotency record, so manual Stripe replays can resend emails.
- If a dedicated payment audit trail is needed, add a `Payments` tab after the first successful live verification.

## References

- Stripe Checkout Session object:
  - https://docs.stripe.com/api/checkout/sessions/object
- Stripe Checkout discounts and promotion codes:
  - https://docs.stripe.com/payments/checkout/discounts
- Brevo transactional email API:
  - https://developers.brevo.com/docs/send-a-transactional-email

