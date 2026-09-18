# Payments & Emails Implementation

Updated: 2026-08-26

## Current Status

As of Wednesday, August 26, 2026:

- There was no dedicated Stripe/Brevo implementation document in this repo yet.
- Payment and email notes only existed indirectly in `SESSION_HANDOFF_TOPFITRUNNING.md` and the generic project secret docs.
- The current Cloudflare Pages production secret list for project `willemluyckx` now shows:
  - `BREVO_API_KEY`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
- The current Cloudflare Pages production vars now confirm:
  - `BREVO_FROM_EMAIL=info@topfitrunning.com`
  - `BREVO_FROM_NAME=TopFit Running`
  - `BREVO_TO_EMAIL=info@topfitrunning.com`
  - `BREVO_REPLY_TO_EMAIL=info@topfitrunning.com`
  - `SITE_URL=https://topfitrunning.com`
- Live smoke test on Wednesday, August 26, 2026:
  - `POST https://topfitrunning.com/api/contact` returned `200`
  - Brevo delivery succeeded with an internal message id
- Stripe is still not live from this pass because the required Stripe runtime config is still missing in production.

## Current Implementation Map

### Checkout frontend

- Product checkout UI lives in `src/pages/localeRoutePages.tsx`.
- The checkout button posts to `/api/stripe-checkout`.
- The page now keeps the user on `topfitrunning.com` and opens Stripe securely inside the page itself.
- Promo codes are now entered in the embedded Stripe checkout panel, not in a fake local coupon field.

### Stripe checkout session creation

- Endpoint: `functions/api/stripe-checkout.ts`
- Supported product slugs:
  - `premium`
  - `base`
  - `clinic-ticket`
  - Dutch alias `basis` maps to `base`
- The endpoint now:
  - normalizes the product slug
  - supports both redirect checkout and embedded on-site checkout
  - returns the user to the same product page with `?success=1#checkout` after payment completion
  - keeps localized cancel URLs on the product pages
  - allows Stripe promotion codes via `allow_promotion_codes=true`
  - stores `customer_name`, `phone`, `locale`, `product_slug` and `requested_slug` in Stripe metadata
  - supports optional per-product URL overrides:
    - `STRIPE_SUCCESS_URL_PREMIUM`
    - `STRIPE_CANCEL_URL_PREMIUM`
    - `STRIPE_SUCCESS_URL_BASE`
    - `STRIPE_CANCEL_URL_BASE`
    - `STRIPE_SUCCESS_URL_CLINIC_TICKET`
    - `STRIPE_CANCEL_URL_CLINIC_TICKET`

### Intake flow after payment

- Page: `src/pages/IntakePage.tsx`
- Route: `/intake`
- The intake page now reads `?locale=nl` or `?locale=en` from the query string.
- A successful payment now shows a confirmation on the product page first.
- From that confirmation, the customer can start the non-localized intake route when ready while still rendering the right language.
- Intake submissions are written to the `Intake` tab by `functions/api/intake.ts`.

### Stripe webhook

- Endpoint: `functions/api/stripe-webhook.ts`
- The webhook now:
  - validates the Stripe signature
  - safely rejects invalid JSON
  - handles:
    - `checkout.session.completed`
    - `checkout.session.async_payment_succeeded`
  - skips early completion events that are not yet actually `paid`
  - sends an internal payment notification email through Brevo
  - sends a customer payment confirmation email through Brevo with the intake link
- Current limitation:
  - there is still no persistent payment log tab or idempotency store for replay protection
  - manual event replays could resend emails
  - live Stripe checkout still returns `503` until `STRIPE_SECRET_KEY` and the price vars are present

### Contact email delivery

- Endpoint: `functions/api/contact.ts`
- The route used to validate only and return `ok: true` without delivering mail.
- It now:
  - sends an internal notification email through Brevo
  - sends an automatic customer confirmation email through Brevo
  - returns `503` when Brevo is not configured, instead of pretending the message was delivered
- Production verification on Wednesday, August 26, 2026 confirmed the contact route is now sending mail successfully.

### Shared email helper

- Helper: `functions/lib/brevo.ts`
- Uses Brevo transactional email API over HTTPS.
- Escapes user input before embedding it into HTML emails.

## Required Runtime Config

### Stripe secrets

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Stripe runtime config

- `SITE_URL`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRICE_BASE`
- `STRIPE_PRICE_CLINIC`

### Optional per-product URL overrides

- `STRIPE_SUCCESS_URL_PREMIUM`
- `STRIPE_CANCEL_URL_PREMIUM`
- `STRIPE_SUCCESS_URL_BASE`
- `STRIPE_CANCEL_URL_BASE`
- `STRIPE_SUCCESS_URL_CLINIC_TICKET`
- `STRIPE_CANCEL_URL_CLINIC_TICKET`

### Brevo config

- `BREVO_API_KEY`
- `BREVO_FROM_EMAIL`
- `BREVO_FROM_NAME`
- `BREVO_TO_EMAIL`
- `BREVO_REPLY_TO_EMAIL`

## Known Gaps After This Pass

- No TopFit production Stripe secret or price IDs were found locally during this pass.
- Local Brevo account inspection from the current machine IP was blocked by Brevo `authorised_ips`, even though the Cloudflare runtime mail send succeeded live.
- No dedicated payment persistence in Google Sheets yet.
- No refund/cancellation email flow yet.
- No idempotency layer for webhook email replay protection yet.
- No admin dashboard for payment events yet.
- Hebrew checkout copy still falls back to the English branch where the UI is binary `nl` vs `en`.

## Recommended Next Implementation Order

1. Put Stripe and Brevo runtime config into Cloudflare Pages.
2. Run one live or test checkout for `premium`.
3. Confirm both emails arrive:
   - internal payment notification
   - customer confirmation with intake link
4. Confirm `/intake?locale=nl&flow=checkout&product=premium` submits into the `Intake` sheet.
5. Enable `base` and `clinic-ticket` only after their price IDs are confirmed.
6. If needed, add a `Payments` sheet tab after live verification.

## References

- Stripe Checkout Session object:
  - https://docs.stripe.com/api/checkout/sessions/object
- Stripe promotion codes in Checkout:
  - https://docs.stripe.com/payments/checkout/discounts
- Brevo transactional email API:
  - https://developers.brevo.com/docs/send-a-transactional-email
