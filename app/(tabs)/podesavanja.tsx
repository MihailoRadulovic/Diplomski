import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { useTheme } from '@/hooks/useTheme';
import { useJezikaStore, type Jezik } from '@/stores/jezikaStore';
import { useAuth } from '@/hooks/useAuth';
import { useT } from '@/hooks/useT';
import { supabase } from '@/lib/supabase/client';
import type { Tema } from '@/stores/temaStore';

const TEME: { vrednost: Tema; kljuc: string }[] = [
  { vrednost: 'svetla', kljuc: 'tema_svetla' },
  { vrednost: 'tamna',  kljuc: 'tema_tamna' },
  { vrednost: 'sistem', kljuc: 'tema_sistem' },
];

const JEZICI: { vrednost: Jezik; kljuc: string }[] = [
  { vrednost: 'sr', kljuc: 'jezik_sr' },
  { vrednost: 'en', kljuc: 'jezik_en' },
];

function SekcijaKartica({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4">
      {children}
    </View>
  );
}

function SekcijaLabel({ children }: { children: string }) {
  return (
    <Text
      className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3"
    >
      {children}
    </Text>
  );
}

export default function PodesavanjaTab() {
  const t = useT('podesavanja');
  const tNav = useT('nav');
  const tZ = useT('zajednicko');
  const tAuth = useT('auth');
  const { tema, setTema } = useTheme();
  const { jezik, setJezik } = useJezikaStore();
  const { korisnik, jeGost } = useAuth();

  const handleOdjava = async () => {
    Alert.alert(tNav('odjava'), t('odjava_poruka'), [
      { text: tZ('otkazi'), style: 'cancel' },
      {
        text: tZ('odjavi_se'),
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-100 dark:bg-[#080F05]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text
          className="text-3xl font-semibold mt-6 mb-6 text-zinc-900 dark:text-white"
          style={{ fontFamily: SERIF_BOLD }}
        >
          {t('naslov')}
        </Text>

        {/* Tema sekcija */}
        <View className="mb-4">
          <SekcijaKartica>
            <SekcijaLabel>{t('tema')}</SekcijaLabel>
            <View className="flex-row flex-wrap gap-2">
              {TEME.map(({ vrednost, kljuc }) => (
                <Pressable
                  key={vrednost}
                  onPress={() => setTema(vrednost)}
                  className={`px-4 py-2 rounded-full border ${
                    tema === vrednost
                      ? 'bg-[#639922] border-[#639922]'
                      : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: tema === vrednost }}
                  accessibilityLabel={t(kljuc)}
                >
                  <Text className={tema === vrednost ? 'text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}>
                    {t(kljuc)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </SekcijaKartica>
        </View>

        {/* Jezik sekcija */}
        <View className="mb-6">
          <SekcijaKartica>
            <SekcijaLabel>{t('jezik')}</SekcijaLabel>
            <View className="flex-row flex-wrap gap-2">
              {JEZICI.map(({ vrednost, kljuc }) => (
                <Pressable
                  key={vrednost}
                  onPress={() => setJezik(vrednost)}
                  className={`px-4 py-2 rounded-full border ${
                    jezik === vrednost
                      ? 'bg-[#639922] border-[#639922]'
                      : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: jezik === vrednost }}
                  accessibilityLabel={t(kljuc)}
                >
                  <Text className={jezik === vrednost ? 'text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}>
                    {t(kljuc)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </SekcijaKartica>
        </View>

        {/* Auth sekcija */}
        <View>
          <SekcijaKartica>
            <SekcijaLabel>{tZ('nalog')}</SekcijaLabel>

            {jeGost ? (
              <View className="gap-3">
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  {t('nije_prijavljen')}
                </Text>
                <Pressable
                  onPress={() => router.push('/(auth)/prijava')}
                  className="py-3 rounded-xl bg-[#639922] items-center"
                  accessibilityRole="button"
                  accessibilityLabel={tNav('prijava')}
                >
                  <Text className="text-white font-semibold">{tNav('prijava')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(auth)/registracija')}
                  className="py-3 rounded-xl border border-[#639922] items-center"
                  accessibilityRole="button"
                  accessibilityLabel={tNav('registracija')}
                >
                  <Text className="text-[#639922] font-semibold">{tNav('registracija')}</Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-4">
                {korisnik?.user_metadata?.puno_ime && (
                  <View>
                    <Text className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">{t('ime')}</Text>
                    <Text className="font-medium text-zinc-900 dark:text-white">
                      {korisnik.user_metadata.puno_ime}
                    </Text>
                  </View>
                )}
                <View>
                  <Text className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">{tAuth('email')}</Text>
                  <Text className="font-medium text-zinc-900 dark:text-white">{korisnik?.email}</Text>
                </View>
                <Pressable
                  onPress={handleOdjava}
                  className="py-3 rounded-xl border border-red-300 dark:border-red-800 items-center mt-1"
                  accessibilityRole="button"
                  accessibilityLabel={tZ('odjavi_se')}
                >
                  <Text className="text-red-500 font-semibold">{tZ('odjavi_se')}</Text>
                </Pressable>
              </View>
            )}
          </SekcijaKartica>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
