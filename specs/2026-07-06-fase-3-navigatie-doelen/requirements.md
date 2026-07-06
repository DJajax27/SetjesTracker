# Fase 3 — Navigatie & Doelen: Requirements

## Doel
Drie hoofdschermen bereikbaar via een vaste bottom tab-bar, plus een volledig doelensysteem met dagelijks afvinken en reminders via Web Notifications.

## Scope

### In scope
1. **Bottom tab-bar** — Home, Doelen, Progressie als vaste navigatie onderaan het scherm
2. **Doelen aanmaken** — naam, beschrijving, type: deadline (einddatum) of dagelijks herhalend
3. **Dagelijks afvinken** — een herhalend doel markeren als behaald voor vandaag
4. **Reminders** — Web Notifications permissie + service worker voor dagelijkse herhalende doelen

### Buiten scope
- Progressiegrafieken en analytics (Fase 4)
- Bewerken van bestaande doelen (post-MVP iteratie)
- Authenticatie, cloud sync, sociale features (niet-doelen per mission)

## Beslissingen

| Beslissing | Keuze | Reden |
|---|---|---|
| Doelen-datamodel | Enkelvoudige `goals`-tabel in Dexie; `completedDates` als JSON-array | Eenvoudig schema zonder join-queries; voldoende voor dagelijkse check-offs |
| Goal-type veld | `'deadline' \| 'recurring'` discriminator | Twee duidelijk verschillende flows; geen overlap in UI-logica |
| Reminders scope | In scope — Web Notifications + service worker | Roadmap item 4 expliciet in deze fase; afstel vergroot de gap naar volgende fase |
| Navigatiestructuur | Tab-bar wraps de router; actieve tab volgt `useLocation()` | Geen aparte routing-laag nodig; React Router v6 al aanwezig |
| Progressie-tab | Placeholder-scherm in deze fase | Tab-bar moet compleet zijn; inhoud volgt in Fase 4 |
| Reminder-trigger | Bij app-start (indien permissie `'granted'`) | Background Sync API heeft beperkte browserondersteuning; self-post message is universeler |
| Permissie-mislukking | Stille mislukking — geen blokkade voor de rest van de flow | Reminder is een nice-to-have; app moet bruikbaar blijven zonder permissie |

## Datamodel

Nieuwe `goals`-tabel (Dexie-versienummer ophogen):

```
goals
  id             — auto-increment (number)
  name           — string
  description    — string
  type           — 'deadline' | 'recurring'
  targetDate     — Date | undefined  (alleen bij type 'deadline')
  completedDates — Date[]            (check-offs voor herhalende doelen; dag-granulariteit)
```

## Context
- Doelgroep: de gebruiker zelf + vrienden/familie; geen accounts of gedeelde database
- Primair gebruik: mobiel in de sportschool — interacties moeten werken met één hand
- Merkkleur zwart en blauw (vastgelegd in Fase 2 design tokens)
- Technische referentie: `specs/tech-stack.md`
- Productvisie: `specs/mission.md`
