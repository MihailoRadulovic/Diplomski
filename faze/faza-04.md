# Faza 4 — Expo Router navigacija

## Opis
Kreiranje navigacione strukture sa Expo Router v4. Tab bar sa 5 tabova,
stack za detalje biljke, modal stack za auth. Prazni screen fajlovi.

## Zavisnosti
Faza 2, Faza 3

## Web referenca
```
src/app/[locale]/(main)/page.tsx         <- Pocetna
src/app/[locale]/(main)/pretraga/        <- Pretraga tab
src/app/[locale]/(main)/prepoznavanje/   <- Kamera tab
src/app/[locale]/(main)/omiljene/        <- Omiljene tab
src/app/[locale]/(main)/podesavanja/     <- Profil tab
src/app/[locale]/biljke/[slug]/          <- Detalji biljke (stack)
src/app/[locale]/(auth)/prijava/         <- Prijava
src/app/[locale]/(auth)/registracija/    <- Registracija
src/app/[locale]/(main)/layout.tsx       <- Main layout (Navbar na webu)
src/app/[locale]/(auth)/layout.tsx       <- Auth layout
```

Kljucna razlika: web koristi `[locale]` prefix za sve rute (next-intl URL routing).
Mobile ne koristi URL-based i18n — jezik se pamti u Zustand store.

## Struktura fajlova

```
app/
  _layout.tsx          <- Root: QueryClient, SafeArea, i18n init, tema
  (tabs)/
    _layout.tsx        <- Tab bar sa 5 tabova i ikonama
    index.tsx          <- Pocetna (prazna)
    pretraga.tsx       <- Pretraga (prazna)
    prepoznavanje.tsx  <- Kamera (prazna)
    omiljene.tsx       <- Omiljene (prazna)
    podesavanja.tsx    <- Podesavanja (prazna)
  biljka/
    [slug].tsx         <- Detalji biljke (prazna)
  (auth)/
    _layout.tsx        <- Auth layout
    prijava.tsx        <- Prijava (prazna)
    registracija.tsx   <- Registracija (prazna)
```

## Implementacija

### `app/_layout.tsx` — Root layout

SplashScreen se drzi do ucitavanja auth stanja. `preventAutoHideAsync()` mora biti
pozvan ODMAH — pre bilo kog `await` ili async poziva u layoutu.

```tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import '@/i18n'; // inicijalizacija i18n
import '@/global.css';

// Poziva se sinhrono — drzi splash dok auth init ne zavrsi
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Splash se sakriva tek kada je sve spremno.
    // Auth init i font load se dodaju ovde u Fazi 17 kada se ucitavaju fontovi.
    SplashScreen.hideAsync();
  }, []);

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

### `app/(tabs)/_layout.tsx` — Tab bar

```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#639922',
      tabBarInactiveTintColor: '#888',
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pocetna',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pretraga"
        options={{
          title: 'Pretraga',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prepoznavanje"
        options={{
          title: 'Kamera',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="omiljene"
        options={{
          title: 'Omiljene',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="podesavanja"
        options={{
          title: 'Podesavanja',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### `app/(auth)/_layout.tsx` — Auth layout

Sadrzaj ovog fajla nigde drugde nije prikazan. Definise Stack za auth ekrane i X dugme
za zatvaranje modala (korisnik moze odustati od prijave).

```tsx
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="prijava"
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
              <Ionicons name="close" size={24} color="#27500A" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="registracija"
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
              <Ionicons name="close" size={24} color="#27500A" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
```

---

### Auth guard za Omiljene tab

Web koristi middleware za redirect. Mobile koristi `useAuth` u komponenti:

```tsx
// app/(tabs)/omiljene.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function OmiljeneTab() {
  // Napomena: guest korisnici MOGU videti omiljene (cuvaju se u AsyncStorage)
  // Auth guard ovde nije potreban — web takodje dozvoljava gostima
  return <OmiljeneEkran />;
}
```

## Sta izostaviti
- `[locale]` prefix u rutama — nema URL-based i18n
- `src/middleware.ts` — nema servera
- `src/proxy.ts` — nema servera
- Breadcrumb navigacija — zamenjuje back dugme u headeru

## Commit
`feat: Expo Router navigacija, tab bar, root layout`

## Proveri pre commita
- [ ] App se pokrece i prikazuje tab bar sa 5 tabova
- [ ] Svaki tab je klikabilan (prazni ekrani su ok)
- [ ] Back dugme radi na biljka/[slug] stacku
- [ ] Modal se otvara za prijava i registracija ekrane
- [ ] QueryClient je dostupan (testirati pozivom `useQueryClient()`)
