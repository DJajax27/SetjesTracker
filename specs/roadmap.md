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

## ~~Fase 3 — Navigatie & Doelen~~ — Afgerond

> Doel: drie hoofdschermen (Home, Doelen, Progressie) via een bottom tab-bar, en een volledig doelensysteem met reminders.

1. ~~Bottom tab-navigatie — Home, Doelen, Progressie als vaste tabs onderaan~~
2. ~~Doelen aanmaken — naam, beschrijving, tijdsframe (einddatum of dagelijks herhalend)~~
3. ~~Dagelijks afvinken — goal markeren als behaald voor vandaag~~
4. ~~Reminders — Web Notifications (permissie + service worker) voor dagelijkse doelen~~

---

## ~~Fase 4 — Design refresh~~ — Afgerond

> Doel: de volledige app voorzien van een vernieuwd visueel ontwerp — bordeauxrood kleurpalet, hero-header op Home, stat-cards met echte data, en een consistente stijl op alle schermen.

1. ~~Nieuw kleurpalet — bordeauxrood vervangt blauw in alle design tokens en Tailwind-config~~
2. ~~Hero-header op Home — gradient achtergrond, datum, subtitle en grote paginatitel~~
3. ~~Stat-cards — Streak, Deze week en Totaal berekend uit Dexie-data~~
4. ~~Training-kaarten redesign — categorie-badge, oefeningen-teller, geschatte duur en Start-knop~~
5. ~~Tab-navigatie restyling — pill-achtige actieve staat, iconen en merkkleur~~
6. ~~Alle overige schermen — Goals, History, Session, GoalNew/Edit, Progress consistent bijgewerkt~~

---

## ~~Fase 5 — Diepgang & 3D-layout~~ — Afgerond

> Doel: de app visueel meer diepte en karakter geven via subtiele 3D-effecten, schaduwlagen en spatiale hiërarchie — zodat kaarten, knoppen en panelen "zweven" in plaats van flat te zijn.

1. ~~Kaartschaduwen — meerdere schaduwniveaus (ambient + directional) voor een realistisch zweefeffect op template- en doel-kaarten~~
2. ~~Hero-diepte — parallax of lichte perspectief-kanteling op de hero-header bij scrollen~~
3. ~~Interactieve 3D-druk — knoppen en kaarten reageren met een subtiele indruk-animatie (scale + shadow-vermindering) bij aanraken~~
4. ~~Zwevende tab-bar — verhoogde footer met blur-achtergrond (backdrop-filter) en sterkere schaduw omhoog~~
5. ~~Modale diepte — bottom sheets en pop-ups krijgen een diepere schaduw en lichte schaalverkleining van de achtergrond bij openen~~
6. ~~Glassmorphism accenten — semi-transparante achtergronden met blur op de stat-cards of hero-overlay~~

---

## ~~Fase 6 — Oefeningen bibliotheek~~ — Afgerond

> Doel: oefeningen onthouden en snel terugvinden via een doorzoekbare bibliotheek, zodat je niet elke keer opnieuw hoeft te typen.

1. ~~Oefeningen-database — 100 meest gebruikte fitnesssoefeningen ingebakken in de app, elk met naam en spiergroep~~
2. ~~Brede "Oefening toevoegen"-balk — prominente knop onderaan het template-bewerkscherm die naar de bibliotheek navigeert~~
3. ~~Bibliotheekscherm — volledige lijst met oefeningen, bovenin een zoekbalk voor direct filteren op naam~~
4. ~~Sortering: Alfabetisch — standaardweergave A–Z~~
5. ~~Sortering: Spiergroep — oefeningen gegroepeerd per body part (borst, rug, benen, schouders, armen, core, cardio)~~
6. ~~Sortering: Recent — oefeningen die de gebruiker al eerder heeft gelogd, gesorteerd op meest recent gebruikt~~
7. ~~Oefening selecteren — tikt de gebruiker een oefening aan, dan wordt hij direct toegevoegd aan het template en keert de app terug~~
8. ~~Eigen oefeningen — gebruiker kan een nieuwe oefening aanmaken vanuit de bibliotheek als hij er niet tussen staat~~

---

## ~~Fase 7 — User accounts met Supabase~~ — Afgerond

> Doel: gebruikers kunnen een account aanmaken zodat data in de cloud opgeslagen wordt en op meerdere apparaten beschikbaar is.

1. ~~Supabase project opzetten — Auth + database schema inrichten~~
2. ~~Registreren & inloggen — e-mail/wachtwoord authenticatie via Supabase Auth~~
3. ~~Sessie-beheer — ingelogde staat bewaren, automatisch uitloggen bij sessie-verloop~~
4. ~~Data-migratie — bestaande lokale Dexie.js data uploaden naar Supabase Postgres bij eerste login~~
5. ~~Realtime sync — trainingen, templates en doelen opslaan in Supabase in plaats van alleen lokaal~~
6. ~~Offline-first fallback — lokale Dexie.js cache behouden; sync zodra er verbinding is~~
7. ~~Accountpagina — ingelogde gebruiker tonen, uitloggen, accountverwijdering~~
8. ~~Row-level security — elke gebruiker ziet alleen zijn eigen data (Supabase RLS policies)~~

---

## Fase 8 — Progressie & analytics

> Doel: inzicht geven in verbetering over tijd via grafieken en statistieken.

1. Training- en oefeningselector — kies een template en vervolgens een oefening
2. Grafiek 1: geschatte 1RM per sessie — 1RM = gewicht × (1 + herhalingen / 30), lijndiagram
3. Grafiek 2: trainingsvolume per sessie — totaal gewicht (sets × reps × kg), staafdiagram
4. Grafiek 3: scatterplot gewicht vs. herhalingen — visueel overzicht van alle gelogde sets
5. Progressiegrafiek per oefening — maximaal gewicht per sessie (lijndiagram)
6. Volumegrafiek per oefening — totaal gewicht per sessie (sets x reps x kg)
7. Persoonlijk record (PR) detectie en highlight in de UI
8. Samenvatting-dashboard: totaal trainingen, favoriete oefeningen, langste streak
9. JSON-export van alle data (voor backup)