import { haySupabase } from "../supabase/config";
import { fuenteMemoria } from "./memoria";
import { fuenteSupabase } from "./supabase";
import type { FuenteDatos } from "./contrato";

/**
 * Punto único de acceso a datos. Los componentes importan SIEMPRE desde acá,
 * nunca de `memoria` ni de `supabase` directamente.
 *
 * Sin credenciales de Supabase cae a la implementación en memoria para que el
 * proyecto levante igual, pero con un aviso: la demo real necesita Supabase.
 */
export const datos: FuenteDatos = haySupabase ? fuenteSupabase : fuenteMemoria;

export const usandoSupabase = haySupabase;

export type {
  AccionPedido,
  DatosNuevoPedido,
  FuenteDatos,
} from "./contrato";
