import { View, Text } from 'react-native';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { UpozorenjeItem } from './UpozorenjeItem';
import type { BiljkaUpozenjeRow } from '@/types/biljka';

interface UpozorenjaSekcijaProps {
  upozorenja: BiljkaUpozenjeRow[];
}

export function UpozorenjaSekcija({ upozorenja }: UpozorenjaSekcijaProps) {
  return (
    <View>
      <Text
        className="text-lg text-tekst-primarni dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        Interakcije i upozorenja
      </Text>
      {upozorenja.map((upozorenje) => (
        <UpozorenjeItem key={upozorenje.id} upozorenje={upozorenje} />
      ))}
    </View>
  );
}
