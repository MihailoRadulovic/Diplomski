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
