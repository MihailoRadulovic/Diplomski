# Faza 9 — Pretraga

## Opis
Port ekrana za pretragu sa input-om, filterima i listom rezultata.
Kljucna razlika: nema `useDeferredValue` — debounce je u TextInput `onChangeText`.

## Zavisnosti
Faza 5, Faza 6, Faza 7

## Web referenca
```
src/app/[locale]/(main)/pretraga/page.tsx
src/app/[locale]/(main)/pretraga/PretragaKlijent.tsx
src/components/pretraga/PretragaInput/PretragaInput.tsx
src/components/pretraga/PretragaFilteri/PretragaFilteri.tsx
src/components/pretraga/PretragaFilteri/FilterChip.tsx
src/components/pretraga/PretragaRezultati/PretragaRezultati.tsx
src/stores/pretragaStore.ts
src/hooks/usePretraga.ts
```

---

## `app/(tabs)/pretraga.tsx` — Pretraga ekran

```tsx
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { usePretragaStore } from '@/stores/pretragaStore';
import { PretragaInput } from '@/components/pretraga/PretragaInput/PretragaInput';
import { PretragaFilteri } from '@/components/pretraga/PretragaFilteri/PretragaFilteri';
import { PretragaRezultati } from '@/components/pretraga/PretragaRezultati/PretragaRezultati';
import { usePretraga } from '@/hooks/usePretraga';

export default function PretragaTab() {
  // Citanje filter parametra koji moze doci sa pocetne stranice (PopularniFilteri)
  const params = useLocalSearchParams<{ filter?: string }>();
  const { q, filter, setQ, setFilter } = usePretragaStore();
  const [strana, setStrana] = useState(1);

  // Inicijalizacija filtera iz navigacionih parametara
  useEffect(() => {
    if (params.filter) setFilter(params.filter);
  }, [params.filter]);

  const { biljke, ukupno, ukupno_strana, isLoading } = usePretraga({ q, filter, strana });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <View className="flex-1 px-4 pt-4">
        <PretragaInput value={q} onSearch={(noviQ) => { setQ(noviQ); setStrana(1); }} />
        <PretragaFilteri aktivni_filter={filter} onFilterChange={(f) => { setFilter(f); setStrana(1); }} />
        <PretragaRezultati
          biljke={biljke}
          ukupno={ukupno}
          isLoading={isLoading}
          strana={strana}
          ukupno_strana={ukupno_strana}
          onStranaChange={setStrana}
        />
      </View>
    </SafeAreaView>
  );
}
```

---

## `PretragaInput`

Web: `<input type="text">` sa kontrolisanom vrednosti i debounce-om kroz `useDeferredValue` u hoooku.
Mobile: `TextInput` sa debounce-om direktno u `onChangeText`.

```tsx
// components/pretraga/PretragaInput/PretragaInput.tsx
import { useRef } from 'react';
import { TextInput, View, Pressable } from 'react-native';

const DEBOUNCE_MS = 300;

interface PretragaInputProps {
  value: string;
  onSearch: (q: string) => void;
}

export function PretragaInput({ value, onSearch }: PretragaInputProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (tekst: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(tekst), DEBOUNCE_MS);
  };

  return (
    <View className="flex-row items-center border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-zinc-900">
      {/* Lupa ikona */}
      <TextInput
        defaultValue={value}
        onChangeText={handleChange}
        placeholder="Pretrazite bilje..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-tekst-primarni dark:text-white"
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Pretraga bilja"
      />
    </View>
  );
}
```

Napomena: `defaultValue` umesto `value` jer je input "uncontrolled" dok debounce ne okine.

---

## `PretragaFilteri` i `FilterChip`

Web: horizontalni div sa overflow-x-auto. Mobile: `ScrollView` horizontal.

```tsx
// components/pretraga/PretragaFilteri/PretragaFilteri.tsx
import { ScrollView } from 'react-native';
import { TAGOVI } from '@/lib/constants/tagovi';
import { useT } from '@/hooks/useT';
import { FilterChip } from './FilterChip';

interface PretragaFilteriProps {
  aktivni_filter: string;
  onFilterChange: (filter: string) => void;
}

export function PretragaFilteri({ aktivni_filter, onFilterChange }: PretragaFilteriProps) {
  const t = useT('tagovi');
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
      {TAGOVI.map((tag) => (
        <FilterChip
          key={tag.filter}
          // tag.filter sadrzi vrednost koja se trazi u `delovanje` koloni (nema `tagovi` kolone u bazi)
          label={tag.label.sr}  // ili t(tag.filter) za lokalizovanu labelu
          aktivan={aktivni_filter === tag.filter}
          onPress={() => onFilterChange(aktivni_filter === tag.filter ? '' : tag.filter)}
        />
      ))}
    </ScrollView>
  );
}
```

---

## `PretragaRezultati`

Web: grid 3 kolone na desktopu, 2 na tablet, 1 na mobilnom. Paginacija dugmadima.
Mobile: `FlashList` sa 2 kolone. Paginacija kroz `onEndReached` (beskonacni scroll)
ILI dugmad "Prethodna/Sledeca" (jednostavnije).

```tsx
import { FlashList } from '@shopify/flash-list';
import { BiljkaKartica } from '@/components/biljke/BiljkaKartica/BiljkaKartica';

export function PretragaRezultati({ biljke, isLoading, ukupno }) {
  if (isLoading) return <PretragaRezultatiSkeleton />;
  if (biljke.length === 0) return <EmptyState tekst="Nema rezultata" />;

  return (
    <FlashList
      data={biljke}
      numColumns={2}
      estimatedItemSize={200}
      renderItem={({ item }) => (
        <BiljkaKartica
          key={item.id}
          {...item}
          glavna_slika_url={item.biljka_slike?.find(s => s.je_glavna)?.url ?? item.biljka_slike?.[0]?.url}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## `po_strani` i paginacija

Web dinamicki menja `po_strani` na osnovu `window.innerWidth` (10 za mobilni, 21 za desktop).
Mobile: fiksno `PO_STRANI = 21` (definisano u `usePretraga.ts`).

Za paginaciju preporuka: `onEndReached` sa `onEndReachedThreshold={0.3}` za beskonacni scroll
umesto web-style dugmadi "Sledeca stranica" (prirodniji UX na mobilnom).

## Sta izostaviti
- `sessionStorage` za cuvanje scroll pozicije — Expo Router resava ovo automatski
- `window.innerWidth` za `po_strani` — fiksno 21
- `useDeferredValue` — zamenjeno debounce-om u TextInput
- `useRouter().replace()` za URL sync — nema URL-based state na mobilnom
- Keyboard shortcuts (`PretragaShortcut`, `TastaturnePercice`) — ne postoje na mobilnom

## Commit
`feat: pretraga — input, filteri, rezultati sa FlashList`

## Proveri pre commita
- [ ] Kucanje u input okida pretragu sa 300ms debounce-om (ne za svako slovo)
- [ ] Inicijalni state prikazuje 9 random biljaka
- [ ] Filter chip toggle radi (aktiviran = zeleni, drugi klik = ocistiti filter)
- [ ] Pretraga "kamilica" vraca relevantne rezultate
- [ ] Pretraga "nervni" vraca biljke sa tim tagom/delovanjem
- [ ] Tap na karticu otvara detalje biljke
- [ ] Loading skeleton se prikazuje dok se podaci ucitavaju
- [ ] Empty state se prikazuje kad nema rezultata
- [ ] Filter parametar sa pocetne stranice (PopularniFilteri tap) se primenjuje
