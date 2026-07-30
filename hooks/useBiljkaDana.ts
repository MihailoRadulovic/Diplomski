import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

async function fetchBiljkaDana() {
  const epoch = new Date(0);
  const danaOdEpohe = Math.floor((Date.now() - epoch.getTime()) / (1000 * 60 * 60 * 24));

  const { count } = await supabase
    .from('biljke')
    .select('id', { count: 'exact', head: true })
    .is('deleted_at', null);

  if (!count || count === 0) throw new Error('Nema biljaka');

  const index = danaOdEpohe % count;

  const { data, error } = await supabase
    .from('biljke')
    .select('id, srpski_naziv, latinski_naziv, slug, delovanje, opis, biljka_slike(url, alt_tekst, je_glavna)')
    .is('deleted_at', null)
    .order('id') // MORA biti 'id', ne 'created_at' — da se podudara sa web verzijom
    .range(index, index)
    .single();

  if (error || !data) throw new Error('Greska pri ucitavanju biljke dana');
  return data;
}

export function useBiljkaDana() {
  return useQuery({
    queryKey: ['biljka-dana'],
    queryFn: fetchBiljkaDana,
    staleTime: 1000 * 60 * 60 * 24, // 24h — menja se jednom dnevno
    retry: 2,
  });
}
