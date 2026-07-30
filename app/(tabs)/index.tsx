import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PocetnaHero } from '@/components/pocetna/PocetnaHero/PocetnaHero';
import { NedavnoPregledano } from '@/components/pocetna/NedavnoPregledano/NedavnoPregledano';
import { BiljkaDanaSekcija } from '@/components/pocetna/BiljkaDanaSekcija/BiljkaDanaSekcija';
import { PopularniFilteri } from '@/components/pocetna/PopularniFilteri/PopularniFilteri';

export default function PocetnaTab() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['biljka-dana'] });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PocetnaHero />
        <NedavnoPregledano />
        <BiljkaDanaSekcija />
        <PopularniFilteri />
      </ScrollView>
    </SafeAreaView>
  );
}
