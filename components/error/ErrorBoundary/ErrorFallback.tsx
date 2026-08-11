import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';

interface ErrorFallbackProps {
  onReset?: () => void;
}

// Stack trace se nikad ne prikazuje korisniku — samo friendly poruka
export function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <View
      accessibilityRole="alert"
      className="flex-1 items-center justify-center py-16 px-4"
    >
      <Ionicons name="leaf-outline" size={64} color="#639922" style={{ opacity: 0.5, marginBottom: 16 }} />
      <Text
        className="text-xl text-tekst-primarni dark:text-[#E8F5E2] mb-2 text-center"
        style={{ fontFamily: SERIF_BOLD }}
      >
        Doslo je do greske
      </Text>
      <Text className="text-sm text-tekst-blagi dark:text-zinc-400 max-w-xs text-center mb-6">
        Nesto nije proslo kako treba. Mozete pokusati ponovo ili se vratiti na pocetnu stranicu.
      </Text>
      <View className="flex-row gap-3">
        {onReset && (
          <Pressable
            onPress={onReset}
            className="px-4 py-2 rounded-xl bg-[#639922]"
            accessibilityRole="button"
            accessibilityLabel="Pokusaj ponovo"
          >
            <Text className="text-white font-semibold">Pokusaj ponovo</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.replace('/')}
          className="px-4 py-2 rounded-xl bg-pozadina-kartica dark:bg-zinc-800"
          accessibilityRole="button"
          accessibilityLabel="Vrati se na pocetnu"
        >
          <Text className="text-tekst-primarni dark:text-[#E8F5E2] font-semibold">Vrati se na pocetnu</Text>
        </Pressable>
      </View>
    </View>
  );
}
