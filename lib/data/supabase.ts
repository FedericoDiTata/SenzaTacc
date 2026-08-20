import { HORAS_EXPIRACION_PEDIDO } from "../siteConfig";
import type { MovimientoStock, Pedido, Producto } from "../types";
import { clienteServidor } from "../supabase/servidor";
import {
  generarCodigo,
  type FuenteDatos,
} from "./contrato";

/* ── Mapeo de filas (snake_case) a los tipos de la app (camelCase) ────────── */

type FilaProducto = {
  id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  categoria: Producto["categoria"];
  imagen: string;
  precio: number | string;
  unidad: string;
  stock: number;
  reservado: number;
  stock_minimo: number;
  destacado: boolean;
  activo: boolean;
  orden: number;
};

function aProducto(f: FilaProducto): Producto {
  return {
    id: f.id,
    nombre: f.nombre,
    marca: f.marca,
    descripcion: f.descripcion,
    categoria: f.categoria,
    imagen: f.imagen,
    precio: Number(f.precio),
    unidad: f.unidad,
    stock: f.stock,
    reservado: f.reservado,
    stockMinimo: f.stock_minimo,
    destacado: f.destacado,
    activo: f.activo,
    orden: f.orden,
  };
}

type FilaPedido = {
  id: string;
  codigo: string;
  estado: Pedido["estado"];
  cliente_nombre: string;
  cliente_telefono: string;
  items: Pedido["items"];
  total: number | string;
  nota: string;
  creado_en: string;
  resuelto_en: string | null;
  expira_en: string;
};

function aPedido(f: FilaPedido): Pedido {
  return {
    id: f.id,
    codigo: f.codigo,
    estado: f.estado,
    clienteNombre: f.cliente_nombre,
    clienteTelefono: f.cliente_telefono,
    items: f.items ?? [],
    total: Number(f.total),
    nota: f.nota,
    creadoEn: f.creado_en,
    resueltoEn: f.resuelto_en,
    expiraEn: f.expira_en,
  };
}

type FilaMovimiento = {
  id: string;
  producto_id: string;
  delta: number;
  origen: MovimientoStock["origen"];
  ref_id: string | null;
  ref_externo: string | null;
  nota: string;
  creado_en: string;
};

function aMovimiento(f: FilaMovimiento): MovimientoStock {
  return {
    id: f.id,
    productoId: f.producto_id,
    delta: f.delta,
    origen: f.origen,
    refId: f.ref_id,
    refExterno: f.ref_externo,
    nota: f.nota,
    creadoEn: f.creado_en,
  };
}

/** Convierte los campos camelCase de los items al formato que esperan las funciones SQL. */
function itemsParaSQL(items: Pedido["items"]) {
  return items.map((i) => ({
    productoId: i.productoId,
    nombre: i.nombre,
    marca: i.marca,
    unidad: i.unidad,
    precioUnitario: i.precioUnitario,
    cantidad: i.cantidad,
  }));
}

/* ── Implementación ───────────────────────────────────────────────────────── */

/*
 * Se lee de la tabla `productos` y no de la vista `productos_disponibles`.
 *
 * La vista existe y calcula bien, pero medida contra el proyecto real tarda el
 * doble que la tabla (~1000 ms contra ~460 ms para las 41 filas): al ser
 * security_invoker, evalúa las políticas RLS fila por fila. Y encima
 * pagábamos ese costo al pedo, porque `aProducto` descarta la columna
 * `disponible` y el valor se calcula igual en TypeScript con
 * `disponible(producto)` de lib/types.ts.
 *
 * La vista se deja en el esquema porque es cómoda para consultar a mano desde
 * el SQL Editor, pero la app no la usa.
 */
export const fuenteSupabase: FuenteDatos = {
  async listarProductos() {
    const sb = await clienteServidor();
    const { data, error } = await sb
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("orden");
    if (error) throw new Error(error.message);
    return (data as FilaProducto[]).map(aProducto);
  },

  async obtenerProducto(id) {
    const sb = await clienteServidor();
    const { data, error } = await sb
      .from("productos")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? aProducto(data as FilaProducto) : null;
  },

  async actualizarProducto(id, cambios) {
    const sb = await clienteServidor();
    const fila: Record<string, unknown> = {};
    if (cambios.nombre !== undefined) fila.nombre = cambios.nombre;
    if (cambios.marca !== undefined) fila.marca = cambios.marca;
    if (cambios.descripcion !== undefined) fila.descripcion = cambios.descripcion;
    if (cambios.precio !== undefined) fila.precio = cambios.precio;
    if (cambios.unidad !== undefined) fila.unidad = cambios.unidad;
    if (cambios.stockMinimo !== undefined) fila.stock_minimo = cambios.stockMinimo;
    if (cambios.destacado !== undefined) fila.destacado = cambios.destacado;
    if (cambios.activo !== undefined) fila.activo = cambios.activo;
    if (cambios.categoria !== undefined) fila.categoria = cambios.categoria;

    const { error } = await sb.from("productos").update(fila).eq("id", id);
    if (error) throw new Error(error.message);
  },

  async crearPedido({ clienteNombre, clienteTelefono, items, nota }) {
    const sb = await clienteServidor();
    const { data, error } = await sb.rpc("crear_pedido", {
      p_codigo: generarCodigo(),
      p_nombre: clienteNombre,
      p_telefono: clienteTelefono,
      p_items: itemsParaSQL(items),
      p_nota: nota,
      p_horas: HORAS_EXPIRACION_PEDIDO,
    });
    if (error) throw new Error(error.message);
    return aPedido(data as FilaPedido);
  },

  async listarPedidos() {
    const sb = await clienteServidor();
    const { data, error } = await sb
      .from("pedidos")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data as FilaPedido[]).map(aPedido);
  },

  async resolverPedido(id, accion, itemsNuevos) {
    const sb = await clienteServidor();
    const { data, error } = await sb.rpc("resolver_pedido", {
      p_id: id,
      p_estado: accion,
      p_items_nuevos: itemsNuevos ? itemsParaSQL(itemsNuevos) : null,
    });
    if (error) throw new Error(error.message);
    return aPedido(data as FilaPedido);
  },

  async expirarPedidos() {
    const sb = await clienteServidor();
    const { data, error } = await sb.rpc("expirar_pedidos");
    if (error) throw new Error(error.message);
    return (data as number) ?? 0;
  },

  async venderEnMostrador(productoId, cantidad) {
    const sb = await clienteServidor();
    const { error } = await sb.rpc("aplicar_movimiento", {
      p_producto_id: productoId,
      p_delta: -Math.abs(cantidad),
      p_origen: "mostrador",
      p_ref_id: null,
      p_ref_externo: null,
      p_nota: "Venta en mostrador",
    });
    if (error) throw new Error(error.message);
  },

  async reponerStock(productoId, cantidad, nota = "Reposición") {
    const sb = await clienteServidor();
    const { error } = await sb.rpc("aplicar_movimiento", {
      p_producto_id: productoId,
      p_delta: Math.abs(cantidad),
      p_origen: "reposicion",
      p_ref_id: null,
      p_ref_externo: null,
      p_nota: nota,
    });
    if (error) throw new Error(error.message);
  },

  async ajustarStock(productoId, nuevoStock, nota = "Ajuste manual") {
    const sb = await clienteServidor();
    const { data: actual, error: e1 } = await sb
      .from("productos")
      .select("stock")
      .eq("id", productoId)
      .single();
    if (e1) throw new Error(e1.message);

    const delta = nuevoStock - (actual as { stock: number }).stock;
    if (delta === 0) return;

    const { error } = await sb.rpc("aplicar_movimiento", {
      p_producto_id: productoId,
      p_delta: delta,
      p_origen: "ajuste",
      p_ref_id: null,
      p_ref_externo: null,
      p_nota: nota,
    });
    if (error) throw new Error(error.message);
  },

  async listarMovimientos(limite = 50) {
    const sb = await clienteServidor();
    const { data, error } = await sb
      .from("movimientos_stock")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(limite);
    if (error) throw new Error(error.message);
    return (data as FilaMovimiento[]).map(aMovimiento);
  },
};
