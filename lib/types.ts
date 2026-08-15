/** Tipos compartidos por la web pública y el panel. */

export type CategoriaId =
  | "galletitas"
  | "alfajores"
  | "barritas"
  | "snacks"
  | "pastas";

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  descripcion: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    id: "galletitas",
    nombre: "Galletitas",
    descripcion: "Dulces, rellenas y de arroz",
  },
  {
    id: "alfajores",
    nombre: "Alfajores",
    descripcion: "Simples, triples y de arroz",
  },
  {
    id: "barritas",
    nombre: "Barritas",
    descripcion: "De frutos secos y proteicas",
  },
  {
    id: "snacks",
    nombre: "Snacks",
    descripcion: "Salados, maní y grisines",
  },
  {
    id: "pastas",
    nombre: "Pastas",
    descripcion: "De arroz y de maíz",
  },
];

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  categoria: CategoriaId;
  imagen: string;
  /** Precio en pesos. PROVISORIO — ver AGENTS.md § Datos pendientes. */
  precio: number;
  /** Presentación: "125 g", "500 g", "unidad". */
  unidad: string;
  /** Unidades físicas en góndola. */
  stock: number;
  /** Unidades comprometidas por pedidos web pendientes. */
  reservado: number;
  /** Umbral para avisar "quedan pocas" en el panel. */
  stockMinimo: number;
  destacado: boolean;
  activo: boolean;
  orden: number;
}

/**
 * Lo que el cliente puede comprar hoy.
 * Nunca mostrar `stock` crudo en la web: un pedido pendiente ya reservó
 * unidades que todavía no se descontaron del stock real.
 */
export function disponible(p: Producto): number {
  return Math.max(0, p.stock - p.reservado);
}

export type EstadoStock = "disponible" | "ultimas" | "agotado";

export function estadoStock(p: Producto): EstadoStock {
  const d = disponible(p);
  if (d <= 0) return "agotado";
  if (d <= p.stockMinimo) return "ultimas";
  return "disponible";
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "modificado"
  | "cancelado"
  | "expirado";

export interface ItemPedido {
  productoId: string;
  nombre: string;
  marca: string;
  unidad: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  /** Código corto tipo "A7F3". Es lo que une el chat de WhatsApp con esta fila. */
  codigo: string;
  estado: EstadoPedido;
  clienteNombre: string;
  clienteTelefono: string;
  items: ItemPedido[];
  total: number;
  nota: string;
  creadoEn: string;
  resueltoEn: string | null;
  /** Pasada esta fecha la reserva se libera sola. */
  expiraEn: string;
}

/**
 * De dónde vino un movimiento de stock.
 * `pos_externo` es el hueco reservado para el día que se conecte el sistema
 * del mostrador: entra por acá sin tocar nada más.
 */
export type OrigenMovimiento =
  | "pedido_web"
  | "mostrador"
  | "ajuste"
  | "reposicion"
  | "pos_externo";

export interface MovimientoStock {
  id: string;
  productoId: string;
  /** Negativo = salida, positivo = ingreso. */
  delta: number;
  origen: OrigenMovimiento;
  /** Id del pedido web que lo originó, si aplica. */
  refId: string | null;
  /** Id de la venta en el sistema externo. Único junto con `origen`. */
  refExterno: string | null;
  nota: string;
  creadoEn: string;
}

export function totalPedido(items: ItemPedido[]): number {
  return items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
}

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}
