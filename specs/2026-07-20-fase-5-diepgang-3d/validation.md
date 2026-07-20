# Fase 5 — Diepgang & 3D-layout: Validatie

## Succescriteria

### Glassmorphism stat-cards
- [ ] Op het Home-scherm zijn de drie stat-cards semi-transparant: de roze/rode hero-gradiënt schemert zichtbaar erdoorheen
- [ ] De tekst (emoji, label, waarde) is op alle achtergronden leesbaar — minimaal WCAG AA contrast
- [ ] In Firefox zonder `backdrop-filter`-support tonen de cards een witte fallback-achtergrond (geen kapot uiterlijk)
- [ ] Op Safari iOS ziet het glaseffect er vloeiend uit zonder artefacten

### Frosted glass tab-bar
- [ ] De tab-bar is semi-transparant: bij scrollen door een lange lijst is de inhoud subtiel zichtbaar achter de footer
- [ ] De actieve tab-pill (bordeauxrode achtergrond) is nog duidelijk te onderscheiden op de blur-achtergrond
- [ ] De tagline onderaan is nog leesbaar
- [ ] In Firefox zonder support toont de footer een witte achtergrond als fallback

### Diepte-verbeteringen
- [ ] Template-kaarten en doel-kaarten hebben een zachtere, meer gelaagde schaduw dan voorheen
- [ ] BottomSheet pop-ins en slide-ups voelen meer "zwevend" aan door een sterkere schaduw

### Algemeen
- [ ] `npm run test:run` — alle 57 tests groen
- [ ] `npx tsc --noEmit` — geen TypeScript-fouten
- [ ] Geen zichtbare layout-shift of jank op een middelmatig Android-apparaat (of Chrome DevTools throttling)
- [ ] Alle schermen zien er consistent uit op 320 px, 640 px en 1280 px

## Merge-criterium
Alle bovenstaande punten zijn afgevinkt én er zijn geen visuele regressies op de schermen die buiten de primaire scope vallen (NewTemplate, EditTemplate, SessionView, GoalNew, GoalEdit).
