# Review Flow Build Plan

Doel: een herbruikbare klant-review wizard waarmee een klant pagina's en secties kan beoordelen, later kan hervatten, en per ronde opnieuw moet goedkeuren.

## Doel

- Klant werkt in een wizard, niet in Google Sheets.
- Feedback wordt per pagina en per sectie opgeslagen.
- Elke wijzigingsronde krijgt een versie: `V1`, `V2`, `V3`.
- Jij houdt overzicht op open punten, goedgekeurde onderdelen en terugkerende feedback.
- Het systeem moet herbruikbaar zijn voor andere projecten.

## Kernprincipes

- Een enkele klantlink per reviewronde.
- Autosave na elke stap.
- Resume support via token + server-side state.
- Pagina's en secties zijn los van elkaar te reviewen.
- Na verwerking van feedback moet de klant opnieuw goedkeuren.
- Google Sheets is opslag en administratie, niet de klantinterface.

## Routes

- `/review/:token`
- `/review/:token/summary`
- later eventueel:
  - `/review/:token/page/:pageKey`
  - `/review/:token/page/:pageKey/section/:sectionKey`

## Data Model

### ReviewRound

- `round_id`
- `project_key`
- `project_name`
- `version`
- `token`
- `status`
- `created_at`
- `updated_at`
- `submitted_at`
- `approved_at`

### ReviewPage

- `page_key`
- `page_label`
- `page_url`
- `order`
- `active`
- `default_sections`

### ReviewItem

- `item_id`
- `round_id`
- `project_key`
- `version`
- `page_key`
- `page_url`
- `page_label`
- `section_key`
- `section_label`
- `status`
- `comment`
- `priority`
- `updated_at`

### ReviewLog

- `log_id`
- `timestamp`
- `project_key`
- `round_id`
- `item_id`
- `action`
- `from_status`
- `to_status`
- `note`

## Status Model

- `pending`
- `needs_review`
- `needs_changes`
- `approved`
- `not_applicable`
- `blocked`

Round states:

- `v1_open`
- `v1_processed`
- `v2_open`
- `v2_processed`
- `final_approved`

## Wizard Flow

### Step 1: Intro

- Leg uit wat de reviewronde is.
- Laat de huidige versie zien.
- Laat zien dat voortgang automatisch wordt opgeslagen.

### Step 2: Paginalijst

- Toon alle pagina's in scope.
- Laat per pagina status zien.
- Laat zien hoeveel secties nog open zijn.

### Step 3: Pagina Review

Per pagina:

- algemene status
- commentaarveld
- knop `Goed`
- knop `Aanpassen`
- knop `Niet van toepassing`

### Step 4: Sectie Review

Per sectie:

- korte label
- statusknoppen
- commentaarveld
- optioneel prioriteit

### Step 5: Samenvatting

- Toon alle open items.
- Laat de klant nog een finale check doen.
- Laat de klant de ronde definitief indienen.

## Resume Gedrag

- Token in de URL.
- Server-side autosave op elk relevant moment.
- LocalStorage als fallback.
- Bij opnieuw openen gaat de wizard verder op de laatst opgeslagen stap.

## Google Sheets Tabs

### `Review_Rounds`

Gebruik voor ronde-overzicht en status.

### `Review_Items`

Gebruik voor alle pagina- en sectie-feedback.

### `Review_Pages`

Gebruik voor projectconfiguratie en page registry.

### `Review_Log`

Gebruik voor audit trail en statuswijzigingen.

## UI Componenten

- `ReviewIntro`
- `ReviewProgress`
- `ReviewPageList`
- `ReviewPageCard`
- `ReviewSectionCard`
- `ReviewStatusPill`
- `ReviewCommentField`
- `ReviewActionBar`
- `ReviewSummary`
- `ReviewCompletionScreen`

## Backend Components

- token validation
- round loading
- autosave endpoint
- approve endpoint
- round finalize endpoint
- prompt export endpoint

## Codex Export

Een knop voor de beheerder:

- `Copy as Codex prompt`

Die output bevat:

- projectnaam
- versie
- open items
- per item:
  - pagina
  - sectie
  - status
  - commentaar
  - prioriteit

## Implementatievolgorde

### Phase 1

- route `/review/:token`
- basic wizard shell
- local state
- hardcoded pages list

### Phase 2

- autosave
- resume
- Google Sheets write
- version field

### Phase 3

- section-level review
- approval flow
- summary page

### Phase 4

- codex export
- audit log
- reuse across projects

## Reusable Setup For Other Projects

Maak per project:

- `project_key`
- `page_registry`
- `section_registry`
- `review_rounds`
- `review_items`

Dan kan hetzelfde systeem werken voor:

- TopFit Running
- RolexBugatti
- Highcraft
- Sitedesk
- Trabajar en Holanda
- RoadHero
- template projecten

## Acceptance Criteria

- De klant ziet nooit Google Sheets.
- De klant kan stoppen en later verdergaan.
- Na een wijziging moet de klant opnieuw goedkeuren.
- Elke versie blijft in de administratie zichtbaar.
- Je kunt feedback direct omzetten naar een Codex prompt.
- Het systeem werkt generiek voor meerdere projecten.
