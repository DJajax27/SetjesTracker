# Fase 1 — MVP: Plan

## Taakgroepen

### 1. Project bootstrap
- Verwijder huidige `src/index.ts` placeholder en lege `package.json`
- Draai `npm create vite@latest . -- --template react-ts` in de project-root
- Installeer dependencies: `dexie`, `zustand`, `react-router-dom`
- Installeer Tailwind CSS + initialiseer config
- Verifieer dat `npm run dev` een lege React-app serveert

### 2. Database-laag (Dexie)
- Maak `src/db/db.ts` — initialiseer Dexie-instantie met versie 1
- Definieer vier tabellen: `templates`, `exercises`, `sessions`, `sets`
- Indexen: `exercises.templateId`, `sessions.templateId + date`, `sets.sessionId + exerciseId`
- Exporteer getypte interfaces (`WorkoutTemplate`, `TemplateExercise`, `WorkoutSession`, `WorkoutSet`)

### 3. State management (Zustand)
- Maak `src/store/workoutStore.ts`
- Acties:
  - `loadTemplates` — laad alle templates
  - `createTemplate(name, exerciseNames)` — sla template + oefeningen op
  - `startSession(templateId)` — maak nieuwe sessie aan, retourneer sessionId
  - `loadSession(sessionId)` — laad sessie + template-oefeningen + sets
  - `loadHistory` — laad alle sessies verrijkt met templatenaam
  - `addSet(exerciseId, reps, weight)` — voeg set toe aan actieve sessie
  - `deleteSet(id)` — verwijder set

### 4. Routing
- Stel React Router v6 in in `src/main.tsx`
- Routes: `/` (home/templates), `/template/new`, `/session/:id`, `/history`

### 5. Layout component
Elk onderdeel staat in een eigen bestand onder `src/components/layout/`:
- `Layout.css` — structuur-stijlen (geen Tailwind); geïmporteerd in `Layout.tsx`
- `Header.tsx` — `<header>` element; props: `title`, `subtitle?`, `back?`, `actions?`
- `Footer.tsx` — `<footer>` element; sticky bottom-nav met NavLink naar Home en Geschiedenis
- `Layout.tsx` — combineert `<Header>`, `<main className="layout-main">` en `<Footer>`; importeert `Layout.css`
- Pas alle schermen aan om `<Layout>` te gebruiken in plaats van eigen header/wrapper

### 6. Scherm: Home (`/`)
- Lijst van alle templates
- Per template: naam + "Start"-knop die een nieuwe sessie aanmaakt en navigeert naar `/session/:id`
- Nieuw-template knop in de header

### 7. Scherm: Nieuwe template (`/template/new`)
- Formulier: tekstinvoer voor templatenaam
- Dynamisch oefeningen toevoegen (naam per oefening)
- Opslaan slaat de template + oefeningen op en navigeert terug naar `/`

### 8. Scherm: Sessie uitvoeren (`/session/:id`)
- Laad sessie op basis van URL-param, toon templatenaam + datum
- Per oefening (uit de template): sets loggen (reps + gewicht in kg)
- Geboekte sets zichtbaar onder de oefening; set verwijderen beschikbaar

### 9. Scherm: Geschiedenis (`/history`)
- Lijst van alle sessies gesorteerd op datum (nieuwste eerst)
- Per rij: templatenaam + datum
- Klikken op een rij opent `/session/:id` om de sessie te bekijken