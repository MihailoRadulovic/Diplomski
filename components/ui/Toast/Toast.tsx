import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: 'bg-[#3A7D44]', icon: 'checkmark-circle' },
  error:   { bg: 'bg-[#C0392B]', icon: 'close-circle' },
  warning: { bg: 'bg-[#EF9F27]', icon: 'warning' },
  info:    { bg: 'bg-[#1A6B8A]', icon: 'information-circle' },
};

export function Toast({ message, variant = 'info', onClose, duration = 3000 }: ToastProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 100, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(onClose);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, opacity, translateY]);

  const { bg, icon } = variantStyles[variant];

  return (
    <Animated.View
      style={{ transform: [{ translateY }], opacity, position: 'absolute', bottom: 24, left: 16, right: 16, zIndex: 999 }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${bg}`}>
        <Ionicons name={icon} size={20} color="white" />
        <Text className="flex-1 text-sm font-medium text-white">{message}</Text>
        <Pressable onPress={onClose} accessibilityLabel="Zatvori obavestenje">
          <Ionicons name="close" size={18} color="white" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
