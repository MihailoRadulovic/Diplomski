import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBiljkaDana } from '@/hooks/useBiljkaDana';
import { useT } from '@/hooks/useT';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { SERIF_BOLD, SERIF_ITALIC, SERIF_REGULAR } from '@/lib/constants/fontovi';

function BiljkaDanaSkeleton() {
  return (
    <View className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Skeleton className="h-48 w-full rounded-none" />
      <View className="p-4 gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-32 mt-2 rounded-xl" />
      </View>
    </View>
  );
}

export function BiljkaDanaSekcija() {
  const t = useT('pocetna');
  const { data: biljka, isLoading, isError } = useBiljkaDana();

  const glavna_slika = biljka?.biljka_slike?.find((s: { je_glavna: boolean }) => s.je_glavna)
    ?? biljka?.biljka_slike?.[0];

  return (
    <View className="px-4 mb-6">
      <Text
        className="text-xl font-semibold text-zinc-900 dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {t('biljka_dana_naslov')}
      </Text>

      {isLoading && <BiljkaDanaSkeleton />}

      {isError && (
        <View className="py-8 items-center">
          <Text className="text-zinc-400 dark:text-zinc-500" style={{ fontFamily: SERIF_REGULAR }}>
            {t('biljka_dana_nije_dostupna')}
          </Text>
        </View>
      )}

      {biljka && !isLoading && (
        <Pressable
          onPress={() => router.push(`/biljka/${biljka.slug}` as never)}
          style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
          className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          accessibilityRole="button"
          accessibilityLabel={`${biljka.srpski_naziv} — ${t('pogledaj_detalje')}`}
        >
          {/* Slika */}
          <View className="h-48 bg-[#EAF3DE] dark:bg-zinc-800">
            {glavna_slika ? (
              <Image
                source={{ uri: glavna_slika.url }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="leaf-outline" size={56} color="#639922" style={{ opacity: 0.3 }} />
              </View>
            )}
          </View>

          {/* Sadrzaj */}
          <View className="p-4 gap-1">
            <Text
              className="text-xl font-bold text-zinc-900 dark:text-white"
              style={{ fontFamily: SERIF_BOLD }}
            >
              {biljka.srpski_naziv}
            </Text>
            <Text
              className="text-sm text-zinc-500 dark:text-zinc-400 italic"
              style={{ fontFamily: SERIF_ITALIC }}
            >
              {biljka.latinski_naziv}
            </Text>

            {biljka.opis && biljka.opis !== biljka.srpski_naziv && biljka.opis.length > 30 && (
              <Text
                className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed"
                style={{ fontFamily: SERIF_REGULAR }}
                numberOfLines={3}
              >
                {biljka.opis}
              </Text>
            )}

            <View className="mt-3 self-start px-4 py-2 rounded-xl bg-[#639922]">
              <Text
                className="text-white text-sm font-semibold"
                style={{ fontFamily: SERIF_BOLD }}
              >
                {t('pogledaj_detalje')}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
