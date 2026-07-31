import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge/Badge';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import type { PrepoznavanjeOdgovorData } from '@/lib/validations/upload.schema';

interface Props {
  rezultat: PrepoznavanjeOdgovorData;
  onNova: () => void;
}

export function PrepoznavanjeRezultat({ rezultat, onNova }: Props) {
  const router = useRouter();

  if (rezultat.tip === 'nije_prepoznato') {
    return (
      <View className="items-center py-8 gap-4">
        <Text className="text-4xl">🔍</Text>
        <Text className="font-semibold text-lg text-zinc-800 dark:text-zinc-100" style={{ fontFamily: SERIF_BOLD }}>
          Biljka nije prepoznata
        </Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          Pokušaj sa boljom fotografijom ili pretraži po imenu.
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={onNova}
            className="px-4 py-2.5 rounded-xl bg-[#639922] items-center"
            accessibilityRole="button"
            accessibilityLabel="Pokušaj ponovo"
          >
            <Text className="text-white font-semibold">Pokušaj ponovo</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/pretraga')}
            className="px-4 py-2.5 rounded-xl border border-[#639922] items-center"
            accessibilityRole="button"
            accessibilityLabel="Pretraži po imenu"
          >
            <Text className="text-[#639922] font-semibold">Pretraži</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const pouzdanostProcent = Math.round(rezultat.pouzdanost * 100);
  const pouzdanostVarijanta: 'green' | 'amber' | 'red' =
    pouzdanostProcent >= 70 ? 'green' : pouzdanostProcent >= 40 ? 'amber' : 'red';

  return (
    <View className="gap-4">
      <Text className="text-xl font-semibold text-zinc-800 dark:text-zinc-100" style={{ fontFamily: SERIF_BOLD }}>
        Rezultati analize
      </Text>

      <View className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1A2E0F] gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="font-semibold text-zinc-800 dark:text-zinc-100 italic">
              {rezultat.naziv}
            </Text>
            {rezultat.tip === 'u_bazi' && <Badge variant="green">Nađena u bazi</Badge>}
            {rezultat.tip === 'nije_u_bazi' && <Badge variant="amber">Nije u našoj bazi</Badge>}
          </View>
          <View className="items-end gap-1">
            <Text className="text-xs text-zinc-400">Pouzdanost</Text>
            <Badge variant={pouzdanostVarijanta}>{`${pouzdanostProcent}%`}</Badge>
          </View>
        </View>

        {'preostalihZahteva' in rezultat && (
          <Text className="text-xs text-zinc-400">
            Preostalih zahteva danas: {rezultat.preostalihZahteva}
          </Text>
        )}

        <View className="flex-row gap-2">
          {rezultat.tip === 'u_bazi' && (
            <Pressable
              onPress={() => router.push(`/biljka/${rezultat.slug}`)}
              className="flex-1 py-2.5 rounded-xl bg-[#639922] items-center"
              accessibilityRole="button"
              accessibilityLabel={`Pogledaj biljku ${rezultat.naziv}`}
            >
              <Text className="text-white font-semibold">Pogledaj biljku</Text>
            </Pressable>
          )}
          <Pressable
            onPress={onNova}
            className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 items-center"
            accessibilityRole="button"
            accessibilityLabel="Nova fotografija"
          >
            <Text className="text-zinc-600 dark:text-zinc-300 font-semibold">Nova fotografija</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
