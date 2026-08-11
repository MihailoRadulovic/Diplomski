import { memo } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SERIF_BOLD, SERIF_ITALIC } from '@/lib/constants/fontovi';
import type { BiljkaKarticaProps } from './BiljkaKartica.types';

export const BiljkaKartica = memo(function BiljkaKartica({
  id,
  slug,
  srpski_naziv,
  latinski_naziv,
  porodica,
  glavna_slika_url,
  je_omiljena = false,
  onOmiljenaToggle,
}: BiljkaKarticaProps) {
  return (
    <Pressable
      onPress={() => router.push(`/biljka/${slug}` as never)}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      accessibilityRole="button"
      accessibilityLabel={`${srpski_naziv}, ${latinski_naziv}${porodica ? `, ${porodica}` : ''}`}
      accessibilityHint="Otvara detalje biljke"
    >
      {/* Slika */}
      <View className="h-40 bg-[#EAF3DE] dark:bg-zinc-800">
        {glavna_slika_url ? (
          <Image
            source={{ uri: glavna_slika_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="leaf-outline" size={40} color="#639922" style={{ opacity: 0.4 }} />
          </View>
        )}
      </View>

      {/* Tekst i toggle */}
      <View className="p-3 flex-row items-start justify-between" style={{ minHeight: 96 }}>
        <View className="flex-1 mr-2">
          <Text
            className="font-bold text-tekst-primarni dark:text-white"
            style={{ fontFamily: SERIF_BOLD }}
            numberOfLines={2}
          >
            {srpski_naziv}
          </Text>
          <Text
            className="text-sm text-zinc-500 dark:text-zinc-400 italic"
            style={{ fontFamily: SERIF_ITALIC }}
            numberOfLines={1}
          >
            {latinski_naziv ?? ''}
          </Text>
          <Text
            className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5"
            numberOfLines={1}
          >
            {porodica ?? ''}
          </Text>
        </View>

        {onOmiljenaToggle && (
          <Pressable
            onPress={() => onOmiljenaToggle(id, slug)}
            accessibilityRole="button"
            accessibilityLabel={je_omiljena ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
            accessibilityState={{ checked: je_omiljena }}
            onStartShouldSetResponder={() => true}
            hitSlop={8}
          >
            <Ionicons
              name={je_omiljena ? 'heart' : 'heart-outline'}
              size={22}
              color="#639922"
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});
