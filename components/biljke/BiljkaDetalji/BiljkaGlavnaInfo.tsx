import { View, Text, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge/Badge';
import { SERIF_BOLD, SERIF_ITALIC, SERIF_REGULAR } from '@/lib/constants/fontovi';
import { TAG_LABELE } from '@/lib/constants/tagovi';
import { useJezikaStore } from '@/stores/jezikaStore';
import type { BiljkaSaRelacijama } from '@/types/biljka';

interface BiljkaGlavnaInfoProps {
  biljka: BiljkaSaRelacijama;
  onKopiranje?: () => void;
}

export function BiljkaGlavnaInfo({ biljka, onKopiranje }: BiljkaGlavnaInfoProps) {
  const { jezik } = useJezikaStore();

  const kopiraj = async () => {
    await Clipboard.setStringAsync(biljka.latinski_naziv);
    onKopiranje?.();
  };

  return (
    <View className="pt-4">
      <Text
        className="text-2xl text-tekst-primarni dark:text-white mb-1"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {biljka.srpski_naziv}
      </Text>

      {/* Latinski naziv + kopiraj */}
      <Pressable
        onPress={kopiraj}
        className="flex-row items-center gap-1 mb-2"
        accessibilityRole="button"
        accessibilityLabel={`Kopiraj latinsko ime: ${biljka.latinski_naziv}`}
      >
        <Text
          className="text-tekst-sekundarni dark:text-zinc-400 text-base"
          style={{ fontFamily: SERIF_ITALIC }}
        >
          {biljka.latinski_naziv}
        </Text>
        <Ionicons name="copy-outline" size={14} color="#639922" style={{ marginLeft: 4 }} />
      </Pressable>

      {/* Porodica */}
      {biljka.porodica ? (
        <Text className="text-sm text-tekst-blagi dark:text-zinc-500 mb-3">
          Porodica: {biljka.porodica}
        </Text>
      ) : null}

      {/* Tagovi */}
      {biljka.tagovi && biljka.tagovi.length > 0 ? (
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          {biljka.tagovi.map((tag) => (
            <Badge key={tag} variant="green">
              {TAG_LABELE[tag]?.[jezik] ?? tag}
            </Badge>
          ))}
        </View>
      ) : null}

      {/* Opis */}
      <Text
        className="text-tekst-primarni dark:text-zinc-300 leading-relaxed text-base"
        style={{ fontFamily: SERIF_REGULAR }}
      >
        {biljka.opis}
      </Text>
    </View>
  );
}
