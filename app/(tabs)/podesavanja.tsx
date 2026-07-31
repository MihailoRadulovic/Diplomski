import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { useTheme } from '@/hooks/useTheme';
import { useJezikaStore, type Jezik } from '@/stores/jezikaStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import type { Tema } from '@/stores/temaStore';

const TEME: { vrednost: Tema; label: string }[] = [
  { vrednost: 'svetla', label: 'Svetla' },
  { vrednost: 'tamna', label: 'Tamna' },
  { vrednost: 'sistem', label: 'Sistem' },
];

const JEZICI: { vrednost: Jezik; label: string }[] = [
  { vrednost: 'sr', label: 'Srpski' },
  { vrednost: 'en', label: 'English' },
];

export default function PodesavanjaTab() {
  const { tema, setTema } = useTheme();
  const { jezik, setJezik } = useJezikaStore();
  const { korisnik, ucitava, jeGost } = useAuth();

  const handleJezik = (noviJezik: Jezik) => {
    setJezik(noviJezik);
  };

  const handleOdjava = async () => {
    Alert.alert('Odjava', 'Da li si siguran da se zelis odjaviti?', [
      { text: 'Odustani', style: 'cancel' },
      {
        text: 'Odjavi se',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-3xl font-semibold mt-6 mb-6" style={{ fontFamily: SERIF_BOLD }}>
          Podesavanja
        </Text>

        {/* Tema sekcija */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3" style={{ fontFamily: SERIF_BOLD }}>
            Tema
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {TEME.map(({ vrednost, label }) => (
              <Pressable
                key={vrednost}
                onPress={() => setTema(vrednost)}
                className={`px-4 py-2 rounded-full border ${
                  tema === vrednost
                    ? 'bg-[#639922] border-[#639922]'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
                accessibilityRole="radio"
                accessibilityState={{ checked: tema === vrednost }}
                accessibilityLabel={label}
              >
                <Text className={tema === vrednost ? 'text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Jezik sekcija */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3" style={{ fontFamily: SERIF_BOLD }}>
            Jezik
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {JEZICI.map(({ vrednost, label }) => (
              <Pressable
                key={vrednost}
                onPress={() => handleJezik(vrednost)}
                className={`px-4 py-2 rounded-full border ${
                  jezik === vrednost
                    ? 'bg-[#639922] border-[#639922]'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
                accessibilityRole="radio"
                accessibilityState={{ checked: jezik === vrednost }}
                accessibilityLabel={label}
              >
                <Text className={jezik === vrednost ? 'text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Auth sekcija */}
        <View className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Text className="text-lg font-semibold mb-4" style={{ fontFamily: SERIF_BOLD }}>
            Nalog
          </Text>

          {jeGost ? (
            <View className="gap-3">
              <Text className="text-sm text-zinc-500">Nisi prijavljen/a.</Text>
              <Pressable
                onPress={() => router.push('/(auth)/prijava')}
                className="py-3 rounded-xl bg-[#639922] items-center"
              >
                <Text className="text-white font-semibold">Prijavi se</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(auth)/registracija')}
                className="py-3 rounded-xl border border-[#639922] items-center"
              >
                <Text className="text-[#639922] font-semibold">Registruj se</Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              {korisnik?.user_metadata?.puno_ime && (
                <View>
                  <Text className="text-xs text-zinc-400 mb-0.5">Ime</Text>
                  <Text className="font-medium">{korisnik.user_metadata.puno_ime}</Text>
                </View>
              )}
              <View>
                <Text className="text-xs text-zinc-400 mb-0.5">Email</Text>
                <Text className="font-medium">{korisnik?.email}</Text>
              </View>
              <Pressable
                onPress={handleOdjava}
                className="py-3 rounded-xl border border-red-300 items-center mt-2"
                accessibilityRole="button"
                accessibilityLabel="Odjavi se"
              >
                <Text className="text-red-500 font-semibold">Odjavi se</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
