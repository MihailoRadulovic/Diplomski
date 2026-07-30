// Formatiranje datuma za prikaz u UI
export function formatirajDatum(iso: string, locale = "sr-RS"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Formatiranje procenta pouzdanosti (PlantNet score)
export function formatirajPouzdanost(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}
