# Roadmap

## ~~Fase 1 — MVP: data opslaan en teruglezen~~ — Afgerond

> Doel: een werkende app waarmee je een training kunt aanmaken en terugzien.

1. ~~Installeer en configureer Dexie.js~~
2. ~~Zet Zustand op met acties voor CRUD op workouts en sets~~
3. ~~Bouw het scherm "Nieuwe training" (naam invoeren + oefeningen toevoegen)~~
4. ~~Bouw het scherm "Training uitvoeren" (sets loggen per oefening: reps + gewicht)~~
5. ~~Bouw het overzichtsscherm met de lijst van afgelopen trainingen~~

---

## Fase 2 — UI polish
> Doel: de app prettig en snel bruikbaar maken op mobiel.

1. Tailwind CSS installeren + globale design tokens (kleuren, spacing, typografie)
2. Responsive layout met bottom-navigation voor de drie hoofdschermen
3. Detailpagina per training (bekijk/bewerk/verwijder een afgelopen training)
4. Inline bewerken van sets (swipe-to-delete of edit-knop)
5. Lege-staat illustraties en loading-skeletons

---

## Fase 3 — Progressie & analytics
> Doel: inzicht geven in verbetering over tijd.

1. Progressiegrafiek per oefening — maximaal gewicht per sessie (lijndiagram)
2. Volumegrafiek per oefening — totaal gewicht per sessie (sets × reps × kg)
3. Persoonlijk record (PR) detectie en highlight in de UI
4. Samenvatting-dashboard: totaal trainingen, favoriete oefeningen, langste streak
5. JSON-export van alle data (voor backup)
