import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function Skeleton({ className = '' }: { className?: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={{ opacity }}
      className={`bg-zinc-300 dark:bg-zinc-700 rounded-lg ${className}`}
    />
  );
}
