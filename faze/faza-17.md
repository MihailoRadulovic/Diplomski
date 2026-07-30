# Faza 17 — Fontovi i vizuelni detalji

## Opis
Ucitavanje Georgia fonta (ili slobodnog ekvivalenta), ikone kroz `@expo/vector-icons`
ili custom SVG-ove, splash screen i app icon konfiguracija.

## Zavisnosti
Faza 1 (app.json konfiguracija)

## Web referenca
```
src/app/layout.tsx        (font loading: next/font)
src/app/globals.css       (font-family fallback)
public/icons/             (SVG ikone)
```

---

## Fontovi

### Odluka je doneta u Fazi 5

Font je izabran i konstante su definisane u `lib/constants/fontovi.ts` u Fazi 5.
Sve komponente od Faze 5 nadalje vec koriste `SERIF_BOLD`, `SERIF_ITALIC`, `SERIF_REGULAR`
iz te konstante — nema potrebe za pretragom i zamenom `Georgia` stringova.

Ova faza samo ucitava fontove u `app/_layout.tsx` i integrise splash screen:

```bash
npx expo install expo-font @expo-google-fonts/playfair-display
```

```tsx
// app/_layout.tsx — kompletna verzija sa fontovima i splash screen
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import '@/i18n';
import '@/global.css';

// Sinhrono — drzati splash dok fontovi nisu ucitani (definisano vec u Fazi 4)
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Dok fontovi nisu ucitani — splash screen se drzi, komponenta vraca null
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="biljka/[slug]" options={{ headerShown: true, title: '' }} />
            <Stack.Screen name="(auth)/prijava" options={{ presentation: 'modal', title: 'Prijava' }} />
            <Stack.Screen name="(auth)/registracija" options={{ presentation: 'modal', title: 'Registracija' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

### Konacna verzija `app/_layout.tsx` — tema + fontovi + splash

Ovo je kompletan fajl koji spaja fazu 4 (Stack struktura), fazu 15 (tema + StatusBar)
i fazu 17 (ucitavanje fontova). Koristiti ovu verziju kao finalnu.

```tsx
// app/_layout.tsx — kompletna verzija
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useTheme } from '@/hooks/useTheme';
import '@/i18n';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { aktivnaTema } = useTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(aktivnaTema);
  }, [aktivnaTema]);

  return (
    <>
      <StatusBar style={aktivnaTema === 'dark' ? 'light' : 'dark'} />
      {children}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="biljka/[slug]" options={{ headerShown: true, title: '' }} />
              <Stack.Screen name="(auth)/prijava" options={{ presentation: 'modal', title: '' }} />
              <Stack.Screen name="(auth)/registracija" options={{ presentation: 'modal', title: '' }} />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## Ikone

### `@expo/vector-icons`

Vec dostupno u Expo bez instalacije. Preporucen set: `Ionicons` ili `MaterialCommunityIcons`.

```tsx
import { Ionicons } from '@expo/vector-icons';

// Kamera ikona (prepoznavanje)
<Ionicons name="camera-outline" size={32} color="#639922" />

// Galerija
<Ionicons name="images-outline" size={32} color="#639922" />

// Srce (omiljene — prazno)
<Ionicons name="heart-outline" size={20} color="#639922" />

// Srce (omiljene — puno)
<Ionicons name="heart" size={20} color="#639922" />

// Pretraga
<Ionicons name="search-outline" size={18} color="#9CA3AF" />

// Deli
<Ionicons name="share-outline" size={20} color="#639922" />

// Kopiraj
<Ionicons name="copy-outline" size={16} color="#639922" />

// Lupa (lupa — search input)
<Ionicons name="search" size={16} color="#9CA3AF" />

// Nazad
<Ionicons name="arrow-back" size={24} color="#27500A" />

// Zatvori (X)
<Ionicons name="close" size={24} color="#27500A" />

// Upozorenje
<Ionicons name="warning-outline" size={16} color="#F59E0B" />
```

Tabbar ikone (vec konfigurisano u Fazi 4 — proveriti konzistentnost):
```tsx
// Pocetna: home-outline / home
// Pretraga: search-outline / search
// Prepoznavanje: camera-outline / camera
// Omiljene: heart-outline / heart
// Podesavanja: settings-outline / settings
```

---

## App icon i splash screen

### app.json konfiguracija

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#EAF3DE"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#EAF3DE"
      }
    }
  }
}
```

Kreirati ikone u `assets/images/`:
- `icon.png` — 1024x1024 (iOS)
- `adaptive-icon.png` — 1024x1024 (Android foreground)
- `splash-icon.png` — centralna ikona na splash screenu

Splash screen boja `#EAF3DE` odgovara svetloj pozadini kartica.

### expo-splash-screen (vec instaliran)

Splash screen ostaje do ucitavanja fontova i auth init-a:

```tsx
// app/_layout.tsx
useEffect(() => {
  async function init() {
    await Promise.all([
      // cekaj font load
      // cekaj auth init
    ]);
    await SplashScreen.hideAsync();
  }
  init();
}, []);
```

---

## Vizuelni detalji

### Senke

```tsx
// iOS senka
style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,  // Android
}}
```

NativeWind shadow klase (ogranicene na mobilnom — koristiti `style` za fine kontrole).

### Zaobljeni uglovi

Web koristi `rounded-2xl` (16px). Konzistentno koristiti iste klase kroz mobilnu aplikaciju.

### Razmaci

Web `space-y-6` / `gap-4` — NativeWind podrzava ove klase. Proveriti da su konzistentni.

### Biljka ikona (placeholder za sliku)

Kada nema slike za biljku — SVG ili Ionicons ikona biljke kao placeholder:
```tsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="leaf-outline" size={32} color="#639922" opacity={0.5} />
```

---

## Commit
`feat: fontovi, ikone i splash screen konfiguracija`

## Proveri pre commita
- [ ] Georgia (ili PlayfairDisplay) se prikazuje ispravno na iOS i Android
- [ ] Naslovi koriste serif font konzistentno kroz aplikaciju
- [ ] Sve ikone su prikazane (kamera, galerija, srce, lupa, share, copy)
- [ ] Tabbar ikone se menjaju (outline → filled) pri aktivnom tabu
- [ ] Splash screen se prikazuje sa zelenom pozadinom i logotipom
- [ ] App ikona je vidljiva na home screen-u
- [ ] Placeholder (leaf ikona) se prikazuje kada biljka nema sliku
- [ ] Nema vidljivog FOUC (flash of unstyled content) pri pokretanju
