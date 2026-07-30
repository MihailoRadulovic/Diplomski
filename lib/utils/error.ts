// Standardni kodovi gresaka iz CLAUDE.md
export const KODOVI_GRESAKA = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PLANTNET_ERROR: "PLANTNET_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type KodGreske = (typeof KODOVI_GRESAKA)[keyof typeof KODOVI_GRESAKA];

export class AppGreska extends Error {
  constructor(
    public readonly kod: KodGreske,
    message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AppGreska";
  }
}

export function izvuciPorukuGreske(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Doslo je do neocekivane greske";
}
