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
