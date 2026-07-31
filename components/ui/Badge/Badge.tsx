import { View, Text } from 'react-native';

type Variant = 'green' | 'amber' | 'red';

const styles: Record<Variant, { bg: string; text: string }> = {
  green: { bg: 'bg-[#EAF3DE] dark:bg-[#162510]', text: 'text-[#27500A] dark:text-[#A8D080]' },
  amber: { bg: 'bg-[#FAEEDA] dark:bg-[#EF9F27]/10', text: 'text-[#7A4F00] dark:text-amber-300' },
  red:   { bg: 'bg-red-100 dark:bg-red-950/30', text: 'text-red-800 dark:text-red-400' },
};

export function Badge({ children, variant = 'green' }: { children: string; variant?: Variant }) {
  return (
    <View className={`px-2 py-0.5 rounded-full ${styles[variant].bg}`}>
      <Text className={`text-xs font-medium ${styles[variant].text}`}>{children}</Text>
    </View>
  );
}
