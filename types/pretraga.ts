export interface PretragaParametri {
  q?: string;
  filter?: string; // tag/delovanje filter
  stranica?: number;
}

export interface PretragaRezultat<T> {
  stavke: T[];
  ukupno: number;
  stranica: number;
  ukupnoStranica: number;
}
