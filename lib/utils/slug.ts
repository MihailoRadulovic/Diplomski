// Generise slug iz srpskog naziva biljke
// Primer: "Kantarion" → "kantarion", "Crni bez" → "crni-bez"
export function generisiSlug(naziv: string): string {
  return naziv
    .toLowerCase()
    .replace(/š/g, "s")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/ž/g, "z")
    .replace(/đ/g, "dj")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}
