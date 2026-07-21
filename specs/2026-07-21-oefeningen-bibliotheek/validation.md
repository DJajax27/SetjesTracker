# Validation — Oefeningen bibliotheek (Fase 6)

De implementatie is klaar en mag gemerged worden als alle onderstaande checks slagen.

## Functioneel

### Brede toevoegbalk
- [ ] In `NewTemplate` staat onderaan de oefenlijst een brede "Oefening toevoegen"-knop
- [ ] In `EditTemplate` staat dezelfde knop
- [ ] Tikken opent het bibliotheekscherm (navigatie, niet een sheet)

### Bibliotheekscherm — laden
- [ ] Scherm laadt met alle standaardoefeningen zichtbaar (≥100 items)
- [ ] Eigen aangemaakte oefeningen verschijnen ook in de lijst
- [ ] Laadindicator of lege staat als er niets is

### Zoekbalk
- [ ] Typen filtert real-time op naam (case-insensitive)
- [ ] Zoeken op deelwoord werkt (bijv. "press" toont bench press, overhead press, etc.)
- [ ] Lege zoekresultaten tonen een duidelijke melding

### Sortering — Alfabetisch
- [ ] Standaardweergave is A–Z gesorteerd
- [ ] Zoekresultaten zijn ook alfabetisch gesorteerd

### Sortering — Spiergroep
- [ ] Oefeningen zijn gegroepeerd in 7 categorieën: Borst, Rug, Benen, Schouders, Armen, Core, Cardio
- [ ] Elke categorie heeft een zichtbare sectieheader

### Sortering — Recent
- [ ] Toont oefeningen die de gebruiker eerder heeft gelogd, meest recent bovenaan
- [ ] Lege staat als er nog niets gelogd is, met een duidelijke uitleg

### Oefening selecteren
- [ ] Tikken op een oefening voegt hem toe aan het template
- [ ] Na selectie navigeert de app terug naar het template-scherm
- [ ] De oefening is direct zichtbaar in de lijst van het template

### Eigen oefening aanmaken
- [ ] "+ Eigen oefening" knop is zichtbaar onderaan de bibliotheek
- [ ] Sheet opent met naam-invoerveld en spiergroep-keuze
- [ ] Opslaan voegt de oefening toe aan Dexie en selecteert hem direct
- [ ] Eigen oefening is ook in volgende sessies zichtbaar in de bibliotheek

## Technisch

- [ ] `tsc --noEmit` geeft geen fouten
- [ ] `vite build` slaagt zonder warnings over ongebruikte imports
- [ ] Dexie versie 5 migratie draait foutloos (bestaande data blijft intact)
- [ ] Offline werkt de bibliotheek volledig (statische data, geen netwerk nodig)

## UX / responsiveness

- [ ] Bibliotheekscherm is bruikbaar op 320 px brede schermen (mobiel)
- [ ] Zoekbalk is direct focusbaar zonder scrollen
- [ ] Terug-knop werkt correct (geen lege pagina of oneindige loop)
- [ ] Spiergroep-badges zijn leesbaar op kleine schermen

## Regressie

- [ ] Bestaand handmatig oefeningen toevoegen in templates werkt nog steeds
- [ ] Bestaande templates en sessies zijn na de Dexie-migratie nog intact
- [ ] Alle andere schermen (Home, Goals, Progress, History) werken ongewijzigd
