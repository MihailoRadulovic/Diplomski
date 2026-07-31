import { useCallback } from 'react';
import { ScrollView, Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNedavnoPregledano } from '@/hooks/useNedavnoPregledano';
import { useT } from '@/hooks/useT';
import { SERIF_BOLD } from '@/lib/constants/fontovi';

export function NedavnoPregledano() {
  const t = useT('pocetna');
  const { stavke, osvezi } = useNedavnoPregledano();

  // Osvezava listu kada ekran dobije fokus (korisnik je mozda posetio novu biljku)
  useFocusEffect(useCallback(() => {
    osvezi();
  }, [osvezi]));

  if (stavke.length === 0) return null;

  return (
    <View className="px-4 mb-6">
      <Text
        className="text-xl font-semibold text-zinc-900 dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {t('nedavno_pregledano')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stavke.map((s) => (
          <Pressable
            key={s.slug}
            onPress={() => router.push(`/biljka/${s.slug}` as never)}
            style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
            className="mr-3 items-center w-24"
            accessibilityRole="button"
            accessibilityLabel={s.srpski_naziv}
            accessibilityHint="Otvara detalje biljke"
          >
            <View className="w-16 h-16 rounded-lg overflow-hidden bg-[#EAF3DE] dark:bg-zinc-800">
              {s.slika_url ? (
                <Image
                  source={{ uri: s.slika_url }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="leaf-outline" size={24} color="#639922" style={{ opacity: 0.4 }} />
                </View>
              )}
            </View>
            <Text
              className="text-xs font-medium text-center mt-1 leading-tight text-zinc-700 dark:text-zinc-300"
              numberOfLines={2}
              style={{ fontFamily: SERIF_BOLD }}
            >
              {s.srpski_naziv}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
