# Faza 8 — Pocetna stranica

## Opis
Port svih 5 komponenti pocetne stranice. Web pocetna (`page.tsx`) renderuje:
PocetnaHero → NedavnoPregledano → BiljkaDanaSekcija → PopularniFilteri.
Plus IznenadimeDugme unutar PocetnaHero.

## Zavisnosti
Faza 5, Faza 6, Faza 7

## Web referenca
```
src/app/[locale]/(main)/page.tsx
src/components/pocetna/PocetnaHero/PocetnaHero.tsx
src/components/pocetna/IznenadimeDugme/IznenadimeDugme.tsx
src/components/pocetna/NedavnoPregledano/NedavnoPregledano.tsx
src/components/pocetna/BiljkaDanaSekcija/BiljkaDanaSekcija.tsx
src/components/pocetna/PopularniFilteri/PopularniFilteri.tsx
src/hooks/useAuth.ts             <- za personalizovani pozdrav
src/hooks/useBiljkaDana.ts       <- za BiljkaDanaSekcija
```

---

## `app/(tabs)/index.tsx` — Pocetni ekran

```tsx
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PocetnaHero } from '@/components/pocetna/PocetnaHero/PocetnaHero';
import { NedavnoPregledano } from '@/components/pocetna/NedavnoPregledano/NedavnoPregledano';
import { BiljkaDanaSekcija } from '@/components/pocetna/BiljkaDanaSekcija/BiljkaDanaSekcija';
import { PopularniFilteri } from '@/components/pocetna/PopularniFilteri/PopularniFilteri';

export default function PocetnaTab() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['biljka-dana'] });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PocetnaHero />
        <NedavnoPregledano />
        <BiljkaDanaSekcija />
        <PopularniFilteri />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## `PocetnaHero`

Web: sekcija sa naslovom, personalizovanim pozdravom, search barom i 2 CTA dugmeta.
Mobile: bez search bara u hero-u (search je na zasebnom tabu) — samo naslov, pozdrav i dugmad.

```
Sta portovati:
- Personalizovani pozdrav (useAuth → ime korisnika)
- Naslov aplikacije "Lekovito Bilje" (Georgia bold)
- Podnaslov / opis
- CTA dugme "Pregledaj bilje" → router.push('/(tabs)/pretraga')
- CTA dugme "Prepoznaj biljku" → router.push('/(tabs)/prepoznavanje')
- IznenadimeDugme

Sta izostaviti:
- Search input u hero-u (korisnik ima pretraga tab)
- Dekorativni listovi u pozadini (Image sa opacity) — opciono portovati
```

---

## `IznenadimeDugme`

Web: poziva `/api/pretraga?po_strani=1` da dobije ukupan broj, pa random biljku.
Mobile: poziva Supabase direktno.

```ts
const handleKlik = async () => {
  setUcitava(true);
  try {
    const { count } = await supabase
      .from('biljke')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    if (!count || count === 0) return;

    const offset = Math.floor(Math.random() * count);
    const { data } = await supabase
      .from('biljke')
      .select('slug')
      .is('deleted_at', null)
      .order('srpski_naziv')
      .range(offset, offset)
      .single();

    if (data?.slug) router.push(`/biljka/${data.slug}`);
  } finally {
    setUcitava(false);
  }
};
```

---

## `NedavnoPregledano`

Web: cita iz localStorage, osvezava na window focus event.
Mobile: cita iz AsyncStorage, osvezava pri `useFocusEffect` (Expo Router).

```tsx
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { useNedavnoPregledano } from '@/hooks/useNedavnoPregledano';

export function NedavnoPregledano() {
  const { stavke, osvezi } = useNedavnoPregledano();

  // useFocusEffect se poziva svaki put kada ekran dobije fokus (ekvivalent window focus)
  // Osvezava listu jer je korisnik mozda posetio novu biljku na drugom tabu
  useFocusEffect(useCallback(() => {
    osvezi();
  }, []));

  if (stavke.length === 0) return null;

  return (
    <View className="px-4 mb-6">
      <Text className="text-xl font-semibold text-tekst-primarni dark:text-white mb-3" style={{ fontFamily: SERIF_BOLD }}>
        Nedavno pregledano
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stavke.map((s) => (
          <Pressable key={s.slug} onPress={() => router.push(`/biljka/${s.slug}`)} className="mr-3 items-center w-24">
            <View className="w-16 h-16 rounded-lg overflow-hidden bg-[#EAF3DE]">
              {s.slika_url
                ? <Image source={{ uri: s.slika_url }} style={{ width: 64, height: 64 }} contentFit="cover" />
                : <View className="flex-1 items-center justify-center">{/* ikona */}</View>
              }
            </View>
            <Text className="text-xs font-medium text-center mt-1 leading-tight" numberOfLines={2} style={{ fontFamily: SERIF_BOLD }}>
              {s.srpski_naziv}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
```

---

## `BiljkaDanaSekcija`

Web: kartica biljke dana sa slikom, naslovom i kratkim opisom.
Mobile: isti sadrzaj, koristiti `useBiljkaDana` hook (vec portovan u Fazi 6).

Sta portovati:
- `useBiljkaDana()` za ucitavanje podataka
- Skeleton tokom ucitavanja
- Slika, naziv (Georgia), latinski naziv, kratki opis (max 2-3 linije)
- Tap → `router.push('/biljka/' + biljka.slug)`

---

## `PopularniFilteri`

Web: horizontalni scroll sa filter chip-ovima iz `TAGOVI` konstante.
Mobile: horizontalni `ScrollView` sa Pressable chip-ovima.

Tap na chip → navigacija na pretraga tab sa filterom:
```ts
router.push({ pathname: '/(tabs)/pretraga', params: { filter: tag.filter } });
```

Pretraga tab treba da procita `filter` parametar iz `useLocalSearchParams()`.

## Sta izostaviti
- `generateMetadata` / SEO — ne postoji na mobilnom
- `window.scrollTo` / `sessionStorage` scroll pozicija — ne primenjuje se
- Breadcrumb navigacija

## Commit
`feat: pocetna stranica — hero, nedavno pregledano, biljka dana, filteri`

## Proveri pre commita
- [ ] Pull-to-refresh ucitava novu biljku dana (ako se promenio datum)
- [ ] NedavnoPregledano prikazuje biljke nakon sto se poseti neka stranica detalja
- [ ] NedavnoPregledano se osvezava pri povratku na pocetnu (useFocusEffect)
- [ ] NedavnoPregledano se ne prikazuje kada nema poseta (vraca null)
- [ ] BiljkaDanaSekcija prikazuje Skeleton tokom ucitavanja
- [ ] BiljkaDanaSekcija tap otvara detalje biljke
- [ ] PopularniFilteri chip tap navigira na pretraga tab sa filterom
- [ ] IznenadimeDugme otvara random biljku
- [ ] Personalizovani pozdrav prikazuje ime korisnika kada je ulogovan
- [ ] Dark mode izgleda ispravno na svim sekcijama
