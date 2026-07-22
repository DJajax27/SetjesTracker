# Plan — Fase 7: User accounts met Supabase

## Taakgroep 1 — Supabase project & client

- Supabase project aanmaken (of bestaande URL + anon key ophalen)
- `@supabase/supabase-js` installeren als npm dependency
- `.env` aanmaken: `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`
- `src/lib/supabase.ts` — singleton Supabase client exporteren

## Taakgroep 2 — Database schema in Supabase

- SQL migrations schrijven voor alle 7 tabellen
- Kolommen per tabel: primaire sleutel (`id bigint generated always as identity`), `user_id uuid references auth.users not null`, datavelden, `updated_at timestamptz default now()`, `created_at timestamptz default now()`
- RLS inschakelen op alle tabellen
- RLS policies voor `SELECT`, `INSERT`, `UPDATE`, `DELETE`: `auth.uid() = user_id`
- Trigger `set_updated_at` op alle tabellen zodat `updated_at` automatisch bijgewerkt wordt

## Taakgroep 3 — Dexie schema uitbreiden (versie 6)

- `synced: number` (0 = dirty, 1 = clean) toevoegen aan alle bestaande tabellen
- `updatedAt: string` (ISO timestamp) toevoegen aan alle tabellen voor conflict-resolutie
- Nieuwe Dexie versie bumpen naar 6 in `src/db/db.ts`
- Index `synced` toevoegen zodat background sync snel ongesyncte records kan opvragen

## Taakgroep 4 — Auth store & flows

- `src/store/authStore.ts` — Zustand store:
  - State: `user`, `session`, `loading`
  - Acties: `signUp(email, password)`, `signIn(email, password)`, `signOut()`, `resetPassword(email)`, `initialize()`
  - `initialize()` aanroepen bij app-start via `supabase.auth.getSession()` + `onAuthStateChange` listener
- `src/pages/Login.tsx` — inlogscherm (e-mail + wachtwoord + link naar registreren + wachtwoord vergeten)
- `src/pages/Register.tsx` — registratiescherm (e-mail + wachtwoord + bevestiging)
- `src/pages/ForgotPassword.tsx` — e-mail invoeren, Supabase stuurt reset-link
- Routes toevoegen in `App.tsx`: `/login`, `/register`, `/forgot-password`
- Niet-ingelogde gebruikers blijven gewoon op de normale schermen — geen redirect

## Taakgroep 5 — Sync-laag (write-through)

- `src/lib/sync.ts` exporteert:
  - `pushRecord(table, dexieRecord)` — upsert één record naar Supabase, update `synced: 1` in Dexie bij succes
  - `pushAllDirty()` — query Dexie voor `synced: 0` op alle tabellen, push elk record
- Alle Zustand stores (workoutStore, goalsStore, exerciseLibraryStore) roepen `pushRecord` aan na elke Dexie-schrijfactie, niet-blokkerend (fire-and-forget)
- Geen foutmelding bij mislukte sync — stil falen, record blijft `synced: 0`

## Taakgroep 6 — Pull bij inloggen (multi-device & migratie)

- `src/lib/sync.ts` exporteert `pullAll(userId)`:
  - Fetch alle records per tabel uit Supabase voor de ingelogde gebruiker
  - Per record: check `updatedAt` — als Supabase-versie nieuwer is, overschrijf Dexie-record
  - Markeer alle opgehaalde records als `synced: 1`
- `pushLocalData(userId)` — upload alle bestaande Dexie-records (eerste-login migratie):
  - Zet `user_id` op elk record, upsert naar Supabase, markeer `synced: 1`
- In `authStore.signIn` en bij `onAuthStateChange` (nieuwe sessie):
  1. Als er lokale data is zonder `user_id` → `pushLocalData()` (migratie)
  2. Daarna altijd `pullAll()` (eventuele cloud-data van ander apparaat binnenhalen)
  3. Last-write-wins op basis van `updatedAt`

## Taakgroep 7 — Background sync bij verbinding herstel

- `src/lib/backgroundSync.ts`:
  - Luistert op `window` `online`-event
  - Roept `pushAllDirty()` aan zodra verbinding hersteld is
  - Initialiseren in `App.tsx` via `useEffect` bij mount
- Service worker: bestaande PWA-setup ongewijzigd laten

## Taakgroep 8 — Account UI

- Accountstatus integreren in de bestaande settings-popup (Home-scherm)
- Ingelogd: toon e-mailadres, "Uitloggen"-knop, "Account verwijderen"-knop
- Niet ingelogd: toon "Inloggen"-knop en "Account aanmaken"-knop → navigeren naar `/login` / `/register`
- Account verwijderen: `supabase.auth.admin.deleteUser` + lokale Dexie-data intact laten
- `mission.md` en `tech-stack.md` updaten om de nieuwe richting te reflecteren
