import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import {
  guestOmiljeneUcitaj,
  guestOmiljeneSacuvaj,
  guestOmiljeneUkloni,
  guestOmiljeneObrisi,
  guestBannerJeVidjeno,
  guestBannerSetVidjeno,
  type GuestOmiljena,
} from '@/lib/utils/guestOmiljene';

interface OmiljenaStavka {
  id: string;
  biljka_id: string;
  created_at: string;
  biljke: {
    id: string;
    srpski_naziv: string;
    latinski_naziv: string;
    slug: string;
    porodica: string | null;
    biljka_slike: { url: string; alt_tekst: string; je_glavna: boolean }[];
  } | null;
}

async function fetchAuthOmiljene(): Promise<OmiljenaStavka[]> {
  const { data, error } = await supabase
    .from('omiljene')
    .select('id, biljka_id, created_at, biljke(id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna))')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as OmiljenaStavka[];
}

export function useOmiljene() {
  const queryClient = useQueryClient();
  const [jeGost, setJeGost] = useState<boolean | null>(null);
  const [guestStavke, setGuestStavke] = useState<GuestOmiljena[]>([]);
  const [showGuestBaner, setShowGuestBaner] = useState(false);

  const migrirajGuestOmiljene = useCallback(async () => {
    const stavke = await guestOmiljeneUcitaj();
    if (stavke.length === 0) return;
    // allSettled — nastavlja bez obzira na duplikate ili RLS greske
    await Promise.allSettled(
      stavke.map((s) =>
        supabase.from('omiljene').insert({ biljka_id: s.biljka_id })
      )
    );
    await guestOmiljeneObrisi();
    queryClient.invalidateQueries({ queryKey: ['omiljene'] });
  }, [queryClient]);

  useEffect(() => {
    const init = async () => {
      const stavke = await guestOmiljeneUcitaj();
      setGuestStavke(stavke);
      setJeGost(true);
    };

    // getUser() verifikuje token na serveru — pouzdano za migraciju
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setJeGost(false);
        migrirajGuestOmiljene();
      } else {
        init();
      }
    });

    // Prati login/logout dok je hook aktivan
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setJeGost(false);
        migrirajGuestOmiljene();
      } else if (event === 'SIGNED_OUT') {
        setGuestStavke([]);
        setJeGost(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [migrirajGuestOmiljene]);

  const { data: omiljene = [], isLoading: isLoadingAuth } = useQuery({
    queryKey: ['omiljene'],
    queryFn: fetchAuthOmiljene,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: jeGost === false,
  });

  const isLoading = jeGost === null || (jeGost === false && isLoadingAuth);

  // Soft-delete za auth korisnika
  const toggleOmiljena = async (omiljenaId: string, _biljkaId: string) => {
    await supabase
      .from('omiljene')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', omiljenaId);
    queryClient.invalidateQueries({ queryKey: ['omiljene'] });
  };

  const toggleGuestOmiljena = useCallback(async (biljkaId: string, slug: string) => {
    const jeVecOmiljena = guestStavke.some((s) => s.biljka_id === biljkaId);
    if (jeVecOmiljena) {
      await guestOmiljeneUkloni(biljkaId);
    } else {
      const jePrvo = guestStavke.length === 0;
      await guestOmiljeneSacuvaj(biljkaId, slug);
      if (jePrvo && !(await guestBannerJeVidjeno())) {
        await guestBannerSetVidjeno();
        setShowGuestBaner(true);
      }
    }
    const nove = await guestOmiljeneUcitaj();
    setGuestStavke(nove);
  }, [guestStavke]);

  const zatvoriGuestBaner = useCallback(() => setShowGuestBaner(false), []);

  // Proverava da li je biljka u omiljenima (radi za oba rezima)
  const jeOmiljena = useCallback(
    (biljkaId: string): boolean => {
      if (jeGost) return guestStavke.some((s) => s.biljka_id === biljkaId);
      return omiljene.some((o) => o.biljka_id === biljkaId);
    },
    [jeGost, guestStavke, omiljene]
  );

  // Vraca ID omiljene stavke za auth korisnika (potrebno za soft-delete)
  const omiljeneId = useCallback(
    (biljkaId: string): string | undefined =>
      omiljene.find((o) => o.biljka_id === biljkaId)?.id,
    [omiljene]
  );

  return {
    omiljene,
    isLoading,
    jeGost,
    guestStavke,
    showGuestBaner,
    zatvoriGuestBaner,
    toggleOmiljena,
    toggleGuestOmiljena,
    jeOmiljena,
    omiljeneId,
  };
}
