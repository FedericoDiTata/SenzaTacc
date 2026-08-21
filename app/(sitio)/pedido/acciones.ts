"use server";

import { datos } from "@/lib/data";
import { disponible, type ItemPedido } from "@/lib/types";
import { linkPedido } from "@/lib/whatsapp";

export interface LineaSolicitada {
  productoId: string;
  cantidad: number;
}

export type ResultadoPedido =
  | { ok: true; codigo: string; url: string }
  | { ok: false; error: string };

/**
 * Crea el pedido y devuelve el link de WhatsApp.
 *
 * El cliente manda sólo id + cantidad: precios, nombres y disponibilidad se
 * releen de la base. Una Server Action se puede invocar con un POST directo,
 * así que nada de lo que llega es confiable.
 */
export async function confirmarPedido(
  nombre: string,
  telefono: string,
  nota: string,
  lineas: LineaSolicitada[],
): Promise<ResultadoPedido> {
  const nombreLimpio = nombre.trim().slice(0, 80);
  if (nombreLimpio.length < 2) {
    return { ok: false, error: "Necesitamos tu nombre para el pedido." };
  }
  if (!Array.isArray(lineas) || lineas.length === 0) {
    return { ok: false, error: "El pedido está vacío." };
  }

  // Reservas vencidas primero: puede liberar stock que este pedido necesita.
  await datos.expirarPedidos();

  const items: ItemPedido[] = [];
  for (const linea of lineas) {
    const cantidad = Math.floor(Number(linea.cantidad));
    if (!Number.isFinite(cantidad) || cantidad < 1) continue;

    const producto = await datos.obtenerProducto(String(linea.productoId));
    if (!producto || !producto.activo) {
      return { ok: false, error: "Uno de los productos ya no está disponible." };
    }

    const libre = disponible(producto);
    if (libre < cantidad) {
      return {
        ok: false,
        error:
          libre === 0
            ? `Se acaba de agotar ${producto.nombre}. Sacalo del pedido para seguir.`
            : `De ${producto.nombre} quedan ${libre}. Ajustá la cantidad para seguir.`,
      };
    }

    items.push({
      productoId: producto.id,
      nombre: producto.nombre,
      marca: producto.marca,
      unidad: producto.unidad,
      precioUnitario: producto.precio,
      cantidad,
    });
  }

  if (items.length === 0) {
    return { ok: false, error: "El pedido está vacío." };
  }

  try {
    const pedido = await datos.crearPedido({
      clienteNombre: nombreLimpio,
      clienteTelefono: telefono.trim().slice(0, 40),
      nota: nota.trim().slice(0, 500),
      items,
    });

    return { ok: true, codigo: pedido.codigo, url: linkPedido(pedido) };
  } catch (e) {
    // El error típico acá es que otro pedido se llevó las últimas unidades
    // entre la validación y la reserva.
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return {
      ok: false,
      error: msg.includes("stock")
        ? "Esas unidades se acaban de agotar. Revisá el carrito para seguir."
        : "No pudimos registrar el pedido. Probá de nuevo en un momento.",
    };
  }
}
