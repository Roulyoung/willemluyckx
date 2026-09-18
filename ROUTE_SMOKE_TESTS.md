# Route Smoke Tests

Voer deze checks uit in Chrome na een build of bij een klantreview.

## Start

- Open `npm run go`
- Controleer dat de app opent op `http://localhost:5173/nl`

## Home

- Open `/nl`
- Switch naar EN
- Switch terug naar NL
- Controleer dat geen wit scherm verschijnt

## Taalwissel

- Test de taalwissel op:
  - home
  - over-willem / about-willem
  - abonnementen / subscriptions
  - trainingsschemas / training-plans
  - looptechniek / running-technique
  - mukti-running
  - clinics
  - trainingskampen / training-camps
  - online-coaching
  - hardloopkalender / running-calendar
  - blog
  - shop
  - contact

## Detailroutes

- Open een blogartikel
- Switch taal op het artikel
- Open een abonnementdetail
- Switch taal op het detail
- Open een shopproduct
- Switch taal op het product

## CTA-links

- Home CTA naar schema's
- Home CTA naar Mukti Running
- Blog teruglink
- Intake teruglinks
- Footer contactlink

## Acceptatie

- Geen 404
- Geen wit scherm
- Geen terugval naar verkeerde taal
- Geen NL-link op EN pagina tenzij expliciet bedoeld
