# Faza 5 — UI primitive komponente

## Opis
Kreiranje svih baznih UI komponenti sa NativeWind klasama i dark mode varijantama.
Ovo su "gradivni blokovi" — sve ostale faze ih koriste.

## Zavisnosti
Faza 3, Faza 4

## Web referenca
```
src/components/ui/Button/Button.tsx + Button.types.ts
src/components/ui/Card/Card.tsx
src/components/ui/Badge/Badge.tsx
src/components/ui/Input/Input.tsx
src/components/ui/Spinner/Spinner.tsx
src/components/ui/Skeleton/Skeleton.tsx
src/components/ui/Toast/Toast.tsx
src/components/ui/Disclaimer/Disclaimer.tsx
src/components/ui/Tooltip/Tooltip.tsx     <- ne portovati
src/components/ui/Breadcrumb/Breadcrumb.tsx  <- ne portovati
src/components/empty/EmptyState/EmptyState.tsx
src/components/error/ErrorBoundary/ErrorBoundary.tsx
src/components/error/ErrorBoundary/ErrorFallback.tsx
src/components/layout/SkipLink/SkipLink.tsx  <- ne portovati
```

## Font — odluka se donosi OVDE (koristi se od ove faze nadalje)

Georgia nije garantovana na Androidu. Koristiti `PlayfairDisplay` kao konzistentnu zamenu:

```bash
npx expo install @expo-google-fonts/playfair-display
```

Definisati font konstantu koja se koristi u SVIM komponentama:
```ts
// lib/constants/fontovi.ts
export const SERIF_BOLD = 'PlayfairDisplay-Bold';
export const SERIF_ITALIC = 'PlayfairDisplay-Italic';
export const SERIF_REGULAR = 'PlayfairDisplay-Regular';
```

Ucitavanje fontova ide u `app/_layout.tsx` (finalizuje se u Fazi 17), ali konstante
se koriste odmah od ove faze. Sve komponente koje prikazuju nazive biljaka ili naslove
pisu `style={{ fontFamily: SERIF_BOLD }}` — nikad hardkodovani `'Georgia'`.

---

## Komponente i kljucne razlike

### Button
Web: `<button>` HTML element sa Tailwind klasama i hover/focus stanjima.
Mobile: `Pressable` sa `activeOpacity` za feedback.

```tsx
// components/ui/Button/Button.tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ onPress, label, variant = 'primary', loading, disabled }: ButtonProps) {
  const base = 'flex-row items-center justify-center px-4 py-3 rounded-xl';
  const variants = {
    primary: 'bg-[#639922]',
    outline: 'border border-[#639922]',
    ghost: '',
  };
  const textVariants = {
    primary: 'text-white font-semibold',
    outline: 'text-[#639922] font-semibold',
    ghost: 'text-[#639922]',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? 'white' : '#639922'} />
        : <Text className={textVariants[variant]}>{label}</Text>
      }
    </Pressable>
  );
}
```

### Card
Web: `<div>` sa shadow i border. Mobile: `View` sa NativeWind shadow.
```tsx
// components/ui/Card/Card.tsx
import { View } from 'react-native';
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 ${className}`}>
      {children}
    </View>
  );
}
```

### Badge
Web: `<span>`. Mobile: `View` + `Text`.
```tsx
// components/ui/Badge/Badge.tsx
import { View, Text } from 'react-native';
type Variant = 'green' | 'amber' | 'red';
const styles: Record<Variant, { bg: string; text: string }> = {
  green:  { bg: 'bg-[#EAF3DE]', text: 'text-[#27500A]' },
  amber:  { bg: 'bg-[#FAEEDA]', text: 'text-[#7A4F00]' },
  red:    { bg: 'bg-red-100',   text: 'text-red-800' },
};
export function Badge({ children, variant = 'green' }: { children: string; variant?: Variant }) {
  return (
    <View className={`px-2 py-0.5 rounded-full ${styles[variant].bg}`}>
      <Text className={`text-xs font-medium ${styles[variant].text}`}>{children}</Text>
    </View>
  );
}
```

### Input
Web: `<input>` HTML. Mobile: `TextInput` sa `accessibilityLabel`.
- `focus-visible:ring` → `onFocus`/`onBlur` state sa border color promenom
- `aria-invalid` → `accessibilityState={{ invalid: hasError }}`

### Spinner
Web: CSS animate-spin div. Mobile: `ActivityIndicator` iz React Native.
```tsx
import { ActivityIndicator } from 'react-native';
export function Spinner({ size = 'small' }: { size?: 'small' | 'large' }) {
  return <ActivityIndicator size={size} color="#639922" />;
}
```

### Skeleton
Web: CSS pulsing div. Mobile: `Animated.View` sa interpoliranom opacity, ili `expo-linear-gradient`.
```tsx
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
export function Skeleton({ className = '' }: { className?: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
  return <Animated.View style={{ opacity }} className={`bg-zinc-300 dark:bg-zinc-700 rounded-lg ${className}`} />;
}
```

### Toast
Web: fixed position div u uglu ekrana. Mobile: Animated.View koji se pojavljuje i nestaje.
Prikazati na vrhu ili dnu ekrana, trajanje 3s.

### Disclaimer
Web: `<p>` sa tekstom. Mobile: `Text` komponenta — kopirati tekst 1:1.

### EmptyState
Web: botanicka SVG ilustracija + tekst + CTA link. Mobile: isti SVG kroz `react-native-svg`.
- Web `<Link>` → `Button` komponenta ili `Pressable` sa `router.push`

### ErrorBoundary / ErrorFallback
Web: React class component ErrorBoundary. Mobile: identican pattern — class component radi u RN.
Kopirati logiku 1:1, zameniti web-specificne HTML tagove sa RN komponentama (`View`, `Text`).

### ScreenWrapper (novo — nema na webu)
```tsx
// components/layout/ScreenWrapper/ScreenWrapper.tsx
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
```

## Sta izostaviti
- `Tooltip` — ne postoji prirodan ekvivalent na mobilnom
- `Breadcrumb` — zamenjuje back dugme u navigaciji
- `SkipLink` — accessibility web pattern, ne primenjuje se na mobilnom

## Commit
`feat: UI primitive komponente — Button, Card, Badge, Input, Spinner, Skeleton, Toast, Disclaimer, EmptyState, ErrorBoundary, ScreenWrapper`

## Proveri pre commita
- [ ] Svaka komponenta se renderuje bez gresaka
- [ ] Dark mode varijante rade (`dark:` klase)
- [ ] Button loading state prikazuje ActivityIndicator
- [ ] Skeleton animacija radi (loop pulsing)
- [ ] ErrorBoundary hvata greske u child komponentama
- [ ] ScreenWrapper pravi scroll i respektuje safe area (notch)
- [ ] `lib/constants/fontovi.ts` postoji i izvozi `SERIF_BOLD`, `SERIF_ITALIC`, `SERIF_REGULAR`
- [ ] Nijedna komponenta ne koristi hardkodovani `fontFamily: 'Georgia'`
