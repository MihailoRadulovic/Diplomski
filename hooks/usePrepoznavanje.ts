import { useState } from 'react';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { PrepoznavanjeOdgovorData, UploadOrgan } from '@/lib/validations/upload.schema';

// Nema client-side retry-a — server (/api/prepoznavanje) vec retryuje PlantNet 3 puta interno.
async function pozovPrepoznavanje(
  asset: ImagePickerAsset,
  organ: UploadOrgan
): Promise<PrepoznavanjeOdgovorData> {
  const formData = new FormData();
  formData.append('image', {
    uri: asset.uri,
    type: asset.mimeType ?? 'image/jpeg',
    name: asset.fileName ?? 'slika.jpg',
  } as unknown as Blob);
  formData.append('organ', organ);

  const odgovor = await fetch(
    `${process.env.EXPO_PUBLIC_VERCEL_API_URL}/api/prepoznavanje`,
    { method: 'POST', body: formData }
  );

  if (!odgovor.ok) {
    const greska = await odgovor.json().catch(() => ({ error: { message: 'Greska pri prepoznavanju.' } }));
    throw new Error(greska?.error?.message ?? 'Greska pri prepoznavanju.');
  }

  const json = await odgovor.json();
  return json.data as PrepoznavanjeOdgovorData;
}

export function usePrepoznavanje() {
  const [rezultat, setRezultat] = useState<PrepoznavanjeOdgovorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);

  const prepoznaj = async (asset: ImagePickerAsset, organ: UploadOrgan) => {
    setIsLoading(true);
    setGreska(null);
    setRezultat(null);

    try {
      const podaci = await pozovPrepoznavanje(asset, organ);
      setRezultat(podaci);
    } catch (err) {
      const poruka = err instanceof Error ? err.message : 'Greska pri prepoznavanju. Pokusajte ponovo.';
      setGreska(poruka);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setRezultat(null);
    setGreska(null);
    setIsLoading(false);
  };

  return { prepoznaj, rezultat, isLoading, greska, reset };
}
