import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DEBOUNCE_MS = 300;

interface PretragaInputProps {
  value: string;
  onSearch: (q: string) => void;
}

export function PretragaInput({ value, onSearch }: PretragaInputProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = (tekst: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(tekst), DEBOUNCE_MS);
  };

  return (
    <View className="flex-row items-center border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 mb-3 bg-white dark:bg-zinc-900">
      <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 6 }} />
      <TextInput
        defaultValue={value}
        onChangeText={handleChange}
        placeholder="Pretrazite bilje..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-tekst-primarni dark:text-white"
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Pretraga bilja"
      />
    </View>
  );
}
