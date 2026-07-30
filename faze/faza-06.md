# Faza 6 — Hookovi (data layer)

## Opis
Port i prilagodjavanja svih hookova. Ovo je najkompleksnija faza — ovde se
resi sva logika za Supabase direktne upite, guestOmiljene rewrite i prepoznavanje.

## Zavisnosti
Faza 2, Faza 3

## Web referenca
```
src/hooks/useAuth.ts
src/hooks/useBiljka.ts
src/hooks/useBiljkaDana.ts
src/hooks/usePretraga.ts
src/hooks/useOmiljene.ts
src/hooks/usePrepoznavanje.ts
src/hooks/useTheme.ts
src/hooks/useIsPwa.ts          <- ne portovati
src/lib/guestOmiljene.ts       <- kompletan rewrite u lib/utils/guestOmiljene.ts
```

---

## `lib/utils/guestOmiljene.ts` — kompletan rewrite

Web verzija je sinhrona (localStorage). Mobile mora biti async (AsyncStorage).
`isClient()` guard se brise — na mobilnom ne postoji SSR.

Portovati logiku, ne kod. Isti kljucevi i isti rok od 7 dana, ali sve funkcije `async`.
Kompletan `lib/utils/guestOmiljene.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KLJUC_LISTA = 'guestOmiljene';
const KLJUC_DATUM = 'guestOmiljeneDatum';
const KLJUC_BANNER = 'guestOmiljeneBannerViewed';
const ROK_MS = 7 * 24 * 60 * 60 * 1000; // 7 dana

interface GuestOmiljena {
  biljka_id: string;
  slug: string;
}

export async function guestOmiljeneUcitaj(): Promise<GuestOmiljena[]> {
  try {
    const raw = await AsyncStorage.getItem(KLJUC_LISTA);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function guestOmiljeneSacuvaj(biljkaId: string, slug: string): Promise<void> {
  try {
    const lista = await guestOmiljeneUcitaj();
    if (lista.some((s) => s.biljka_id === biljkaId)) return;
    const novaLista = [...lista, { biljka_id: biljkaId, slug }];
    await AsyncStorage.setItem(KLJUC_LISTA, JSON.stringify(novaLista));
    const datum = await AsyncStorage.getItem(KLJUC_DATUM);
    if (!datum) await AsyncStorage.setItem(KLJUC_DATUM, new Date().toISOString());
  } catch {}
}

export async function guestOmiljeneUkloni(biljkaId: string): Promise<void> {
  try {
    const lista = await guestOmiljeneUcitaj();
    await AsyncStorage.setItem(KLJUC_LISTA, JSON.stringify(lista.filter((s) => s.biljka_id !== biljkaId)));
  } catch {}
}

export async function guestBannerJeVidjeno(): Promise<boolean> {
  try { return (await AsyncStorage.getItem(KLJUC_BANNER)) === 'true'; }
  catch { return false; }
}

export async function guestBannerSetVidjeno(): Promise<void> {
  try { await AsyncStorage.setItem(KLJUC_BANNER, 'true'); } catch {}
}

export async function guestOmiljeneObrisi(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KLJUC_LISTA, KLJUC_DATUM, KLJUC_BANNER]);
  } catch {}
}
```

Obavezno dodati `guestPreostaliDani` — koristi se u Fazi 12 (omiljene ekran):

```ts
// Vraca broj dana do isteka guest omiljenih (od datuma prvog cuvanja)
export async function guestPreostaliDani(): Promise<number> {
  try {
    const datum = await AsyncStorage.getItem(KLJUC_DATUM);
    if (!datum) return 7;
    const proslo = Date.now() - new Date(datum).getTime();
    const preostalo = Math.ceil((ROK_MS - proslo) / (1000 * 60 * 60 * 24));
    return Math.max(0, preostalo);
  } catch {
    return 7;
  }
}
```

Napomena: `guestPreostaliDani` je `async` — u Fazi 12 se poziva unutar `useEffect`
ili `useMemo` sa `await`, ne sinhrono.

---

## `lib/utils/nedavnoPregledano.ts` — novo (nema na webu kao poseban fajl)

Web logika je u `NedavnoPregledano.tsx` direktno (ucitajNedavne, zapisiNedavnu).
Mobile izvlaci u poseban util fajl sa AsyncStorage:

```ts
// lib/utils/nedavnoPregledano.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KLJUC = 'nedavno_pregledano';
const MAX = 5;

export interface NedavnaStavka {
  slug: string;
  srpski_naziv: string;
  latinski_naziv: string;
  slika_url?: string | null;
}

export async function ucitajNedavne(): Promise<NedavnaStavka[]> {
  try {
    const raw = await AsyncStorage.getItem(KLJUC);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function zapisiNedavnu(stavka: NedavnaStavka): Promise<void> {
  try {
    const lista = await ucitajNedavne();
    const filtrirano = lista.filter((s) => s.slug !== stavka.slug);
    const nova = [stavka, ...filtrirano].slice(0, MAX);
    await AsyncStorage.setItem(KLJUC, JSON.stringify(nova));
  } catch {}
}
```

---

## `hooks/useAuth.ts`

Web koristi `getSession()` za inicijalni load (cita iz cookie cache — brzo).
Mobile koristi `getSession()` takodje — cita iz AsyncStorage, nema network poziva.
`getUser()` koristiti samo tamo gde je potrebna server verifikacija (npr. useOmiljene migracija).

```ts
// hooks/useAuth.ts
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
```

---

## `hooks/useBiljka.ts`

Web: `fetch('/api/biljke/[slug]')`. Mobile: Supabase direktno.
Retry logika ostaje ista. QueryKey ostaje `['biljka', slug]`.

```ts
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
```

---

## `hooks/useBiljkaDana.ts`

ISTA formula kao web — `dana od Unix epohe % count`, sort po `id`.

```ts
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
```

---

## `hooks/usePretraga.ts`

Web: `fetch('/api/pretraga')` + `useDeferredValue`. Mobile: Supabase direktno + fiksno `PO_STRANI`.
`useDeferredValue` se izostavlja — debounce je u TextInput komponenti (Faza 9).

```ts
const PO_STRANI = 21; // fiksno — nema window.innerWidth na mobilnom

async function fetchPretraga(q: string, filter: string, strana: number) {
  // Filtriranje ide kroz kolonu `delovanje` (ne kroz `tagovi`) — fleksibilnija pretraga slobodnim tekstom.

  // Nema q ni filter — vrati random biljke
  if (!q && !filter) {
    const { count } = await supabase.from('biljke')
      .select('*', { count: 'exact', head: true }).is('deleted_at', null);
    const ukupno = count ?? 0;
    const offset = Math.floor(Math.random() * Math.max(0, ukupno - 9));
    const { data } = await supabase.from('biljke')
      .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)')
      .is('deleted_at', null).order('id').range(offset, offset + 8);
    return { biljke: data ?? [], ukupno, ukupno_strana: 1 };
  }

  const od = (strana - 1) * PO_STRANI;
  let query = supabase.from('biljke')
    .select('id, srpski_naziv, latinski_naziv, slug, porodica, biljka_slike(url, alt_tekst, je_glavna)', { count: 'exact' })
    .is('deleted_at', null).order('srpski_naziv').range(od, od + PO_STRANI - 1);

  if (q) query = query.or(`srpski_naziv.ilike.%${q}%,latinski_naziv.ilike.%${q}%,delovanje.ilike.%${q}%`);
  // Filter po tagu: pretrazuje `delovanje` polje (ne `tagovi`)
  if (filter) query = query.ilike('delovanje', `%${filter}%`);

  const { data, count } = await query;
  const ukupno = count ?? 0;
  return { biljke: data ?? [], ukupno, ukupno_strana: Math.ceil(ukupno / PO_STRANI) };
}
```

---

## `hooks/useOmiljene.ts` — kompletan rewrite

Web koristi sinhroni `guestOmiljene` API i `/api/omiljene` rutu. Mobile:
- sve async (AsyncStorage nema sinhronog API-ja)
- Supabase direktno umesto fetch poziva na API rute
- `onAuthStateChange` za pracenje login/logout dok je ekran otvoren
- Soft-delete: `.update({ deleted_at })` umesto HTTP DELETE

```ts
// hooks/useOmiljene.ts
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

  // Soft-delete za auth korisnika (koristi se u fazi 7 i 12)
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
```

---

## `hooks/usePrepoznavanje.ts`

Web: prima `File` objekat. Mobile: prima `ImagePicker.ImagePickerAsset`.

```ts
import type { ImagePickerAsset } from 'expo-image-picker';
import type { PrepoznavanjeOdgovorData } from '@/lib/validations/upload.schema';

async function pozovPrepoznavanje(asset: ImagePickerAsset, organ: string): Promise<PrepoznavanjeOdgovorData> {
  const formData = new FormData();
  formData.append('image', {
    uri: asset.uri,
    type: asset.mimeType ?? 'image/jpeg',
    name: asset.fileName ?? 'slika.jpg',
  } as any);
  formData.append('organ', organ);

  const odgovor = await fetch(
    `${process.env.EXPO_PUBLIC_VERCEL_API_URL}/api/prepoznavanje`,
    { method: 'POST', body: formData }
  );
  // Ostatak identican kao web
}
```

Hook interfejs se menja: `prepoznaj(slika: File, organ)` → `prepoznaj(asset: ImagePickerAsset, organ)`.

---

## `hooks/useTheme.ts`

Web: manipulise `document.documentElement.classList`. Mobile: `useColorScheme`.
Kompletan primer je u `faza-15.md`. Ukratko: `useTheme` cita `temaStore` i sistem shemu,
vraca `aktivnaTema: 'light' | 'dark'` koji se predaje NativeWind `setColorScheme`.

---

## `hooks/useImagePicker.ts` — novo (nema na webu)

Ovaj hook pokriva i kameru i galeriju. Trazi permisije automatski pri prvom pozivu.

```ts
// hooks/useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const otvoriKameru = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permisija = await ImagePicker.requestCameraPermissionsAsync();
    if (!permisija.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled) return result.assets[0];
    return null;
  };

  const otvoriGaleriju = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permisija = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permisija.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) return result.assets[0];
    return null;
  };

  return { otvoriKameru, otvoriGaleriju };
}
```

---

## `hooks/useNedavnoPregledano.ts` — novo

```ts
import { useState, useEffect, useCallback } from 'react';
import { ucitajNedavne, zapisiNedavnu, type NedavnaStavka } from '@/lib/utils/nedavnoPregledano';

export function useNedavnoPregledano() {
  const [stavke, setStavke] = useState<NedavnaStavka[]>([]);

  useEffect(() => {
    ucitajNedavne().then(setStavke);
  }, []);

  const zapisi = useCallback(async (stavka: NedavnaStavka) => {
    await zapisiNedavnu(stavka);
    setStavke(await ucitajNedavne());
  }, []);

  // osvezi se koristi u NedavnoPregledano komponenti kroz useFocusEffect
  const osvezi = useCallback(() => {
    ucitajNedavne().then(setStavke);
  }, []);

  return { stavke, zapisi, osvezi };
}
```

## Sta izostaviti
- `useIsPwa.ts` — PWA detekcija, ne postoji na mobilnom
- `AbortSignal.timeout` polyfill — fetch u RN ima drugaciju cancel logiku
- `timeoutSignal()` helper — nije potreban u RN kontekstu
- `useDeferredValue` — zamenjuje se debounce-om u TextInput (Faza 9)

## Commit
`feat: data hookovi — Supabase direktno, useImagePicker, useNedavnoPregledano`

## Proveri pre commita
- [ ] `useAuth` vraca korisnika nakon prijave, null nakon odjave
- [ ] `useAuth` vraca `jeGost: true` kada nema sesije, `false` kada je ulogovan
- [ ] `useBiljka('kamilica')` vraca podatke o biljci sa svim relacijama
- [ ] `useBiljkaDana` vraca istu biljku kao web verzija za isti datum
- [ ] `usePretraga({ q: 'kamilica' })` vraca rezultate
- [ ] `usePretraga({})` vraca 9 random biljaka
- [ ] `usePretraga({ filter: 'probava' })` filtrira po `delovanje` koloni (ne `tagovi`)
- [ ] `useOmiljene` toggle radi za gosta (AsyncStorage) i auth korisnika (Supabase)
- [ ] `usePrepoznavanje` salje formData na Vercel URL (proveriti u network logu)
- [ ] `useNedavnoPregledano` perzistira stavke kroz navigaciju
- [ ] `useImagePicker.otvoriKameru()` trazi permisiju i vraca asset
- [ ] `useImagePicker.otvoriGaleriju()` otvara photo picker
- [ ] `guestPreostaliDani()` vraca broj dana do isteka (0-7)
