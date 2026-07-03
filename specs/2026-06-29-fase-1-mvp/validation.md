# Fase 1 — MVP: Validation

## Slagingscriterium
Fase 1 is klaar om te mergen wanneer de volledige handmatige walkthrough hieronder slaagt zonder fouten in de browser-console.

## Handmatige walkthrough

### Stap 1 — Template aanmaken
1. Open de app (`/`)
2. Klik op "+ Nieuw" en ga naar de nieuwe-template pagina
3. Voer een naam in, bijv. "Rug & Biceps"
4. Voeg twee oefeningen toe: "Deadlift" en "Barbell curl"
5. Sla op → app navigeert terug naar home

**Verwacht:** "Rug & Biceps" staat in de templatelijst met een "Start"-knop.

### Stap 2 — Sessie starten en sets loggen
1. Klik op "Start" bij "Rug & Biceps"
2. App navigeert naar `/session/:id` met de juiste datum
3. Voeg bij "Deadlift" drie sets toe: bijv. 5×100 kg, 5×105 kg, 3×110 kg
4. Voeg bij "Barbell curl" twee sets toe: bijv. 10×30 kg, 8×32 kg
5. Verwijder één set om te verifiëren dat verwijderen werkt

**Verwacht:** sets verschijnen direct onder de oefening; verwijderde set verdwijnt.

### Stap 3 — Persistentie controleren
1. Herlaad de pagina (`F5` of hard refresh)
2. Controleer dat alle resterende sets nog aanwezig zijn

**Verwacht:** data overleeft een page refresh; Dexie heeft alles opgeslagen.

### Stap 4 — Tweede sessie van dezelfde template
1. Ga terug naar home (`/`)
2. Klik opnieuw op "Start" bij "Rug & Biceps"
3. Log andere sets (bijv. licht hogere gewichten)

**Verwacht:** nieuwe sessie aangemaakt; de vorige sessie staat ongewijzigd in de geschiedenis.

### Stap 5 — Tweede template aanmaken en geschiedenis controleren
1. Maak een tweede template aan, bijv. "Push day" met "Bench press" en "Overhead press"
2. Start een sessie en log enkele sets
3. Ga naar `/history`

**Verwacht:** drie sessies in de lijst (twee "Rug & Biceps", één "Push day"), gesorteerd nieuwste bovenaan.

## Geautomatiseerde tests
Draai `npm run test:run` — alle tests moeten slagen voor merge:

| Test | Wat wordt gevalideerd |
|---|---|
| `createTemplate` — persists template and exercises | Template + oefeningen worden opgeslagen in Dexie |
| `startSession + loadSession` — creates session | Sessie gekoppeld aan template, oefeningen geladen |
| `startSession + loadSession` — keeps sessions independent | Tweede sessie start leeg, andere sessie ongewijzigd |
| `addSet` — stores set in database | Set opgeslagen in Zustand én Dexie |
| `deleteSet` — removes from store and database | Set verdwijnt uit beide |
| `loadHistory` — newest first with template name | Geschiedenis gesorteerd, templatenaam verrijkt |

## Handmatige walkthrough

### Stap 1 — Template aanmaken
1. Open de app (`/`)
2. Klik op "+ Nieuw" en ga naar de nieuwe-template pagina
3. Voer een naam in, bijv. "Rug & Biceps"
4. Voeg twee oefeningen toe: "Deadlift" en "Barbell curl"
5. Sla op → app navigeert terug naar home

**Verwacht:** "Rug & Biceps" staat in de templatelijst met een "Start"-knop.

### Stap 2 — Sessie starten en sets loggen
1. Klik op "Start" bij "Rug & Biceps"
2. App navigeert naar `/session/:id` met de juiste datum
3. Voeg bij "Deadlift" drie sets toe: bijv. 5×100 kg, 5×105 kg, 3×110 kg
4. Voeg bij "Barbell curl" twee sets toe: bijv. 10×30 kg, 8×32 kg
5. Verwijder één set om te verifiëren dat verwijderen werkt

**Verwacht:** sets verschijnen direct onder de oefening; verwijderde set verdwijnt.

### Stap 3 — Persistentie controleren
1. Herlaad de pagina (`F5` of hard refresh)
2. Controleer dat alle resterende sets nog aanwezig zijn

**Verwacht:** data overleeft een page refresh; Dexie heeft alles opgeslagen.

### Stap 4 — Tweede sessie van dezelfde template
1. Ga terug naar home (`/`)
2. Klik opnieuw op "Start" bij "Rug & Biceps"
3. Log andere sets (bijv. licht hogere gewichten)

**Verwacht:** nieuwe sessie aangemaakt; de vorige sessie staat ongewijzigd in de geschiedenis.

### Stap 5 — Tweede template aanmaken en geschiedenis controleren
1. Maak een tweede template aan, bijv. "Push day" met "Bench press" en "Overhead press"
2. Start een sessie en log enkele sets
3. Ga naar `/history`

**Verwacht:** drie sessies in de lijst (twee "Rug & Biceps", één "Push day"), gesorteerd nieuwste bovenaan.

## Responsive design checks
Controleer op zowel een smal (≤390 px, bijv. iPhone) als een breed scherm (≥1280 px, bijv. laptop):

- [ ] Op mobiel: layout vult het volledige scherm; header en footer zijn zichtbaar; formulieren zijn bruikbaar met touch
- [ ] Op desktop: content gecentreerd in een kolom van max. 640 px; achtergrond buiten de kolom heeft een andere kleur; geen horizontale scroll
- [ ] Tekst, knoppen en invoervelden schalen correct mee op beide formaten

## Technische checks
- [ ] `npm run test:run` slaagt — alle 6 Vitest tests groen
- [ ] `npm run build` slaagt zonder TypeScript-fouten
- [ ] Geen `console.error` of uncaught exceptions tijdens de walkthrough
- [ ] Vier Dexie-tabellen zichtbaar in DevTools → Application → IndexedDB: `templates`, `exercises`, `sessions`, `sets`