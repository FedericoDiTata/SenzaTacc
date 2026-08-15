import { HORAS_EXPIRACION_PEDIDO } from "../siteConfig";
import { PRODUCTOS_SEED } from "../seed";
import { PEDIDOS_DEMO } from "../seedPedidos";
import {
  totalPedido,
  type ItemPedido,
  type MovimientoStock,
  type OrigenMovimiento,
  type Pedido,
  type Producto,
} from "../types";
import {
  generarCodigo,
  type AccionPedido,
  type FuenteDatos,
} from "./contrato";

/**
 * Implementación en memoria — sólo para levantar el proyecto sin Supabase.
 *
 * Limitaciones reales, a tener presentes:
 *  - El estado se pierde al reiniciar el servidor.
 *  - No se comparte entre instancias (en Vercel, cada request puede caer en
 *    una lambda distinta).
 * Para la demo en vivo, con dos dispositivos viendo lo mismo, hace falta
 * Supabase sí o sí.
 */
interface EstadoMemoria {
  productos: Producto[];
  pedidos: Pedido[];
  movimientos: MovimientoStock[];
}

/*
 * El estado cuelga de globalThis a propósito.
 *
 * Next arma un bundle por ruta, así que un módulo importado desde una Server
 * Action y desde un Server Component puede instanciarse DOS VECES en el mismo
 * proceso. Con `let` a nivel de módulo, el pedido se creaba en una copia y el
 * panel leía la otra: se generaba el código pero el pedido no aparecía nunca.
 * Es el mismo patrón de singleton que se usa para el cliente de Prisma.
 */
declare global {
  // eslint-disable-next-line no-var
  var __senzaTaccMemoria: EstadoMemoria | undefined;
}

const ahora = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 12);

function crearEstado(): EstadoMemoria {
  const estado: EstadoMemoria = {
    productos: PRODUCTOS_SEED.map((p) => ({ ...p })),
    pedidos: [],
    movimientos: [],
  };
  sembrarPedidosDemo(estado);
  return estado;
}

/**
 * Carga los pedidos de demo respetando las reservas, para que el panel arranque
 * con trabajo pendiente y el stock disponible sea coherente.
 * Un panel vacío no vende.
 */
function sembrarPedidosDemo(estado: EstadoMemoria) {
  for (const demo of PEDIDOS_DEMO) {
    const items: ItemPedido[] = demo.lineas.flatMap((l) => {
      const p = estado.productos.find((x) => x.id === l.productoId);
      if (!p || p.stock - p.reservado < l.cantidad) return [];
      p.reservado += l.cantidad;
      return [
        {
          productoId: p.id,
          nombre: p.nombre,
          marca: p.marca,
          unidad: p.unidad,
          precioUnitario: p.precio,
          cantidad: l.cantidad,
        },
      ];
    });
    if (items.length === 0) continue;

    const creado = new Date(Date.now() - demo.hace * 60_000);
    estado.pedidos.push({
      id: uid(),
      codigo: demo.codigo,
      estado: "pendiente",
      clienteNombre: demo.nombre,
      clienteTelefono: demo.telefono,
      items,
      total: totalPedido(items),
      nota: demo.nota,
      creadoEn: creado.toISOString(),
      resueltoEn: null,
      expiraEn: new Date(
        creado.getTime() + HORAS_EXPIRACION_PEDIDO * 3600_000,
      ).toISOString(),
    });
  }
  estado.pedidos.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

const estado: EstadoMemoria = (globalThis.__senzaTaccMemoria ??= crearEstado());

function buscar(id: string): Producto | undefined {
  return estado.productos.find((p) => p.id === id);
}

function registrar(
  productoId: string,
  delta: number,
  origen: OrigenMovimiento,
  nota = "",
  refId: string | null = null,
) {
  const p = buscar(productoId);
  if (!p) return;
  p.stock = Math.max(0, p.stock + delta);
  estado.movimientos.unshift({
    id: uid(),
    productoId,
    delta,
    origen,
    refId,
    refExterno: null,
    nota,
    creadoEn: ahora(),
  });
}

export const fuenteMemoria: FuenteDatos = {
  async listarProductos() {
    return estado.productos
      .filter((p) => p.activo)
      .sort((a, b) => a.orden - b.orden)
      .map((p) => ({ ...p }));
  },

  async obtenerProducto(id) {
    const p = buscar(id);
    return p ? { ...p } : null;
  },

  async actualizarProducto(id, cambios) {
    const p = buscar(id);
    if (p) Object.assign(p, cambios);
  },

  async crearPedido({ clienteNombre, clienteTelefono, items, nota }) {
    for (const item of items) {
      const p = buscar(item.productoId);
      if (!p || p.stock - p.reservado < item.cantidad) {
        throw new Error(`Sin stock suficiente para ${item.nombre}`);
      }
    }
    for (const item of items) {
      const p = buscar(item.productoId)!;
      p.reservado += item.cantidad;
    }

    const creado = new Date();
    const pedido: Pedido = {
      id: uid(),
      codigo: generarCodigo(),
      estado: "pendiente",
      clienteNombre,
      clienteTelefono,
      items,
      total: totalPedido(items),
      nota,
      creadoEn: creado.toISOString(),
      resueltoEn: null,
      expiraEn: new Date(
        creado.getTime() + HORAS_EXPIRACION_PEDIDO * 3600_000,
      ).toISOString(),
    };
    estado.pedidos.unshift(pedido);
    return { ...pedido };
  },

  async listarPedidos() {
    return estado.pedidos.map((p) => ({ ...p }));
  },

  async resolverPedido(id, accion: AccionPedido, itemsNuevos?: ItemPedido[]) {
    const pedido = estado.pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error("Pedido inexistente");
    if (pedido.estado !== "pendiente") {
      throw new Error(`El pedido ya fue resuelto (${pedido.estado})`);
    }

    // La reserva original se libera siempre.
    for (const item of pedido.items) {
      const p = buscar(item.productoId);
      if (p) p.reservado = Math.max(0, p.reservado - item.cantidad);
    }

    if (accion === "cancelado") {
      pedido.estado = "cancelado";
    } else {
      const finales = itemsNuevos ?? pedido.items;
      for (const item of finales) {
        if (item.cantidad > 0) {
          registrar(
            item.productoId,
            -item.cantidad,
            "pedido_web",
            `Pedido ${pedido.codigo}`,
            pedido.id,
          );
        }
      }
      pedido.items = finales.filter((i) => i.cantidad > 0);
      pedido.total = totalPedido(pedido.items);
      pedido.estado = accion;
    }

    pedido.resueltoEn = ahora();
    return { ...pedido };
  },

  async expirarPedidos() {
    const hoy = Date.now();
    let n = 0;
    for (const pedido of estado.pedidos) {
      if (pedido.estado !== "pendiente") continue;
      if (new Date(pedido.expiraEn).getTime() >= hoy) continue;

      for (const item of pedido.items) {
        const p = buscar(item.productoId);
        if (p) p.reservado = Math.max(0, p.reservado - item.cantidad);
      }
      pedido.estado = "expirado";
      pedido.resueltoEn = ahora();
      n++;
    }
    return n;
  },

  async venderEnMostrador(productoId, cantidad) {
    registrar(productoId, -Math.abs(cantidad), "mostrador", "Venta en mostrador");
  },

  async reponerStock(productoId, cantidad, nota = "Reposición") {
    registrar(productoId, Math.abs(cantidad), "reposicion", nota);
  },

  async ajustarStock(productoId, nuevoStock, nota = "Ajuste manual") {
    const p = buscar(productoId);
    if (!p) return;
    registrar(productoId, nuevoStock - p.stock, "ajuste", nota);
  },

  async listarMovimientos(limite = 50) {
    return estado.movimientos.slice(0, limite).map((m) => ({ ...m }));
  },
};

/** Resetea la demo local (tests, o volver al estado inicial antes de mostrarla). */
export function reiniciarMemoria() {
  // Muta el objeto en vez de reasignar la global: los demás bundles ya tienen
  // una referencia a ESTE objeto, y reasignar dejaría a unos viendo el estado
  // viejo y a otros el nuevo.
  const nuevo = crearEstado();
  estado.productos = nuevo.productos;
  estado.pedidos = nuevo.pedidos;
  estado.movimientos = nuevo.movimientos;
}
