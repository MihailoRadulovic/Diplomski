import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OzbiljnostUpozorenja } from '@/types/biljka';
import type { BiljkaUpozorenjeRow } from '@/types/biljka';

const OZBILJNOST_STILOVI: Record<OzbiljnostUpozorenja, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  iconColor: string;
}> = {
  niska: {
    bg: 'bg-zelena-svetla dark:bg-zelena-tamna/30',
    border: 'border-zelena-primarna/40',
    text: 'text-zelena-tamna dark:text-zelena-svetla',
    icon: 'information-circle-outline',
    iconColor: '#639922',
  },
  srednja: {
    bg: 'bg-amber-svetla dark:bg-[#1A0F00]',
    border: 'border-amber-akcenat/40',
    text: 'text-[#7A4F00] dark:text-amber-300',
    icon: 'warning-outline',
    iconColor: '#EF9F27',
  },
  visoka: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-400/40',
    text: 'text-red-700 dark:text-red-400',
    icon: 'alert-circle-outline',
    iconColor: '#DC2626',
  },
};

interface UpozorenjeItemProps {
  upozorenje: BiljkaUpozorenjeRow;
}

export function UpozorenjeItem({ upozorenje }: UpozorenjeItemProps) {
  const stilovi = OZBILJNOST_STILOVI[upozorenje.ozbiljnost];

  return (
    <View
      className={`p-3 rounded-xl border mb-2 ${stilovi.bg} ${stilovi.border}`}
    >
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons
          name={stilovi.icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={stilovi.iconColor}
        />
        <Text className={`text-sm font-semibold ${stilovi.text}`}>
          {upozorenje.lek}
        </Text>
      </View>
      <Text className={`text-sm ${stilovi.text} opacity-90`}>
        {upozorenje.opis_interakcije}
      </Text>
    </View>
  );
}
