# Validation — Fase 7: User accounts met Supabase

## Auth

- [ ] Registreren met e-mail + wachtwoord maakt een Supabase-account aan
- [ ] Inloggen met juiste credentials werkt
- [ ] Inloggen met verkeerd wachtwoord toont een duidelijke foutmelding
- [ ] "Wachtwoord vergeten" stuurt een reset-link per e-mail
- [ ] Sessie blijft bewaard na herladen van de pagina (geen re-login nodig)
- [ ] Uitloggen wist de sessie; opnieuw openen toont de app als uitgelogd

## Offline-first

- [ ] App werkt volledig zonder internet (trainingen loggen, doelen afvinken, templates aanmaken)
- [ ] Nieuwe data aangemaakt zonder internet heeft `synced: 0` in Dexie
- [ ] Geen foutmeldingen of crashes bij wegvallen verbinding
- [ ] Zodra internet terug is worden ongesyncte records automatisch geüpload (background sync)
- [ ] Na sync hebben alle records `synced: 1` in Dexie

## Multi-device sync

- [ ] Inloggen op apparaat 2 laadt alle data van apparaat 1 automatisch in
- [ ] Bij conflict (zelfde record gewijzigd op twee apparaten offline) wint de meest recente `updatedAt`
- [ ] Na inloggen op apparaat 2 zijn trainingen, templates en doelen van apparaat 1 zichtbaar

## Eerste-login migratie

- [ ] Bestaande lokale data wordt bij eerste login geüpload naar Supabase
- [ ] Na upload zijn alle lokale records `synced: 1`
- [ ] Supabase bevat dezelfde data als lokale Dexie na migratie

## Beveiliging

- [ ] RLS actief: inloggen als gebruiker B toont nooit data van gebruiker A
- [ ] Supabase anon key staat alleen in `.env`, niet hard-coded in broncode
- [ ] `.env` staat in `.gitignore`

## Account UI

- [ ] Ingelogde gebruiker ziet e-mailadres in de settings-popup
- [ ] Uitlogknop werkt; na uitloggen is sessie weg maar lokale data blijft intact
- [ ] "Account verwijderen" verwijdert het Supabase-account
- [ ] Niet-ingelogde gebruiker ziet "Inloggen" en "Account aanmaken" in de settings-popup

## Regressie

- [ ] Niet-ingelogde gebruiker kan de app volledig gebruiken (geen forceer-login)
- [ ] Alle bestaande features werken ongewijzigd (trainingen, doelen, oefeningen bibliotheek)
- [ ] PWA installeert nog steeds correct
- [ ] Offline service worker werkt na de Supabase-integratie
- [ ] Geen TypeScript-fouten (`npm run build` slaagt)
