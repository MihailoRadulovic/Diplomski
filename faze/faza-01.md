# Faza 1 — Inicijalizacija projekta

## Opis
Kreiranje novog Expo projekta sa TypeScript templateom i instalacija svih zavisnosti.
Nema web reference — ovo je cist setup korak.

## Zavisnosti
Nema.

## Koraci

### 1. Kreirati projekat
```bash
npx create-expo-app@latest LekovitoBiljeApp --template blank-typescript
```

### 2. Instalirati zavisnosti
```bash
npm install expo-router expo-splash-screen
npm install nativewind tailwindcss
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install @tanstack/react-query
npm install zustand
npm install expo-image-picker expo-image expo-font expo-localization expo-clipboard
npm install react-i18next i18next
npm install @shopify/flash-list
npm install react-native-safe-area-context react-native-gesture-handler
npm install zod
```

### 2.5 Dodati entry point u `package.json`

Expo Router zahteva eksplicitan `main` entry — bez ovoga file-based routing ne radi:

```json
{
  "main": "expo-router/entry"
}
```

### 3. Podesiti `app.json`
```json
{
  "expo": {
    "name": "Lekovito Bilje",
    "slug": "lekovito-bilje",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "lekovitobilje",
    "platforms": ["android"],
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#EAF3DE"
      },
      "package": "com.lekovitobilje.app"
    }
  }
}
```

### 4. Kreirati `tailwind.config.js`

Sve custom boje se definisu ODMAH — komponente ih koriste od Faze 5 nadalje.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primarne boje dizajn sistema
        'zelena-primarna': '#639922',
        'zelena-tamna': '#27500A',
        'zelena-svetla': '#EAF3DE',
        'amber-akcenat': '#EF9F27',
        'amber-svetla': '#FAEEDA',
        // Semanticke boje teksta (light / dark vrednosti se navode inline kroz dark: prefix)
        'tekst-primarni': '#27500A',
        'tekst-sekundarni': '#4A7A28',
        'tekst-blagi': '#6B8F58',
        // Semanticke boje pozadine
        'pozadina': '#FFFFFF',
        'pozadina-surface': '#F5F9F0',
        'pozadina-kartica': '#EAF3DE',
        'pozadina-hover': '#E0EDD4',
        // Ivice
        'ivica': '#C8DEB8',
        'ivica-blaga': '#DCE8CC',
      },
    },
  },
  plugins: [],
};
```

Dark varijante se pisu direktno u komponentama kroz `dark:` prefix:
```tsx
// Primer: tekst-primarni u dark modu
<Text className="text-tekst-primarni dark:text-[#E8F5E2]">...</Text>
<View className="bg-pozadina dark:bg-[#0F1A08]">...</View>
```

### 5. Kreirati `global.css`
```css
@import 'tailwindcss';
```

### 6. Azurirati `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

### 7. Kreirati `tsconfig.json` sa path aliasima
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 8. Kreirati `.env`
```env
EXPO_PUBLIC_SUPABASE_URL=https://wttgvqoubnsbxohiapcm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6TOlNFeRZ0-dus2PIGIcyw_J5gJ-CcZ
EXPO_PUBLIC_VERCEL_API_URL=https://[tvoj-vercel-url]
```

### 9. Kreirati `metro.config.js` (potrebno za NativeWind)
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

## Commit
`chore: inicijalizacija Expo projekta sa zavisnostima`

## Proveri pre commita
- [ ] `npx expo start` se pokree bez gresaka
- [ ] TypeScript kompajlira (`npx tsc --noEmit`)
- [ ] `.env` je u `.gitignore`
- [ ] NativeWind klase se primenjuju (test sa `className="text-zelena-primarna"`)
- [ ] `package.json` ima `"main": "expo-router/entry"`
- [ ] `expo-router` i `expo-splash-screen` su u `node_modules`
- [ ] Custom boje (`tekst-primarni`, `pozadina-kartica` itd.) su dostupne u Tailwindu
