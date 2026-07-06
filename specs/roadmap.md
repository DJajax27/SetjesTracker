# Roadmap

## ~~Fase 1 — MVP: data opslaan en teruglezen~~ — Afgerond

> Doel: een werkende app waarmee je een training kunt aanmaken en terugzien.

1. ~~Installeer en configureer Dexie.js~~
2. ~~Zet Zustand op met acties voor CRUD op workouts en sets~~
3. ~~Bouw het scherm "Nieuwe training" (naam invoeren + oefeningen toevoegen)~~
4. ~~Bouw het scherm "Training uitvoeren" (sets loggen per oefening: reps + gewicht)~~
5. ~~Bouw het overzichtsscherm met de lijst van afgelopen trainingen~~

---

## ~~Fase 2 — UI polish~~ — Afgerond

> Doel: de app prettig en snel bruikbaar maken op mobiel én desktop.

1. ~~Globale design tokens (kleuren, spacing, typografie) — CSS custom properties + Tailwind `theme.extend`~~
2. ~~Responsive layout~~ — basisresponsiviteit (max-width kolom, body-achtergrond) gerealiseerd in Fase 1
3. ~~Sessie afronden met een "Opslaan"-knop op het sessie-scherm; na opslaan terug naar home~~
4. ~~Sessies verschijnen pas in de geschiedenis na opslaan (`completedAt`-filter op `loadHistory`)~~
5. ~~Sessie verwijderen vanuit de geschiedenis; template verwijderen vanuit het home-scherm~~
6. ~~Inline set verwijderen — delete-knop per set met 44 px raakoppervlak~~
7. ~~Vorige sessie tonen per oefening — hint met reps × gewicht uit de laatste afgeronde sessie~~
8. ~~3-state oefening-kaart (idle → actief → afgerond), bewerkbare sets, instellingen-popup met bottom sheet~~

---

## Fase 3 — Progressie & analytics

> Doel: inzicht geven in verbetering over tijd.

1. Progressiegrafiek per oefening — maximaal gewicht per sessie (lijndiagram)
2. Volumegrafiek per oefening — totaal gewicht per sessie (sets x reps x kg)
3. Persoonlijk record (PR) detectie en highlight in de UI
4. Samenvatting-dashboard: totaal trainingen, favoriete oefeningen, langste streak
5. JSON-export van alle data (voor backup)