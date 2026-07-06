# Fase 2 — UI Polish: Plan

## Taakgroepen

### 1. Design tokens instellen
1.1 Definieer CSS custom properties in `src/index.css` (`--color-primary`, `--color-accent`, `--color-text`, `--color-bg`, spacing-schaal)  
1.2 Breid `tailwind.config.js` uit met `theme.extend.colors` die verwijzen naar de CSS-variabelen  
1.3 Vervang hardcoded kleuren in bestaande componenten door de nieuwe tokens  
1.4 Controleer visueel op mobiel en desktop dat de merkkleur (zwart + blauw) consistent is toegepast  

### 2. Sessie-opslaan flow
2.1 Voeg kolom `completedAt` (timestamp, nullable) toe aan het `sessions` Dexie-schema (schemaversie omhoog)  
2.2 Voeg Zustand-actie `completeSession(sessionId)` toe die `completedAt` instelt  
2.3 Plaats "Opslaan"-knop onderaan `SessionView`; koppel aan de actie en navigeer naar `/` na succesvolle opslag  
2.4 Schrijf of update Vitest-test voor `completeSession`  

### 3. Verwijderacties
3.1 Voeg Zustand-actie `deleteSession(sessionId)` toe (verwijdert sessie + bijbehorende sets)  
3.2 Voeg verwijderknop toe aan elk sessie-item in `History`; koppel aan de actie  
3.3 Voeg Zustand-actie `deleteTemplate(templateId)` toe (verwijdert template + oefeningen + sessies + sets)  
3.4 Voeg verwijderknop toe aan elk template-item op `Home`; koppel aan de actie  
3.5 Schrijf of update Vitest-tests voor `deleteSession` en `deleteTemplate`  

### 4. Inline set-bewerking
4.1 Vervang de bestaande verwijderknop per set in `ExerciseCard` door een consistente, stijlvolle delete-knop (rode trash-icon of tekst)  
4.2 Zorg dat de set-rij visueel duidelijk aangeeft dat hij verwijderbaar is (kleurcontrast, grootte raakbaar op mobiel ≥ 44 px)  
4.3 Controleer dat `deleteSet` in de Zustand-store al correct werkt; voeg test toe als die ontbreekt  

### 5. Testen & validatie
5.1 Voer `npm run test:run` uit en herstel eventuele regressies  
5.2 Handmatige smoke op 320 px (mobiel): alle nieuwe flows doorlopen  
5.3 Handmatige smoke op 1280 px (desktop): layout ziet er goed uit, geen overflow  
5.4 Update `CHANGELOG.md` en markeer afgeronde items in `specs/roadmap.md`  
