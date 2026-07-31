import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useBiljka } from '@/hooks/useBiljka';
import { useNedavnoPregledano } from '@/hooks/useNedavnoPregledano';
import { BiljkaSlike } from '@/components/biljke/BiljkaDetalji/BiljkaSlike';
import { BiljkaGlavnaInfo } from '@/components/biljke/BiljkaDetalji/BiljkaGlavnaInfo';
import { BiljkaKoristiSe } from '@/components/biljke/BiljkaDetalji/BiljkaKoristiSe';
import { UpozorenjaSekcija } from '@/components/biljke/UpozorenjaSekcija/UpozorenjaSekcija';
import { Disclaimer } from '@/components/ui/Disclaimer/Disclaimer';
import { OmiljenaToggle } from '@/components/biljke/OmiljenaToggle/OmiljenaToggle';
import { ShareDugme } from '@/components/biljke/BiljkaDetalji/ShareDugme';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { Toast } from '@/components/ui/Toast/Toast';
import { ErrorFallback } from '@/components/error/ErrorBoundary/ErrorFallback';

function BiljkaDetaljiSkeleton() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <Skeleton className="h-64 rounded-none" />
      <View className="px-4 pt-4 gap-3">
        <Skeleton className="h-8 rounded-lg w-3/4" />
        <Skeleton className="h-5 rounded w-1/2" />
        <Skeleton className="h-4 rounded w-2/5" />
        <View className="flex-row gap-2 mt-1">
          <Skeleton className="h-6 rounded-full w-20" />
          <Skeleton className="h-6 rounded-full w-24" />
          <Skeleton className="h-6 rounded-full w-16" />
        </View>
        <Skeleton className="h-4 rounded w-full mt-2" />
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-5/6" />
        <Skeleton className="h-4 rounded w-4/6" />
      </View>
    </ScrollView>
  );
}

export default function BiljkaEkran() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const { data: biljka, isLoading, isError } = useBiljka(slug);
  const { zapisi } = useNedavnoPregledano();
  const [toastMsg, setToastMsg] = useState('');

  // Upis posete u AsyncStorage (ekvivalent BiljkaPosetaZapis)
  useEffect(() => {
    if (!biljka) return;
    const glavna = biljka.biljka_slike?.find((s) => s.je_glavna) ?? biljka.biljka_slike?.[0];
    zapisi({
      slug: biljka.slug,
      srpski_naziv: biljka.srpski_naziv,
      latinski_naziv: biljka.latinski_naziv,
      slika_url: glavna?.url ?? null,
    });
  }, [biljka?.slug]);

  // OmiljenaToggle u headeru + naslov
  useEffect(() => {
    if (!biljka) return;
    navigation.setOptions({
      title: biljka.srpski_naziv,
      headerRight: () => (
        <OmiljenaToggle biljkaId={biljka.id} slug={biljka.slug} />
      ),
    });
  }, [biljka?.id]);

  if (isLoading) return <BiljkaDetaljiSkeleton />;
  if (isError || !biljka) return <ErrorFallback />;

  return (
    <View className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <BiljkaSlike slike={biljka.biljka_slike} srpski_naziv={biljka.srpski_naziv} />
        <View className="px-4 gap-6">
          <BiljkaGlavnaInfo
            biljka={biljka}
            onKopiranje={() => setToastMsg('Latinsko ime kopirano')}
          />
          <ShareDugme naziv={biljka.srpski_naziv} opis={biljka.opis} />
          {biljka.biljka_upotrebe?.length > 0 && (
            <BiljkaKoristiSe upotrebe={biljka.biljka_upotrebe} />
          )}
          {biljka.biljka_upozorenja?.length > 0 && (
            <UpozorenjaSekcija upozorenja={biljka.biljka_upozorenja} />
          )}
          <Disclaimer />
        </View>
      </ScrollView>
      {toastMsg ? (
        <Toast message={toastMsg} variant="success" onClose={() => setToastMsg('')} />
      ) : null}
    </View>
  );
}
