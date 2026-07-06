# Fase 2 — UI Polish: Requirements

## Doel
De app prettig en snel bruikbaar maken op mobiel én desktop door visuele consistentie, afgeronde flows en snelle interacties toe te voegen.

## Scope

### In scope
1. **Design tokens** — globale CSS-variabelen en Tailwind-thema-uitbreiding voor merkkleur (zwart + blauw), spacing en typografie
2. **Sessie afronden** — expliciete "Opslaan"-knop op het sessie-scherm; na opslaan navigeert de app terug naar home
3. **Verwijderacties** — sessie verwijderen vanuit de geschiedenis; template verwijderen vanuit het home-scherm
4. **Inline set-bewerking** — verwijderknop per set op het sessie-scherm (optimistische UI, direct zichtbaar)

### Buiten scope
- Lege-staat illustraties en loading-skeletons (uitgesteld naar een latere iteratie)
- Progressiegrafieken en PR-detectie (Fase 3)
- Authenticatie, cloud sync, sociale features (niet-doelen per mission)

## Beslissingen

| Beslissing | Keuze | Reden |
|---|---|---|
| Design tokens format | CSS custom properties (`--color-primary`, etc.) + Tailwind `theme.extend` | CSS vars werken in Tailwind én in plain CSS; één bron van waarheid |
| Merkkleur blauw | `#2563EB` (Tailwind `blue-600`) als primaire accentkleur | Al gebruikt in huidige codebase; bestaande code hoeft niet te worden overschreven |
| Merkkleur zwart | `#000000` als primaire tekstkleur / achtergrondaccent | Expliciete merkkleur zoals opgegeven |
| Sessie opslaan | Knop markeert sessie als afgerond in Dexie (`sessions.completedAt`); navigeert naar `/` | Eenvoudig schema-uitbreidbaar; flow is duidelijk voor de gebruiker |
| Verwijderen UX | Directe delete zonder dialoogvenster, wel een visuele confirmatie-interactie (rode kleur, korte dwell) | Onnodige modale dialogen vertragen de flow op mobiel |
| Inline set-delete | Verwijderknop rechts naast elke set-rij; geen swipe (swipe heeft geen native ondersteuning in HTML) | Simpeler te implementeren, werkt op alle browsers |

## Context
- Doelgroep: de gebruiker zelf + vrienden/familie; geen accounts of gedeelde database
- Primair gebruik: mobiel in de sportschool — interacties moeten werken met één hand
- Merkkleur zwart en blauw (vastgelegd door de eigenaar)
- Technische referentie: `specs/tech-stack.md`
- Productvisie: `specs/mission.md`
