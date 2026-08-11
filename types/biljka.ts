import type { Database } from "./database";

export type BiljkaRow = Database["public"]["Tables"]["biljke"]["Row"];
export type BiljkaSlikaRow = Database["public"]["Tables"]["biljka_slike"]["Row"];
export type BiljkaUpotrebaRow = Database["public"]["Tables"]["biljka_upotrebe"]["Row"];
export type BiljkaUpozorenjeRow = Database["public"]["Tables"]["biljka_upozorenja"]["Row"];

// Biljka sa relacijama — nazivi polja odgovaraju Supabase join imenima (tabela → polje)
// tagovi je dodat migracijom 007 i nije u auto-generisanim tipovima
export interface BiljkaSaRelacijama extends BiljkaRow {
  tagovi?: string[] | null;
  biljka_slike: BiljkaSlikaRow[];
  biljka_upotrebe: BiljkaUpotrebaRow[];
  biljka_upozorenja: BiljkaUpozorenjeRow[];
}

export type OzbiljnostUpozorenja = "niska" | "srednja" | "visoka";
