import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

interface GuestOmiljenaBanerProps {
  dani: number;
  onZatvori: () => void;
}

export function GuestOmiljenaBaner({ dani, onZatvori }: GuestOmiljenaBanerProps) {
  return (
    <View className="absolute bottom-20 left-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg p-4 gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="text-sm font-semibold flex-1">Sacuvano u omiljenima</Text>
        <Pressable onPress={onZatvori} accessibilityLabel="Zatvori">
          <Text className="text-zinc-500 text-base leading-none">✕</Text>
        </Pressable>
      </View>
      <Text className="text-xs text-zinc-500">
        Biljka ce biti sacuvana jos {dani} dana.
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => router.push('/(auth)/prijava')}
          className="flex-1 py-2 rounded-lg bg-[#639922] items-center"
        >
          <Text className="text-white text-sm font-semibold">Prijavi se</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/registracija')}
          className="flex-1 py-2 rounded-lg border border-[#639922] items-center"
        >
          <Text className="text-[#639922] text-sm font-semibold">Registruj se</Text>
        </Pressable>
      </View>
    </View>
  );
}
