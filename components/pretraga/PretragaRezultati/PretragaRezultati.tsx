import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { BiljkaKartica } from '@/components/biljke/BiljkaKartica/BiljkaKartica';
import { EmptyState } from '@/components/empty/EmptyState/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { Spinner } from '@/components/ui/Spinner/Spinner';

interface BiljkaPreviewItem {
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
  isFetchingMore: boolean;
  ukupno: number;
  strana: number;
  ukupno_strana: number;
  onStranaChange: (strana: number) => void;
}

function PretragaRezultatiSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-2 pt-1">
      {Array.from({ length: 6 }).map((_, i) => (
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
  isFetchingMore,
  strana,
  ukupno_strana,
  onStranaChange,
}: PretragaRezultatiProps) {
  if (isLoading) return <PretragaRezultatiSkeleton />;

  if (biljke.length === 0) {
    return <EmptyState title="Nema rezultata" description="Pokusajte sa drugom pretragom ili filterom." />;
  }

  return (
    <FlashList
      data={biljke}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1, margin: 4, marginLeft: index % 2 === 0 ? 0 : 4 }}>
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
      onEndReachedThreshold={0.3}
      onEndReached={() => {
        if (!isFetchingMore && strana < ukupno_strana) {
          onStranaChange(strana + 1);
        }
      }}
      ListFooterComponent={
        isFetchingMore ? (
          <View className="py-4 items-center">
            <Spinner size="small" />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}
