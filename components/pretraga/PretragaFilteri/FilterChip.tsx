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
          : 'bg-zelena-svetla border-ivica dark:bg-zinc-800 dark:border-zinc-700'
      }`}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: aktivan }}
    >
      <Text
        className={`text-sm font-medium ${
          aktivan ? 'text-white' : 'text-zelena-tamna dark:text-zinc-300'
        }`}
        style={{ includeFontPadding: false }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
