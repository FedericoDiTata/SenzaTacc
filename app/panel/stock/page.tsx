import { datos } from "@/lib/data";
import {
  CATEGORIAS,
  disponible,
  estadoStock,
  formatARS,
  type MovimientoStock,
} from "@/lib/types";
import { fechaHora } from "@/lib/tiempo";
import { FilaStock } from "./FilaStock";
import { AutoRefresco } from "../AutoRefresco";

export const dynamic = "force-dynamic";

const ORIGEN: Record<MovimientoStock["origen"], string> = {
  pedido_web: "Pedido web",
  mostrador: "Mostrador",
  ajuste: "Ajuste manual",
  reposicion: "Reposición",
  pos_externo: "Sistema del local",
};

export default async function StockPage() {
  await datos.expirarPedidos();
  const [productos, movimientos] = await Promise.all([
    datos.listarProductos(),
    datos.listarMovimientos(25),
  ]);

  const agotados = productos.filter((p) => estadoStock(p) === "agotado");
  const pocos = productos.filter((p) => estadoStock(p) === "ultimas");
  const valorInventario = productos.reduce(
    (n, p) => n + p.precio * p.stock,
    0,
  );

  const nombrePorId = new Map(productos.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AutoRefresco segundos={10} />

      <header>
        <h1 className="font-display text-3xl">Inventario</h1>
        <p className="mt-1.5 text-sm text-tinta-suave">
          Lo que hay en góndola. &quot;Disponible&quot; descuenta lo que ya está
          reservado por pedidos sin resolver.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metrica
          etiqueta="Valor del inventario"
          valor={formatARS(valorInventario)}
        />
        <Metrica
          etiqueta="Quedan pocas unidades"
          valor={String(pocos.length)}
          acento={pocos.length > 0 ? "ambar" : undefined}
        />
        <Metrica
          etiqueta="Sin stock"
          valor={String(agotados.length)}
          acento={agotados.length > 0 ? "rojo" : undefined}
        />
      </div>

      {(agotados.length > 0 || pocos.length > 0) && (
        <div className="mt-6 rounded-sm border border-ambar/30 bg-ambar/5 p-4">
          <h2 className="text-sm">Hay que reponer</h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tinta-suave">
            {[...agotados, ...pocos].map((p) => (
              <li key={p.id}>
                {p.marca} {p.nombre}
                <span
                  className={`ml-1.5 tabular-nums ${
                    disponible(p) === 0 ? "text-rojo" : "text-ambar"
                  }`}
                >
                  ({disponible(p)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {CATEGORIAS.map((cat) => {
        const items = productos.filter((p) => p.categoria === cat.id);
        if (items.length === 0) return null;

        return (
          <section key={cat.id} className="mt-10">
            <h2 className="eyebrow text-tinta-suave">
              {cat.nombre}
              <span className="ml-2 text-tinta-tenue">{items.length}</span>
            </h2>

            <div className="mt-3 overflow-x-auto rounded-sm border border-borde bg-blanco">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-borde text-[11px] uppercase tracking-widest text-tinta-tenue">
                    <th className="px-3 py-2.5 text-left font-normal">
                      Producto
                    </th>
                    <th className="px-3 py-2.5 text-right font-normal">
                      Precio
                    </th>
                    <th className="px-3 py-2.5 text-center font-normal">
                      Disponible
                    </th>
                    <th className="px-3 py-2.5 text-center font-normal">
                      En góndola
                    </th>
                    <th className="px-3 py-2.5 text-right font-normal">
                      Reponer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borde/70">
                  {items.map((p) => (
                    <FilaStock key={p.id} producto={p} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <section className="mt-16">
        <h2 className="eyebrow text-tinta-suave">Últimos movimientos</h2>
        <p className="mt-2 text-xs text-tinta-tenue">
          Cada cambio de stock queda registrado con su origen. Cuando se conecte
          el sistema del mostrador, sus ventas van a aparecer en esta misma
          lista.
        </p>

        {movimientos.length === 0 ? (
          <p className="mt-5 rounded-sm border border-dashed border-borde px-4 py-10 text-center text-sm text-tinta-tenue">
            Todavía no hubo movimientos.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-borde/70 rounded-sm border border-borde bg-blanco">
            {movimientos.map((m) => {
              const p = nombrePorId.get(m.productoId);
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                >
                  <span
                    className={`w-12 shrink-0 text-right tabular-nums ${
                      m.delta < 0 ? "text-rojo" : "text-verde"
                    }`}
                  >
                    {m.delta > 0 ? `+${m.delta}` : m.delta}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {p ? `${p.marca} ${p.nombre}` : m.productoId}
                  </span>
                  <span className="shrink-0 rounded-full bg-crema-profundo px-2.5 py-1 text-[11px] text-tinta-suave">
                    {ORIGEN[m.origen]}
                  </span>
                  <span className="hidden shrink-0 text-[11px] text-tinta-tenue sm:inline">
                    {fechaHora(m.creadoEn)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metrica({
  etiqueta,
  valor,
  acento,
}: {
  etiqueta: string;
  valor: string;
  acento?: "ambar" | "rojo";
}) {
  const clase =
    acento === "rojo"
      ? "border-rojo/30 bg-rojo/5"
      : acento === "ambar"
        ? "border-ambar/30 bg-ambar/5"
        : "border-borde bg-blanco";

  return (
    <div className={`rounded-sm border px-4 py-3.5 ${clase}`}>
      <p className="text-[11px] uppercase tracking-widest text-tinta-tenue">
        {etiqueta}
      </p>
      <p className="mt-1 font-display text-xl tabular-nums">{valor}</p>
    </div>
  );
}
