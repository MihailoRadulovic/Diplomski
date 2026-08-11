import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '@/hooks/useT';

interface GuestOmiljenaBanerProps {
  dani: number;
  onZatvori: () => void;
}

export function GuestOmiljenaBaner({ dani, onZatvori }: GuestOmiljenaBanerProps) {
  const t = useT('omiljene');
  const tNav = useT('nav');

  return (
    <View className="absolute bottom-20 left-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg p-4 gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="text-sm font-semibold flex-1 text-zinc-900 dark:text-white">
          {t('gost_baner_naslov')}
        </Text>
        <Pressable
          onPress={onZatvori}
          accessibilityLabel={t('zatvori_baner')}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color="#71717a" />
        </Pressable>
      </View>
      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
        {t('gost_baner_rok', { dani })}
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => router.push('/(auth)/prijava')}
          className="flex-1 py-2 rounded-lg bg-[#639922] items-center"
          accessibilityRole="button"
          accessibilityLabel={tNav('prijava')}
        >
          <Text className="text-white text-sm font-semibold">{tNav('prijava')}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/registracija')}
          className="flex-1 py-2 rounded-lg border border-[#639922] items-center"
          accessibilityRole="button"
          accessibilityLabel={tNav('registracija')}
        >
          <Text className="text-[#639922] text-sm font-semibold">{tNav('registracija')}</Text>
        </Pressable>
      </View>
    </View>
  );
}
