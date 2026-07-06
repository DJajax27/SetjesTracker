# Fase 4 — Design refresh: Plan

## Taakgroepen

### 1. Kleurpalet & design tokens
1.1 Bepaal de exacte bordeauxrode hexwaarden op basis van het referentieontwerp (`/Examples`)  
1.2 Vervang `--color-accent` en `--color-accent-dark` in `src/index.css` door de nieuwe rode waarden  
1.3 Voeg toe: `--color-accent-light` (lichtroze achtergrond voor badges en actieve tabs)  
1.4 Voeg toe: `--color-hero-from` en `--color-hero-to` voor de gradient op het Home-scherm  
1.5 Werk `tailwind.config.js` bij: vervang de blauwe kleurwaarden in `theme.extend.colors`  
1.6 Controleer alle bestanden op hardcoded blauwe hexwaarden (`#2563eb`, `#1d4ed8`, `#eff6ff`) en vervang ze door de nieuwe tokens  

### 2. Template-categorie
2.1 Voeg optioneel veld `category?: string` toe aan de `WorkoutTemplate` interface in `src/db/db.ts` (geen Dexie-versie-bump nodig)  
2.2 Voeg een categorie-selector toe aan `NewTemplate.tsx` en `EditTemplate.tsx`: vaste keuzes (KRACHT, VOLUME, CARDIO, MOBILITEIT)  
2.3 Sla de categorie op via de bestaande `createTemplate` / `updateTemplate` acties in de store  

### 3. Stat-berekeningen
3.1 Maak `src/utils/stats.ts` met drie exportfuncties:  
&nbsp;&nbsp;&nbsp;&nbsp;- `calcStreak(sessions)` — langste aaneengesloten reeks dagen met minstens één `completedAt`-sessie tot en met vandaag  
&nbsp;&nbsp;&nbsp;&nbsp;- `calcThisWeek(sessions)` — aantal `completedAt`-sessies in de huidige kalenderweek (ma–zo)  
&nbsp;&nbsp;&nbsp;&nbsp;- `calcTotalTime(sessions, sets)` — schatting: totaal sets × 2 minuten, opgemaakt als "Xu Ym"  
3.2 Schrijf Vitest-tests voor alle drie functies in `src/__tests__/stats.test.ts`  

### 4. Home-scherm redesign
4.1 Vervang de bestaande `<Layout>`-wrapper op Home door een schermspecifieke opmaak met hero-header  
4.2 Hero-header: gradient achtergrond (`--color-hero-from` → wit), datum in kleine hoofdletters, grote paginatitel, subtitle  
4.3 Laad sessies en sets in `Home.tsx`; bereken de drie stat-waarden via `src/utils/stats.ts`  
4.4 Render drie stat-cards (Streak / Deze week / Totaal) in een horizontale rij  
4.5 Trainingslijst: voeg icoon, categorie-badge, oefeningen-teller (`x oefeningen`) en geschatte duur toe aan elke kaart  
4.6 Geschatte duur per template: `Math.ceil(exerciseCount * 8 / 5) * 5` minuten, weergegeven als "X min"  
4.7 Start-knop in nieuwe merkkleur; lijst-sectie met "JOUW SCHEMA" koptekst en telling rechts  

### 5. Tab-navigatie restyling
5.1 Update `Footer.css`: actieve tab krijgt een pill-achtige achtergrond (`--color-accent-light`) in plaats van enkel tekstkleur  
5.2 Voeg een motiverende tagline toe onder de tab-bar (configureerbaar als constante)  
5.3 Zorg dat iconen en tekst de merkkleur overnemen bij de actieve staat  

### 6. Overige schermen
6.1 **History** — pas kaarten, knoppen en accenten aan naar de nieuwe tokens  
6.2 **Goals / GoalNew / GoalEdit** — pas knoppen, toggle-switch en badges aan  
6.3 **Progress** — pas de archief-kaarten en sectiekopteksten aan  
6.4 **SessionView / EditSession** — pas set-knoppen, oefening-kaarten en "Opslaan"-knop aan  
6.5 Verwijder alle overblijvende blauwe kleurvermeldingen uit Tailwind-utilities in de JSX (`text-blue-*`, `bg-blue-*`, `ring-blue-*`)  

### 7. Cleanup & validatie
7.1 Voer `npm run test:run` en `npx tsc --noEmit` uit; herstel regressies  
7.2 Handmatige smoke op 320 px en 1280 px: alle schermen visueel controleren  
7.3 Update `CHANGELOG.md` en markeer afgeronde items in `specs/roadmap.md`  
