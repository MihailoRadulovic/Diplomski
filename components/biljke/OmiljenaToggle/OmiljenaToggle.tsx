import { useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useOmiljene } from '@/hooks/useOmiljene';

interface OmiljenaToggleProps {
  biljkaId: string;
  slug: string;
}

export function OmiljenaToggle({ biljkaId, slug }: OmiljenaToggleProps) {
  const { jeOmiljena, toggleOmiljena, toggleGuestOmiljena, jeGost } = useOmiljene();
  const scale = useRef(new Animated.Value(1)).current;

  const aktivan = jeOmiljena(biljkaId);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 50, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 4 }),
    ]).start();

    if (jeGost) {
      toggleGuestOmiljena(biljkaId, slug);
    } else {
      toggleOmiljena(biljkaId);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={jeGost === null}
      accessibilityRole="button"
      accessibilityLabel={aktivan ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
      accessibilityState={{ checked: aktivan }}
      hitSlop={8}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={aktivan ? 'heart' : 'heart-outline'}
          size={22}
          color="#639922"
        />
      </Animated.View>
    </Pressable>
  );
}
