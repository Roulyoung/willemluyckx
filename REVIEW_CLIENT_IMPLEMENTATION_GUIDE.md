# Review Flow Guide

Laatste update: 2026-07-21

Dit document beschrijft de review-flow voor klanten en voor intern gebruik. De flow is bedoeld als herbruikbaar systeem voor dit project en voor toekomstige projecten.

## Doel

- Klant geeft feedback in een wizard, niet in Google Sheets.
- Eén bronversie wordt gereviewd, meestal Nederlands.
- Alle feedback wordt per pagina en per sectie opgeslagen.
- Na verwerking van feedback moet de klant opnieuw goedkeuren.
- Jij houdt overzicht via de admin-pagina en via de Codex prompt export.

## Voor de klant

Gebruik deze uitleg wanneer je de klant de review-link stuurt.

### Wat de klant krijgt

- Eén review-link, bijvoorbeeld `/review/<token>`.
- Een wizard met pagina's en secties.
- Per onderdeel knoppen voor:
  - `Approved`
  - `Needs changes`
  - `Not applicable`
  - `Blocked`
- Een notitieveld per pagina en per sectie.
- Automatische opslag tijdens het invullen.
- Een summary-pagina aan het einde.

### Wat de klant moet doen

1. Open de review-link.
2. Ga pagina voor pagina door de site.
3. Beoordeel per pagina en per sectie wat goed is en wat anders moet.
4. Schrijf korte, concrete feedback waar nodig.
5. Klik door naar de volgende pagina.
6. Op de summary-pagina zie je de open punten.
7. Geef pas akkoord als de hele ronde klopt.

### Wat de klant niet hoeft te doen

- Geen Google Sheets openen.
- Geen technische routes begrijpen.
- Geen taalwissels doorlopen.
- Geen prompt schrijven voor Codex.

### Korte tekst voor de klant

> Ik heb een review-wizard voor je gemaakt. Je kunt daar per pagina en per onderdeel feedback geven. Alles wordt automatisch opgeslagen, dus je kunt later verdergaan met dezelfde link. Aan het einde zie je een samenvatting van de open punten en kun je de versie goedkeuren.

### Korte app-/mailtekst

> Je kunt je feedback geven via deze review-link. Daarin loop je stap voor stap door de pagina's en onderdelen heen. Geef aan wat goed is en wat nog aangepast moet worden. Alles wordt automatisch opgeslagen, dus je kunt tussendoor stoppen en later verdergaan met dezelfde link. Aan het einde zie je een samenvatting en kun je de versie goedkeuren.

## Interne flow

### Start

- Jij maakt een token aan in `review-admin`.
- Je deelt de review-link met de klant.
- De klant opent de wizard.

### Review ronde

- De klant vult feedback in op pagina- en sectieniveau.
- Autosave schrijft de voortgang weg.
- Jij ziet de open punten in de admin.

### Verwerking

- Jij verwerkt de feedback in de site.
- Open items blijven open totdat de klant opnieuw akkoord geeft.

### Nieuwe ronde

- Na wijzigingen start je een nieuwe ronde, bijvoorbeeld `V2`.
- De klant controleert opnieuw dezelfde pagina's.
- Pas daarna sluit je de ronde af.

## Wat de klant ziet in de wizard

- Paginalijst links.
- Groot previewvenster van de huidige pagina.
- Sectiekaarten met duidelijke klanttaal.
- Knoppen voor status en notities.
- Een duidelijke volgende-stap flow zonder losse summary-knop in het midden van de wizard.

## Wat de admin doet

- Review tokens aanmaken.
- Reviews openen en monitoren.
- Status van rondes bekijken.
- Open items kopiëren naar Codex.
- Een nieuwe ronde starten als V2.

## Inhoudsmodel

De reviewflow werkt op deze onderdelen:

- `page`
- `section`
- `status`
- `comment`
- `version`
- `token`

De opgeslagen statussen zijn:

- `pending`
- `needs_review`
- `needs_changes`
- `approved`
- `not_applicable`
- `blocked`

## Google Sheets structuur

De backend schrijft naar deze tabs:

- `ReviewRounds`
- `ReviewItems`
- `ReviewApprovals`

### Waarom deze tabs

- `ReviewRounds` bewaart per ronde de basis en de snapshot.
- `ReviewItems` bewaart de pagina- en sectiefeedback.
- `ReviewApprovals` bewaart de finale goedkeuring.

## Route-overzicht

- `/review/:token`
- `/review/:token/summary`
- `/review-admin`

De normale site blijft los daarvan bestaan.

## Implementatiekeuzes die bewust zijn gemaakt

1. De klant werkt in één bronversie.
- Geen reviewflow per taal.
- Vertaling gebeurt pas na goedkeuring.

2. Secties hebben eigen anchors.
- De preview springt naar het relevante blok.
- Dat voorkomt verwarring over termen zoals hero, FAQ of blog teaser.

3. De preview is een echte site-preview.
- Niet alleen uitlegtekst.
- De klant ziet wat er echt op de pagina staat.

4. Summary is alleen voor afronding.
- De summary is niet de plek om te reviewen.
- Daar hoort akkoord en codex-export.

## Testplan voor de klantronde

### Vooraf

- Controleer of `npm run build` groen is.
- Controleer of de nieuwste deploy live staat.
- Controleer of `review-admin` een token kan genereren.

### Klanttest

1. Open de review-link.
2. Check of de wizard laadt zonder wit scherm.
3. Klik door alle pagina's.
4. Controleer of de preview naar het juiste blok springt.
5. Vul op minstens één pagina feedback in.
6. Refresh de pagina.
7. Controleer of de voortgang terugkomt.
8. Ga naar de summary.
9. Controleer of open items zichtbaar zijn.
10. Geef alleen akkoord als de ronde echt klopt.

### Admintest

1. Open `/review-admin`.
2. Controleer of de token-lijst zichtbaar is.
3. Open de summary van een token.
4. Controleer of de codex prompt klopt.
5. Start een volgende ronde als dat nodig is.

## Korte interne checklist

Gebruik deze checklist tijdens de eerste klanttest.

### Voor start

- [ ] Latest build is groen
- [ ] Latest deploy is live
- [ ] Review token werkt
- [ ] Review-admin opent
- [ ] Google Sheets tabs bestaan

### Klantflow

- [ ] Review-link opent zonder wit scherm
- [ ] Wizard laadt direct op de bron-taal
- [ ] Paginalijst is duidelijk
- [ ] Preview toont het juiste blok
- [ ] Open page link werkt
- [ ] Sectie-statusknoppen werken
- [ ] Notitievelden werken
- [ ] Refresh behoudt voortgang
- [ ] De klant kan later verdergaan met dezelfde link
- [ ] Summary toont open items
- [ ] Approve version werkt

### Adminflow

- [ ] Token aanmaken werkt
- [ ] Admin overzicht laadt
- [ ] Summary openen werkt
- [ ] Codex prompt kopiëren werkt
- [ ] Nieuwe ronde starten werkt
- [ ] V2 opent met lege status

### Let extra op

- [ ] Sectienamen zijn begrijpelijk voor de klant
- [ ] Preview-anchors wijzen naar het juiste blok
- [ ] Review blijft beperkt tot één bron-taal
- [ ] Er zijn geen onbedoelde links naar andere talen in de wizard

## Mogelijke aandachtspunten

Dit zijn de dingen die tijdens de test nog kunnen schuiven:

- Sommige secties zijn nog vrij generiek benoemd. Als de klant dat nog verwarrend vindt, kunnen we labels verder versimpelen.
- Sommige preview-anchors kunnen later nog specifieker worden als de klant veel in detail wil reviewen.
- De flow is nu bewust op één taal gericht. Als later toch een aparte taalcheck nodig is, moet die apart worden ontworpen en niet in deze hoofdflow worden gepropt.
- Als een pagina in de toekomst grote layoutverschillen tussen talen krijgt, moet de review-config opnieuw worden bekeken.
- Als de klant veel lange opmerkingen geeft, kan een compactere samenvatting of tagging handig worden.

## Herbruikbaar voor andere projecten

Dit patroon kan direct worden hergebruikt voor:

- TopFit Running
- RolexBugatti
- Highcraft
- Sitedesk
- Trabajar en Holanda
- RoadHero
- template projecten

Aanpasbare delen per project:

- projectnaam
- token-link
- pagina-lijst
- sectie-lijst
- admin key
- Google Sheet ID

## Volgende logische stap

1. Laat de klant de review-link testen.
2. Verzamel feedback.
3. Verwerk de feedback in de site.
4. Start daarna V2.
5. Gebruik dezelfde documentstructuur opnieuw voor de volgende feedbackronde.
