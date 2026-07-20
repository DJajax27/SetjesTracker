# Fase 5 — Diepgang & 3D-layout: Requirements

## Doel
De app visueel meer diepte en karakter geven via subtiele glassmorphism- en blur-effecten, zodat de UI "gelaagd" aanvoelt zonder drukker of zwaarder te worden.

## Gekozen effecten
| Effect | Omschrijving |
|---|---|
| Glassmorphism stat-cards | De drie stat-cards op Home krijgen een semi-transparante achtergrond met `backdrop-filter: blur` zodat de hero-gradient erdoorheen schemert |
| Frosted glass tab-bar | De footer-tab-bar krijgt `backdrop-filter: blur` en een semi-transparante achtergrond zodat de paginainhoud er subtiel onderdoorheen zichtbaar is |

## Intensiteit
**Subtiel & strak** — kleine blur-waarden (8–16 px), lage opacity (0.6–0.8), zodat het professioneel blijft en het bordeauxrode kleurpalet niet verdrinkt.

## Scope
- Alle schermen mogen worden aangepast indien een verbetering logisch is
- Primaire focus: Home (stat-cards) en de globale Footer
- Geen nieuwe npm-afhankelijkheden — puur CSS (`backdrop-filter`, `background: rgba(...)`)

## Technische randvoorwaarden
- `backdrop-filter` werkt niet op Firefox zonder feature-flag; fallback = witte/licht-grijze achtergrond (graceful degradation)
- De blur-laag mag geen merkbare layout-shift of jank veroorzaken op middelmatige Android-hardware
- Glassmorphism-effect op de stat-cards vereist dat het parent-element (hero) een zichtbare achtergrond heeft — de bestaande radiale gradiënt in `Home.css` voldoet hieraan
- `backdrop-filter` op de footer vereist dat de footer `position: sticky` behoudt én dat er geen `overflow: hidden` op het parent-element staat

## Niet in scope
- Parallax-scrolling
- Perspectief-kanteling (CSS `perspective` / `rotateX`)
- Indruk-animaties op knoppen (bewust uitgesteld)
- Nieuwe kleur- of typografieveranderingen
