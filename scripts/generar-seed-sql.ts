/**
 * Genera los SQL de carga a partir de lib/seed.ts y lib/seedPedidos.ts, que son
 * la fuente de verdad. Así no hay que transcribir 41 productos a mano.
 *
 *   node scripts/generar-seed-sql.ts
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTOS_SEED } from "../lib/seed.ts";
import { PEDIDOS_DEMO } from "../lib/seedPedidos.ts";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const filas = PRODUCTOS_SEED.map(
  (p) =>
    `  (${q(p.id)}, ${q(p.nombre)}, ${q(p.marca)}, ${q(p.descripcion)}, ` +
    `${q(p.categoria)}, ${q(p.imagen)}, ${p.precio}, ${q(p.unidad)}, ` +
    `${p.stock}, ${p.reservado}, ${p.stockMinimo}, ${p.destacado}, ${p.activo}, ${p.orden})`,
).join(",\n");

const sql = `-- ============================================================================
-- Senza Tacc — carga inicial del catálogo (${PRODUCTOS_SEED.length} productos)
-- GENERADO por scripts/generar-seed-sql.ts — no editar a mano.
-- Para cambiar el catálogo: editar lib/seed.ts y volver a correr el script.
--
-- Correr DESPUÉS de schema.sql. Es idempotente: vuelve a dejar el catálogo
-- como está en el código, incluidos precios y stock de demo.
-- ============================================================================

insert into productos
  (id, nombre, marca, descripcion, categoria, imagen, precio, unidad,
   stock, reservado, stock_minimo, destacado, activo, orden)
values
${filas}
on conflict (id) do update set
  nombre       = excluded.nombre,
  marca        = excluded.marca,
  descripcion  = excluded.descripcion,
  categoria    = excluded.categoria,
  imagen       = excluded.imagen,
  precio       = excluded.precio,
  unidad       = excluded.unidad,
  stock        = excluded.stock,
  reservado    = excluded.reservado,
  stock_minimo = excluded.stock_minimo,
  destacado    = excluded.destacado,
  activo       = excluded.activo,
  orden        = excluded.orden;
`;

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(raiz, "supabase", "seed.sql"), sql, "utf8");
console.log(`seed.sql generado con ${PRODUCTOS_SEED.length} productos.`);

/* ── Pedidos de demo ───────────────────────────────────────────────────────
   Se crean con crear_pedido() para que las reservas de stock queden bien, y
   después se les retrasa la fecha para que no parezcan todos recién hechos. */

const porId = new Map(PRODUCTOS_SEED.map((p) => [p.id, p]));

const bloques = PEDIDOS_DEMO.map((d) => {
  const items = d.lineas.flatMap((l) => {
    const p = porId.get(l.productoId);
    if (!p) {
      console.warn(`  ! ${d.codigo}: no existe el producto ${l.productoId}`);
      return [];
    }
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

  return `select crear_pedido(
  ${q(d.codigo)},
  ${q(d.nombre)},
  ${q(d.telefono)},
  ${q(JSON.stringify(items))}::jsonb,
  ${q(d.nota)},
  24
);
update pedidos
   set creado_en = now() - interval '${d.hace} minutes'
 where codigo = ${q(d.codigo)};`;
}).join("\n\n");

const sqlPedidos = `-- ============================================================================
-- Senza Tacc — pedidos de demostración (${PEDIDOS_DEMO.length})
-- GENERADO por scripts/generar-seed-sql.ts — no editar a mano.
--
-- OPCIONAL, pero muy recomendable antes de mostrar la demo: un panel vacío no
-- vende. Correr DESPUÉS de seed.sql.
--
-- Ojo: NO es idempotente (el código de pedido es único). Para volver a
-- cargarlos hay que borrar los anteriores:
--   delete from pedidos where codigo in (${PEDIDOS_DEMO.map((d) => `'${d.codigo}'`).join(", ")});
--   -- y devolver las reservas:
--   update productos set reservado = 0;
-- ============================================================================

${bloques}
`;

writeFileSync(join(raiz, "supabase", "seed-pedidos.sql"), sqlPedidos, "utf8");
console.log(`seed-pedidos.sql generado con ${PEDIDOS_DEMO.length} pedidos.`);
