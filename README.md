# The Learning Vault

Aktywna nauka dla Natalii. Old money po cichu — bez fajerwerków, bez emoji, bez „świetnie!".

13 sekcji wiedzy, spaced repetition, Error Vault z własnych pomyłek, Salon do rozmowy przy winie. AI generuje pytania z notatek, ja je tylko akceptuję.

---

## Stack

- **Next.js 14** (App Router, mix RSC + client components)
- **TypeScript**
- **Firebase**: Auth (Google), Firestore, Hosting (opcjonalnie — domyślnie Vercel)
- **Tailwind CSS** z custom designem (ivory + forest + gold)
- **Cormorant Garamond** + **Manrope** (Google Fonts)
- **Lucide React** — ikony
- **Anthropic SDK** — generowanie pytań przez API route
- **Zustand** — globalny stan
- **date-fns** — daty
- **PWA** — manifest + service worker (offline dla powtórek)

## Status

Wszystkie 7 faz spec zamknięte:

- [x] **Faza 1 — fundament**: Next.js 14 + Tailwind + Firebase config, design tokens, sidebar/bottom-nav, routing
- [x] **Faza 2 — rdzeń nauki**: Auth Google, wszystkie widoki na Firestore, sesja 15 min z SRS + Error Vault dorzucaniem, streak
- [x] **Faza 3 — Error Vault**: filtry (sekcja, uciążliwe), quiz tylko z błędów, logika rehabilitacji (3 z rzędu → wypada)
- [x] **Faza 4 — Salon**: lista teaserów pogrupowana po sekcji, szczegół z trzema sekcjami (krótko/expand/pułapka), rotacja „tematu dnia" przez `lastShownInSalon`
- [x] **Faza 5 — AI**: `/api/generate` (Opus 4.8 + prompt caching), `/api/grade` (Haiku 4.5 dla pytań open), `/admin` z inline edit propozycji + zapis topic+questions+salon
- [x] **Faza 6 — Statystyki**: heatmapa aktywności 90 dni (SVG), wykres trafności 30 dni (SVG), top sekcje, najtrudniejsze tematy, agregaty, effective streak (zeruje się po pominiętym dniu)
- [x] **Faza 7 — PWA**: service worker (`public/sw.js`), Firestore offline persistence (IndexedDB), ikona SVG, indicator offline, mikroanimacje (fadeIn + stagger), respect `prefers-reduced-motion`

## Uruchomienie

```bash
npm install
cp .env.local.example .env.local
# uzupełnij .env.local — patrz niżej
npm run dev
```

Aplikacja na <http://localhost:3000>. Wymaga skonfigurowanego Firebase (Auth Google + Firestore) — patrz niżej. Przy pierwszym logowaniu dane startowe (sekcje, tematy, błędy) zasiewają się same.

## Konfiguracja Firebase

1. Załóż projekt w <https://console.firebase.google.com>.
2. Dodaj aplikację Web — skopiuj configa do `NEXT_PUBLIC_FIREBASE_*` w `.env.local`.
3. Włącz Firebase Authentication → Google sign-in.
4. Utwórz Firestore (production mode, region `europe-central2`).
5. Wgraj reguły i indeksy:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
6. Dla seeda — wygeneruj service account JSON (Project settings → Service accounts → Generate new private key) i przepisz do `.env.local`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (z zachowanymi `\n`)
7. Zaloguj się w aplikacji Google'em, w Firebase Auth skopiuj UID i wklej jako `SEED_USER_ID`.
8. Uruchom seed:
   ```bash
   npm run seed
   ```

## Klucz Anthropic

```
ANTHROPIC_API_KEY=sk-ant-...
```

Klucz tylko po stronie serwera (API routes), nigdy w `NEXT_PUBLIC_*`. Model do generowania: `claude-opus-4-8`, do oceniania: `claude-haiku-4-5` (patrz `lib/anthropic.ts`).

## Struktura katalogów

```
app/
  layout.tsx, globals.css      — root layout, design tokens
  page.tsx                     — Dashboard (Dziś)
  vaults/                      — lista + [slug] szczegół
  study/                       — wybór trybu + sesja [id] z timerem
  errors/, salon/, stats/      — Error Vault, Salon, statystyki
  api/                         — generate, grade, projekt30-xp (server)
components/
  Sidebar.tsx, BottomNav.tsx, TopNav.tsx
  session/                     — Theory/Test/Korekta
  ui/StatCard, StatusDot, VaultIcon
lib/
  firebase.ts                  — klient
  firebase-admin.ts            — server / seed
  types.ts                     — modele Firestore
  firestore-data.ts            — hooki + mutacje + seed startowy
  spaced-repetition.ts         — SM-2
  api-auth.ts, rate-limit.ts   — garda + limiter route'ów AI
  store.ts                     — Zustand
scripts/
  seed.ts                      — 13 sekcji + błędy
firestore.rules                — userId-scoped read/write
firestore.indexes.json
firebase.json
tailwind.config.ts             — design tokens
```

## Ton

Bez wykrzykników. Bez „brawo!". Bez achievementów typu „Master of Spanish".
Po poprawnej: „Tak. To samo."
Po błędnej: „Nie. Tu jest sedno: ..."
Po sesji: „7 z 10. Trzy błędy poszły do Error Vault."
