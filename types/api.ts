import type { KodGreske } from "@/lib/utils/error";

// Standardni format odgovora iz CLAUDE.md
export type ApiOdgovor<T> =
  | { data: T; error: null }
  | { data: null; error: { code: KodGreske; message: string } };

// HTTP status kodovi po specu
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;
