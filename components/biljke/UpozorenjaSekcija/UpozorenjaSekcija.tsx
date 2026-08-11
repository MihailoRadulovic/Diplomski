import { View, Text } from 'react-native';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { useT } from '@/hooks/useT';
import { UpozorenjeItem } from './UpozorenjeItem';
import type { BiljkaUpozorenjeRow } from '@/types/biljka';

interface UpozorenjaSekcijaProps {
  upozorenja: BiljkaUpozorenjeRow[];
}

export function UpozorenjaSekcija({ upozorenja }: UpozorenjaSekcijaProps) {
  const t = useT('biljke');
  return (
    <View>
      <Text
        className="text-lg text-tekst-primarni dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {t('interakcije_upozorenja')}
      </Text>
      {upozorenja.map((upozorenje) => (
        <UpozorenjeItem key={upozorenje.id} upozorenje={upozorenje} />
      ))}
    </View>
  );
}
