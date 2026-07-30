# Faza 7 — BiljkaKartica komponenta

## Opis
Kreiranje kartice biljke koja se koristi na Pocetnoj, Pretrazi i Omiljenima.
Mora biti gotova pre svih ekrana koji je koriste.

## Zavisnosti
Faza 5 (UI primitive), Faza 6 (hookovi)

## Web referenca
```
src/components/biljke/BiljkaKartica/BiljkaKartica.tsx
src/components/biljke/BiljkaKartica/BiljkaKartica.types.ts
src/components/biljke/BiljkaKartica/BiljkaKarticaSlika.tsx
```

## Props (web BiljkaKarticaProps)

```ts
// Kopiraj tip direktno iz web projekta, uz jednu izmenu:
export interface BiljkaKarticaProps {
  id: string;
  slug: string;
  srpski_naziv: string;
  latinski_naziv: string;
  porodica?: string | null;
  glavna_slika_url?: string | null;
  je_omiljena?: boolean;
  onOmiljenaToggle?: (biljka_id: string, slug: string) => void;
  // highlightQuery se NE portuje — RN Text ne podrzava inline highlight
  // tagovi?: string[] — dodati ako zelimo tagove na kartici (nova funkcionalnost vs web)
}
```

## Sta portovati

- Raspored elemenata: slika gore, srpski naziv (Georgia bold), latinsko ime (Georgia italic), toggle desno
- OmiljenaToggle dugme sa srce ikonom (puna/prazna)
- Loading state dok se slika ucitava (Skeleton placeholder)
- Isti propovi osim `highlightQuery`

## Sta prilagoditi

| Web | Mobile |
|-----|--------|
| `<div>` wrapper | `Pressable` (da cela kartica bude klikabilna) |
| `<Link href="/biljke/[slug]">` | `router.push('/biljka/' + slug)` u `onPress` |
| `next/image` | `expo-image` sa `contentFit="cover"` |
| `hover:shadow-md` | `activeOpacity={0.85}` na Pressable |
| `focus-visible:ring` | `accessibilityRole="button"`, `accessibilityLabel` |
| `highlightQuery` bold match | Izostaviti |

```tsx
// components/biljke/BiljkaKartica/BiljkaKartica.tsx
import { Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SERIF_BOLD, SERIF_ITALIC } from '@/lib/constants/fontovi';
import type { BiljkaKarticaProps } from './BiljkaKartica.types';

export function BiljkaKartica({ id, slug, srpski_naziv, latinski_naziv, porodica, glavna_slika_url, je_omiljena, onOmiljenaToggle }: BiljkaKarticaProps) {
  return (
    <Pressable
      onPress={() => router.push(`/biljka/${slug}`)}
      activeOpacity={0.85}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      accessibilityRole="button"
      accessibilityLabel={`${srpski_naziv}, ${latinski_naziv}`}
    >
      {/* Slika */}
      <View className="h-40 bg-[#EAF3DE]">
        {glavna_slika_url ? (
          <Image
            source={{ uri: glavna_slika_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            placeholder={{ uri: '' }} // blurhash ili boja
          />
        ) : (
          // Placeholder ikona biljke
          <View className="flex-1 items-center justify-center">
            {/* SVG ikona */}
          </View>
        )}
      </View>

      {/* Tekst i toggle */}
      <View className="p-3 flex-row items-start justify-between">
        <View className="flex-1 mr-2">
          <Text className="font-bold text-tekst-primarni dark:text-white" style={{ fontFamily: SERIF_BOLD }}>
            {srpski_naziv}
          </Text>
          <Text className="text-sm text-zinc-500 italic" style={{ fontFamily: SERIF_ITALIC }}>
            {latinski_naziv}
          </Text>
          {porodica && (
            <Text className="text-xs text-zinc-400 mt-0.5">{porodica}</Text>
          )}
        </View>

        {/* OmiljenaToggle */}
        {onOmiljenaToggle && (
          <Pressable
            onPress={() => onOmiljenaToggle(id, slug)}
            accessibilityRole="button"
            accessibilityLabel={je_omiljena ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
          >
            {/* Srce SVG — puno ili prazno */}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
```

## Napomena o tagovima

Web `BiljkaKarticaProps` nema `tagovi` prop — tagovi se prikazuju samo na stranici detalja.
Ako zelimo tagove na kartici (nova funkcionalnost), dodati `tagovi?: string[]` i Badge komponente.
Odluciti pre implementacije i biti konzistentan kroz sve ekrane.

## `OmiljenaToggle` komponenta — kreira se OVDE

`OmiljenaToggle` se kreira u ovoj fazi jer je potrebna i `BiljkaKartica` (faza 7)
i `BiljkaEkran` (faza 10). Zavisi od `useOmiljene` hooka iz faze 6.

```tsx
// components/biljke/OmiljenaToggle/OmiljenaToggle.tsx
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOmiljene } from '@/hooks/useOmiljene';

interface OmiljenaToggleProps {
  biljkaId: string;
  slug: string;
}

export function OmiljenaToggle({ biljkaId, slug }: OmiljenaToggleProps) {
  const { jeOmiljena, toggleOmiljena, toggleGuestOmiljena, jeGost, omiljeneId } = useOmiljene();

  const aktivan = jeOmiljena(biljkaId);

  const handlePress = () => {
    if (jeGost) {
      toggleGuestOmiljena(biljkaId, slug);
    } else {
      const id = omiljeneId(biljkaId);
      if (id) toggleOmiljena(id, biljkaId);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={aktivan ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
      accessibilityState={{ checked: aktivan }}
      hitSlop={8}
    >
      <Ionicons
        name={aktivan ? 'heart' : 'heart-outline'}
        size={22}
        color="#639922"
      />
    </Pressable>
  );
}
```

Napomena: `useOmiljene` hook mora eksportovati `jeOmiljena(biljkaId): boolean`
i `omiljeneId(biljkaId): string | undefined` helper metode.

## Sta izostaviti
- `highlightQuery` prop i logika — nema ekvivalenta u RN Text
- `BiljkaKarticaSlika` kao posebna komponenta — ukomponovati direktno u karticu

## Commit
`feat: BiljkaKartica + OmiljenaToggle komponente`

## Proveri pre commita
- [ ] Tap na karticu otvara `/biljka/[slug]` ekran
- [ ] Slika se prikazuje kada postoji URL, placeholder kada ne postoji
- [ ] OmiljenaToggle menja ikonu (puno/prazno srce)
- [ ] `je_omiljena=true` prikazuje popunjeno srce
- [ ] Dark mode izgleda ispravno
- [ ] Kartica je pristupacna (accessibilityLabel postoji)
- [ ] Radi u FlashList listi (ne samo standalone)
- [ ] `OmiljenaToggle` komponenta postoji i moze se importovati iz `/components/biljke/OmiljenaToggle/`
