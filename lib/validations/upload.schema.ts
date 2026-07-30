import { z } from "zod";

export const DOZVOLJENI_TIPOVI = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_VELICINA_MB = 10;
export const MAX_VELICINA_BAJTOVI = MAX_VELICINA_MB * 1024 * 1024;

export const organSchema = z
  .enum(["leaf", "flower", "fruit", "bark", "habit", "other"])
  .default("leaf");

export type UploadOrgan = z.infer<typeof organSchema>;

// Tip prepoznavanja — rezultat koji vraca /api/prepoznavanje
export type PrepoznavanjeOdgovorData =
  | { tip: "u_bazi"; slug: string; naziv: string; latinskiNaziv: string; pouzdanost: number; preostalihZahteva: number }
  | { tip: "nije_u_bazi"; naziv: string; pouzdanost: number; preostalihZahteva: number }
  | { tip: "nije_prepoznato" };
