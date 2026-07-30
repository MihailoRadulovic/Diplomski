# Faza 12 — Omiljene

## Opis
Port ekrana omiljenih biljaka. Dve putanje: gost (AsyncStorage) i ulogovan (Supabase).
Gost stavke se ucitavaju direktno iz Supabase jednim `.in()` upitom.
GuestOmiljenaBaner se prikazuje pri prvom sacuvavanju kao gost.

## Zavisnosti
Faza 5, Faza 6, Faza 7

## Web referenca
```
src/app/[locale]/(main)/omiljene/OmiljeneKlijent.tsx
src/components/biljke/OmiljenaToggle/GuestOmiljenaBaner.tsx
src/hooks/useOmiljene.ts
src/lib/guestOmiljene.ts
```

---

## `app/(tabs)/omiljene.tsx` — Omiljene ekran

Logika 1:1 iz `OmiljeneKlijent.tsx`. Tri stanja: `jeGost === null` (init loading),
`jeGost === true` (gost prikaz), `jeGost === false` (auth prikaz).

```tsx
// app/(tabs)/omiljene.tsx
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { FlashList } from '@shopify/flash-list';
import { useOmiljene } from '@/hooks/useOmiljene';
import { BiljkaKartica } from '@/components/biljke/BiljkaKartica/BiljkaKartica';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { supabase } from '@/lib/supabase/client';
import { guestPreostaliDani } from '@/lib/utils/guestOmiljene';

export default function OmiljeneTab() {
  const {
    omiljene,
    isLoading,
    toggleOmiljena,
    jeGost,
    guestStavke,
    toggleGuestOmiljena,
    showGuestBaner,
    zatvoriGuestBaner,
  } = useOmiljene();

  // Ucitaj podatke biljaka za guest korisnike — jedan .in() upit
  const { data: guestBiljke = [], isLoading: isLoadingGuestBiljke } = useQuery({
    queryKey: ['guest-omiljene-biljke', guestStavke.map((s) => s.slug).join(',')],
    queryFn: async () => {
      if (guestStavke.length === 0) return [];
      const slugovi = guestStavke.map((s) => s.slug);
      const { data, error } = await supabase
        .from('biljke')
        .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)')
        .in('slug', slugovi)
        .is('deleted_at', null);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: jeGost === true,
    staleTime: 1000 * 60 * 5,
  });

  const showLoader =
    jeGost === null ||
    (jeGost === true && isLoadingGuestBiljke && guestStavke.length > 0) ||
    (jeGost === false && isLoading);

  const [preostaliDani, setPreostaliDani] = useState(7);
  useEffect(() => {
    // guestPreostaliDani je async — ucitava datum iz AsyncStorage
    guestPreostaliDani().then(setPreostaliDani);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-3xl font-semibold mt-6 mb-4" style={{ fontFamily: SERIF_BOLD }}>
          Omiljene biljke
        </Text>

        {/* Info baner za goste sa sacuvanim biljkama */}
        {jeGost === true && guestStavke.length > 0 && (
          <View className="flex-row gap-3 p-4 rounded-xl bg-[#FAEEDA] dark:bg-[#EF9F27]/10 border border-[#EF9F27]/40 mb-4">
            <Text className="text-sm flex-1">
              Sacuvane biljke ce biti dostupne jos {preostaliDani} dana.{' '}
              <Text className="font-semibold underline" onPress={() => router.push('/(auth)/prijava')}>
                Prijavi se
              </Text>
              {' ili '}
              <Text className="font-semibold underline" onPress={() => router.push('/(auth)/registracija')}>
                registruj se
              </Text>
            </Text>
          </View>
        )}

        {/* Loading */}
        {showLoader && (
          <View className="gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </View>
        )}

        {/* Prazno stanje za goste */}
        {!showLoader && jeGost === true && guestStavke.length === 0 && (
          <PraznoStanje />
        )}

        {/* Guest prikaz */}
        {!showLoader && jeGost === true && guestBiljke.length > 0 && (
          <FlashList
            data={guestBiljke}
            numColumns={2}
            estimatedItemSize={260}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const slike = item.biljka_slike as { url: string; je_glavna: boolean }[];
              const glavnaSlika = slike?.find((s) => s.je_glavna)?.url ?? slike?.[0]?.url;
              return (
                <BiljkaKartica
                  id={item.id}
                  slug={item.slug}
                  srpski_naziv={item.srpski_naziv}
                  latinski_naziv={item.latinski_naziv}
                  porodica={item.porodica}
                  glavna_slika_url={glavnaSlika}
                  je_omiljena={true}
                  onOmiljenaToggle={(id, slug) => toggleGuestOmiljena(id, slug)}
                />
              );
            }}
          />
        )}

        {/* Prazno stanje za ulogovane */}
        {!isLoading && jeGost === false && omiljene.length === 0 && <PraznoStanje />}

        {/* Auth prikaz */}
        {!isLoading && jeGost === false && omiljene.length > 0 && (
          <FlashList
            data={omiljene}
            numColumns={2}
            estimatedItemSize={260}
            keyExtractor={(stavka) => stavka.id}
            renderItem={({ item: stavka }) => {
              const biljka = stavka.biljke;
              if (!biljka) return null;
              const glavnaSlika = biljka.biljka_slike?.find((s) => s.je_glavna)?.url ?? biljka.biljka_slike?.[0]?.url;
              return (
                <BiljkaKartica
                  id={biljka.id}
                  slug={biljka.slug}
                  srpski_naziv={biljka.srpski_naziv}
                  latinski_naziv={biljka.latinski_naziv}
                  glavna_slika_url={glavnaSlika}
                  je_omiljena={true}
                  onOmiljenaToggle={() => toggleOmiljena(stavka.id, biljka.id)}
                />
              );
            }}
          />
        )}
      </ScrollView>

      {/* GuestOmiljenaBaner — fiksiran na dnu */}
      {showGuestBaner && (
        <GuestOmiljenaBaner dani={preostaliDani} onZatvori={zatvoriGuestBaner} />
      )}
    </SafeAreaView>
  );
}
```

---

## `GuestOmiljenaBaner`

Web: fiksiran `fixed bottom-24`, prikazuje se pri prvom sacuvavanju kao gost.
Mobile: `position: absolute` ili `View` van `ScrollView` (unutar `SafeAreaView`).

```tsx
// components/biljke/OmiljenaToggle/GuestOmiljenaBaner.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

interface GuestOmiljenaBanerProps {
  dani: number;
  onZatvori: () => void;
}

export function GuestOmiljenaBaner({ dani, onZatvori }: GuestOmiljenaBanerProps) {
  return (
    <View className="absolute bottom-20 left-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg p-4 gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="text-sm font-semibold flex-1">Sacuvano u omiljenima</Text>
        <Pressable onPress={onZatvori} accessibilityLabel="Zatvori">
          {/* X ikona */}
        </Pressable>
      </View>
      <Text className="text-xs text-zinc-500">
        Biljka ce biti sacuvana jos {dani} dana.
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => router.push('/(auth)/prijava')}
          className="flex-1 py-2 rounded-lg bg-[#639922] items-center"
        >
          <Text className="text-white text-sm font-semibold">Prijavi se</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/registracija')}
          className="flex-1 py-2 rounded-lg border border-[#639922] items-center"
        >
          <Text className="text-[#639922] text-sm font-semibold">Registruj se</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

---

## `PraznoStanje`

```tsx
function PraznoStanje() {
  return (
    <View className="py-16 items-center gap-4">
      {/* Biljka ikona */}
      <Text className="font-semibold text-center">Nema omiljenih biljaka</Text>
      <Text className="text-sm text-zinc-500 text-center">
        Sacuvaj biljke pritiskom na srce na kartici.
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/pretraga')}
        className="px-5 py-2.5 rounded-xl bg-[#639922]"
      >
        <Text className="text-white font-semibold">Pregledaj bilje</Text>
      </Pressable>
    </View>
  );
}
```

---

## Napomene o `useOmiljene` hookou

Hook je portovan u Fazi 6. Kljucne tacke:
- `jeGost: boolean | null` — null dok se async init ne zavrsi
- `guestStavke: { slug: string; biljka_id: string }[]` iz AsyncStorage
- `showGuestBaner` — true samo jednom pri prvom sacuvavanju (AsyncStorage flag)
- `toggleOmiljena(omiljenaId, biljkaId)` — soft-delete za auth korisnika
- `toggleGuestOmiljena(biljkaId, slug)` — AsyncStorage operacija

## Sta izostaviti
- Swipe-to-delete gesta — web nema, dovoljno je toggle srcem
- `guestPreostaliDani` lokalna logika (vec portovana u Fazi 6)

## Commit
`feat: omiljene — gost i auth prikaz, GuestOmiljenaBaner`

## Proveri pre commita
- [ ] Gost korisnik: tap na srce sacuva biljku u AsyncStorage
- [ ] Gost korisnik: omiljene se prikazuju (biljke se ucitavaju jednim .in() upitom)
- [ ] Gost korisnik: GuestOmiljenaBaner se prikazuje pri prvom sacuvavanju
- [ ] Gost korisnik: baner sadrzi linkove ka prijavi i registraciji
- [ ] Gost korisnik: prazno stanje se prikazuje ako nema omiljenih
- [ ] Auth korisnik: omiljene se prikazuju iz Supabase
- [ ] Auth korisnik: tap na srce uklanja iz omiljenih (soft-delete)
- [ ] Auth korisnik: prazno stanje sa linkom ka pretrazi
- [ ] `jeGost === null` prikazuje Skeleton dok se init ne zavrsi
- [ ] Info baner sa danima isteka se prikazuje gostu sa sacuvanim biljkama
