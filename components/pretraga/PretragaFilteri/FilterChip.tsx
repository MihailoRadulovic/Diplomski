import { Pressable, Text } from 'react-native';

interface FilterChipProps {
  label: string;
  aktivan: boolean;
  onPress: () => void;
}

export function FilterChip({ label, aktivan, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 px-4 py-1.5 rounded-full border ${
        aktivan
          ? 'bg-zelena-primarna border-zelena-primarna'
          : 'bg-transparent border-zinc-300 dark:border-zinc-600'
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected: aktivan }}
    >
      <Text
        className={`text-sm font-medium ${
          aktivan ? 'text-white' : 'text-tekst-primarni dark:text-zinc-300'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
