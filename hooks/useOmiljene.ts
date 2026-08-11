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
  guestBannerSetPending,
  guestBannerIsPending,
  guestBannerClearPending,
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

  // Toggle za auth korisnika: INSERT ako nije u omiljenima, soft-delete ako jeste
  const toggleOmiljena = useCallback(async (biljkaId: string) => {
    const existing = omiljene.find((o) => o.biljka_id === biljkaId);
    if (existing) {
      await supabase
        .from('omiljene')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('omiljene').insert({ biljka_id: biljkaId });
    }
    queryClient.invalidateQueries({ queryKey: ['omiljene'] });
  }, [omiljene, queryClient]);

  const toggleGuestOmiljena = useCallback(async (biljkaId: string, slug: string) => {
    const jeVecOmiljena = guestStavke.some((s) => s.biljka_id === biljkaId);
    if (jeVecOmiljena) {
      await guestOmiljeneUkloni(biljkaId);
    } else {
      const jePrvo = guestStavke.length === 0;
      await guestOmiljeneSacuvaj(biljkaId, slug);
      if (jePrvo && !(await guestBannerJeVidjeno())) {
        await guestBannerSetPending();
      }
    }
    const nove = await guestOmiljeneUcitaj();
    setGuestStavke(nove);
  }, [guestStavke]);

  const zatvoriGuestBaner = useCallback(() => setShowGuestBaner(false), []);

  const checkGuestBaner = useCallback(async () => {
    if (await guestBannerIsPending()) {
      await guestBannerSetVidjeno();
      await guestBannerClearPending();
      setShowGuestBaner(true);
    }
  }, []);

  // Proverava da li je biljka u omiljenima (radi za oba rezima)
  const jeOmiljena = useCallback(
    (biljkaId: string): boolean => {
      if (jeGost) return guestStavke.some((s) => s.biljka_id === biljkaId);
      return omiljene.some((o) => o.biljka_id === biljkaId);
    },
    [jeGost, guestStavke, omiljene]
  );

  return {
    omiljene,
    isLoading,
    jeGost,
    guestStavke,
    showGuestBaner,
    zatvoriGuestBaner,
    checkGuestBaner,
    toggleOmiljena,
    toggleGuestOmiljena,
    jeOmiljena,
  };
}
