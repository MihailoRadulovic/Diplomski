import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';

export function useT(ns: string) {
  const { t } = useTranslation();
  return (key: string, opts?: TOptions) => t(`${ns}.${key}`, opts);
}

// Upotreba u komponenti (identicno kao web):
// const t = useT('pocetna');
// t('naslov')  =>  trazi 'pocetna.naslov' u sr.json
