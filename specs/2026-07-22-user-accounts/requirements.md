# Requirements — Fase 7: User accounts met Supabase

## Doel

Gebruikers kunnen optioneel een account aanmaken zodat data in de cloud wordt gespiegeld en op meerdere apparaten beschikbaar is. Zonder account blijft de app volledig bruikbaar (lokaal only).

## Scope

- E-mail + wachtwoord authenticatie via Supabase Auth
- Offline-first: app werkt altijd, ook zonder internet
- Passieve achtergrond-sync naar Supabase bij elke schrijfactie
- Bij inloggen op een nieuw apparaat: alle cloud-data wordt automatisch ingeladen in Dexie
- Eerste-login migratie: bestaande lokale data wordt éénmalig geüpload

## Buiten scope

- Social login (Google, Apple, etc.)
- Supabase Realtime push (live updates terwijl app open is)
- Gedeelde data tussen gebruikers
- Supabase Storage (bestanden/afbeeldingen)

## Authenticatie

- Registreren met e-mail + wachtwoord
- Inloggen met e-mail + wachtwoord
- Wachtwoord vergeten → reset-link per e-mail via Supabase
- Sessie blijft bewaard na pagina vernieuwen (Supabase localStorage token)
- Niet-ingelogde gebruikers kunnen de app volledig gebruiken (lokaal only, geen banner of nag screen)

## Data-architectuur

### Offline-first met write-through sync

- **Dexie.js is de primaire lees/schrijflaag** — alle UI leest en schrijft altijd naar Dexie
- **Supabase Postgres is de cloud-spiegel** — na elke Dexie-schrijfactie volgt een niet-blokkerende sync-poging
- Elk Dexie-record krijgt een `synced: 0 | 1` vlag
- Bij offline: schrijf naar Dexie (`synced: 0`), geen foutmelding aan gebruiker
- Bij herstel verbinding: background sync pikt alle `synced: 0` records op

### Conflict-resolutie

**Last-write-wins op basis van `updatedAt` timestamp.**
Bij conflict tussen lokale en cloud-versie wint de meest recente timestamp.

### Multi-device: inloggen op nieuw apparaat

Bij inloggen (of app-start met geldige sessie zonder lokale data):
1. Fetch alle records van de ingelogde gebruiker uit Supabase
2. Schrijf naar Dexie (overschrijf indien conflict op basis van `updatedAt`)
3. Markeer alles als `synced: 1`

### Eerste-login migratie (bestaande gebruiker)

Als er lokale Dexie-data is bij eerste inloggen:
1. Upload alle records naar Supabase
2. Markeer als `synced: 1`
3. Toon een subtiele "Synchroniseren…" melding tijdens upload

### Supabase tabellen

| Supabase tabel      | Dexie tabel        | Extra kolommen        |
|---------------------|--------------------|-----------------------|
| `templates`         | `templates`        | `user_id`, `updated_at` |
| `exercises`         | `exercises`        | `user_id`, `updated_at` |
| `sessions`          | `sessions`         | `user_id`, `updated_at` |
| `session_exercises` | `sessionExercises` | `user_id`, `updated_at` |
| `sets`              | `sets`             | `user_id`, `updated_at` |
| `goals`             | `goals`            | `user_id`, `updated_at` |
| `exercise_library`  | `exerciseLibrary`  | `user_id`, `updated_at` |

Row-level security (RLS) op alle tabellen: elke gebruiker leest/schrijft alleen zijn eigen rijen (`auth.uid() = user_id`).

## UX beslissingen

- Accountstatus zichtbaar via een icoon of initialen in de bestaande settings-popup (geen aparte tab)
- Accountweergave toont: e-mailadres, uitlogknop, knop om account te verwijderen
- Bij uitloggen: Supabase sessie clearen, lokale Dexie-data intact houden (offline gebruik blijft werken)
- Sync-status wordt **niet** real-time getoond — werkt stil op de achtergrond
