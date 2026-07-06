# Fase 3 — Navigatie & Doelen: Validation

## Acceptatiecriteria

De branch is klaar om te mergen als aan alle onderstaande criteria is voldaan.

### Geautomatiseerd

- [ ] `npm run test:run` slaagt zonder fouten (alle bestaande + nieuwe tests groen)
- [ ] TypeScript-compilatie slaagt zonder fouten (`npx tsc --noEmit`)

### Handmatige smoke — mobiel (320 px)

**Bottom tab-navigatie**
- [ ] Tab-bar is zichtbaar op alle schermen (Home, Doelen, Progressie, geschiedenis, sessie)
- [ ] Actieve tab is visueel onderscheiden (kleur of underline)
- [ ] Tappen op een tab navigeert naar het juiste scherm zonder page reload
- [ ] Tab-bar overlapt geen content (safe-area / padding-bottom correct)

**Doelen aanmaken**
- [ ] Opslaan is geblokkeerd zonder naam (formuliervalidatie zichtbaar)
- [ ] Type "deadline" toont een datumkiezer; type "herhalend" niet
- [ ] Opgeslagen doel verschijnt direct in de lijst (geen refresh nodig)
- [ ] Doel persists na een page reload (data zit in Dexie)
- [ ] Doel verwijderen werkt vanuit de lijst

**Dagelijks afvinken**
- [ ] Checkmark-knop op een herhalend doel markeert het als behaald voor vandaag
- [ ] Na afvinken toont de knop de "al behaald"-staat
- [ ] Een tweede tap op dezelfde dag voegt geen dubbele entry toe aan `completedDates`
- [ ] Deadline-doelen tonen geen checkmark-knop

**Reminders**
- [ ] Bij het aanmaken van het eerste herhalende doel wordt om notificatie-permissie gevraagd
- [ ] Bij permissie `'granted'`: service worker is geregistreerd (`navigator.serviceWorker.ready` resolves)
- [ ] Bij app-start stuurt de service worker notificaties voor herhalende doelen die vandaag open staan
- [ ] Bij permissie `'denied'` of `'default'`: app crasht niet en de flow gaat gewoon door

### Handmatige smoke — desktop (1280 px)

- [ ] Alle bovenstaande flows werken ook op desktop
- [ ] Layout toont geen horizontale overflow of gebroken uitlijning
- [ ] Knoppen zijn goed zichtbaar en klikbaar zonder hover-afhankelijkheid

### Regressiecontrole

- [ ] Nieuwe training aanmaken en een sessie uitvoeren werkt nog
- [ ] Sessie opslaan en terugzien in de geschiedenis werkt nog
- [ ] Sessie verwijderen en template verwijderen werken nog
- [ ] "Vorige sessie"-hint per oefening verschijnt nog

## Definitie van "klaar"
Alle vakjes boven zijn aangevinkt én de branch is samengevoegd in `main`.
