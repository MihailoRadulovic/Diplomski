export const TAGOVI = [
  { filter: "probava",        label: { sr: "Probava",          en: "Digestion" } },
  { filter: "srce-krvotok",   label: { sr: "Srce i krvotok",   en: "Heart & Circulation" } },
  { filter: "disanje",        label: { sr: "Disanje",          en: "Respiratory" } },
  { filter: "bubrezi",        label: { sr: "Bubrezi",          en: "Kidneys" } },
  { filter: "nervni-sistem",  label: { sr: "Nervni sistem",    en: "Nervous System" } },
  { filter: "koza",           label: { sr: "Koža",             en: "Skin" } },
  { filter: "kosti-zglobovi", label: { sr: "Kosti i zglobovi", en: "Joints & Bones" } },
  { filter: "imunitet",       label: { sr: "Imunitet",         en: "Immunity" } },
] as const;

export type TagFilter = (typeof TAGOVI)[number]["filter"];

// Mapa za brzo pronalazenje labele po filter kljucu
export const TAG_LABELE: Record<string, { sr: string; en: string }> = Object.fromEntries(
  TAGOVI.map(({ filter, label }) => [filter, label])
);
