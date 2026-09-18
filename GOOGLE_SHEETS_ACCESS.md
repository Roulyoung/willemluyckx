# Google Sheets Access

## Standard Model

This project uses a shared Google Sheets service-account approach:

- local admin script for spreadsheet maintenance
- worker-side read access for runtime content
- no service-account JSON committed to git

## Local Admin Access

Use `scripts/google-sheets-admin.js` for spreadsheet operations.

Default sheet ID in the script:

- `1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA`

Expected local key file:

- `worker/secretgogle/service-account.json`

Optional override:

- `SERVICE_ACCOUNT_PATH`

Examples:

```powershell
node scripts/google-sheets-admin.js info
node scripts/google-sheets-admin.js read --range "Pages!A1:Z5"
node scripts/google-sheets-admin.js bootstrap-topfit
```

## Worker Access

The Cloudflare Pages function at `functions/api/topfit.ts` reads Google Sheets with a service-account JSON secret from the runtime environment.

Supported env var names:

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`

## Sheet Structure

The local bootstrap script expects these tabs:

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

## What To Keep Out Of Git

- raw service-account JSON
- private keys
- OAuth tokens
- copied spreadsheet exports with secrets

## Quick Checks

- `npm run build`
- `node scripts/google-sheets-admin.js info`
- worker endpoint test from the deployed site or local emulation

