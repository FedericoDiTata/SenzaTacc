"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirSesion } from "@/lib/auth";
import { datos, type AccionPedido } from "@/lib/data";
import { haySupabase } from "@/lib/supabase/config";
import { clienteServidor } from "@/lib/supabase/servidor";
import { disponible, type ItemPedido } from "@/lib/types";

export type Resultado = { ok: true } | { ok: false; error: string };

/** Todo lo que cambia stock invalida el panel Y el market. */
function revalidarTodo() {
  revalidatePath("/panel", "layout");
  revalidatePath("/market");
  revalidatePath("/");
}

function fallo(e: unknown): Resultado {
  return { ok: false, error: e instanceof Error ? e.message : "Error inesperado" };
}

/**
 * Confirmar / modificar / cancelar un pedido.
 * Es la acción central del panel: un toque acá reemplaza llevar el inventario
 * a mano.
 */
export async function resolverPedido(
  id: string,
  accion: AccionPedido,
  itemsNuevos?: ItemPedido[],
): Promise<Resultado> {
  try {
    await requerirSesion();
    await datos.resolverPedido(id, accion, itemsNuevos);
    revalidarTodo();
    return { ok: true };
  } catch (e) {
    return fallo(e);
  }
}

/** Venta presencial. El mismo movimiento que hará el POS cuando se integre. */
export async function venderEnMostrador(
  productoId: string,
  cantidad = 1,
): Promise<Resultado> {
  try {
    await requerirSesion();

    // La grilla puede estar desactualizada (otra caja vendió lo último hace
    // segundos). Sin este chequeo, aplicar_movimiento igual registraría el
    // movimiento aunque el stock ya esté en cero —el clamp lo deja en 0— y el
    // ledger mostraría una venta que nunca descontó nada.
    const producto = await datos.obtenerProducto(productoId);
    if (!producto) return { ok: false, error: "Producto inexistente" };
    const libre = disponible(producto);
    if (libre < cantidad) {
      return {
        ok: false,
        error:
          libre === 0
            ? `No queda stock de ${producto.nombre} (puede estar reservado por un pedido web).`
            : `De ${producto.nombre} quedan ${libre} sin reservar.`,
      };
    }

    await datos.venderEnMostrador(productoId, cantidad);
    revalidarTodo();
    return { ok: true };
  } catch (e) {
    return fallo(e);
  }
}

export async function reponerStock(
  productoId: string,
  cantidad: number,
): Promise<Resultado> {
  try {
    await requerirSesion();
    await datos.reponerStock(productoId, cantidad);
    revalidarTodo();
    return { ok: true };
  } catch (e) {
    return fallo(e);
  }
}

export async function ajustarStock(
  productoId: string,
  nuevoStock: number,
): Promise<Resultado> {
  try {
    await requerirSesion();
    if (!Number.isFinite(nuevoStock) || nuevoStock < 0) {
      return { ok: false, error: "El stock no puede ser negativo" };
    }
    await datos.ajustarStock(productoId, Math.floor(nuevoStock));
    revalidarTodo();
    return { ok: true };
  } catch (e) {
    return fallo(e);
  }
}

export async function actualizarProducto(
  id: string,
  cambios: { precio?: number; activo?: boolean; destacado?: boolean; stockMinimo?: number },
): Promise<Resultado> {
  try {
    await requerirSesion();
    await datos.actualizarProducto(id, cambios);
    revalidarTodo();
    return { ok: true };
  } catch (e) {
    return fallo(e);
  }
}

export async function cerrarSesion() {
  if (haySupabase) {
    const sb = await clienteServidor();
    await sb.auth.signOut();
  }
  redirect("/login");
}
