# Requirements — Oefeningen bibliotheek (Fase 6)

## Scope

De gebruiker kan bij het aanmaken of bewerken van een template oefeningen kiezen uit een ingebakken bibliotheek van 100 veelgebruikte fitnesssoefeningen, in plaats van alles handmatig in te typen. De bibliotheek is doorzoekbaar en sorteerbaar. De gebruiker kan ook eigen oefeningen aanmaken als een oefening er niet bij staat.

## Context

- **Primair gebruik**: mobiel, in de sportschool — de UX moet snel en eenhandig werken
- **Data leeft lokaal**: geen cloud, geen accounts (zie mission.md)
- **Huidige flow**: in `NewTemplate` en `EditTemplate` typt de gebruiker oefeningen handmatig in een tekstinvoerveld

## Beslissingen

### Opslag
- De 100 standaardoefeningen worden opgeslagen als een **statisch TypeScript-bestand** (`src/data/exercises.ts`) — geen Dexie-migratie, altijd offline beschikbaar
- **Eigen oefeningen** die de gebruiker aanmaakt worden opgeslagen in een **nieuwe Dexie-tabel** `exerciseLibrary`
- De bibliotheek combineert bij het laden: standaardoefeningen + gebruikersoefeningen

### Spiergroepen (7 categorieën)
| Categorie | Voorbeelden |
|-----------|-------------|
| Borst | Bench press, Push-up, Cable fly |
| Rug | Deadlift, Pull-up, Seated row |
| Benen | Squat, Leg press, Lunge, Romanian deadlift |
| Schouders | Overhead press, Lateral raise, Face pull |
| Armen | Bicep curl, Tricep extension, Hammer curl |
| Core | Plank, Crunch, Leg raise, Russian twist |
| Cardio | Treadmill, Rowing machine, Jump rope |

### UX — oefening toevoegen
- Onderaan de oefenlijst in `NewTemplate` en `EditTemplate` staat een **brede "Oefening toevoegen"-balk**
- Tikken navigeert naar een nieuw **bibliotheekscherm** (`/exercise-picker?templateId=x&returnTo=...`)
- Na selectie keert de app terug naar het template-scherm met de oefening automatisch toegevoegd
- De balk vervangt het bestaande losse tekstinvoerveld niet — beide mogen naast elkaar bestaan

### Bibliotheekscherm — 3 weergaven
1. **Alfabetisch** (standaard) — alle oefeningen A–Z
2. **Spiergroep** — oefeningen gegroepeerd per categorie met een sticky sectieheader
3. **Recent** — oefeningen die de gebruiker al eerder heeft gelogd (`sessionExercises` tabel), gesorteerd op meest recent gebruikt; valt leeg als niets gelogd is

### Eigen oefening aanmaken
- Een "+ Eigen oefening" knop onderaan de bibliotheek (of in de zoekresultaten als niets gevonden)
- Minimale invoer: naam + spiergroep kiezen
- Wordt opgeslagen in `exerciseLibrary` tabel in Dexie

## Niet in scope
- Oefeningen verwijderen of bewerken vanuit de bibliotheek
- Oefeningen als favoriet markeren
- Afbeeldingen of animaties bij oefeningen
- Synchronisatie of export van de bibliotheek
