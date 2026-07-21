# Plan — Oefeningen bibliotheek (Fase 6)

## Taakgroep 1 — Statische oefeningen data

1.1 Maak `src/data/exercises.ts` aan met de 100 standaardoefeningen  
  - Interface: `{ id: string; name: string; muscleGroup: MuscleGroup }`  
  - Type `MuscleGroup`: `'Borst' | 'Rug' | 'Benen' | 'Schouders' | 'Armen' | 'Core' | 'Cardio'`  
  - Minimaal ~14 oefeningen per grote groep, ~7 voor Cardio en Core

---

## Taakgroep 2 — Dexie schema uitbreiden

2.1 Voeg `exerciseLibrary` toe aan `src/db/db.ts`  
  - Interface: `ExerciseLibraryItem { id?: number; name: string; muscleGroup: string; createdAt: string }`  
  - Dexie versie bump naar v5: `.version(5).stores({ exerciseLibrary: '++id, muscleGroup' })`

---

## Taakgroep 3 — Store

3.1 Maak `src/store/exerciseLibraryStore.ts` (Zustand)  
  - State: `customExercises: ExerciseLibraryItem[]`  
  - Acties: `loadCustomExercises()`, `addCustomExercise(name, muscleGroup)`  
  - Selector: `allExercises()` — combineert statische data + Dexie

---

## Taakgroep 4 — Route toevoegen

4.1 Voeg route toe in `src/main.tsx` (of `App.tsx`): `/exercise-picker`  
4.2 Accepteer query params: `templateId` en `returnTo` (`/template/new` of `/template/:id/edit`)

---

## Taakgroep 5 — Bibliotheekscherm `ExercisePicker.tsx`

5.1 Paginalayout: volledige pagina (geen Layout wrapper), ArrowLeft terug-knop, `bg-gray-50`  
5.2 Zoekbalk bovenin — filtert real-time op naam (case-insensitive)  
5.3 Drie tabs: **Alfabetisch** · **Spiergroep** · **Recent**  
5.4 **Alfabetisch**: gesorteerde platte lijst, `divide-y divide-border`  
5.5 **Spiergroep**: gegroepeerde lijst met sticky categorie-headers per spiergroep  
5.6 **Recent**: haalt eerder gebruikte namen op uit `sessionExercises` tabel, sorteert op meest recent; lege staat als niets gelogd  
5.7 Oefening-rij: naam + spiergroep-badge, tik → voegt toe en navigeert terug  
5.8 Lege zoekstaat: "Geen resultaten" + zichtbare "+ Eigen oefening" aanmaakknop

---

## Taakgroep 6 — Eigen oefening aanmaken

6.1 "+ Eigen oefening" knop onderaan de lijst (altijd zichtbaar, niet alleen bij lege zoekresultaten)  
6.2 Opent een BottomSheet met: naam-invoerveld + spiergroep-selector (dropdown of pills)  
6.3 Opslaan via `addCustomExercise()` → oefening verschijnt direct in de lijst en wordt geselecteerd

---

## Taakgroep 7 — Brede toevoegbalk in templates

7.1 Voeg in `NewTemplate.tsx` onderaan de oefenlijst een brede knop toe:  
  `"+ Oefening toevoegen"` — `rounded-xl border border-border w-full py-3 text-sm font-medium`  
7.2 Zelfde wijziging in `EditTemplate.tsx`  
7.3 Bestaand handmatig invoerveld blijft behouden (onder de brede balk als fallback)

---

## Taakgroep 8 — Terugnavigatie met geselecteerde oefening

8.1 Na selectie: roep de bestaande `addExercise(templateId, name)` actie aan via de workoutStore  
8.2 Navigeer terug naar `returnTo` param  
8.3 Template-scherm toont de nieuw toegevoegde oefening direct in de lijst
