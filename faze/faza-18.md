# Faza 18 — Testiranje i build

## Opis
Finalni QA prolaz kroz sve ekrane, environment varijable za produkciju,
EAS build konfiguracija i generisanje APK-a za testiranje.

## Zavisnosti
Sve prethodne faze

## Web referenca
```
Nema direktnog web ekvivalenta.
```

---

## Pred-release checklist

### 1. Environment varijable

`.env` mora imati sve varijable iz Faze 1:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_VERCEL_API_URL=    ← PlantNet backend URL
```

Za EAS Build — dodati u `eas.json`:
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "...",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "...",
        "EXPO_PUBLIC_VERCEL_API_URL": "..."
      }
    }
  }
}
```

Alternativa: koristiti EAS Secrets umesto hardkodovanih vrednosti.

---

### 2. `app.json` finalizacija

Pre build-a proveriti:
```json
{
  "expo": {
    "name": "Lekovito Bilje",
    "slug": "lekovito-bilje",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "plugins": [
      ["expo-image-picker", {
        "cameraPermission": "Dozvoli pristup kameri za prepoznavanje biljaka.",
        "photosPermission": "Dozvoli pristup galeriji za izbor fotografije."
      }],
      "expo-font"
    ]
  }
}
```

---

## QA — Funkcionalnost po ekranu

### Pocetna (index.tsx)
- [ ] Pull-to-refresh radi
- [ ] NedavnoPregledano prikazuje posecene biljke (useFocusEffect)
- [ ] BiljkaDana se ucitava i menja po datumu
- [ ] IznenadimeDugme otvara random biljku
- [ ] PopularniFilteri navigiraju na pretragu sa filterom
- [ ] Personalizovani pozdrav prikazuje ime (ako je ulogovan)

### Pretraga (pretraga.tsx)
- [ ] Debounce radi (300ms — ne salje upit za svako slovo)
- [ ] Filter chipovi funkcionisu (toggle, zeleni kada aktivan)
- [ ] Inicijalni prikaz: 9 random biljaka (prazna pretraga)
- [ ] FlashList sa 2 kolone prikazuje kartice
- [ ] Tap na karticu otvara detalje
- [ ] Loading skeleton tokom ucitavanja
- [ ] Empty state kada nema rezultata

### Biljka detalji (biljka/[slug].tsx)
- [ ] Carousel slika (swipe levo/desno)
- [ ] Tagovi sa ispravnim labelama (aktivan jezik)
- [ ] KopirajLatinski — kopira u clipboard + Toast
- [ ] BiljkaKoristiSe — grupisanje po deo_biljke ispravno
- [ ] UpozorenjaSekcija — boje po ozbiljnosti (niska/srednja/visoka)
- [ ] Share dugme otvara native share sheet
- [ ] OmiljenaToggle u headeru menja stanje
- [ ] Poseta se upisuje u AsyncStorage
- [ ] ErrorFallback kada biljka nije nadjena (los slug)

### Prepoznavanje (prepoznavanje.tsx)
- [ ] "Slikaj" otvara kameru (trazi permisiju prvi put)
- [ ] "Galerija" otvara photo picker
- [ ] Preview slike se prikazuje
- [ ] Organ radio dugmad (leaf default)
- [ ] "Prepoznaj" salje formData na Vercel URL
- [ ] Loader tokom analize
- [ ] Scenario u_bazi: prikazuje naziv + "Pogledaj biljku"
- [ ] Scenario nije_u_bazi: prikazuje naziv bez linka
- [ ] Scenario nije_prepoznato: poruka + retry dugme
- [ ] "Nova fotografija" resetuje sve

### Omiljene (omiljene.tsx)
- [ ] Gost: sacuvane biljke se prikazuju
- [ ] Gost: GuestOmiljenaBaner pri prvom sacuvavanju
- [ ] Gost: info baner sa preostalim danima
- [ ] Auth: omiljene iz Supabase
- [ ] Toggle srce uklanja biljku (soft-delete)
- [ ] Prazno stanje sa linkom ka pretrazi

### Auth (prijava.tsx / registracija.tsx)
- [ ] Prijava sa ispravnim podacima
- [ ] Pogresna lozinka — greska u UI
- [ ] Registracija — email potvrda
- [ ] Prikazi/sakrij lozinku
- [ ] Navigacija: X zatvara modal, prijava/registracija linkovi rade

### Podesavanja (podesavanja.tsx)
- [ ] Tema: svetla/tamna/sistem menjaju temu odmah
- [ ] Jezik: srpski/engleski menjaju UI odmah
- [ ] Gost vidi dugmad za prijavu/registraciju
- [ ] Ulogovan vidi ime, email i dugme odjava
- [ ] Odjava: Alert potvrda, zatim redirect na pocetnu

---

## Build za testiranje

### Lokalni build (APK za Android)

```bash
# Instalirati EAS CLI ako nije instaliran
npm install -g eas-cli

# Prijaviti se na Expo
eas login

# Konfigurisati projekat (prvi put)
eas build:configure

# Preview build (interno testiranje — APK)
eas build --platform android --profile preview
```

`eas.json` za preview APK:
```json
{
  "cli": { "version": ">= 14.0.0" },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### Testiranje na uredaju bez build-a

```bash
# Pokretanje u Expo Go (development)
npx expo start

# Skenirati QR kod u Expo Go aplikaciji
```

Napomena: Expo Go ne podrzava custom native module. Kamera (`expo-image-picker`)
radi u Expo Go, ali za produkcijski build koristiti EAS.

---

## Ceste greske i resenja

| Greska | Uzrok | Resenje |
|--------|-------|---------|
| `Network request failed` | Supabase URL ili anon key nisu ucitani | Proveriti `.env` i da varijable pocinju sa `EXPO_PUBLIC_` |
| `Cannot read property 'uri' of undefined` | ImagePickerAsset nije proveren pre upotrebe | Dodati `if (!asset) return;` |
| `FlashList: estimatedItemSize too small` | Warning u konzoli | Povecati `estimatedItemSize` |
| `NativeWind dark: klase ne rade` | `setColorScheme` nije pozvan | Proveriti ThemeProvider u `_layout.tsx` |
| `AsyncStorage: key conflict` | Razliciti kljucevi za istu vrednost | Definisati konstante za kljuceve u jednom fajlu |
| `Supabase session lost on restart` | `AsyncStorage` adapter nije podesena | Proveriti `createClient` u Fazi 2 |

---

## Commit
`feat: EAS build konfiguracija i finalni QA`

## Finalni QA pre submisije
- [ ] Sve gorenavedene funkcionalnosti rade na fizickom uredaju (ne samo simulator)
- [ ] Dark mode izgleda ispravno na svim ekranima
- [ ] Oba jezika (SR/EN) prevode UI ispravno
- [ ] Nema `console.error` u logovima (samo `console.log` za debug)
- [ ] APK build prolazi bez gresaka
- [ ] Aplikacija se pokree bez crasha na fresh install
- [ ] Supabase RLS: gost moze citati biljke, ali ne moze pisati tue omiljene
