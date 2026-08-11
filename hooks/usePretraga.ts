import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { TAGOVI } from '@/lib/constants/tagovi';

const PO_STRANI = 10;

interface BiljkaPreview {
  id: string;
  srpski_naziv: string;
  latinski_naziv: string;
  slug: string;
  porodica: string | null;
  biljka_slike: { url: string; alt_tekst: string; je_glavna: boolean }[];
}

interface PretragaOdgovor {
  biljke: BiljkaPreview[];
  ukupno: number;
  ukupno_strana: number;
}

async function fetchPretraga(q: string, filter: string, strana: number): Promise<PretragaOdgovor> {
  // Filtriranje ide kroz kolonu `delovanje` (ne kroz `tagovi`) — fleksibilnija pretraga slobodnim tekstom.

  // Nema q ni filter — vrati random biljke
  if (!q && !filter) {
    const { count } = await supabase.from('biljke')
      .select('*', { count: 'exact', head: true }).is('deleted_at', null);
    const ukupno = count ?? 0;
    const offset = Math.floor(Math.random() * Math.max(0, ukupno - 10));
    const { data } = await supabase.from('biljke')
      .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)')
      .is('deleted_at', null).order('id').range(offset, offset + 9);
    return { biljke: (data ?? []) as unknown as BiljkaPreview[], ukupno, ukupno_strana: 1 };
  }

  const od = (strana - 1) * PO_STRANI;
  let query = supabase.from('biljke')
    .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)', { count: 'exact' })
    .is('deleted_at', null).order('srpski_naziv').range(od, od + PO_STRANI - 1);

  if (q) query = query.or(`srpski_naziv.ilike.%${q}%,latinski_naziv.ilike.%${q}%,delovanje.ilike.%${q}%`);
  // Filter po tagu: koristi searchTerm iz TAGOVI koji odgovara srpskim rečima u tekstu
  if (filter) {
    const searchTerm = TAGOVI.find(t => t.filter === filter)?.searchTerm ?? filter;
    query = query.ilike('delovanje', `%${searchTerm}%`);
  }

  const { data, count } = await query;
  const ukupno = count ?? 0;
  return {
    biljke: (data ?? []) as unknown as BiljkaPreview[],
    ukupno,
    ukupno_strana: Math.ceil(ukupno / PO_STRANI),
  };
}

interface UsePretragaParams {
  q: string;
  filter?: string;
  strana?: number;
}

export function usePretraga({ q, filter = '', strana = 1 }: UsePretragaParams) {
  const isRandom = !q && !filter;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: isRandom
      ? ['pretraga-random']
      : ['pretraga', q, filter, strana],
    queryFn: () => fetchPretraga(q, filter, strana),
    staleTime: isRandom ? 0 : 1000 * 60 * 10,
    placeholderData: (prev) => prev,
  });

  return {
    biljke: data?.biljke ?? [],
    ukupno_strana: data?.ukupno_strana ?? 1,
    isLoading,
    isFetching,
  };
}
