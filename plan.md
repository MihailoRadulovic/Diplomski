# Lekovito Bilje — React Native (Expo) plan

Mobilna verzija web aplikacije za prepoznavanje i pretragu lekovitog bilja.
Web verzija ostaje netaknuta na `C:\Users\Korisnik\Desktop\Sajt\Hakaton`.

Detaljne instrukcije po fazama su u folderu `faze/`.

---

## Sta gradimo

Ista aplikacija kao PWA, ali kao prava React Native mobilna app:
- Pretraga bilja po imenu i delovanju
- Detaljna kartica biljke (deo, upotreba, priprema, upozorenja)
- Prepoznavanje biljke kamerom ili iz galerije (PlantNet API)
- Biljka dana na pocetnom ekranu
- Nedavno pregledane biljke na pocetnom ekranu (AsyncStorage history)
- Omiljene biljke (za goste i za autentifikovane korisnike)
- Prijava i registracija (Supabase Auth)
- Light / Dark mode
- Srpski i engleski jezik

---

## Tech stack

| Kategorija | Biblioteka | Napomena |
|---|---|---|
| Framework | Expo SDK 53 (managed workflow) | |
| Routing | Expo Router v4 | File-based, kao Next.js App Router |
| Stilizovanje | NativeWind v4 | Tailwind klase u React Native |
| Baza / Auth | @supabase/supabase-js | Direktno iz app-a, bez SSR |
| Session storage | @react-native-async-storage/async-storage | Zamena za cookies/localStorage |
| Server state | @tanstack/react-query v5 | Identican sa web verzijom |
| Client state | zustand v5 | Identican sa web verzijom |
| Kamera / galerija | expo-image-picker | Pokriva i kameru i galeriju |
| I18n | react-i18next + expo-localization | Zamena za next-intl |
| Validacija | zod | Identican sa web verzijom |
| Liste | @shopify/flash-list | Performansna zamena za FlatList |
| Fontovi | expo-font + @expo-google-fonts/playfair-display | PlayfairDisplay kao zamena za Georgia (nije garantovana na Androidu) |
| Safe area | react-native-safe-area-context | Obavezno za iOS notch/dynamic island |
| Gestures | react-native-gesture-handler | Potrebno za Expo Router |
| Slike | expo-image | Zamena za next/image |

---

## Backend strategija

Expo app NE gradi sopstveni backend. Koristi dva izvora:

**1. Supabase direktno (za sve podatke o biljkama)**
- `GET biljke` — lista sa paginacijom
- `GET biljke by slug` — detalji jedne biljke
- `GET biljka-dana` — deterministicki po datumu (dana od Unix epohe % count)
- `GET/POST/DELETE omiljene` — sa RLS-om (DELETE = soft-delete kroz `.update({ deleted_at })`)
- Pretraga po `srpski_naziv`, `latinski_naziv`, `delovanje` kroz `.ilike()` — filter se radi kroz `delovanje.ilike('%filter%')`
- Auth: `signInWithPassword`, `signUp`, `signOut`

**2. Vercel backend (samo za PlantNet)**
- `POST https://[vercel-url]/api/prepoznavanje`
- PlantNet API kljuc ostaje SERVER-SIDE — nikad u mobilnoj app
- Isti endpoint koji koristi web verzija, Expo ga samo poziva

Web verzija mora ostati deployovana na Vercel (za PlantNet rutu).

---

## Env varijable

Kreirati `.env` fajl u root-u Expo projekta:

```env
EXPO_PUBLIC_SUPABASE_URL=https://wttgvqoubnsbxohiapcm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6TOlNFeRZ0-dus2PIGIcyw_J5gJ-CcZ
EXPO_PUBLIC_VERCEL_API_URL=https://[tvoj-vercel-url]
```

`EXPO_PUBLIC_` prefix je obavezan za varijable koje se koriste u klijentskom kodu.
PlantNet kljuc NIJE u .env — poziva se iskljucivo kroz Vercel rutu.

---

## Navigacija

Tab bar na dnu sa 5 tabova:

```
[ Pocetna ] [ Pretraga ] [ Kamera ] [ Omiljene ] [ Podesavanja ]
```

- **Pocetna** — hero sa pretragom i CTA, nedavno pregledano, biljka dana, brzi filteri, "Iznenadi me"
- **Pretraga** — input + filteri + lista rezultata
- **Kamera** — prepoznavanje (centralna, malo veca ikona)
- **Omiljene** — sacuvane biljke
- **Profil** — podesavanja (tema, jezik) + prijava/odjava

Stack navigacija iznad tabova:
- `/biljka/[slug]` — detalji biljke (push sa bilo kog taba)
- `/(auth)/prijava` — modal ili stack
- `/(auth)/registracija` — modal ili stack

---

## Folder struktura

```
LekovitoBiljeApp/
  app/
    _layout.tsx                  <- Root layout (providers, fonts, tema)
    (tabs)/
      _layout.tsx                <- Tab bar konfiguracija
      index.tsx                  <- Pocetna
      pretraga.tsx               <- Pretraga
      prepoznavanje.tsx          <- Kamera/upload
      omiljene.tsx               <- Omiljene biljke
      podesavanja.tsx            <- Podesavanja + auth
    biljka/
      [slug].tsx                 <- Detalji biljke
    (auth)/
      _layout.tsx
      prijava.tsx
      registracija.tsx

  components/
    ui/
      Button/Button.tsx + Button.types.ts
      Card/Card.tsx
      Badge/Badge.tsx
      Input/Input.tsx
      Spinner/Spinner.tsx
      Skeleton/Skeleton.tsx
      Toast/Toast.tsx
      Disclaimer/Disclaimer.tsx
      EmptyState/EmptyState.tsx
    layout/
      ScreenWrapper/ScreenWrapper.tsx   <- SafeAreaView + scroll wrapper
      // Header se NE pravi — Expo Router koristi navigation.setOptions() direktno
    biljke/
      BiljkaKartica/BiljkaKartica.tsx
      BiljkaDetalji/
        BiljkaGlavnaInfo.tsx
        BiljkaKoristiSe.tsx
        BiljkaSlike.tsx
        ShareDugme.tsx
      UpozorenjaSekcija/
        UpozorenjaSekcija.tsx
        UpozorenjeItem.tsx
      OmiljenaToggle/OmiljenaToggle.tsx
    pocetna/
      PocetnaHero/PocetnaHero.tsx
      IznenadimeDugme/IznenadimeDugme.tsx
      NedavnoPregledano/NedavnoPregledano.tsx
      BiljkaDanaSekcija/BiljkaDanaSekcija.tsx
      PopularniFilteri/PopularniFilteri.tsx
    pretraga/
      PretragaInput/PretragaInput.tsx
      PretragaRezultati/PretragaRezultati.tsx
      PretragaFilteri/PretragaFilteri.tsx + FilterChip.tsx
    prepoznavanje/
      PrepoznavanjeRezultat/PrepoznavanjeRezultat.tsx
      PrepoznavanjeLoader/PrepoznavanjeLoader.tsx
    error/
      ErrorBoundary/ErrorBoundary.tsx + ErrorFallback.tsx

  hooks/
    useAuth.ts                   <- Port sa web (getSession umesto cookie)
    useBiljka.ts                 <- Port sa web (Supabase direktno)
    useBiljkaDana.ts             <- Port sa web (Supabase direktno)
    usePretraga.ts               <- Port sa web (Supabase direktno, bez useDeferredValue)
    useOmiljene.ts               <- Kompletan rewrite (async guest funkcije)
    usePrepoznavanje.ts          <- Prilagodjen (URI + mimeType umesto File)
    useTheme.ts                  <- Prilagodjen (useColorScheme)
    useImagePicker.ts            <- Novo (expo-image-picker)
    useNedavnoPregledano.ts      <- Novo (AsyncStorage history)

  stores/
    temaStore.ts                 <- Port (persist -> AsyncStorage)
    jezikaStore.ts               <- Port (persist -> AsyncStorage)
    pretragaStore.ts             <- Identican sa web

  lib/
    supabase/client.ts           <- createClient sa AsyncStorage
    utils/
      cn.ts                      <- Identican
      format.ts                  <- Identican
      slug.ts                    <- Identican
      error.ts                   <- Identican
      guestOmiljene.ts           <- Kompletan rewrite (sve funkcije async)
      nedavnoPregledano.ts       <- Novo (AsyncStorage, zamena za localStorage logiku)
    constants/tagovi.ts          <- Identican
    constants/fontovi.ts         <- Novo (SERIF_BOLD, SERIF_ITALIC, SERIF_REGULAR konstante)
    validations/upload.schema.ts <- Identican

  types/
    database.ts                  <- Identican sa web (obavezan, biljka.ts ga importuje)
    biljka.ts                    <- Identican sa web
    api.ts                       <- Identican sa web
    auth.ts                      <- Identican sa web
    pretraga.ts                  <- Identican sa web

  messages/
    sr.json                      <- Identican sa web
    en.json                      <- Identican sa web

  i18n/index.ts                  <- react-i18next konfiguracija
  hooks/useT.ts                  <- Helper wrapper za useTranslation (emulira next-intl API)

  global.css                     <- NativeWind import
  .env
  app.json
  tailwind.config.js
  tsconfig.json
  package.json
```

---

## Dizajn sistem

### Boje

```
Primarna zelena:   #639922
Tamna zelena:      #27500A
Svetla zelena:     #EAF3DE
Amber akcenat:     #EF9F27
Svetli amber:      #FAEEDA
Dark pozadina:     #0F1A08
Dark tekst:        #C8E6A0
```

NativeWind `tailwind.config.js` — svi custom tokeni definisani odmah u Fazi 1:
```js
theme: {
  extend: {
    colors: {
      'zelena-primarna': '#639922',
      'zelena-tamna': '#27500A',
      'zelena-svetla': '#EAF3DE',
      'amber-akcenat': '#EF9F27',
      'amber-svetla': '#FAEEDA',
      'tekst-primarni': '#27500A',
      'tekst-sekundarni': '#4A7A28',
      'tekst-blagi': '#6B8F58',
      'pozadina': '#FFFFFF',
      'pozadina-surface': '#F5F9F0',
      'pozadina-kartica': '#EAF3DE',
      'pozadina-hover': '#E0EDD4',
      'ivica': '#C8DEB8',
      'ivica-blaga': '#DCE8CC',
    }
  }
}
```

Dark varijante se pisu direktno u komponentama kroz `dark:` prefix (npr. `dark:text-[#E8F5E2]`).
NativeWind ne podrzava nested `{ DEFAULT, dark }` sintaksu za automatske dark varijante.

### Tipografija
- Srpski nazivi biljaka: PlayfairDisplay-Bold — ucitava se kroz `expo-font` + `@expo-google-fonts/playfair-display`
- Latinsko ime: PlayfairDisplay-Italic
- Naslovi sekcija: PlayfairDisplay-Bold
- Telo teksta: sistemski font (default React Native)
- Konstante definisane u `lib/constants/fontovi.ts`: `SERIF_BOLD`, `SERIF_ITALIC`, `SERIF_REGULAR`
- Georgia se NE koristi — nije garantovana na Androidu

### Razlike UI od web verzije

| Web | Mobile |
|-----|--------|
| `hover:` stanja | `activeOpacity` / `pressed` (Pressable) |
| `focus-visible:ring` | `accessibilityLabel` |
| `Link href=...` | `router.push(...)` |
| `next/image` | `expo-image` |
| Sticky header (Navbar) | Tab bar na dnu |
| Breadcrumb navigacija | Back dugme u header-u |
| Keyboard shortcuts | N/A |
| `sr-only` klase | `accessible={false}` |
| `aria-*` atributi | RN accessibility props |

---

## Kljucne razlike vs. web (pregled)

Detaljan kod i objašnjenja za svaku stavku nalaze se u odgovarajućoj fazi.

| Tema | Razlika | Faza |
|------|---------|------|
| Supabase klijent | `AsyncStorage` umesto cookie/SSR, nema `@supabase/ssr` | 2 |
| Zustand persist | `AsyncStorage` storage + `onRehydrateStorage` koji restaurira `i18n.language` pri restartovanju | 3 |
| I18n | `react-i18next` umesto `next-intl`, `useT(ns)` helper emulira `useTranslations` API | 3 |
| Kamera / galerija | `useImagePicker` hook, trazi permisije pre pokretanja kamere/galerije | 6 |
| PlantNet poziv | `FormData` sa `uri` + `mimeType` umesto `File` objekta | 6, 11 |
| Dark mode | `useColorScheme` + NativeWind `setColorScheme` u root layoutu, bez `document.classList` | 6, 15 |
| Guest omiljene | Sve funkcije `async` — `AsyncStorage` nema sinhroni API, `isClient()` guard se brise | 6 |
| Pretraga / filter | `delovanje.ilike('%vrednost%')` — filter ide kroz `delovanje`, ne kroz `tagovi` | 6, 9 |
| Auth | `getSession()` za init, hook vraca `jeGost: boolean` | 6, 13 |
| Navigacija auth | `/(auth)/prijava`, `/(auth)/registracija` — uvek sa group prefiksom | 4, 12, 13 |
| `useAuth` portovanje | `getSession()` cita iz AsyncStorage (brzo, bez network poziva) | 6 |
| Biljka danas | Ista deterministicka formula kao web: `danaOdEpohe % count`, sort po `id` | 6 |

---

## Sta se prenosi 1:1 iz web projekta

```
types/database.ts             <- obavezan, biljka.ts ga importuje
types/biljka.ts
types/api.ts
types/auth.ts
types/pretraga.ts
lib/utils/cn.ts
lib/utils/format.ts
lib/utils/slug.ts
lib/utils/error.ts
lib/constants/tagovi.ts
lib/validations/upload.schema.ts
stores/pretragaStore.ts
messages/sr.json
messages/en.json
```

---

## Sta se prilagodjava (ne kopira direktno)

| Fajl | Izmena |
|------|--------|
| `stores/temaStore.ts` | `persist` storage → AsyncStorage |
| `stores/jezikaStore.ts` | `persist` storage → AsyncStorage + `onRehydrateStorage` callback koji restaurira `i18n.language` pri restartovanju |
| `hooks/useAuth.ts` | `getSession()` za init (bez SSR), `onAuthStateChange` za pracenje, vraca `jeGost: boolean` |
| `hooks/useBiljka.ts` | Supabase direktno umesto `/api/biljke/[slug]` |
| `hooks/useBiljkaDana.ts` | Supabase direktno, ista formula za seed |
| `hooks/usePretraga.ts` | Supabase direktno, bez `useDeferredValue`, fiksno `PO_STRANI=21` |
| `hooks/useOmiljene.ts` | Kompletan rewrite — async guest funkcije menjaju sve call site-ove |
| `hooks/usePrepoznavanje.ts` | URI + `asset.mimeType` umesto File, pun Vercel URL |
| `lib/utils/guestOmiljene.ts` | Kompletan rewrite — sve funkcije async, brise se `isClient()` |
| `lib/utils/nedavnoPregledano.ts` | Novo — async AsyncStorage varijanta web localStorage logike |
| `lib/supabase/client.ts` | Bez `@supabase/ssr`, sa AsyncStorage session |

---

## Sta se baca (ne postoji u mobile)

- Sve Next.js API rute (`/api/*`) — Supabase direktno
- `lib/supabase/server.ts`, `middleware.ts` — nema servera
- PWA fajlovi (`sw.js`, `manifest.json`, `ServiceWorkerRegistrar`, `components/pwa/*`)
- `next-intl`, `next-pwa`, `@supabase/ssr`
- `components/layout/SkipLink`
- `src/proxy.ts`
- SEO (`generateMetadata`, `sitemap.ts`, `robots.ts`)
- `next.config.ts` → zamenjuje `app.json`

---

## Pregled faza

| # | Opis | Fajl |
|---|------|------|
| 1 | Inicijalizacija projekta | [faze/faza-01.md](faze/faza-01.md) |
| 2 | Konfiguracija | [faze/faza-02.md](faze/faza-02.md) |
| 3 | I18n + Zustand stores | [faze/faza-03.md](faze/faza-03.md) |
| 4 | Expo Router navigacija | [faze/faza-04.md](faze/faza-04.md) |
| 5 | UI primitive komponente | [faze/faza-05.md](faze/faza-05.md) |
| 6 | Hookovi (data layer) | [faze/faza-06.md](faze/faza-06.md) |
| 7 | BiljkaKartica | [faze/faza-07.md](faze/faza-07.md) |
| 8 | Pocetna stranica | [faze/faza-08.md](faze/faza-08.md) |
| 9 | Pretraga | [faze/faza-09.md](faze/faza-09.md) |
| 10 | Detalji biljke | [faze/faza-10.md](faze/faza-10.md) |
| 11 | Prepoznavanje | [faze/faza-11.md](faze/faza-11.md) |
| 12 | Omiljene | [faze/faza-12.md](faze/faza-12.md) |
| 13 | Auth ekrani | [faze/faza-13.md](faze/faza-13.md) |
| 14 | Profil i podesavanja | [faze/faza-14.md](faze/faza-14.md) |
| 15 | Dark mode finalizacija | [faze/faza-15.md](faze/faza-15.md) |
| 16 | Accessibility i polish | [faze/faza-16.md](faze/faza-16.md) |
| 17 | Fonts i vizuelni detalji | [faze/faza-17.md](faze/faza-17.md) |
| 18 | Testiranje i screenshoti | [faze/faza-18.md](faze/faza-18.md) |

---

## Pokretanje projekta

```bash
npm install
npx expo start
# Skenirati QR u Expo Go ili pritisnuti 'a' za Android emulator
```

Android emulator: Android Studio → AVD Manager → Pixel 8, API 35 → pokrenuti → `npx expo start` → `a`

---

## APK za prezentaciju (opciono)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

`preview` profil generise `.apk` za direktnu instalaciju bez Play Store-a. Besplatno na Expo infrastrukturi.
