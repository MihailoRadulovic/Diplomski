# Faza 15 — Dark mode finalizacija

## Opis
Provjera i doradu dark mode-a kroz celu aplikaciju. Web koristi Tailwind `dark:` klase
sa `class` strategijom (html element). Mobile koristi NativeWind v4 sa `colorScheme`
iz `useColorScheme` hooka i `temaStore` koji mapira "svetla"/"tamna"/"sistem" na
React Native ColorScheme.

## Zavisnosti
Faza 3 (temaStore, useTheme), sve prethodne faze

## Web referenca
```
src/stores/temaStore.ts
src/hooks/useTheme.ts
tailwind.config.ts   (darkMode: 'class')
```

---

## Kako dark mode radi na mobilnom

### temaStore + useTheme

Portovano u Fazi 3. Kljucna logika:

```ts
// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { useTemaStore } from '@/stores/temaStore';

export function useTheme() {
  const { tema, setTema } = useTemaStore();
  const sistemskaTema = useColorScheme(); // 'light' | 'dark' | null

  const aktivnaTema: 'light' | 'dark' =
    tema === 'sistem'
      ? (sistemskaTema ?? 'light')
      : tema === 'tamna' ? 'dark' : 'light';

  return { tema, setTema, aktivnaTema };
}
```

### NativeWind v4 konfiguracija

NativeWind v4 automatski cita `colorScheme` iz React Native. Dodati u `_layout.tsx`:

```tsx
// app/_layout.tsx
import { useTheme } from '@/hooks/useTheme';
import { useColorScheme } from 'nativewind';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { aktivnaTema } = useTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(aktivnaTema);
  }, [aktivnaTema]);

  return <>{children}</>;
}
```

Alternativa: direktno u `_layout.tsx` bez posebne komponente:
```tsx
const { aktivnaTema } = useTheme();
const { setColorScheme } = useColorScheme();
useEffect(() => { setColorScheme(aktivnaTema); }, [aktivnaTema]);
```

---

## Tailwind boje — napomena o dark varijantama

Custom boje su definisane u Fazi 1 (`tailwind.config.js`) kao obicne string vrednosti.
NativeWind/Tailwind NE podrzava nested `{ DEFAULT, dark }` sintaksu za automatske dark varijante.

Dark varijante se pisu DIREKTNO u komponentama kroz `dark:` prefix:

```tsx
// ISPRAVNO:
<Text className="text-tekst-primarni dark:text-[#E8F5E2]">Naziv</Text>
<View className="bg-pozadina dark:bg-[#0F1A08]">...</View>
<View className="bg-pozadina-kartica dark:bg-[#162510]">...</View>
<View className="border-ivica dark:border-[#2D4A1E]">...</View>

// POGRESNO (ne generise dark klase automatski):
// 'tekst-primarni': { DEFAULT: '#27500A', dark: '#E8F5E2' }
```

Referentne dark vrednosti po boji:
| Klasa | Light | Dark |
|-------|-------|------|
| `tekst-primarni` | `#27500A` | `#E8F5E2` |
| `tekst-sekundarni` | `#4A7A28` | `#A8D080` |
| `pozadina` | `#FFFFFF` | `#0F1A08` |
| `pozadina-surface` | `#F5F9F0` | `#1A2D10` |
| `pozadina-kartica` | `#EAF3DE` | `#162510` |
| `ivica` | `#C8DEB8` | `#2D4A1E` |

---

## Komponente koje zahtevaju paznjo za dark mode

### StatusBar

```tsx
// app/_layout.tsx
import { StatusBar } from 'expo-status-bar';

// U render-u:
<StatusBar style={aktivnaTema === 'dark' ? 'light' : 'dark'} />
```

### SafeAreaView pozadina

Svi ekrani imaju `bg-white dark:bg-[#0F1A08]` na SafeAreaView. Proveriti svaki ekran.

### TextInput

```tsx
<TextInput
  className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900
             text-zinc-900 dark:text-white placeholder:text-zinc-400"
  placeholderTextColor="#9CA3AF"  // mora biti inline — NW ne podrzava placeholder boju
/>
```

### Image placeholder boja

```tsx
<View className="bg-[#EAF3DE] dark:bg-[#162510]">
```

### Skeleton animacija

Skeleton treba da koristi `bg-zinc-200 dark:bg-zinc-700` ili `bg-[#EAF3DE] dark:bg-[#1E3515]`.

---

## Sta proveriti po ekranu

| Ekran | Elementi za proveru |
|-------|---------------------|
| Pocetna | Hero pozadina, kartice, nedavno pregledano |
| Pretraga | Input border, filter chipovi, kartice |
| Biljka detalji | Pozadina, tagovi, upozorenja, sekcije |
| Prepoznavanje | Dugmadi, organ chipovi, rezultat kartica |
| Omiljene | Kartice, gost baner, prazno stanje |
| Auth ekrani | Forma, linkovi |
| Podesavanja | Chipovi, auth sekcija |

---

## Sta izostaviti
- `class` strategija (Tailwind) — NativeWind v4 koristi `colorScheme` API
- `document.documentElement.classList.toggle('dark')` — DOM nema ekvivalenta u RN
- CSS varijable (`--color-*`) — NativeWind ne koristi CSS var na mobilnom

## Commit
`fix: dark mode — finalizacija kroz sve ekrane i komponente`

## Proveri pre commita
- [ ] Prebacivanje Svetla → Tamna → Sistem menja temu odmah (bez restarta)
- [ ] Sistemska tema se postuje kada je "Sistem" izabrano
- [ ] StatusBar je beo tekst na tamnoj temi, crn na svetloj
- [ ] Svi ekrani: pozadina, tekst, border se menjaju ispravno
- [ ] TextInput placeholder boja je vidljiva na obe teme
- [ ] Skeleton ima odgovarajucu tamnu varijantu
- [ ] Biljka detalji: upozorenja i tagovi izgledaju ispravno u dark mode-u
- [ ] Omiljene: gost baner (`bg-[#FAEEDA]`) ima tamnu varijantu
- [ ] Nema hardkodovanih belih ili crnih boja koje se ne menjaju sa temom
