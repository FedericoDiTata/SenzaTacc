import type {
  ItemPedido,
  MovimientoStock,
  Pedido,
  Producto,
} from "../types";

export interface DatosNuevoPedido {
  clienteNombre: string;
  clienteTelefono: string;
  items: ItemPedido[];
  nota: string;
}

export type AccionPedido = "confirmado" | "modificado" | "cancelado";

/**
 * Contrato único de acceso a datos.
 *
 * Reglas que valen para cualquier implementación:
 *  1. TODAS las funciones son async, incluso si la implementación es síncrona.
 *     Así cambiar de fuente no obliga a tocar un solo componente.
 *  2. Las escrituras del panel pasan por acá — nada de mutar estado por fuera.
 *  3. Ningún consumidor debería leer `stock` para decidir qué mostrar en la
 *     web: para eso está `disponible(producto)`.
 */
export interface FuenteDatos {
  listarProductos(): Promise<Producto[]>;
  obtenerProducto(id: string): Promise<Producto | null>;
  actualizarProducto(id: string, cambios: Partial<Producto>): Promise<void>;

  /** Crea el pedido y RESERVA. No toca el stock real. */
  crearPedido(datos: DatosNuevoPedido): Promise<Pedido>;
  listarPedidos(): Promise<Pedido[]>;
  /** Confirma (baja stock), modifica (baja lo editado) o cancela (libera). */
  resolverPedido(
    id: string,
    accion: AccionPedido,
    itemsNuevos?: ItemPedido[],
  ): Promise<Pedido>;
  /** Libera reservas vencidas. Devuelve cuántos pedidos expiró. */
  expirarPedidos(): Promise<number>;

  venderEnMostrador(productoId: string, cantidad: number): Promise<void>;
  reponerStock(productoId: string, cantidad: number, nota?: string): Promise<void>;
  ajustarStock(productoId: string, nuevoStock: number, nota?: string): Promise<void>;
  listarMovimientos(limite?: number): Promise<MovimientoStock[]>;
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0 ni I/1

/** Código corto de pedido. Es lo que el dueño busca en el chat de WhatsApp. */
export function generarCodigo(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return s;
}
