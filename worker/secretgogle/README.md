# Local Google Service Account Key

Place the service account JSON key used for Google Sheets access in this folder.

Default file expected by project scripts:

- `service-account.json`

Do not commit the JSON key to git.
Keep it only on the local machine and point scripts to it through:

- `SERVICE_ACCOUNT_PATH`

This project uses the standard shared Google service-account pattern documented in `GOOGLE_SHEETS_ACCESS.md`.

