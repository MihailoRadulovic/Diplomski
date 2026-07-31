import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SERIF_BOLD } from '@/lib/constants/fontovi';
import { FlashList } from '@shopify/flash-list';
import { useOmiljene } from '@/hooks/useOmiljene';
import { BiljkaKartica } from '@/components/biljke/BiljkaKartica/BiljkaKartica';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { supabase } from '@/lib/supabase/client';
import { guestPreostaliDani } from '@/lib/utils/guestOmiljene';
import { GuestOmiljenaBaner } from '@/components/biljke/OmiljenaToggle/GuestOmiljenaBaner';

export default function OmiljeneTab() {
  const {
    omiljene,
    isLoading,
    toggleOmiljena,
    jeGost,
    guestStavke,
    toggleGuestOmiljena,
    showGuestBaner,
    zatvoriGuestBaner,
  } = useOmiljene();

  const { data: guestBiljke = [], isLoading: isLoadingGuestBiljke } = useQuery({
    queryKey: ['guest-omiljene-biljke', guestStavke.map((s) => s.slug).join(',')],
    queryFn: async () => {
      if (guestStavke.length === 0) return [];
      const slugovi = guestStavke.map((s) => s.slug);
      const { data, error } = await supabase
        .from('biljke')
        .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)')
        .in('slug', slugovi)
        .is('deleted_at', null);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: jeGost === true,
    staleTime: 1000 * 60 * 5,
  });

  const showLoader =
    jeGost === null ||
    (jeGost === true && isLoadingGuestBiljke && guestStavke.length > 0) ||
    (jeGost === false && isLoading);

  const [preostaliDani, setPreostaliDani] = useState(7);
  useEffect(() => {
    guestPreostaliDani().then(setPreostaliDani);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-3xl font-semibold mt-6 mb-4 text-zinc-900 dark:text-white" style={{ fontFamily: SERIF_BOLD }}>
          Omiljene biljke
        </Text>

        {jeGost === true && guestStavke.length > 0 && (
          <View className="flex-row gap-3 p-4 rounded-xl bg-[#FAEEDA] dark:bg-[#EF9F27]/10 border border-[#EF9F27]/40 mb-4">
            <Text className="text-sm flex-1 text-zinc-700 dark:text-zinc-300">
              Sacuvane biljke ce biti dostupne jos {preostaliDani} dana.{' '}
              <Text className="font-semibold underline" onPress={() => router.push('/(auth)/prijava')}>
                Prijavi se
              </Text>
              {' ili '}
              <Text className="font-semibold underline" onPress={() => router.push('/(auth)/registracija')}>
                registruj se
              </Text>
            </Text>
          </View>
        )}

        {showLoader && (
          <View className="gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </View>
        )}

        {!showLoader && jeGost === true && guestStavke.length === 0 && (
          <PraznoStanje />
        )}

        {!showLoader && jeGost === true && guestBiljke.length > 0 && (
          <FlashList
            data={guestBiljke}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const slike = item.biljka_slike as { url: string; je_glavna: boolean }[];
              const glavnaSlika = slike?.find((s) => s.je_glavna)?.url ?? slike?.[0]?.url;
              return (
                <BiljkaKartica
                  id={item.id}
                  slug={item.slug}
                  srpski_naziv={item.srpski_naziv}
                  latinski_naziv={item.latinski_naziv}
                  porodica={item.porodica}
                  glavna_slika_url={glavnaSlika}
                  je_omiljena={true}
                  onOmiljenaToggle={(id, slug) => toggleGuestOmiljena(id, slug)}
                />
              );
            }}
          />
        )}

        {!isLoading && jeGost === false && omiljene.length === 0 && <PraznoStanje />}

        {!isLoading && jeGost === false && omiljene.length > 0 && (
          <FlashList
            data={omiljene}
            numColumns={2}
            keyExtractor={(stavka) => stavka.id}
            renderItem={({ item: stavka }) => {
              const biljka = stavka.biljke;
              if (!biljka) return null;
              const glavnaSlika = biljka.biljka_slike?.find((s) => s.je_glavna)?.url ?? biljka.biljka_slike?.[0]?.url;
              return (
                <BiljkaKartica
                  id={biljka.id}
                  slug={biljka.slug}
                  srpski_naziv={biljka.srpski_naziv}
                  latinski_naziv={biljka.latinski_naziv}
                  glavna_slika_url={glavnaSlika}
                  je_omiljena={true}
                  onOmiljenaToggle={() => toggleOmiljena(stavka.id, biljka.id)}
                />
              );
            }}
          />
        )}
      </ScrollView>

      {showGuestBaner && (
        <GuestOmiljenaBaner dani={preostaliDani} onZatvori={zatvoriGuestBaner} />
      )}
    </SafeAreaView>
  );
}

function PraznoStanje() {
  return (
    <View className="py-16 items-center gap-4">
      <Text className="font-semibold text-center text-zinc-900 dark:text-white">Nema omiljenih biljaka</Text>
      <Text className="text-sm text-zinc-500 text-center">
        Sacuvaj biljke pritiskom na srce na kartici.
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/pretraga')}
        className="px-5 py-2.5 rounded-xl bg-[#639922]"
      >
        <Text className="text-white font-semibold">Pregledaj bilje</Text>
      </Pressable>
    </View>
  );
}
