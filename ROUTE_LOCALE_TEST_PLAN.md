# Route & Locale Test Plan

Gebruik dit document voor elke release of klantfeedbackronde om taalwissels en URL's consistent te houden.

## Doel

- Geen witte schermen bij taalwissel
- Correcte URL-vertaling per taal
- Consistente routes op desktop en mobiel
- Herbruikbare checklist voor latere projecten

## Canonieke routes

### Algemeen

- `/nl` -> Nederlandse home
- `/en` -> Engelse home
- `/he` -> Hebreeuwse home
- `/intake` -> intake flow zonder locale prefix

### Belangrijkste pagina's

- `/nl/over-willem` -> `/en/about-willem`
- `/nl/abonnementen` -> `/en/subscriptions`
- `/nl/trainingsschemas` -> `/en/training-plans`
- `/nl/looptechniek` -> `/en/running-technique`
- `/nl/mukti-running` -> `/en/mukti-running`
- `/nl/clinics` -> `/en/clinics`
- `/nl/trainingskampen` -> `/en/training-camps`
- `/nl/online-coaching` -> `/en/online-coaching`
- `/nl/hardloopkalender` -> `/en/running-calendar`
- `/nl/contact` -> `/en/contact`
- `/nl/shop` -> `/en/shop`
- `/nl/blog` -> `/en/blog`

### Detailroutes

- Blogartikel openen in NL, EN en HE
- Abonnementdetail openen in NL en EN
- Shopdetail openen in NL en EN

## Testlijst

### 1. Homepage

- Open `/nl`
- Switch naar EN
- Switch terug naar NL
- Check dat de pagina geen wit scherm geeft
- Check dat menu, header en footer blijven laden

### 2. Hoofdpagina's

- Open elke hoofdpagina in NL
- Switch naar EN via de taalknoppen
- Switch terug naar NL
- Herhaal voor HE waar beschikbaar

### 3. Blog

- Open blogindex in NL en EN
- Open een blogpost in NL
- Switch naar EN op de blogpost
- Switch terug naar NL
- Controleer dat de slug logisch vertaald wordt of veilig terugvalt naar de blogindex

### 4. Abonnementen

- Open abonnementen-overzicht in NL en EN
- Open een productdetail
- Switch taal op detailpagina
- Controleer of de juiste productdetailpagina wordt geladen

### 5. Shop

- Open shop-overzicht in NL en EN
- Open een productdetail
- Switch taal op detailpagina
- Controleer of de detailroute klopt of terugvalt naar shop-overzicht

### 6. Intake

- Open `/intake`
- Controleer teruglinks naar abonnementen
- Controleer of de locale switch geen foutpad oplevert

### 7. Navigatie en footer

- Header-menu links
- Mobile menu links
- Footer links
- CTA-knoppen op home en subpagina's

## Acceptatiecriteria

- Geen 404 of wit scherm bij locale switch
- Geen NL-link op een EN-pagina tenzij het bewust een vaste route is
- Blog, shop en abonnementen blijven inhoudelijk consistent tussen talen
- Alle belangrijke routes werken op mobiel en desktop

## Opmerking voor latere rondes

- Als een nieuwe pagina of blogpost wordt toegevoegd, moet er meteen een route-check bij.
- Als een slug per taal afwijkt, voeg hem expliciet toe aan de route-mapping.
- Gebruik dit document opnieuw voor volgende klantfeedbackrondes.
