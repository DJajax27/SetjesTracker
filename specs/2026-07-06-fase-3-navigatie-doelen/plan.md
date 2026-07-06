# Fase 3 — Navigatie & Doelen: Plan

## Taakgroepen

### 1. Dexie schema-migratie
1.1 Verhoog het database-versienummer in `src/db/db.ts` (versie 3 → 4)  
1.2 Voeg de `goals`-tabel toe met velden `name`, `description`, `type`, `targetDate`, `completedDates`  
1.3 Definieer en exporteer getypte interface `Goal` vanuit `src/db/db.ts`  
1.4 Update `src/__tests__/db.test.ts`: verwachte tabel-lijst en versienummer bijwerken  

### 2. Zustand goals-store
2.1 Maak `src/store/goalsStore.ts` met acties: `loadGoals`, `createGoal`, `updateGoal`, `removeGoal`, `toggleGoalToday`  
2.2 `toggleGoalToday` schakelt de datum van vandaag in `completedDates` aan en uit (toggle, geen duplicaten)  
2.3 Exporteer hulpfunctie `isCompletedToday(goal)` voor UI-conditionering  
2.4 Schrijf Vitest-tests in `src/__tests__/goalsStore.test.ts` voor alle acties en `isCompletedToday`  

### 3. Layout-shell & tab-navigatie
3.1 De layout-shell bestaat uit drie afzonderlijke componentbestanden onder `src/components/layout/`:  
&nbsp;&nbsp;&nbsp;&nbsp;- `Header.tsx` — sticky topbalk met titel, optionele terugknop en acties-slot  
&nbsp;&nbsp;&nbsp;&nbsp;- `Footer.tsx` — vaste tab-navigatie onderaan  
&nbsp;&nbsp;&nbsp;&nbsp;- `Layout.tsx` — shell-wrapper die `<Header>`, `<main>` en `<Footer>` samenstelt  
3.2 Elke component importeert zijn eigen CSS-bestand (co-located):  
&nbsp;&nbsp;&nbsp;&nbsp;- `Header.css` → geïmporteerd in `Header.tsx`  
&nbsp;&nbsp;&nbsp;&nbsp;- `Footer.css` → geïmporteerd in `Footer.tsx`  
&nbsp;&nbsp;&nbsp;&nbsp;- `Layout.css` → geïmporteerd in `Layout.tsx` (alleen shell: `.layout`, `.layout-main`)  
3.3 Update `Footer.tsx` tot een drie-tab-navigatie (Home / Doelen / Progressie) met SVG-iconen per tab  
3.4 Actieve tab bepaald via `useLocation()` op pathname-prefix (geen NavLink `end`-prop nodig voor Doelen/Progressie)  
3.5 Minimaal 44 px raakoppervlak per tab; `safe-area-inset-bottom` voor notch-apparaten  

### 4. Progressie-route (placeholder)
4.1 Voeg route `/progress` toe in `App.tsx`  
4.2 Maak `src/pages/Progress.tsx`: placeholder-tekst boven + Archief-sectie hieronder  
4.3 Archief toont deadline-doelen met ten minste één `completedDate`, gefilterd uit de goals-store  

### 5. Doelen-lijstscherm (`/goals`)
5.1 Voeg route `/goals` toe  
5.2 Maak `src/pages/Goals.tsx`: laad goals uit de store; filter weg: deadline-doelen met `completedDates.length > 0`  
5.3 Sorteer: niet-afgevinkte doelen boven, afgevinkte doelen (today) onderaan met `opacity-60` en doorhaling  
5.4 Elke rij: checkbox-icoon (leeg kader → blauw vinkje) voor alle doelen, settings-knop (drie puntjes) rechts  
5.5 Lege staat: tekst + call-to-action knop "Nieuw doel"  

### 6. Doel aanmaken (`/goals/new`)
6.1 Voeg route `/goals/new` toe  
6.2 Maak `src/pages/GoalNew.tsx`: naam (verplicht), beschrijving (optioneel), type-radio (herhalend / deadline)  
6.3 Bij type "deadline": datumkiezer voor `targetDate`  
6.4 Bij aanmaken herhalend doel: vraag notificatiepermissie via `requestNotificationPermission()`  
6.5 Opslaan → `createGoal`, navigate naar `/goals`; annuleren → terug zonder opslaan  

### 7. Doel bewerken (`/goals/:id/edit`)
7.1 Voeg route `/goals/:id/edit` toe  
7.2 Maak `src/pages/GoalEdit.tsx`: laad doel uit Dexie op basis van URL-param, pre-vul het formulier  
7.3 Opslaan → `updateGoal`, navigate naar `/goals`  

### 8. Afvinken & instellingen
8.1 Checkbox-knop roept `toggleGoalToday` aan — toggle in beide richtingen (uitvinken ook mogelijk)  
8.2 Alle doelen (herhalend én deadline) kunnen worden afgevinkt; deadline-doelen verdwijnen bij afvinken naar het Archief  
8.3 Settings-knop opent een `BottomSheet` met opties: "Doel wijzigen" (→ `/goals/:id/edit`) en "Doel verwijderen" (met bevestigingsstap)  

### 9. Web Notifications & service worker
9.1 Maak `src/services/notificationService.ts`: `registerServiceWorker`, `requestNotificationPermission`, `scheduleReminders`  
9.2 Maak `public/sw.js`: luistert op `schedule-reminders` message, toont een notificatie per open herhalend doel  
9.3 `App.tsx` registreert de SW bij app-start en stuurt, bij permissie `'granted'`, de open herhalende doelen als bericht  
9.4 Stille mislukking bij ontbrekende permissie of browserondersteuning  

### 10. Integratie & cleanup
10.1 Alle nieuwe routes in `App.tsx`: `/goals`, `/goals/new`, `/goals/:id/edit`, `/progress`  
10.2 Home-header krijgt een klok-icoon knop als snelkoppeling naar `/history` (Geschiedenis tab vervalt uit de navigatie)  
10.3 Voer `npm run test:run` en `npx tsc --noEmit` uit; herstel eventuele regressies  
10.4 Update `CHANGELOG.md` en markeer afgeronde items in `specs/roadmap.md`  
