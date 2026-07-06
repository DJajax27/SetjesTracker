# Fase 2 — UI Polish: Validation

## Acceptatiecriteria

De branch is klaar om te mergen als aan alle onderstaande criteria is voldaan.

### Geautomatiseerd

- [ ] `npm run test:run` slaagt zonder fouten (alle bestaande + nieuwe tests groen)
- [ ] TypeScript-compilatie slaagt zonder fouten (`npx tsc --noEmit`)

### Handmatige smoke — mobiel (320 px)

- [ ] **Design tokens**: merkkleur blauw is zichtbaar op knoppen en actieve nav-items; zwart als tekst; geen kleuronregelmatigheden
- [ ] **Sessie afronden**: "Opslaan"-knop zichtbaar onderaan de sessie-pagina; tikken op de knop slaat de sessie op en navigeert terug naar home
- [ ] **Sessie verwijderen**: verwijderknop zichtbaar bij elk item in de geschiedenis; tikken verwijdert de sessie en de bijbehorende sets uit de lijst
- [ ] **Template verwijderen**: verwijderknop zichtbaar bij elk template op home; tikken verwijdert het template inclusief alle gekoppelde sessies en sets
- [ ] **Set verwijderen**: verwijderknop per set op het sessie-scherm werkt correct en is raakbaar (raakoppervlak ≥ 44 px hoog)

### Handmatige smoke — desktop (1280 px)

- [ ] Alle bovenstaande flows werken ook op desktop
- [ ] Layout toont geen horizontale overflow of gebroken uitlijning
- [ ] Knoppen zijn goed zichtbaar en klikbaar zonder hover-afhankelijkheid

### Regressiecontrole

- [ ] Bestaande schermen (home, nieuwe template, sessie, geschiedenis) zijn niet visueel gebroken
- [ ] Navigatie tussen schermen werkt correct na de wijzigingen aan de Zustand-store

## Definitie van "klaar"
Alle vakjes boven zijn aangevinkt én de branch is samengevoegd in `main`.
