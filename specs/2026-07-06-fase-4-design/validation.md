# Fase 4 — Design refresh: Validation

## Acceptatiecriteria

De branch is klaar om te mergen als aan alle onderstaande criteria is voldaan.

### Geautomatiseerd

- [ ] `npm run test:run` slaagt zonder fouten (inclusief nieuwe tests in `stats.test.ts`)
- [ ] TypeScript-compilatie slaagt zonder fouten (`npx tsc --noEmit`)
- [ ] Geen hardcoded blauwe hexwaarden (`#2563eb`, `#1d4ed8`, `#eff6ff`) in de broncode (`grep -r "#2563eb" src`)

### Handmatige smoke — mobiel (320 px)

**Kleurpalet**
- [ ] Alle knoppen, iconen en accenten zijn bordeauxrood — geen blauw zichtbaar op enig scherm
- [ ] Badges, actieve tab en lichte accentvlakken gebruiken de lichtroze tint

**Home-scherm**
- [ ] Hero-header toont gradient achtergrond, datum, titel en subtitle
- [ ] Drie stat-cards tonen correcte waarden (Streak in dagen, Deze week als getal, Totaal als "Xu Ym")
- [ ] Trainingskaarten tonen icoon, categorie-badge (indien ingesteld), oefeningen-teller en geschatte duur
- [ ] "+ Nieuw"-knop en Start-knoppen zijn gestijld in de nieuwe merkkleur

**Tab-navigatie**
- [ ] Actieve tab heeft een pill-achtige lichtroze achtergrond
- [ ] Tagline is zichtbaar onder de tab-bar

**Overige schermen**
- [ ] Goals-scherm: knoppen en checkboxen gebruiken bordeauxrood
- [ ] History-scherm: kaarten en accenten zijn bijgewerkt
- [ ] Session-scherm: set-knoppen en "Opslaan"-knop zijn bijgewerkt
- [ ] Progress-scherm: archief-kaarten zijn bijgewerkt

### Handmatige smoke — desktop (1280 px)

- [ ] Alle bovenstaande punten gelden ook op desktop
- [ ] Geen horizontale overflow of gebroken uitlijning op enig scherm

### Regressiecontrole

- [ ] Training aanmaken, sessie uitvoeren en opslaan werkt nog
- [ ] Doelen aanmaken, afvinken en bewerken werkt nog
- [ ] Stat-waarden kloppen: Streak stijgt na een voltooide sessie, Totaal stijgt bij meer sets

## Definitie van "klaar"
Alle vakjes boven zijn aangevinkt én de branch is samengevoegd in `main`.
