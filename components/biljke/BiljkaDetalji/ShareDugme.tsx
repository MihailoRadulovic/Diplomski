import { Pressable, Text, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareDugmeProps {
  naziv: string;
  opis: string;
}

export function ShareDugme({ naziv, opis }: ShareDugmeProps) {
  const handleShare = async () => {
    await Share.share({
      title: naziv,
      message: `${naziv}\n\n${opis?.slice(0, 200)}...`,
    });
  };

  return (
    <Pressable
      onPress={handleShare}
      className="flex-row items-center gap-2 self-start px-4 py-2 rounded-xl border border-ivica dark:border-zinc-700"
      accessibilityRole="button"
      accessibilityLabel={`Podeli informacije o biljci ${naziv}`}
    >
      <Ionicons name="share-outline" size={18} color="#639922" />
      <Text className="text-sm font-medium text-zelena-primarna dark:text-zelena-svetla">
        Podeli
      </Text>
    </Pressable>
  );
}
