# Review Sheets Template

Gebruik dit als standaard sheet-structuur voor alle klantreview-flows.

## Tabs

### 1. `ReviewRounds`

Doel: één regel per reviewronde of snapshot.

Kolommen:

- `token`
- `version`
- `current_page_index`
- `updated_at`
- `status`
- `payload_json`

Voorbeeld:

| token | version | current_page_index | updated_at | status | payload_json |
|---|---:|---:|---|---|---|
| klanttoken123 | V1 | 2 | 2026-07-16T11:05:00Z | needs_review | {"token":"klanttoken123","version":"V1"} |
| klanttoken123 | V1 | 4 | 2026-07-16T11:18:00Z | final_approved | {"token":"klanttoken123","version":"V1"} |

### 2. `ReviewItems`

Doel: één regel per pagina of sectie per save.

Kolommen:

- `token`
- `version`
- `item_type`
- `page_key`
- `section_key`
- `status`
- `note`
- `current_page_index`
- `updated_at`

Voorbeeld:

| token | version | item_type | page_key | section_key | status | note | current_page_index | updated_at |
|---|---|---|---|---|---|---|---:|---|
| klanttoken123 | V1 | page | home |  | needs_review | Hero needs a shorter headline | 0 | 2026-07-16T11:05:00Z |
| klanttoken123 | V1 | section | home | hero | needs_changes | Button text is too long | 0 | 2026-07-16T11:05:00Z |
| klanttoken123 | V1 | section | trainingsschemas | table | approved |  | 2 | 2026-07-16T11:18:00Z |

### 3. `ReviewApprovals`

Doel: één regel per definitieve goedkeuring van een ronde.

Kolommen:

- `token`
- `version`
- `approved_at`
- `status`

Voorbeeld:

| token | version | approved_at | status |
|---|---|---|---|
| klanttoken123 | V1 | 2026-07-16T11:30:00Z | approved |

## Statusen

- `pending`
- `needs_review`
- `needs_changes`
- `approved`
- `not_applicable`
- `blocked`
- `final_approved` als round status

## Review Flow

1. Klant opent `/review/:token`.
2. Klant vult pagina- en sectiestatussen in.
3. Autosave schrijft snapshots naar `ReviewRounds` en `ReviewItems`.
4. Klant gaat naar `/review/:token/summary`.
5. Klant klikt `Approve version`.
6. API schrijft ook een regel in `ReviewApprovals`.
7. Na verwerking start jij een nieuwe ronde via `V2`.

## Handige conventies

- Gebruik `token` als vaste sleutel per klant en project.
- Gebruik `version` als ronde-nummer.
- Houd `page_key` en `section_key` kort en stabiel.
- Behandel `ReviewRounds` als audit log, niet als bewerkbare bron.
- Behandel `ReviewItems` als de belangrijkste werkvoorraad voor feedback.

## Reuse voor andere projecten

Pas alleen deze waarden aan:

- `project_key`
- pagina-slugs
- sectie-lijst
- admin-key
- Google Sheet ID

Verder kan dezelfde flow direct worden hergebruikt voor:

- TopFit Running
- RolexBugatti
- Highcraft
- Sitedesk
- Trabajar en Holanda
- RoadHero
- template projecten
