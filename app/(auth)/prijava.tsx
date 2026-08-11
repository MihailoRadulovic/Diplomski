import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { supabase } from '@/lib/supabase/client';
import { useT } from '@/hooks/useT';

export default function PrijavaEkran() {
  const t = useT('auth');
  const tNav = useT('nav');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePrijava = async () => {
    if (!email || !lozinka) {
      setGreska(t('unesite_podatke'));
      return;
    }
    setGreska(null);
    setIsPending(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: lozinka });
      if (error) {
        setGreska(t('pogresni_podaci'));
        return;
      }
      router.replace('/(tabs)');
    } catch {
      setGreska(t('greska_prijave'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Naslov */}
          <View className="items-center mb-8">
            <Text className="text-3xl text-tekst-primarni dark:text-white" style={{ fontFamily: SERIF_BOLD }}>
              Lekovito Bilje
            </Text>
            <Text className="mt-2 text-base text-zinc-500 dark:text-zinc-400">{t('prijava_podnaslov')}</Text>
          </View>

          {/* Greska */}
          {greska && (
            <View className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <Text className="text-red-600 dark:text-red-400 text-sm">{greska}</Text>
            </View>
          )}

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm font-medium mb-1 text-tekst-primarni dark:text-white">{t('email')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              placeholder="email@primer.com"
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 bg-white dark:bg-zinc-900 text-tekst-primarni dark:text-white"
              accessibilityLabel={t('email')}
            />
          </View>

          {/* Lozinka */}
          <View className="mb-5">
            <Text className="text-sm font-medium mb-1 text-tekst-primarni dark:text-white">{t('lozinka')}</Text>
            <View className="relative">
              <TextInput
                value={lozinka}
                onChangeText={setLozinka}
                secureTextEntry={!prikaziLozinku}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handlePrijava}
                placeholder={t('lozinka')}
                placeholderTextColor="#9CA3AF"
                className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 pr-12 bg-white dark:bg-zinc-900 text-tekst-primarni dark:text-white"
                accessibilityLabel={t('lozinka')}
              />
              <Pressable
                onPress={() => setPrikaziLozinku((p) => !p)}
                className="absolute right-3 top-0 bottom-0 justify-center"
                accessibilityLabel={prikaziLozinku ? t('sakrij_lozinku') : t('prikazi_lozinku')}
              >
                <Ionicons
                  name={prikaziLozinku ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
          </View>

          {/* Submit */}
          <Pressable
            onPress={handlePrijava}
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-[#639922] items-center mb-6"
            style={{ opacity: isPending ? 0.5 : 1 }}
            accessibilityRole="button"
            accessibilityLabel={t('prijavi_se')}
            accessibilityState={{ disabled: isPending }}
          >
            {isPending
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-semibold">{t('prijavi_se')}</Text>
            }
          </Pressable>

          {/* Link ka registraciji */}
          <Text className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {t('nema_naloga')}{' '}
            <Text
              className="font-medium text-[#639922]"
              onPress={() => router.push('/(auth)/registracija')}
            >
              {tNav('registracija')}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
