# Faza 3 — I18n i Zustand stores

## Opis
Kopiranje translation fajlova, podesavanje react-i18next, portovanje Zustand stores-a
sa AsyncStorage umesto localStorage/default storage.

## Zavisnosti
Faza 2

## Web referenca
```
src/stores/temaStore.ts
src/stores/jezikaStore.ts
src/stores/pretragaStore.ts
src/messages/sr.json          <- lokacija moze da se razlikuje po projektu
src/messages/en.json
src/i18n/routing.ts           <- samo za razumevanje, ne portuje se
```

## Sta portovati (kopiraj 1:1)

```
stores/pretragaStore.ts       <- create() bez persist, identican
messages/sr.json
messages/en.json
```

## Sta prilagoditi

### `stores/temaStore.ts` — persist storage → AsyncStorage

Web koristi default Zustand persist (localStorage u browseru).
Mobile mora eksplicitno navesti AsyncStorage:

```ts
// stores/temaStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tema = 'svetla' | 'tamna' | 'sistem';

export const useTemaStore = create<{ tema: Tema; setTema: (tema: Tema) => void }>()(
  persist(
    (set) => ({ tema: 'sistem', setTema: (tema) => set({ tema }) }),
    { name: 'tema-podesavanje', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

### `stores/jezikaStore.ts` — persist + menjanje i18n jezika

```ts
// stores/jezikaStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

export type Jezik = 'sr' | 'en';

export const useJezikaStore = create<{ jezik: Jezik; setJezik: (jezik: Jezik) => void }>()(
  persist(
    (set) => ({
      jezik: 'sr',
      setJezik: (jezik) => {
        set({ jezik });
        i18n.changeLanguage(jezik); // web ne mora ovo, next-intl menja URL
      },
    }),
    {
      name: 'jezik-podesavanje',
      storage: createJSONStorage(() => AsyncStorage),
      // VAZNO: Zustand rehydracija ne poziva setJezik — direktno setuje state.
      // onRehydrateStorage poziva i18n.changeLanguage() odmah po ucitavanju iz AsyncStorage.
      onRehydrateStorage: () => (state) => {
        if (state?.jezik) i18n.changeLanguage(state.jezik);
      },
    }
  )
);
```

### `i18n/index.ts` — nova konfiguracija (ne postoji na webu)

```ts
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sr from '../messages/sr.json';
import en from '../messages/en.json';

i18n.use(initReactI18next).init({
  resources: { sr: { translation: sr }, en: { translation: en } },
  lng: 'sr',
  fallbackLng: 'sr',
  interpolation: { escapeValue: false },
});

export default i18n;
```

### `hooks/useT.ts` — helper koji emulira next-intl API

Web koristi `useTranslations('namespace')` + `t('kljuc')`.
Mobile koristi `useTranslation()` + `t('namespace.kljuc')`.
Wrapper minimizuje izmene u komponentama:

```ts
// hooks/useT.ts
import { useTranslation } from 'react-i18next';

export function useT(ns: string) {
  const { t } = useTranslation();
  return (key: string, opts?: object) => t(`${ns}.${key}`, opts);
}

// Upotreba u komponenti (identicno kao web):
// const t = useT('pocetna');
// t('naslov')  =>  trazi 'pocetna.naslov' u sr.json
```

## Sta izostaviti
- `src/i18n/routing.ts` — next-intl URL routing, ne postoji u RN
- `src/i18n/request.ts` — server-side i18n, ne postoji u RN
- `src/navigation.ts` — next-intl Link wrapper, zamenjuje Expo Router

## Commit
`feat: i18n konfiguracija + Zustand stores sa AsyncStorage`

## Proveri pre commita
- [ ] `t('pocetna.naslov')` vraca srpski string
- [ ] `i18n.changeLanguage('en')` menja jezik u celoj app
- [ ] `useTemaStore` perzistira temu kroz restart (testirati u Expo Go)
- [ ] `useJezikaStore` perzistira jezik kroz restart — UI je na engleskom odmah po otvaranju ako je prethodno biran engleski
- [ ] `pretragaStore` resetFilters() cisti q i filter na ''
