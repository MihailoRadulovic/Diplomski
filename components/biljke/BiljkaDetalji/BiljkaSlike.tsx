import { useState } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import type { BiljkaSlikaRow } from '@/types/biljka';

const { width } = Dimensions.get('window');

interface BiljkaSlikeProps {
  slike: BiljkaSlikaRow[];
  srpski_naziv: string;
}

export function BiljkaSlike({ slike, srpski_naziv }: BiljkaSlikeProps) {
  const [aktivna, setAktivna] = useState(0);

  if (!slike?.length) return null;

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setAktivna(index);
        }}
        scrollEventThrottle={16}
      >
        {slike.map((slika) => (
          <Image
            key={slika.id}
            source={{ uri: slika.url }}
            style={{ width, height: 260 }}
            contentFit="cover"
            accessibilityRole="image"
            accessibilityLabel={slika.alt_tekst || srpski_naziv}
          />
        ))}
      </ScrollView>

      {slike.length > 1 && (
        <View className="flex-row justify-center gap-1.5 py-2.5 absolute bottom-0 left-0 right-0">
          {slike.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === aktivna
                  ? 'bg-white'
                  : 'bg-white/40'
              }`}
              style={{ width: i === aktivna ? 16 : 6 }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
