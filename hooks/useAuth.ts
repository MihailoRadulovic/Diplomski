import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { korisnik, ucitava } = useAuthStore();

  const punoIme: string = korisnik?.user_metadata?.puno_ime ?? '';
  const ime = punoIme.split(' ')[0] || korisnik?.email?.split('@')[0] || '';
  // jeGost: true kada je ucitavanje zavrseno i nema korisnika
  const jeGost = !ucitava && korisnik === null;

  return { korisnik, ucitava, ime, jeGost };
}
