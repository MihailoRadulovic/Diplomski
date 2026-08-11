# Lekovito Bilje — React Native (Expo)

Mobilna aplikacija za prepoznavanje i pretragu lekovitog bilja.
Web referenca se nalazi na `C:\Users\Korisnik\Desktop\Sajt\Hakaton` — **nikad ne menjati**, samo čitati radi razumevanja logike.

---

## Tech stack

| | |
|---|---|
| Framework | Expo SDK 54, React Native 0.81.5, React 19.1.0 |
| Navigacija | Expo Router 6 |
| Stilizovanje | NativeWind 4 + Tailwind CSS 3 |
| Backend | Supabase (direktni pozivi, bez API sloja) |
| State | Zustand |
| Data fetching | TanStack Query v5 |
| i18n | i18next + react-i18next (sr/en, fajlovi u `messages/`) |
| Fontovi | `@expo-google-fonts/playfair-display` |

---

## Folder struktura

```
app/
  _layout.tsx               # root layout
  (tabs)/                   # tab navigacija
    _layout.tsx
    index.tsx               # pocetna
    pretraga.tsx
    prepoznavanje.tsx
    omiljene.tsx
    podesavanja.tsx
  (auth)/                   # auth ekrani
    _layout.tsx
    prijava.tsx
    registracija.tsx
  biljka/[slug].tsx          # detalji biljke

components/
  biljke/                   # BiljkaKartica, OmiljenaToggle, BiljkaDetalji, UpozorenjaSekcija
  pocetna/                  # PocetnaHero, BiljkaDanaSekcija, IznenadimeDugme, NedavnoPregledano, PopularniFilteri
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
  constants/fontovi.ts      # font konstante
  constants/tagovi.ts
  supabase/client.ts        # Supabase klijent
  utils/                    # guestOmiljene, nedavnoPregledano
  validations/              # upload.schema.ts

types/                      # biljka.ts, database.ts
messages/                   # sr.json, en.json
i18n/index.ts
```

---

## Env varijable (obavezne za pokretanje)

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_VERCEL_API_URL=
```

---

## Ključna pravila

- **Font konstante** — uvek koristiti `SERIF_BOLD`, `SERIF_ITALIC`, `SERIF_REGULAR` iz `lib/constants/fontovi.ts`, nikad hardkodovani string `'Georgia'` ili bilo koji drugi
- **Dark mode uvek odmah** — svaka komponenta dobija `dark:` NativeWind varijante u istom trenutku kada se piše, nikad naknadno
- **Auth rute** — uvek `/(auth)/prijava` i `/(auth)/registracija`, nikad `/prijava`
- **Filteri u pretrazi** — filter ide kroz `delovanje.ilike('%vrednost%')` (kolona `tagovi` postoji ali se ne koristi za filtriranje)
- **Nema improvizacije** — ne dodavati ništa što nije eksplicitno traženo

---

## Workflow

### Pre pokretanja
```bash
npx expo start        # skenirati QR u Expo Go (iOS, SDK 54)
```

### Pre svakog commita
```bash
npx tsc --noEmit      # mora proći bez ijedne greške
```

### Commit poruke
Srpski jezik, konvencionalni format:
```
feat: dodavanje omiljenih za gosta
fix: dark mode na ekranu pretrage
```

---

## EAS Build (za produkciju)

Konfiguracija je u `eas.json`. Pokreće se sa `eas build` (zahteva Expo account).
Za razvoj i testiranje koristi se isključivo Expo Go.
