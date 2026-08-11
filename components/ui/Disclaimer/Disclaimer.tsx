import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '@/hooks/useT';

// Prikazuje se na SVAKOJ ekranu detalja biljke — obavezan element
export function Disclaimer() {
  const t = useT('disclaimer');

  return (
    <View
      className="mt-8 p-4 rounded-xl border border-[#EF9F27]/40 bg-amber-svetla dark:bg-[#1A1200]"
    >
      <View className="flex-row gap-2 items-start">
        <Ionicons name="warning-outline" size={14} color="#EF9F27" style={{ marginTop: 2 }} />
        <Text className="text-sm text-tekst-primarni/80 dark:text-[#C8E6A0]/80 leading-relaxed flex-1">
          {t('tekst')}
        </Text>
      </View>
    </View>
  );
}
