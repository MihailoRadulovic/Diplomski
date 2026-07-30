export interface BiljkaKarticaProps {
  id: string;
  slug: string;
  srpski_naziv: string;
  latinski_naziv: string;
  porodica?: string | null;
  glavna_slika_url?: string | null;
  je_omiljena?: boolean;
  onOmiljenaToggle?: (biljka_id: string, slug: string) => void;
}
