# Lekovito Bilje — React Native (Expo)

Mobilna verzija web aplikacije za prepoznavanje i pretragu lekovitog bilja.
Web verzija se nalazi na `C:\Users\Korisnik\Desktop\Sajt\Hakaton`.
Expo projekat se kreira u ovom folderu (`C:\Users\Korisnik\Desktop\Faks\Diplomski`).

---

## Workflow — kako raditi na ovom projektu

### Pre svake faze
1. Pročitaj `plan.md` — arhitektura, tech stack, dizajn sistem, folder struktura
2. Pročitaj odgovarajući `faze/faza-XX.md` — tačne instrukcije, kod i checklist za tu fazu
3. Implementiraj redom — ne preskači korake, ne dodaj ništa što nije eksplicitno u fazi

### Tokom implementacije
- Sekcija **"Web referenca"** u svakoj fazi = fajlovi iz web projekta koji se portuju
- Sekcija **"Sta izostaviti"** u svakoj fazi = striktno poštovati, bez izuzetaka
- Sekcija **"Proveri pre commita"** = sve stavke moraju biti ispunjene pre commita

### Pre commita svake faze
```bash
npx tsc --noEmit      # mora proći bez ijedne greške
npx expo start        # mora se pokrenuti bez crasha
```

---

## Ključna pravila (bez izuzetaka)

- **Nema sopstvenih odluka** — sve arhitekturalne odluke su definisane u `plan.md` i faza fajlovima
- **Nema preskakanja faza** — svaka faza se commituje pre nego što krene sledeća
- **Nema improvizacije** — ako nešto nije pomenuto u fazi, ne dodaje se
- **Typecheck je obavezan** — ni jedan commit ne ide bez čistog `npx tsc --noEmit`
- **Dark mode uvek odmah** — svaka komponenta dobija `dark:` varijante u istoj fazi kada se piše, nikad naknadno
- **Font konstante** — uvek koristiti `SERIF_BOLD`, `SERIF_ITALIC`, `SERIF_REGULAR` iz `lib/constants/fontovi.ts`, nikad hardkodovani string `'Georgia'`
- **Auth rute** — uvek `/(auth)/prijava` i `/(auth)/registracija`, nikad `/prijava`
- **Filteri u pretrazi** — filter ide kroz `delovanje.ilike('%vrednost%')` (kolona `tagovi` postoji ali se ne koristi za filtriranje)

---

## Struktura dokumentacije

| Fajl | Svrha |
|------|-------|
| `CLAUDE.md` | Workflow i pravila rada (ovaj fajl) |
| `plan.md` | Arhitekturalni pregled — tech stack, folder struktura, dizajn sistem, šta se portuje |
| `faze/faza-01.md` do `faza-18.md` | Detaljna implementacija po fazama sa kodom i checklistom |

---

## Redosled faza

Faze se implementiraju striktno redom 1 → 18.

| # | Opis | Fajl |
|---|------|------|
| 1 | Inicijalizacija projekta | faze/faza-01.md |
| 2 | Konfiguracija — tipovi, utils, Supabase klijent | faze/faza-02.md |
| 3 | I18n + Zustand stores | faze/faza-03.md |
| 4 | Expo Router navigacija | faze/faza-04.md |
| 5 | UI primitive komponente + font konstante | faze/faza-05.md |
| 6 | Hookovi — data layer (Supabase direktno) | faze/faza-06.md |
| 7 | BiljkaKartica + OmiljenaToggle | faze/faza-07.md |
| 8 | Pocetna stranica | faze/faza-08.md |
| 9 | Pretraga | faze/faza-09.md |
| 10 | Detalji biljke | faze/faza-10.md |
| 11 | Prepoznavanje biljke | faze/faza-11.md |
| 12 | Omiljene biljke | faze/faza-12.md |
| 13 | Auth ekrani | faze/faza-13.md |
| 14 | Podesavanja ekran | faze/faza-14.md |
| 15 | Dark mode finalizacija | faze/faza-15.md |
| 16 | Accessibility i UX polish | faze/faza-16.md |
| 17 | Fontovi i vizuelni detalji | faze/faza-17.md |
| 18 | Testiranje i EAS build | faze/faza-18.md |
