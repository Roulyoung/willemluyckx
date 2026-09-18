# TopFit Running — nieuwe propositie

Bron: `Extra info/Extra info finale propositie.docx`, plus antwoorden van Roeland op 13 september 2026.

## Besluiten en uitvoering

- Basis en Premium vervallen. Het instapaanbod is een persoonlijk hardloopschema voor 12 weken, eenmalig €19.
- Willem maakt het schema zelf op maat op basis van de intake en stuurt het daarna toe. Er is geen automatische download of gegenereerd schema.
- De intake vraagt ook expliciet naar niveau en ervaring. Dat antwoord en de schema-aanvraag worden in de bestaande kolom `extra_notes` opgeslagen; de bestaande `Intake!A:M`-indeling blijft geldig.
- Zoom Check: €40 voor 30 minuten. Fysieke training: €80 per uur.
- Clinic: 10.00–16.00 uur, lunch inbegrepen, ook voor individuele lopers, minimaal 10 deelnemers. Maatwerk in overleg. €130 normaal, €120 voor schemakopers; korting wordt bij de aanvraag besproken.
- Lezingen: €500 voor 90 minuten, op maat voor clubs, loopgroepen, trainers, organisaties en bedrijven. Thema's: Mukti Running, trainingsleer, voeding en blessurepreventie.
- Aanvragen lopen via intake of het bestaande contactformulier met vooraf ingevuld onderwerp. Online afrekenen is in deze versie niet geactiveerd. Oude pakketcheckout-verzoeken krijgen HTTP 410; historische Stripe-webhooks blijven intact.
- Correcties in de kennisbank: drinken rondom maaltijden, mobiliteit, slaap, cadans, skipping en loopsprongen. Het tekstvak “Wat techniek doet” heeft expliciet witte tekst op een donkere achtergrond.
- De volledige bestaande Google Sheets-wedstrijdlijst blijft beschikbaar. Er zijn geen wedstrijden toegevoegd, verwijderd of gewijzigd. Bij controle bevatte deze lijst 12 wedstrijden.
- De nieuwe commerciële teksten staan in `src/lib/proposition.ts` en hebben voorrang op oude commerciële Sheet-inhoud. Kalender, blog en overige redactionele gegevens blijven uit Sheets komen. Oude prijsregels in Sheets worden niet destructief gewist.
- Nieuwe hoofdroutes: `/nl/aanbod`, `/nl/aanbod/schema`, `/nl/aanbod/zoom`, `/nl/aanbod/fysiek`, `/nl/aanbod/clinic`, `/nl/aanbod/lezing`. Engels gebruikt `/en/offers`. De bestaande Engelse fallback op de `he`-routes blijft behouden.
- Oude Basis/Premium-links verwijzen naar het schema. Oude clinic-links verwijzen naar de nieuwe clinic. Bestaande trainingsschema-, coaching- en clinicroutes blijven bruikbaar.
- Klantcorrectie 14 september: Willem was jarenlang hoofdtrainer van de midden- en langeafstandselectie van Israël en was in Nederland tien jaar trainer voor de midden- en lange afstand bij A.V. Castricum en DEM. Deze ervaring staat nu op de over-Willem-pagina in Nederlands en Engels.
- Klantcorrectie 14 september: techniek, kracht en core, mobiliteit, herstel, voeding en leefstijl zijn niet inbegrepen bij het schema van €19. Deze verdieping wordt aangeboden in een Zoom Check van 30 minuten voor €40.

## Nieuwsbrief

- Los aanmeldformulier in de footer en na een afgeronde intake.
- Expliciete, niet vooraf aangevinkte toestemming; los van de aanvraag. Toestemmingstekst en versie worden opgeslagen.
- `POST /api/newsletter` schrijft naar een afzonderlijke `Newsletter!A:G`-tab in dezelfde TopFit Sheet.
- Kolommen: `created_at`, `email`, `locale`, `consent_version`, `consent_text`, `source`, `status`.
- De tab en kopregel zijn daadwerkelijk aangemaakt en teruggelezen. Geen testabonnees opgeslagen; geen e-mails verstuurd.
- De endpoint maakt alleen deze nieuwe tab aan als hij ontbreekt. Bestaande tabs en datasets blijven ongemoeid. Invoer wordt met `RAW` opgeslagen.
- Dit is registratie van nieuwsbriefaanmeldingen. Campagnes versturen en automatische bevestigingsmails zijn geen onderdeel van deze wijziging. Aanmeldingen zijn een log: ontdubbel e-mailadressen voor een latere mailing en verwerk afmeldingen via `info@topfitrunning.com` vóór verzending.
- Runtime gebruikt de bestaande Google-serviceaccountsecret. Er zijn geen nieuwe keys nodig.

## Validatie

- `node scripts/check-proposition.mjs`: 7 contractcontroles, volledig gemockte externe verzoeken. Controleert toestemming, foutafhandeling, opslagcontract, pensionering oude checkout, oude Sheet-prijzen en taalroutes.
- `node scripts/check-proposition-browser.mjs`: 16 routes in Chrome, intake inclusief niveau/aanvraag, aanvraagonderwerp, nieuwsbrief zonder toestemming / fout / succes, volledige kalender, mobiel menu en leesbaarheid techniekblok. Formulierinzendingen zijn gemockt: geen berichten of testklantdata verstuurd.
- Google Sheets-authenticatie en aanmaak van uitsluitend de lege nieuwsbrief-tab zijn tegen de echte API gecontroleerd.
- `npm run lint`: geen errors; twee reeds bestaande hookwarnings in de reviewpagina's.
- `npm run build`: productiebuild gecontroleerd.
- De losse TypeScriptcontrole blijft een bestaande fout in `src/pages/ReviewWizardPage.tsx:433` melden (`sectionKey` op een union). Dit bestand is identiek aan de startsnapshot en is niet aangepast voor deze opdracht.
- Screenshots staan lokaal in `%TEMP%/topfit-proposition-review`.

## Status en rollback

- Websitewijzigingen zijn gedeployed naar Cloudflare Pages op 14 september 2026.
- Preview deployment: `https://ab27e4f8.willemluyckx.pages.dev`
- Dezelfde nieuwe bundle is gecontroleerd via `https://willemluyckx.pages.dev` en `https://topfitrunning.com`.
- Lokale preview: `http://127.0.0.1:5173/nl`.
- Gedeelde Worker-services en siblingprojecten zijn niet aangepast. De gewijzigde API-routes zijn de bestaande TopFit Pages Functions.
- HEAD bij start: `ec5dd3170426b0b71c7a1a0d273db0d845f4dc7e`. De werkmap bevatte al veel niet-gecommitte wijzigingen; HEAD alleen is daarom geen exacte rollback.
- Exacte startsnapshot van `src`, `functions`, `vite.config.ts` en `index.html`: `../proposition-backup-20260913-200214/`.
- Veilig terugzetten: vergelijk alleen de door deze taak gewijzigde bestanden met die snapshot en herstel die bestanden gericht. Bewaar latere wijzigingen en klantgegevens. Nieuwe proposition-/newsletter-bestanden kunnen bij rollback uit de actieve imports worden gehaald. Geen `git reset --hard` gebruiken.
- De lege nieuwe `Newsletter`-tab kan bij code-rollback blijven bestaan. Verwijder hem niet als er inmiddels aanmeldingen in staan.
- Oudere handoff-instructies over Premium-checkout activeren zijn door deze propositiewijziging achterhaald.
