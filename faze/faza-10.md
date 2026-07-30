# Faza 10 — Detalji biljke

## Opis
Port stack ekrana `/biljka/[slug]` sa svim sekcijama: slike, glavna info,
upotrebe, upozorenja, omiljenaToggle u headeru, share i disclaimer.
Upis posete u AsyncStorage history (ekvivalent BiljkaPosetaZapis).

## Zavisnosti
Faza 5, Faza 6, Faza 7 (OmiljenaToggle komponenta)

## Web referenca
```
src/app/[locale]/(main)/biljke/[slug]/page.tsx
src/app/[locale]/(main)/biljke/[slug]/OmiljenaAkcija.tsx
src/app/[locale]/(main)/biljke/[slug]/BiljkaPosetaZapis.tsx
src/components/biljke/BiljkaDetalji/BiljkaGlavnaInfo.tsx
src/components/biljke/BiljkaDetalji/BiljkaKoristiSe.tsx
src/components/biljke/BiljkaDetalji/BiljkaSlike.tsx
src/components/biljke/BiljkaDetalji/ShareDugme.tsx
src/components/biljke/BiljkaDetalji/KopirajLatinski.tsx
src/components/biljke/UpozorenjaSekcija/UpozorenjaSekcija.tsx
src/components/biljke/UpozorenjaSekcija/UpozorenjeItem.tsx
src/components/ui/Disclaimer/Disclaimer.tsx
```

---

## `app/biljka/[slug].tsx` — Detalji ekran

```tsx
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiljka } from '@/hooks/useBiljka';
import { useNedavnoPregledano } from '@/hooks/useNedavnoPregledano';
import { BiljkaSlike } from '@/components/biljke/BiljkaDetalji/BiljkaSlike';
import { BiljkaGlavnaInfo } from '@/components/biljke/BiljkaDetalji/BiljkaGlavnaInfo';
import { BiljkaKoristiSe } from '@/components/biljke/BiljkaDetalji/BiljkaKoristiSe';
import { UpozorenjaSekcija } from '@/components/biljke/UpozorenjaSekcija/UpozorenjaSekcija';
import { Disclaimer } from '@/components/ui/Disclaimer/Disclaimer';
import { OmiljenaToggle } from '@/components/biljke/OmiljenaToggle/OmiljenaToggle';
import { ShareDugme } from '@/components/biljke/BiljkaDetalji/ShareDugme';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function BiljkaEkran() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const { data: biljka, isLoading, isError } = useBiljka(slug);
  const { zapisi } = useNedavnoPregledano();

  // Upis posete (ekvivalent BiljkaPosetaZapis)
  useEffect(() => {
    if (!biljka) return;
    const glavna = biljka.biljka_slike?.find(s => s.je_glavna) ?? biljka.biljka_slike?.[0];
    zapisi({
      slug: biljka.slug,
      srpski_naziv: biljka.srpski_naziv,
      latinski_naziv: biljka.latinski_naziv,
      slika_url: glavna?.url ?? null,
    });
  }, [biljka?.slug]);

  // OmiljenaToggle u header-u (zamena za web inline dugme)
  useEffect(() => {
    if (!biljka) return;
    navigation.setOptions({
      title: biljka.srpski_naziv,
      headerRight: () => <OmiljenaToggle biljkaId={biljka.id} slug={biljka.slug} />,
    });
  }, [biljka?.id]);

  if (isLoading) return <BiljkaDetaljiSkeleton />;
  if (isError || !biljka) return <ErrorFallback />;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <BiljkaSlike slike={biljka.biljka_slike} srpski_naziv={biljka.srpski_naziv} />
      <View className="px-4 space-y-6 pb-8">
        <BiljkaGlavnaInfo biljka={biljka} />
        <ShareDugme naziv={biljka.srpski_naziv} opis={biljka.opis} />
        {biljka.biljka_upotrebe?.length > 0 && <BiljkaKoristiSe upotrebe={biljka.biljka_upotrebe} />}
        {biljka.biljka_upozorenja?.length > 0 && <UpozorenjaSekcija upozorenja={biljka.biljka_upozorenja} />}
        <Disclaimer />
      </View>
    </ScrollView>
  );
}
```

---

## `BiljkaSlike`

Web: horizontalni scroll sa next/image. Mobile: horizontalni FlatList ili ScrollView sa expo-image.

```tsx
// Horizontalni image carousel
import { ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export function BiljkaSlike({ slike, srpski_naziv }) {
  if (!slike?.length) return null;
  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {slike.map((slika) => (
        <Image
          key={slika.id}
          source={{ uri: slika.url }}
          style={{ width, height: 260 }}
          contentFit="cover"
          accessibilityLabel={slika.alt_tekst || srpski_naziv}
        />
      ))}
    </ScrollView>
  );
}
```

---

## `BiljkaGlavnaInfo`

Web: naziv, latinsko ime sa KopirajLatinski, porodica, tagovi (Badge), opis.
Mobile: isti sadrzaj, prilagoditi `KopirajLatinski` za Clipboard API u RN.

```ts
// KopirajLatinski — web koristi navigator.clipboard.writeText
import * as Clipboard from 'expo-clipboard';
const kopiraj = async () => {
  await Clipboard.setStringAsync(naziv);
  // Prikazati Toast "Kopirano"
};
```

Tagovi: portovati `Badge` komponente sa `TAG_LABELE[tag]?.[jezik]` (koristiti `useJezikaStore`
umesto `useLocale` iz next-intl).

---

## `BiljkaKoristiSe`

Web: tabela `<table>` sa delovima biljke, nacinom upotrebe i za_sta.
Mobile: `View` sa redovima — nema `<table>` u RN.

```tsx
// Portovati logiku grupisanja po deo_biljke
// Prikazati kao sekcije: naslov (deo biljke) + lista stavki
import type { BiljkaUpotreba } from '@/types/biljka';

export function BiljkaKoristiSe({ upotrebe }: { upotrebe: BiljkaUpotreba[] }) {
  // Eksplicitan tip za acc je obavezan uz strict: true
  const grupisano = upotrebe.reduce<Record<string, BiljkaUpotreba[]>>((acc, u) => {
    if (!acc[u.deo_biljke]) acc[u.deo_biljke] = [];
    acc[u.deo_biljke].push(u);
    return acc;
  }, {});

  return (
    <View>
      {Object.entries(grupisano).map(([deo, stavke]) => (
        <View key={deo}>
          <Text className="font-semibold">{deo}</Text>
          {stavke.map(s => (
            <View key={s.id}>
              <Text>{s.nacin_upotrebe}</Text>
              <Text className="text-zinc-500">{s.za_sta}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
```

---

## `UpozorenjaSekcija` i `UpozorenjeItem`

Web: lista upozorenja sa color-coded ozbiljnoscu (niska/srednja/visoka).
Mobile: portovati 1:1, zameniti HTML elemente sa View/Text.

Boje po ozbiljnosti (iste kao web):
- `niska` → zelena/amber
- `srednja` → narandzasta
- `visoka` → crvena

---

## `ShareDugme`

Web: `navigator.share()` Web Share API. Mobile: `Share` iz React Native (native share sheet).

```ts
import { Share } from 'react-native';
const handleShare = async () => {
  await Share.share({
    title: naziv,
    message: `${naziv}\n\n${opis?.slice(0, 200)}...`,
  });
};
```

---

## `OmiljenaToggle` u headeru

Web: `OmiljenaAkcija` komponenta inline na stranici. Mobile: header desno dugme.
Logika ostaje ista (useOmiljene hook), samo pozicija se menja.

---

## `BiljkaPosetaZapis` ekvivalent

Web: posebna Client komponenta koja se renderuje i poziva `zapisiNedavnu` u useEffect.
Mobile: direktan `useEffect` u `BiljkaEkran` komponenti (gore prikazano) — nema potrebe
za posebnom komponentom jer nema Server/Client component distinkcije.

## Sta izostaviti
- Breadcrumb navigacija — zamenjuje back dugme u stack navigationu
- JSON-LD structured data (`<script type="application/ld+json">`) — SEO, ne postoji na mobilnom
- `generateMetadata` — ne postoji na mobilnom
- `redirect` za lowercase slug — Expo Router ne radi URL redirect; normalize slug pre poziva

## Commit
`feat: detalji biljke — slike, info, upotreba, upozorenja, share, omiljenaToggle u headeru`

## Proveri pre commita
- [ ] Biljka se ucitava korektno (slug iz navigacionih params)
- [ ] Carousel slika radi (swipe levo/desno)
- [ ] Tagovi se prikazuju sa ispravnim labelama za aktivan jezik
- [ ] KopirajLatinski kopira latinsko ime u clipboard + prikazuje Toast
- [ ] BiljkaKoristiSe grupisanje po deo_biljke radi ispravno
- [ ] UpozorenjaSekcija prikazuje ozbiljnost bojama
- [ ] ShareDugme otvara native share sheet
- [ ] OmiljenaToggle u headeru menja ikonu i stanje
- [ ] Poseta se upisuje u AsyncStorage (proveriti na pocetnoj — NedavnoPregledano)
- [ ] Disclaimer je vidljiv na dnu stranice
- [ ] 404 stanje — biljka nije nadjena prikazuje ErrorFallback
