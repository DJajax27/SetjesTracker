# Fase 4 — Design refresh: Requirements

## Doel
De volledige app voorzien van een vernieuwd visueel ontwerp gebaseerd op het referentieontwerp in `/Examples`. Alle schermen krijgen een consistente stijl; het bordeauxrode kleurpalet vervangt het huidige blauw volledig.

## Scope

### In scope
1. **Kleurpalet** — bordeauxrood als nieuwe merkkleur; blauw verdwijnt uit alle design tokens en Tailwind-config
2. **Hero-header op Home** — gradient achtergrond, datum, subtitle en grote paginatitel
3. **Stat-cards** — Streak, Deze week en Totaal berekend uit echte Dexie-data
4. **Training-kaarten redesign** — categorie-badge per template, oefeningen-teller, geschatte duur, nieuw knopstijl
5. **Tab-navigatie restyling** — pill-achtige actieve staat conform referentieontwerp
6. **Alle overige schermen** — Goals, History, Session, GoalNew/Edit, Progress; consistent gebruik van nieuwe tokens

### Buiten scope
- Progressiegrafieken en PR-detectie (Fase 5)
- Nieuwe functionaliteit (alle schermen blijven functioneel equivalent)
- Authenticatie, cloud sync, sociale features (nooit)

## Beslissingen

| Beslissing | Keuze | Reden |
|---|---|---|
| Primaire merkkleur | Bordeauxrood (~`#8B1A1A`) — exact hex vastgesteld tijdens implementatie op basis van het referentieontwerp | Volledig vervangen van blauw; één consistente merkkleur door de hele app |
| Stat-cards data | Echte berekeningen uit Dexie — geen placeholders | Gebruiker ziet direct meerwaarde; berekeningen zijn eenvoudig met de bestaande dataset |
| Streak-definitie | Aaneengesloten dagen met minstens één `completedAt`-sessie | Simpelste definitie die klopt met de bestaande datastructuur |
| Totaal-berekening | Totaal aantal voltooide sessies × gemiddelde sessieduur (geschat op basis van het aantal sets × 2 min) | Exacte tijdmeting wordt niet bijgehouden; schatting is voldoende voor de indicator |
| Template-categorie | Optioneel veld `category?: string` op `WorkoutTemplate`; keuze uit een vaste lijst (KRACHT, VOLUME, CARDIO, MOBILITEIT) | Maakt de badges in de kaarten mogelijk zonder complexe categoriestructuur |
| Geschatte duur per template | Aantal oefeningen × 8 minuten, afgerond naar boven op 5 minuten | Ruwe schatting; goed genoeg voor de UI-indicator |

## Referentieontwerp
Zie `/Examples/Schermafbeelding 2026-07-06 160043.png` voor het referentieontwerp van het Home-scherm.

Zichtbare elementen:
- Datum in kleine hoofdletters boven de paginatitel
- Grote vetgedrukte paginatitel met subtitle
- "+ Nieuw"-knop in bordeauxrood rechtsboven
- Drie stat-cards: 🔥 Streak · 📅 Deze week · ⏱ Totaal
- Trainingslijst met icoon, naam, categorie-badge, metainfo en Start-knop
- Tab-bar met pill-achtige actieve staat in lichtroze
- Motiverende tagline onderaan

## Context
- Doelgroep: de gebruiker zelf + vrienden/familie; geen accounts
- Primair gebruik: mobiel in de sportschool
- Technische referentie: `specs/tech-stack.md`
- Productvisie: `specs/mission.md`
