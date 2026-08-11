import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  korisnik: User | null;
  ucitava: boolean;
  _setKorisnik: (k: User | null) => void;
  _setUcitava: (u: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  korisnik: null,
  ucitava: true,
  _setKorisnik: (korisnik) => set({ korisnik }),
  _setUcitava: (ucitava) => set({ ucitava }),
}));
