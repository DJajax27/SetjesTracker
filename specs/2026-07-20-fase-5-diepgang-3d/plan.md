# Fase 5 — Diepgang & 3D-layout: Plan

## Taakgroepen

### 1. Glassmorphism stat-cards
1.1 Verwijder de huidige `bg-white` achtergrond van de drie stat-cards in `Home.tsx`  
1.2 Vervang door `background: rgba(255, 255, 255, 0.55)` + `backdrop-filter: blur(12px)` via een CSS-klasse in `Home.css`  
1.3 Voeg een subtiele witte rand toe (`border: 1px solid rgba(255,255,255,0.7)`) voor glasdiepte  
1.4 Pas de tekst aan zodat leesbaarheid op de gradiëntachtergrond gewaarborgd blijft (contrast check)  
1.5 Test op Safari (iOS/macOS) — `backdrop-filter` is daar standaard ondersteund  
1.6 Voeg Firefox-fallback toe via `@supports (backdrop-filter: blur(1px))` — buiten de support-query gewoon `bg-white`

### 2. Frosted glass tab-bar
2.1 Vervang `background: #ffffff` in `Footer.css` door `background: rgba(255, 255, 255, 0.75)`  
2.2 Voeg `backdrop-filter: blur(16px)` toe aan `.layout-footer`  
2.3 Voeg `-webkit-backdrop-filter: blur(16px)` toe voor Safari-compatibiliteit  
2.4 Verzwaar de bovenrand licht: `border-top: 1px solid rgba(0,0,0,0.08)` voor subtiele scheiding  
2.5 Controleer dat de actieve pill (`bg-accent-light`) nog goed leesbaar is op de blur-achtergrond  
2.6 Voeg Firefox-fallback toe: binnen `@supports` block, buiten ervan `background: #ffffff`

### 3. Ondersteunende diepte-verbeteringen (subtiel, alle schermen)
3.1 Verfijn de `box-shadow` op template-kaarten in `Home.tsx`: van enkelvoudige `shadow-sm` naar een zachtere gelaagde schaduw via CSS  
3.2 Pas dezelfde gelaagde schaduw toe op doel-kaarten in `Goals.tsx` en sessie-kaarten in de Progressie-panelen  
3.3 Verbeter de schaduw op de BottomSheet (modal en tall variant) voor meer "zweven boven de pagina"-gevoel  
3.4 Voeg aan `Home.css` een `.stat-card` klasse toe zodat de glassmorphism-stijlen geïsoleerd zijn van Tailwind-utilities

### 4. Cleanup & validatie
4.1 Voer `npm run test:run` en `npx tsc --noEmit` uit; herstel eventuele regressies  
4.2 Visuele check op 320 px (mobiel), 640 px (app-breedte) en 1280 px (desktop): geen layout-shift, geen onleesbare tekst  
4.3 Check `backdrop-filter`-ondersteuning in Chrome, Safari en Firefox  
4.4 Update `CHANGELOG.md` en markeer Fase 5 als afgerond in `specs/roadmap.md`
