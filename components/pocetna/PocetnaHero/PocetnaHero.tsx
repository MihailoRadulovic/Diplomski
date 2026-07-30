import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useT } from '@/hooks/useT';
import { SERIF_BOLD, SERIF_REGULAR } from '@/lib/constants/fontovi';
import { IznenadimeDugme } from '@/components/pocetna/IznenadimeDugme/IznenadimeDugme';

export function PocetnaHero() {
  const t = useT('pocetna');
  const { korisnik, ucitava, ime } = useAuth();

  const imeCapitalized = ime ? ime.charAt(0).toUpperCase() + ime.slice(1) : '';

  return (
    <View className="px-4 pt-6 pb-4 items-center gap-4">
      {/* Personalizovani pozdrav */}
      {!ucitava && korisnik && imeCapitalized && (
        <View className="flex-row items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF3DE] dark:bg-[#1A2E0D] border border-[#C5DFA0] dark:border-[#2D4A1A]">
          <Text className="text-base">👋</Text>
          <Text
            className="text-sm font-medium text-[#4A7A20] dark:text-[#A8D878]"
            style={{ fontFamily: SERIF_REGULAR }}
          >
            {t('pozdrav', { ime: imeCapitalized })}
          </Text>
        </View>
      )}

      {/* Naslov */}
      <View className="items-center gap-2">
        <Text
          className="text-4xl text-center text-zinc-900 dark:text-white leading-tight"
          style={{ fontFamily: SERIF_BOLD }}
        >
          {t('naslov')}
        </Text>
        <Text
          className="text-base text-center text-zinc-500 dark:text-zinc-400 max-w-xs"
          style={{ fontFamily: SERIF_REGULAR }}
        >
          {t('podnaslov')}
        </Text>
      </View>

      {/* CTA dugmad */}
      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.push('/(tabs)/pretraga' as never)}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          className="w-full py-3 rounded-xl bg-[#639922] items-center"
          accessibilityRole="button"
        >
          <Text
            className="text-white font-semibold text-base"
            style={{ fontFamily: SERIF_BOLD }}
          >
            {t('poziv')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/prepoznavanje' as never)}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          className="w-full py-3 rounded-xl border border-[#639922] dark:border-[#C8E6A0]/40 items-center flex-row justify-center gap-2"
          accessibilityRole="button"
        >
          <Ionicons name="camera-outline" size={18} color="#639922" />
          <Text
            className="text-[#639922] dark:text-[#C8E6A0] font-semibold text-base"
            style={{ fontFamily: SERIF_BOLD }}
          >
            {t('poziv_prepoznavanje')}
          </Text>
        </Pressable>
      </View>

      <IznenadimeDugme />
    </View>
  );
}
