import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { usePretragaStore } from '@/stores/pretragaStore';
import { PretragaInput } from '@/components/pretraga/PretragaInput/PretragaInput';
import { PretragaFilteri } from '@/components/pretraga/PretragaFilteri/PretragaFilteri';
import { PretragaRezultati, type BiljkaPreviewItem } from '@/components/pretraga/PretragaRezultati/PretragaRezultati';
import { usePretraga } from '@/hooks/usePretraga';

export default function PretragaTab() {
  const params = useLocalSearchParams<{ filter?: string }>();
  const { q, filter, setQ, setFilter } = usePretragaStore();
  const [strana, setStrana] = useState(1);

  useEffect(() => {
    if (params.filter) setFilter(params.filter);
  }, [params.filter, setFilter]);

  const { biljke, ukupno_strana, isLoading, isFetching } = usePretraga({ q, filter, strana });

  const handleSearch = (noviQ: string) => {
    setQ(noviQ);
    setStrana(1);
  };

  const handleFilterChange = (f: string) => {
    if (f === filter) return;
    setFilter(f);
    setStrana(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <View className="flex-1 px-4 pt-4">
        <PretragaInput value={q} onSearch={handleSearch} />
        <PretragaFilteri aktivni_filter={filter} onFilterChange={handleFilterChange} />
        <PretragaRezultati
          biljke={biljke as BiljkaPreviewItem[]}
          isLoading={isLoading}
          isFetching={isFetching}
          strana={strana}
          ukupno_strana={ukupno_strana}
          onStranaChange={setStrana}
        />
      </View>
    </SafeAreaView>
  );
}
