export const TAGOVI = [
  { filter: "probava",        searchTerm: "varen",   label: { sr: "Probava",          en: "Digestion" } },
  { filter: "srce-krvotok",   searchTerm: "krvot",   label: { sr: "Srce i krvotok",   en: "Heart & Circulation" } },
  { filter: "disanje",        searchTerm: "kašalj",  label: { sr: "Disanje",          en: "Respiratory" } },
  { filter: "bubrezi",        searchTerm: "bubr",    label: { sr: "Bubrezi",          en: "Kidneys" } },
  { filter: "nervni-sistem",  searchTerm: "nerv",    label: { sr: "Nervni sistem",    en: "Nervous System" } },
  { filter: "koza",           searchTerm: "kož",     label: { sr: "Koža",             en: "Skin" } },
  { filter: "kosti-zglobovi", searchTerm: "reumat",  label: { sr: "Kosti i zglobovi", en: "Joints & Bones" } },
  { filter: "imunitet",       searchTerm: "imunit",  label: { sr: "Imunitet",         en: "Immunity" } },
] as const;

// Mapa za brzo pronalazenje labele po filter kljucu
export const TAG_LABELE: Record<string, { sr: string; en: string }> = Object.fromEntries(
  TAGOVI.map(({ filter, label }) => [filter, label])
);
