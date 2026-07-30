import { View } from 'react-native';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 ${className}`}>
      {children}
    </View>
  );
}
