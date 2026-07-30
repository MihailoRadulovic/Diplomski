import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { TAGOVI } from '@/lib/constants/tagovi';
import { useT } from '@/hooks/useT';
import { useJezikaStore } from '@/stores/jezikaStore';
import { SERIF_BOLD, SERIF_REGULAR } from '@/lib/constants/fontovi';

export function PopularniFilteri() {
  const t = useT('pocetna');
  const { jezik } = useJezikaStore();

  return (
    <View className="px-4 mb-6">
      <Text
        className="text-xl font-semibold text-zinc-900 dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {t('popularni_filteri_naslov')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2 pb-1">
          {TAGOVI.map(({ label, filter }) => (
            <Pressable
              key={filter}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/pretraga',
                  params: { filter },
                } as never)
              }
              style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
              className="px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-transparent"
              accessibilityRole="button"
            >
              <Text
                className="text-sm text-zinc-700 dark:text-zinc-300"
                style={{ fontFamily: SERIF_REGULAR }}
              >
                {jezik === 'en' ? label.en : label.sr}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
