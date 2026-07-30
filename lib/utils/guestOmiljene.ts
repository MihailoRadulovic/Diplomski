import AsyncStorage from '@react-native-async-storage/async-storage';

const KLJUC_LISTA = 'guestOmiljene';
const KLJUC_DATUM = 'guestOmiljeneDatum';
const KLJUC_BANNER = 'guestOmiljeneBannerViewed';
const ROK_MS = 7 * 24 * 60 * 60 * 1000; // 7 dana

export interface GuestOmiljena {
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
    await Promise.all([
      AsyncStorage.removeItem(KLJUC_LISTA),
      AsyncStorage.removeItem(KLJUC_DATUM),
      AsyncStorage.removeItem(KLJUC_BANNER),
    ]);
  } catch {}
}

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
