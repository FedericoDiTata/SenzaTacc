export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Si no hay credenciales, la capa de datos usa la implementación en memoria
 * (lib/data/memoria.ts). Sirve para levantar el proyecto sin backend, pero la
 * demo real necesita Supabase: sin él cada dispositivo ve su propio estado.
 */
export const haySupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
