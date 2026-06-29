# Tech Stack

## Frontend
- **Framework**: React 18 + Vite
- **Taal**: TypeScript

## Data-opslag
- **IndexedDB** via [Dexie.js](https://dexie.org/) — meer opslagruimte dan localStorage, geschikt voor geneste workout-data
- Schema:
  ```
  templates          — id, name
  exercises          — id, templateId, name, order
  sessions           — id, templateId, date
  sets               — id, sessionId, exerciseId, reps, weight, unit ('kg')
  ```
  - `templates` zijn herbruikbare trainingssjablonen (eenmalig aangemaakt)
  - `sessions` zijn concrete uitvoeringen van een template (één per trainingsdag)
  - `sets` horen bij een sessie én een oefening uit de bijbehorende template

## State Management
- **Zustand** voor UI-state (actieve sessie, formulieren, geladen templates)
- Dexie fungeert als de primaire bron van waarheid; Zustand houdt de in-memory view bij

## Routing
- **React Router v6** — routes: `/`, `/template/new`, `/session/:id`, `/history`

## Grafieken
- **Recharts** — lichtgewicht, React-native, voldoende voor lijn- en bargrafieken

## Styling
- **Tailwind CSS** — utility-first, mobile-first

## Tooling
- Vite voor bundling en dev-server
- ESLint + Prettier voor codekwaliteit
