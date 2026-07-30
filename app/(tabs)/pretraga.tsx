import { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { usePretragaStore } from '@/stores/pretragaStore';
import { PretragaInput } from '@/components/pretraga/PretragaInput/PretragaInput';
import { PretragaFilteri } from '@/components/pretraga/PretragaFilteri/PretragaFilteri';
import { PretragaRezultati } from '@/components/pretraga/PretragaRezultati/PretragaRezultati';
import { usePretraga } from '@/hooks/usePretraga';

interface BiljkaPreviewItem {
  id: string;
  srpski_naziv: string;
  latinski_naziv: string;
  slug: string;
  porodica: string | null;
  biljka_slike: { url: string; alt_tekst: string; je_glavna: boolean }[];
}

export default function PretragaTab() {
  const params = useLocalSearchParams<{ filter?: string }>();
  const { q, filter, setQ, setFilter } = usePretragaStore();
  const [strana, setStrana] = useState(1);
  const [allBiljke, setAllBiljke] = useState<BiljkaPreviewItem[]>([]);
  const lastAppendedStrana = useRef(0);

  // Inicijalizacija filtera iz navigacionih parametara
  useEffect(() => {
    if (params.filter) setFilter(params.filter);
  }, [params.filter]);

  const { biljke, ukupno, ukupno_strana, isLoading, isFetching } = usePretraga({
    q,
    filter,
    strana,
  });

  // Akumulacija biljaka — novi q/filter resetuje listu, novi strana dodaje
  useEffect(() => {
    if (isFetching) return;
    if (strana === 1) {
      setAllBiljke(biljke as BiljkaPreviewItem[]);
      lastAppendedStrana.current = 1;
    } else if (strana > lastAppendedStrana.current) {
      setAllBiljke((prev) => [...prev, ...(biljke as BiljkaPreviewItem[])]);
      lastAppendedStrana.current = strana;
    }
  }, [biljke, isFetching, strana]);

  const handleSearch = (noviQ: string) => {
    setQ(noviQ);
    setStrana(1);
    lastAppendedStrana.current = 0;
    setAllBiljke([]);
  };

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setStrana(1);
    lastAppendedStrana.current = 0;
    setAllBiljke([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <View className="flex-1 px-4 pt-4">
        <PretragaInput value={q} onSearch={handleSearch} />
        <PretragaFilteri aktivni_filter={filter} onFilterChange={handleFilterChange} />
        <PretragaRezultati
          biljke={allBiljke}
          isLoading={isLoading}
          isFetchingMore={isFetching && strana > 1}
          ukupno={ukupno}
          strana={strana}
          ukupno_strana={ukupno_strana}
          onStranaChange={setStrana}
        />
      </View>
    </SafeAreaView>
  );
}
