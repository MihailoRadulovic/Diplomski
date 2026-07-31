import { ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import type { BiljkaSlikaRow } from '@/types/biljka';

const { width } = Dimensions.get('window');

interface BiljkaSlikeProps {
  slike: BiljkaSlikaRow[];
  srpski_naziv: string;
}

export function BiljkaSlike({ slike, srpski_naziv }: BiljkaSlikeProps) {
  if (!slike?.length) return null;
  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {slike.map((slika) => (
        <Image
          key={slika.id}
          source={{ uri: slika.url }}
          style={{ width, height: 260 }}
          contentFit="cover"
          accessibilityLabel={slika.alt_tekst || srpski_naziv}
        />
      ))}
    </ScrollView>
  );
}
