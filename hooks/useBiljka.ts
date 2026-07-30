import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { BiljkaSaRelacijama } from '@/types/biljka';

async function fetchBiljka(slug: string): Promise<BiljkaSaRelacijama> {
  const { data, error } = await supabase
    .from('biljke')
    .select('*, biljka_slike(*), biljka_upotrebe(*), biljka_upozorenja(*)')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();
  if (error || !data) throw new Error('Biljka nije pronadjena');
  return data as unknown as BiljkaSaRelacijama;
}

export function useBiljka(slug: string) {
  return useQuery({
    queryKey: ['biljka', slug],
    queryFn: () => fetchBiljka(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('nije pronadjena')) return false;
      return failureCount < 2;
    },
  });
}
