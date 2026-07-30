import { View, Text } from 'react-native';

type Variant = 'green' | 'amber' | 'red';

const styles: Record<Variant, { bg: string; text: string }> = {
  green: { bg: 'bg-[#EAF3DE]', text: 'text-[#27500A]' },
  amber: { bg: 'bg-[#FAEEDA]', text: 'text-[#7A4F00]' },
  red:   { bg: 'bg-red-100',   text: 'text-red-800' },
};

export function Badge({ children, variant = 'green' }: { children: string; variant?: Variant }) {
  return (
    <View className={`px-2 py-0.5 rounded-full ${styles[variant].bg}`}>
      <Text className={`text-xs font-medium ${styles[variant].text}`}>{children}</Text>
    </View>
  );
}
