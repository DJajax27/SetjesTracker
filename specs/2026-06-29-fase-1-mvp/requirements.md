# Fase 1 — MVP: Requirements

## Doel
Een werkende app waarmee je een training eenmalig aanmaakt als sjabloon en daarna herhaaldelijk kunt uitvoeren, met progressiebehoud per sessie.  
Na deze fase is de kernloop bruikbaar: template aanmaken → sessie starten → sets loggen → geschiedenis raadplegen.

## Scope

### In scope
1. **Database** — Dexie.js + schema met templates, exercises, sessions, sets
2. **State management** — Zustand store met acties voor templates, sessies en sets
3. **Scherm: Home** — lijst van templates; vanuit hier een sessie starten
4. **Scherm: Nieuwe template** — naam invoeren + oefeningen toevoegen (eenmalig)
5. **Scherm: Sessie uitvoeren** — sets loggen per oefening voor de actieve sessie
6. **Scherm: Geschiedenis** — lijst van alle uitgevoerde sessies met datum en templatenaam

### Buiten scope
- UI polish, animaties, design tokens (→ Fase 2)
- Progressiegrafieken en PR-detectie (→ Fase 3)
- Template bewerken of verwijderen (→ Fase 2)
- Lbs-ondersteuning (unit is voorlopig vast op `kg`)
- Authenticatie, cloud sync, sociale features (niet-doelen per mission)

## Beslissingen

| Beslissing | Keuze | Reden |
|---|---|---|
| Project bootstrap | `npm create vite@latest` scaffold | Snelste weg naar werkende React + TS + Vite setup |
| Schema: template vs. sessie | Aparte tabellen `templates` + `sessions` | Templates zijn herbruikbaar; sessies zijn datumgebonden uitvoeringen |
| Gewichtseenheid | Vast op `kg` in Fase 1 | Scherm eenvoudig houden; `unit` kolom staat klaar voor uitbreiding |
| Data-laag | Dexie als primaire bron van waarheid | Werkt offline, IndexedDB heeft ruim genoeg opslaglimiet |
| UI-state | Zustand naast Dexie | Scheiding tussen persistente data en vluchtige formulier-/sessiestaat |
| Responsive layout | Mobile-first; `max-width: 640px` gecentreerd op `sm`+ | App wordt primair op mobiel gebruikt; op desktop verschijnt de UI als smalle kolom met achtergrond |

## Context
- Doelgroep: de gebruiker zelf + vrienden/familie; geen accounts of gedeelde database
- De app draait volledig in de browser; alle data blijft lokaal
- Technische referentie: zie `specs/tech-stack.md`
- Productvisie: zie `specs/mission.md`