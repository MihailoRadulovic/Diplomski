import { View, Text } from 'react-native';
import { SERIF_BOLD, SERIF_REGULAR } from '@/lib/constants/fontovi';
import { useT } from '@/hooks/useT';
import type { BiljkaUpotrebaRow } from '@/types/biljka';

interface BiljkaKoristiSeProps {
  upotrebe: BiljkaUpotrebaRow[];
}

export function BiljkaKoristiSe({ upotrebe }: BiljkaKoristiSeProps) {
  const t = useT('biljke');
  const grupisano = upotrebe.reduce<Record<string, BiljkaUpotrebaRow[]>>((acc, u) => {
    if (!acc[u.deo_biljke]) acc[u.deo_biljke] = [];
    acc[u.deo_biljke].push(u);
    return acc;
  }, {});

  return (
    <View>
      <Text
        className="text-lg text-tekst-primarni dark:text-white mb-3"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {t('kako_se_koristi')}
      </Text>

      {Object.entries(grupisano).map(([deo, stavke]) => (
        <View key={deo} className="mb-4">
          <Text
            className="text-sm font-semibold text-zelena-tamna dark:text-zelena-svetla uppercase tracking-wide mb-2"
          >
            {deo}
          </Text>
          {stavke.map((s) => (
            <View
              key={s.id}
              className="mb-2 pl-3 border-l-2 border-zelena-primarna/40"
            >
              <Text
                className="text-tekst-primarni dark:text-zinc-200 text-sm font-medium"
                style={{ fontFamily: SERIF_BOLD }}
              >
                {s.nacin_upotrebe}
              </Text>
              <Text
                className="text-tekst-blagi dark:text-zinc-400 text-sm"
                style={{ fontFamily: SERIF_REGULAR }}
              >
                {s.za_sta}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
