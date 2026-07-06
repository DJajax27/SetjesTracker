# Changelog

## 2026-07-06 — Fase 4: Design refresh
- Vervang blauw kleurpalet door bordeauxrood (#8B1E1E) in alle design tokens
- Voeg `accent-light` (#FFE4E6) toe voor badges en actieve tab
- Home-scherm volledig herontworpen: hero-header met gradient, datum en subtitle
- Stat-cards: Streak, Deze week, Totaal berekend uit echte Dexie-data
- Training-kaarten: categorie-badge, oefeningen-teller, geschatte duur, pill Start-knop
- Template-categorie veld toegevoegd (KRACHT/VOLUME/CARDIO/MOBILITEIT) in aanmaak- en bewerkformulier
- Tab-navigatie: pill actieve staat en motiverende tagline toegevoegd
- Stats-utils: `calcStreak`, `calcThisWeek`, `calcTotalTime` + 16 Vitest-tests
- Hardcoded blauwe klassen verwijderd uit alle schermen

## 2026-07-03
- Ensure mobile-first responsive

## 2026-06-29
- Add Vitest setup and test
- Fase 1 MVP: template/sessie architectuur, layout component, Dexie v2 schema