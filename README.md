# Lekovito Bilje

A mobile application for identifying and exploring medicinal plants. Users can recognize plants by photo, search by name or therapeutic use, and save favorites — with or without an account.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-brightgreen)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-blue)
![Version](https://img.shields.io/badge/version-1.0.0-informational)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Screenshots

> _Coming soon_

---

## Features

- **Plant recognition** — identify a plant by taking a photo or uploading one from the gallery
- **Search** — search by name or filter by therapeutic use (digestion, respiratory, skin, etc.)
- **Plant details** — images with pagination indicator, usage, warnings, and share
- **Favorites** — save plants as a guest (stored locally for 7 days) or as a logged-in user
- **Authentication** — sign in or register via Supabase Auth
- **Dark mode** — full dark/light theme support, follows system preference
- **Multilingual** — Serbian and English (i18n)

---

## Tech Stack

| | |
|---|---|
| Framework | Expo SDK 54, React Native 0.81.5, React 19.1.0 |
| Navigation | Expo Router 6 |
| Styling | NativeWind 4 + Tailwind CSS 3 |
| Backend | Supabase (auth + database) |
| State management | Zustand 5 |
| Data fetching | TanStack Query v5 |
| Internationalization | i18next + react-i18next (sr / en) |
| List rendering | FlashList |
| Image handling | expo-image, expo-image-picker |
| Fonts | Playfair Display (Google Fonts) |
| Validation | Zod |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)

### Installation

```bash
git clone https://github.com/your-username/lekovito-bilje.git
cd lekovito-bilje
npm install
```

### Environment variables

Create a `.env` file in the root of the project:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_VERCEL_API_URL=your_api_url
```

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `EXPO_PUBLIC_VERCEL_API_URL` | API endpoint for plant recognition |

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Project Structure

```
app/
  _layout.tsx               # Root layout — fonts, providers, navigation
  (tabs)/                   # Bottom tab navigation
    index.tsx               # Home screen
    pretraga.tsx            # Search screen
    prepoznavanje.tsx       # Recognition screen
    omiljene.tsx            # Favorites screen
    podesavanja.tsx         # Settings screen
  (auth)/                   # Auth screens (modal)
    prijava.tsx             # Sign in
    registracija.tsx        # Register
  biljka/[slug].tsx         # Plant detail screen

components/
  biljke/                   # BiljkaKartica, OmiljenaToggle, BiljkaDetalji, UpozorenjaSekcija
  pocetna/                  # PocetnaHero, BiljkaDanaSekcija, NedavnoPregledano
  pretraga/                 # PretragaInput, PretragaFilteri, PretragaRezultati
  prepoznavanje/            # PrepoznavanjeLoader, PrepoznavanjeRezultat
  ui/                       # Badge, Disclaimer, Skeleton, Spinner, Toast
  empty/                    # EmptyState
  error/                    # ErrorFallback

hooks/                      # useAuth, useBiljka, useBiljkaDana, useImagePicker,
                            # useNedavnoPregledano, useOmiljene, usePrepoznavanje,
                            # usePretraga, useT, useTheme

stores/                     # jezikaStore, pretragaStore, temaStore (Zustand)

lib/
  supabase/client.ts        # Supabase client
  constants/                # Fonts, filter tags
  utils/                    # guestOmiljene, nedavnoPregledano
  validations/              # upload.schema.ts (Zod)

types/                      # biljka.ts, database.ts
messages/                   # sr.json, en.json (translations)
i18n/index.ts               # i18next configuration
```

---

## License

MIT
