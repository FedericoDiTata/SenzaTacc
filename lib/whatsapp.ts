import { SITE } from "./siteConfig";
import { formatARS, type Pedido } from "./types";

/** Link a WhatsApp, con mensaje pre-cargado opcional. */
export function linkWhatsApp(texto?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

/**
 * Mensaje del pedido.
 *
 * El código va primero y bien visible: es lo que el dueño busca en el panel
 * para saber a qué fila corresponde esta conversación. Sin él tiene una lista
 * de pedidos y un chat, y ninguna forma de unirlos.
 */
export function mensajePedido(pedido: Pedido): string {
  const lineas: string[] = [
    `¡Hola! Quiero hacer un pedido en ${SITE.nombre}.`,
    "",
    `🧾 Pedido *${pedido.codigo}*`,
    "",
  ];

  for (const item of pedido.items) {
    const cant = item.cantidad > 1 ? `${item.cantidad}× ` : "";
    lineas.push(
      `• ${cant}${item.marca} ${item.nombre} (${item.unidad}) — ${formatARS(
        item.precioUnitario * item.cantidad,
      )}`,
    );
  }

  lineas.push("", `💰 Total: ${formatARS(pedido.total)}`);

  if (pedido.nota.trim()) {
    lineas.push("", `💬 ${pedido.nota.trim()}`);
  }

  lineas.push(
    "",
    `👤 ${pedido.clienteNombre}`,
    SITE.soloRetiro ? `📍 Retiro en ${SITE.direccion}` : "📍 A coordinar",
  );

  return lineas.join("\n");
}

export function linkPedido(pedido: Pedido): string {
  return linkWhatsApp(mensajePedido(pedido));
}
