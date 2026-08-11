import { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { usePretragaStore } from '@/stores/pretragaStore';
import { PretragaInput } from '@/components/pretraga/PretragaInput/PretragaInput';
import { PretragaFilteri } from '@/components/pretraga/PretragaFilteri/PretragaFilteri';
import { PretragaRezultati, type BiljkaPreviewItem } from '@/components/pretraga/PretragaRezultati/PretragaRezultati';
import { usePretraga } from '@/hooks/usePretraga';
import { useT } from '@/hooks/useT';

export default function PretragaTab() {
  const params = useLocalSearchParams<{ filter?: string }>();
  const { q, filter, setQ, setFilter } = usePretragaStore();
  const [strana, setStrana] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = useT('pretraga');

  useEffect(() => {
    if (params.filter) setFilter(params.filter);
  }, [params.filter, setFilter]);

  const { biljke, ukupno, ukupno_strana, isLoading, isFetching, isError, refetch } = usePretraga({ q, filter, strana });

  const handleSearch = (noviQ: string) => {
    setQ(noviQ);
    setStrana(1);
  };

  const handleFilterChange = (f: string) => {
    if (f === filter) return;
    setFilter(f);
    setStrana(1);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const isRandom = !q && !filter;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <View className="flex-1 px-4 pt-4">
        <PretragaInput value={q} onSearch={handleSearch} />
        <PretragaFilteri aktivni_filter={filter} onFilterChange={handleFilterChange} />
        {!isRandom && !isLoading && (
          <Text className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
            {t('ukupno_rezultata', { ukupno })}
          </Text>
        )}
        <PretragaRezultati
          biljke={biljke as BiljkaPreviewItem[]}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          strana={strana}
          ukupno_strana={ukupno_strana}
          onStranaChange={setStrana}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
