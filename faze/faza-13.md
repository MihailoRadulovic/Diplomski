# Faza 13 — Auth ekrani

## Opis
Port prijave i registracije. Web koristi Next.js Server Actions (`useActionState`).
Mobile: direktni Supabase pozivi iz handlera — nema Server Actions, nema `formAction`.
Ekrani se prikazuju kao modalni stack (definisan u Fazi 4).

## Zavisnosti
Faza 4, Faza 5

## Web referenca
```
src/app/[locale]/(auth)/prijava/page.tsx
src/app/[locale]/(auth)/registracija/page.tsx
src/app/actions/auth.ts
src/types/auth.ts
```

---

## `app/(auth)/prijava.tsx` — Prijava ekran

Web forma: `email` + `password`. Nema username.
Web koristi `useActionState(login, initialState)` — mobile koristi direktni async handler.

```tsx
// app/(auth)/prijava.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { supabase } from '@/lib/supabase/client';

export default function PrijavaEkran() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePrijava = async () => {
    setGreska(null);
    setIsPending(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: lozinka });
      if (error) {
        setGreska('Pogrešan email ili lozinka.');
        return;
      }
      router.replace('/(tabs)');
    } catch {
      setGreska('Greška pri prijavi. Pokušaj ponovo.');
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
          <Text className="text-3xl font-bold" style={{ fontFamily: SERIF_BOLD }}>
            Lekovito Bilje
          </Text>
          <Text className="mt-2 text-base text-zinc-500">Prijavi se na nalog</Text>
        </View>

        {/* Greska */}
        {greska && (
          <View className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
            <Text className="text-red-600 text-sm">{greska}</Text>
          </View>
        )}

        {/* Email */}
        <View className="mb-5">
          <Text className="text-sm font-medium mb-1">Email</Text>
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
            accessibilityLabel="Email adresa"
          />
        </View>

        {/* Lozinka */}
        <View className="mb-5">
          <Text className="text-sm font-medium mb-1">Lozinka</Text>
          <View className="relative">
            <TextInput
              value={lozinka}
              onChangeText={setLozinka}
              secureTextEntry={!prikaziLozinku}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handlePrijava}
              placeholder="Lozinka"
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 pr-10 bg-white dark:bg-zinc-900 text-tekst-primarni dark:text-white"
              accessibilityLabel="Lozinka"
            />
            <Pressable
              onPress={() => setPrikaziLozinku((p) => !p)}
              className="absolute right-3 top-3"
              accessibilityLabel={prikaziLozinku ? 'Sakrij lozinku' : 'Prikazi lozinku'}
            >
              {/* Eye ikona */}
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handlePrijava}
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-[#639922] items-center mb-6"
          accessibilityRole="button"
          accessibilityLabel="Prijavi se"
        >
          {isPending
            ? <ActivityIndicator color="white" />
            : <Text className="text-white font-semibold">Prijavi se</Text>
          }
        </Pressable>

        {/* Link ka registraciji */}
        <Text className="text-center text-sm text-zinc-500">
          Nemaš nalog?{' '}
          <Text
            className="font-medium text-[#639922]"
            onPress={() => router.push('/(auth)/registracija')}
          >
            Registruj se
          </Text>
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

## `app/(auth)/registracija.tsx` — Registracija ekran

Web forma: `puno_ime` + `email` + `password` — NEMA potvrde lozinke.
Nakon uspesne registracije: prikazati poruku "Proverite email" (Supabase salje potvrdu).

```tsx
// app/(auth)/registracija.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { supabase } from '@/lib/supabase/client';

export default function RegistracijaEkran() {
  const [punoIme, setPunoIme] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [uspesno, setUspesno] = useState(false);

  const handleRegistracija = async () => {
    setGreska(null);
    setIsPending(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: lozinka,
        options: {
          data: { puno_ime: punoIme },
        },
      });
      if (error) {
        setGreska('Greška pri registraciji. Pokušaj ponovo.');
        return;
      }
      setUspesno(true);
    } catch {
      setGreska('Greška pri registraciji. Pokušaj ponovo.');
    } finally {
      setIsPending(false);
    }
  };

  // Ekvivalent web success stanja
  if (uspesno) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08] items-center justify-center px-6">
        <Text className="text-4xl mb-4">✉️</Text>
        <Text className="text-xl font-semibold text-center mb-2" style={{ fontFamily: SERIF_BOLD }}>
          Proverite email
        </Text>
        <Text className="text-zinc-500 text-center mb-6">
          Poslali smo vam link za potvrdu na {email}
        </Text>
        <Pressable onPress={() => router.replace('/(auth)/prijava')}>
          <Text className="text-[#639922] font-medium">Imate nalog? Prijavite se</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

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
          <Text className="text-3xl font-bold" style={{ fontFamily: SERIF_BOLD }}>
            Lekovito Bilje
          </Text>
          <Text className="mt-2 text-base text-zinc-500">Registrujte se</Text>
        </View>

        {greska && (
          <View className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
            <Text className="text-red-600 text-sm">{greska}</Text>
          </View>
        )}

        {/* Puno ime */}
        <View className="mb-5">
          <Text className="text-sm font-medium mb-1">Puno ime</Text>
          <TextInput
            value={punoIme}
            onChangeText={setPunoIme}
            autoComplete="name"
            returnKeyType="next"
            placeholder="Ime i prezime"
            placeholderTextColor="#9CA3AF"
            className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 bg-white dark:bg-zinc-900 text-tekst-primarni dark:text-white"
            accessibilityLabel="Puno ime"
          />
        </View>

        {/* Email */}
        <View className="mb-5">
          <Text className="text-sm font-medium mb-1">Email</Text>
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
            accessibilityLabel="Email adresa"
          />
        </View>

        {/* Lozinka */}
        <View className="mb-5">
          <Text className="text-sm font-medium mb-1">Lozinka</Text>
          <View>
            <TextInput
              value={lozinka}
              onChangeText={setLozinka}
              secureTextEntry={!prikaziLozinku}
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleRegistracija}
              placeholder="Lozinka"
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 pr-10 bg-white dark:bg-zinc-900 text-tekst-primarni dark:text-white"
              accessibilityLabel="Lozinka"
            />
            <Pressable
              onPress={() => setPrikaziLozinku((p) => !p)}
              className="absolute right-3 top-3"
              accessibilityLabel={prikaziLozinku ? 'Sakrij lozinku' : 'Prikazi lozinku'}
            >
              {/* Eye ikona */}
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleRegistracija}
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-[#639922] items-center mb-6"
          accessibilityRole="button"
          accessibilityLabel="Registrujte se"
        >
          {isPending
            ? <ActivityIndicator color="white" />
            : <Text className="text-white font-semibold">Registrujte se</Text>
          }
        </Pressable>

        {/* Link ka prijavi */}
        <Text className="text-center text-sm text-zinc-500">
          Imate nalog?{' '}
          <Text className="font-medium text-[#639922]" onPress={() => router.push('/(auth)/prijava')}>
            Prijavite se
          </Text>
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

## Navigacija iz auth ekrana

Nakon uspesne prijave: `router.replace('/(tabs)')` — ne `router.push` (da se ekran skloni iz historije).
Gost moze da odustane: zaglavlje sa X dugmetom za zatvaranje modala (`router.back()`).

```tsx
// U _layout.tsx za (auth) stack — dodati header sa X dugmetom:
<Stack.Screen
  name="prijava"
  options={{
    title: '',
    headerTransparent: true,
    headerRight: () => (
      <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
        {/* X ikona */}
      </Pressable>
    ),
  }}
/>
```

---

## Sta izostaviti
- `useActionState` / `formAction` — Next.js-specifično, nema ekvivalenta u RN
- Server Actions (`src/app/actions/auth.ts`) — ne postoje na mobilnom
- `noValidate` atribut na formi — nema HTML forme
- Zod validacija na serveru — uraditi jednostavnu client validaciju (prazna polja)
- `generateMetadata` — ne postoji na mobilnom
- `role="alert"` / `aria-live` — koristiti `accessibilityLiveRegion` ako potrebno

## Commit
`feat: auth ekrani — prijava i registracija direktno kroz Supabase`

## Proveri pre commita
- [ ] Prijava sa ispravnim podacima otvara pocetni ekran
- [ ] Prijava sa pogresnim podacima prikazuje gresku u UI
- [ ] Prikazi/sakrij lozinku dugme radi
- [ ] Registracija sa novim nalogom prikazuje "Proverite email" poruku
- [ ] Registracija sa vec postojecim emailom prikazuje gresku
- [ ] Forma: sva tri polja su prisutna (puno_ime, email, password) — BEZ potvrde lozinke
- [ ] Return key (done/next) pravilno fokusira sledece polje
- [ ] `router.replace('/(tabs)')` se koristi (ne `router.push`) nakon prijave
- [ ] Zatvaranje modala (X dugme) vraca korisnika nazad
- [ ] Loading spinner se prikazuje tokom async operacije
