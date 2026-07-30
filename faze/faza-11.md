# Faza 11 — Prepoznavanje biljke

## Opis
Port ekrana za prepoznavanje. Kamera i galerija kroz expo-image-picker
umesto web `<input type="file" capture="environment">`. PlantNet poziv
ide na Vercel URL (isti backend kao web).

## Zavisnosti
Faza 5, Faza 6

## Web referenca
```
src/app/[locale]/(main)/prepoznavanje/page.tsx
src/app/[locale]/(main)/prepoznavanje/PrepoznavanjeKlijent.tsx
src/app/[locale]/(main)/prepoznavanje/PrepoznavanjeWrapper.tsx
src/components/prepoznavanje/KameraInput/KameraInput.tsx
src/components/prepoznavanje/PrepoznavanjeLoader/PrepoznavanjeLoader.tsx
src/hooks/usePrepoznavanje.ts
src/lib/validations/upload.schema.ts  <- UploadOrgan tip (vec kopiran u Fazi 2)
```

Web nema `GalerijaInput` kao poseban fajl — oba (kamera i galerija) su `KameraInput.tsx`
sa razlicitim HTML input props-ima. Mobile ima `useImagePicker` hook koji pokriva oba slucaja.

---

## `app/(tabs)/prepoznavanje.tsx` — Prepoznavanje ekran

Logika toka je identicna web `PrepoznavanjeKlijent.tsx`:
1. Prikaz dugmadi za kameru i galeriju (ako nema izabrane slike)
2. Preview izabrane slike
3. Izbor organa (radio buttons)
4. Dugme "Prepoznaj" + "Nova fotografija"
5. Loading state (PrepoznavanjeLoader)
6. Rezultat (PrepoznavanjeRezultat)

```tsx
// app/(tabs)/prepoznavanje.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { useImagePicker } from '@/hooks/useImagePicker';
import { usePrepoznavanje } from '@/hooks/usePrepoznavanje';
import { PrepoznavanjeLoader } from '@/components/prepoznavanje/PrepoznavanjeLoader/PrepoznavanjeLoader';
import { PrepoznavanjeRezultat } from '@/components/prepoznavanje/PrepoznavanjeRezultat/PrepoznavanjeRezultat';
import type { UploadOrgan } from '@/lib/validations/upload.schema';
import type { ImagePickerAsset } from 'expo-image-picker';

const ORGANI: { vrednost: UploadOrgan; label: string }[] = [
  { vrednost: 'leaf',   label: 'List' },
  { vrednost: 'flower', label: 'Cvet' },
  { vrednost: 'fruit',  label: 'Plod' },
  { vrednost: 'bark',   label: 'Kora' },
  { vrednost: 'habit',  label: 'Cela biljka' },
  { vrednost: 'other',  label: 'Ostalo' },
];

export default function PrepoznavanjeTab() {
  const [izabranaSlika, setIzabranaSlika] = useState<ImagePickerAsset | null>(null);
  const [organ, setOrgan] = useState<UploadOrgan>('leaf');
  const { otvoriKameru, otvoriGaleriju } = useImagePicker();
  const { prepoznaj, rezultat, isLoading, greska, reset } = usePrepoznavanje();

  const handleSlika = (asset: ImagePickerAsset) => {
    setIzabranaSlika(asset);
    reset();
  };

  const handleKamera = async () => {
    const asset = await otvoriKameru();
    if (asset) handleSlika(asset);
  };

  const handleGalerija = async () => {
    const asset = await otvoriGaleriju();
    if (asset) handleSlika(asset);
  };

  const handlePrepoznaj = async () => {
    if (!izabranaSlika) return;
    await prepoznaj(izabranaSlika, organ);
  };

  const handleNova = () => {
    setIzabranaSlika(null);
    reset();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Naslov */}
        <Text className="text-3xl font-semibold text-center mt-6 mb-2" style={{ fontFamily: SERIF_BOLD }}>
          Prepoznaj biljku
        </Text>

        {/* Loading */}
        {isLoading && <PrepoznavanjeLoader />}

        {/* Rezultat */}
        {!isLoading && rezultat && (
          <PrepoznavanjeRezultat rezultat={rezultat} onNova={handleNova} />
        )}

        {/* Glavni UI (samo ako nema rezultata i nije loading) */}
        {!isLoading && !rezultat && (
          <>
            {/* Preview */}
            {izabranaSlika && (
              <View className="h-56 rounded-2xl overflow-hidden mb-4">
                <Image source={{ uri: izabranaSlika.uri }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
              </View>
            )}

            {/* Dugmad za izbor slike */}
            {!izabranaSlika && (
              <View className="flex-row gap-4 mb-4">
                <Pressable onPress={handleKamera} className="flex-1 items-center py-8 rounded-2xl border-2 border-[#639922] bg-[#EAF3DE]"
                  accessibilityLabel="Slikaj biljku kamerom" accessibilityHint="Otvara kameru">
                  {/* Kamera ikona */}
                  <Text className="font-semibold text-[#27500A] mt-2">Slikaj</Text>
                </Pressable>
                <Pressable onPress={handleGalerija} className="flex-1 items-center py-8 rounded-2xl border-2 border-[#639922] bg-[#EAF3DE]"
                  accessibilityLabel="Izaberi sliku iz galerije">
                  {/* Galerija ikona */}
                  <Text className="font-semibold text-[#27500A] mt-2">Galerija</Text>
                </Pressable>
              </View>
            )}

            {/* Izbor organa (samo kada je slika izabrana) */}
            {izabranaSlika && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-center mb-2">Koji deo biljke je na slici?</Text>
                <View className="flex-row flex-wrap justify-center gap-2">
                  {ORGANI.map(({ vrednost, label }) => (
                    <Pressable
                      key={vrednost}
                      onPress={() => setOrgan(vrednost)}
                      className={`px-3 py-1.5 rounded-full border ${organ === vrednost ? 'bg-[#639922] border-[#639922]' : 'border-zinc-300 dark:border-zinc-600'}`}
                    >
                      <Text className={organ === vrednost ? 'text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}>
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Greska */}
            {greska && (
              <View className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 mb-4">
                <Text className="text-red-600 text-sm text-center">{greska}</Text>
              </View>
            )}

            {/* Dugmad akcije */}
            {izabranaSlika && (
              <View className="flex-row gap-2">
                <Pressable onPress={handlePrepoznaj} className="flex-1 py-3 rounded-xl bg-[#639922] items-center"
                  accessibilityRole="button" accessibilityLabel="Prepoznaj biljku">
                  <Text className="text-white font-semibold">Prepoznaj</Text>
                </Pressable>
                <Pressable onPress={handleNova} className="flex-1 py-3 rounded-xl border border-zinc-300 items-center"
                  accessibilityRole="button" accessibilityLabel="Izaberi novu fotografiju">
                  <Text className="text-zinc-600 font-semibold">Nova fotografija</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## `PrepoznavanjeRezultat`

Web ima tri scenarija. Portovati 1:1, zameniti HTML sa RN komponentama i Link sa router.push:

```tsx
// Scenario 1: nadjena u bazi
if (rezultat.tip === 'u_bazi') {
  return (
    <View>
      <Text>Prepoznata: {rezultat.naziv}</Text>
      <Text className="italic">{rezultat.latinskiNaziv}</Text>
      <Text>Pouzdanost: {Math.round(rezultat.pouzdanost * 100)}%</Text>
      <Pressable onPress={() => router.push(`/biljka/${rezultat.slug}`)}>
        <Text>Pogledaj biljku</Text>
      </Pressable>
    </View>
  );
}

// Scenario 2: prepoznata, nije u bazi
if (rezultat.tip === 'nije_u_bazi') {
  return (
    <View>
      <Text>Biljka nije u nasoj bazi: {rezultat.naziv}</Text>
      <Text>Pouzdanost: {Math.round(rezultat.pouzdanost * 100)}%</Text>
    </View>
  );
}

// Scenario 3: nije prepoznato
return (
  <View>
    <Text>Biljka nije prepoznata</Text>
    <Pressable onPress={onNova}><Text>Pokusaj ponovo</Text></Pressable>
  </View>
);
```

---

## `PrepoznavanjeLoader`

Web: animirani spinner sa tekstom. Mobile: isti sadrzaj sa `ActivityIndicator` ili Skeleton.

---

## Kamera permisije

expo-image-picker automatski trazi permisije. Dodati u `app.json`:
```json
"plugins": [
  ["expo-image-picker", { "cameraPermission": "Dozvoli pristup kameri za prepoznavanje biljaka." }]
]
```

## Sta izostaviti
- `KameraInput` kao posebna komponenta — logika je u `useImagePicker` hoooku
- `GalerijaInput` kao posebna komponenta — ista stvar
- `jeTouchUredjaj` detekcija — na mobilnom uvek true, kamera je uvek dostupna
- `URL.createObjectURL` / `URL.revokeObjectURL` — blob URL-ovi ne postoje u RN
- Web `<input type="file" capture="environment">` pattern

## Commit
`feat: prepoznavanje biljke — kamera, galerija, PlantNet rezultat`

## Proveri pre commita
- [ ] Dugme "Slikaj" otvara kameru (trazi permisiju pri prvom pozivu)
- [ ] Dugme "Galerija" otvara photo picker
- [ ] Preview izabrane slike se prikazuje
- [ ] Radio dugmad za organ rade (leaf default)
- [ ] "Prepoznaj" salje formData na Vercel URL (proveriti network log)
- [ ] Loader se prikazuje tokom analize
- [ ] Scenario "u_bazi": dugme "Pogledaj biljku" otvara detalje
- [ ] Scenario "nije_u_bazi": prikazuje naziv bez linka
- [ ] Scenario "nije_prepoznato": prikazuje poruku i dugme za retry
- [ ] "Nova fotografija" resetuje sve stanje
- [ ] Greska mreze se prikazuje u UI (ne samo u konzoli)
