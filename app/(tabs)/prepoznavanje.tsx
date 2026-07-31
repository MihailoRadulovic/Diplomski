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
        <Text
          className="text-3xl font-semibold text-center mt-6 mb-6 text-zinc-800 dark:text-zinc-100"
          style={{ fontFamily: SERIF_BOLD }}
        >
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
            {/* Preview izabrane slike */}
            {izabranaSlika && (
              <View className="h-56 rounded-2xl overflow-hidden mb-4">
                <Image
                  source={{ uri: izabranaSlika.uri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
            )}

            {/* Dugmad za izbor slike */}
            {!izabranaSlika && (
              <View className="flex-row gap-4 mb-6">
                <Pressable
                  onPress={handleKamera}
                  className="flex-1 items-center py-8 rounded-2xl border-2 border-[#639922] bg-[#EAF3DE] dark:bg-[#1A2E0F] dark:border-[#4A7A1A]"
                  accessibilityLabel="Slikaj biljku kamerom"
                  accessibilityHint="Otvara kameru"
                  accessibilityRole="button"
                >
                  <Text className="text-3xl mb-2">📷</Text>
                  <Text className="font-semibold text-[#27500A] dark:text-[#C8E6A0]">Slikaj</Text>
                </Pressable>
                <Pressable
                  onPress={handleGalerija}
                  className="flex-1 items-center py-8 rounded-2xl border-2 border-[#639922] bg-[#EAF3DE] dark:bg-[#1A2E0F] dark:border-[#4A7A1A]"
                  accessibilityLabel="Izaberi sliku iz galerije"
                  accessibilityRole="button"
                >
                  <Text className="text-3xl mb-2">🖼️</Text>
                  <Text className="font-semibold text-[#27500A] dark:text-[#C8E6A0]">Galerija</Text>
                </Pressable>
              </View>
            )}

            {/* Izbor organa (samo kada je slika izabrana) */}
            {izabranaSlika && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-center mb-3 text-zinc-700 dark:text-zinc-300">
                  Koji deo biljke je na slici?
                </Text>
                <View className="flex-row flex-wrap justify-center gap-2">
                  {ORGANI.map(({ vrednost, label }) => (
                    <Pressable
                      key={vrednost}
                      onPress={() => setOrgan(vrednost)}
                      className={`px-3 py-1.5 rounded-full border ${
                        organ === vrednost
                          ? 'bg-[#639922] border-[#639922]'
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}
                      accessibilityRole="radio"
                      accessibilityLabel={label}
                      accessibilityState={{ checked: organ === vrednost }}
                    >
                      <Text
                        className={
                          organ === vrednost
                            ? 'text-white font-medium'
                            : 'text-zinc-600 dark:text-zinc-300'
                        }
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Greska */}
            {greska && (
              <View className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                <Text className="text-red-600 dark:text-red-400 text-sm text-center">{greska}</Text>
              </View>
            )}

            {/* Dugmad akcije */}
            {izabranaSlika && (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handlePrepoznaj}
                  className="flex-1 py-3 rounded-xl bg-[#639922] items-center"
                  accessibilityRole="button"
                  accessibilityLabel="Prepoznaj biljku"
                >
                  <Text className="text-white font-semibold">Prepoznaj</Text>
                </Pressable>
                <Pressable
                  onPress={handleNova}
                  className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 items-center"
                  accessibilityRole="button"
                  accessibilityLabel="Izaberi novu fotografiju"
                >
                  <Text className="text-zinc-600 dark:text-zinc-300 font-semibold">Nova fotografija</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
