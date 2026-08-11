import { useRef, useEffect } from 'react';
import { View, Text, Pressable, RefreshControl } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { BiljkaKartica } from '@/components/biljke/BiljkaKartica/BiljkaKartica';
import { EmptyState } from '@/components/empty/EmptyState/EmptyState';
import { ErrorFallback } from '@/components/error/ErrorBoundary/ErrorFallback';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useT } from '@/hooks/useT';

export interface BiljkaPreviewItem {
  id: string;
  srpski_naziv: string;
  latinski_naziv: string;
  slug: string;
  porodica: string | null;
  biljka_slike: { url: string; alt_tekst: string; je_glavna: boolean }[];
}

interface PretragaRezultatiProps {
  biljke: BiljkaPreviewItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  strana: number;
  ukupno_strana: number;
  onStranaChange: (strana: number) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

function Paginacija({ strana, ukupno_strana, onStranaChange }: {
  strana: number;
  ukupno_strana: number;
  onStranaChange: (s: number) => void;
}) {
  if (ukupno_strana <= 1) return null;
  const pages = getPages(strana, ukupno_strana);

  return (
    <View className="flex-row justify-center items-center gap-1 py-4 flex-wrap">
      <Pressable
        onPress={() => onStranaChange(strana - 1)}
        disabled={strana === 1}
        className={`w-9 h-9 rounded-full items-center justify-center bg-zelena-svetla dark:bg-zinc-800 ${strana === 1 ? 'opacity-30' : ''}`}
        accessibilityLabel="Prethodna strana"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-back" size={16} color="#27500A" />
      </Pressable>

      {pages.map((page, i) =>
        page === '...' ? (
          <Text key={`dots-${i}`} className="w-9 text-center text-tekst-blagi dark:text-zinc-500">
            …
          </Text>
        ) : (
          <Pressable
            key={page}
            onPress={() => onStranaChange(page as number)}
            className={`w-9 h-9 rounded-full items-center justify-center ${page === strana ? 'bg-zelena-primarna' : 'bg-zelena-svetla dark:bg-zinc-800'}`}
            accessibilityLabel={`Strana ${page}`}
            accessibilityRole="button"
          >
            <Text
              className={`text-sm font-medium ${page === strana ? 'text-white' : 'text-zelena-tamna dark:text-zinc-300'}`}
              style={{ includeFontPadding: false }}
            >
              {page}
            </Text>
          </Pressable>
        )
      )}

      <Pressable
        onPress={() => onStranaChange(strana + 1)}
        disabled={strana === ukupno_strana}
        className={`w-9 h-9 rounded-full items-center justify-center bg-zelena-svetla dark:bg-zinc-800 ${strana === ukupno_strana ? 'opacity-30' : ''}`}
        accessibilityLabel="Sledeća strana"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-forward" size={16} color="#27500A" />
      </Pressable>
    </View>
  );
}

function PretragaRezultatiSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-2 pt-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={{ width: '48%' }}>
          <Skeleton className="h-40 rounded-2xl mb-1.5" />
          <Skeleton className="h-4 rounded mb-1 w-full" />
          <Skeleton className="h-3 rounded w-3/4" />
        </View>
      ))}
    </View>
  );
}

export function PretragaRezultati({
  biljke,
  isLoading,
  isFetching,
  isError,
  strana,
  ukupno_strana,
  onStranaChange,
  refreshing,
  onRefresh,
}: PretragaRezultatiProps) {
  const t = useT('pretraga');
  const listRef = useRef<FlashListRef<BiljkaPreviewItem>>(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [strana]);

  if (isLoading) return <PretragaRezultatiSkeleton />;

  if (isError) return <ErrorFallback onReset={onRefresh} />;

  if (biljke.length === 0) {
    if (isFetching) return <View className="flex-1 items-center justify-center"><Spinner size="large" /></View>;
    return <EmptyState title={t('nema_rezultata')} description={t('nema_rezultata_opis')} />;
  }

  return (
    <FlashList
      ref={listRef}
      data={biljke}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 4 }}>
          <BiljkaKartica
            id={item.id}
            slug={item.slug}
            srpski_naziv={item.srpski_naziv}
            latinski_naziv={item.latinski_naziv}
            porodica={item.porodica}
            glavna_slika_url={
              item.biljka_slike?.find((s) => s.je_glavna)?.url ??
              item.biljka_slike?.[0]?.url
            }
          />
        </View>
      )}
      ListFooterComponent={
        <Paginacija
          strana={strana}
          ukupno_strana={ukupno_strana}
          onStranaChange={onStranaChange}
        />
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}
    />
  );
}
