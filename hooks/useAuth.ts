import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export function useAuth() {
  const [korisnik, setKorisnik] = useState<User | null>(null);
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    // getSession() cita iz AsyncStorage — brzo, bez network poziva
    supabase.auth.getSession().then(({ data: { session } }) => {
      setKorisnik(session?.user ?? null);
      setUcitava(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setKorisnik(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const punoIme: string = korisnik?.user_metadata?.puno_ime ?? '';
  const ime = punoIme.split(' ')[0] || korisnik?.email?.split('@')[0] || '';
  // jeGost: true kada je ucitavanje zavrseno i nema korisnika
  const jeGost = !ucitava && korisnik === null;

  return { korisnik, ucitava, punoIme, ime, jeGost };
}
