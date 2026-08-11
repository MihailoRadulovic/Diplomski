import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '@/hooks/useT';
import { SERIF_BOLD, SERIF_REGULAR } from '@/lib/constants/fontovi';

export function PrepoznavanjeLoader() {
  const t = useT('prepoznavanje');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="items-center gap-5 py-12">
      <Animated.View
        style={{ transform: [{ scale: pulseAnim }] }}
        className="w-24 h-24 rounded-full bg-[#EAF3DE] dark:bg-[#1A2E0F] items-center justify-center"
      >
        <Ionicons name="leaf" size={48} color="#639922" />
      </Animated.View>

      <View className="items-center gap-1.5">
        <Text
          className="text-base font-semibold text-zinc-800 dark:text-zinc-100"
          style={{ fontFamily: SERIF_BOLD }}
        >
          {t('obrada')}
        </Text>
        <Text
          className="text-sm text-zinc-500 dark:text-zinc-400 text-center"
          style={{ fontFamily: SERIF_REGULAR }}
        >
          {t('opis')}
        </Text>
      </View>
    </View>
  );
}
