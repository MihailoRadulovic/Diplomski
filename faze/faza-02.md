# Faza 2 — Konfiguracija

## Opis
Kopiranje TypeScript tipova, utility funkcija i konstanti iz web projekta.
Kreiranje Supabase klijenta prilagodenog za React Native.

## Zavisnosti
Faza 1

## Web referenca
```
src/types/database.ts
src/types/biljka.ts
src/types/api.ts
src/types/auth.ts
src/types/pretraga.ts
src/lib/utils/cn.ts
src/lib/utils/format.ts
src/lib/utils/slug.ts
src/lib/utils/error.ts
src/lib/constants/tagovi.ts
src/lib/validations/upload.schema.ts
src/lib/supabase/client.ts        <- prilagoditi, ne kopirati direktno
```

## Sta portovati (kopiraj 1:1)

Sledece fajlove kopiraj bez ikakve izmene:
```
types/database.ts             <- OBAVEZNO — biljka.ts ga importuje
types/biljka.ts
types/api.ts
types/auth.ts
types/pretraga.ts
lib/utils/cn.ts               <- clsx + twMerge, radi u RN
lib/utils/format.ts
lib/utils/slug.ts
lib/utils/error.ts            <- AppGreska klasa, KODOVI_GRESAKA
lib/constants/tagovi.ts       <- TAGOVI niz, TAG_LABELE mapa
lib/validations/upload.schema.ts  <- organSchema, UploadOrgan tip
```

## Sta prilagoditi

### `lib/supabase/client.ts` — ne kopirati, pisati ispocetka

Web koristi `@supabase/ssr` sa cookie logikom. Mobile koristi direktni klijent:

```ts
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

`createAdminClient` se NE portuje — ne postoji service role key na mobilnom.

## Sta izostaviti
- `lib/supabase/server.ts` — nema servera
- `lib/supabase/middleware.ts` — nema servera
- `lib/validations/env.schema.ts` — env validacija na serveru, ne treba na mobilnom
- `lib/validations/auth.schema.ts` — portuje se u Fazi 13
- `lib/validations/pretraga.schema.ts` — web API validacija, ne treba na mobilnom

## Commit
`chore: tipovi, utils, konstante i Supabase klijent`

## Proveri pre commita
- [ ] `npx tsc --noEmit` prolazi bez gresaka (posebno proveriti `database.ts` → `biljka.ts` import)
- [ ] `supabase.from('biljke').select('*')` ne baca TypeScript gresku
- [ ] `TAGOVI` niz ima 8 stavki (probava, srce-krvotok, disanje, bubrezi, nervni-sistem, koza, kosti-zglobovi, imunitet)
- [ ] `organSchema` parsira 'leaf', 'flower', 'fruit', 'bark', 'habit', 'other'
