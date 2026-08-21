import { datos } from "@/lib/data";
import { formatARS, type Pedido } from "@/lib/types";
import { fechaHora } from "@/lib/tiempo";
import { Bandeja } from "@/components/ui/Iconos";
import { TarjetaPedido } from "./TarjetaPedido";
import { AutoRefresco } from "./AutoRefresco";

export const dynamic = "force-dynamic";

const ETIQUETA: Record<Pedido["estado"], { texto: string; clase: string }> = {
  pendiente: { texto: "Pendiente", clase: "bg-ambar/15 text-ambar" },
  confirmado: { texto: "Confirmado", clase: "bg-verde/15 text-verde" },
  modificado: { texto: "Modificado", clase: "bg-ladrillo/15 text-ladrillo" },
  cancelado: { texto: "Cancelado", clase: "bg-rojo/10 text-rojo" },
  expirado: { texto: "Expirado", clase: "bg-tinta/10 text-tinta-tenue" },
};

export default async function PedidosPage() {
  // Libera reservas vencidas antes de mostrar nada.
  await datos.expirarPedidos();
  const pedidos = await datos.listarPedidos();

  const pendientes = pedidos.filter((p) => p.estado === "pendiente");
  const resueltos = pedidos.filter((p) => p.estado !== "pendiente").slice(0, 20);
  const reservado = pendientes.reduce((n, p) => n + p.total, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AutoRefresco />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Pedidos entrantes</h1>
          <p className="mt-1.5 text-sm text-tinta-suave">
            Confirmá, modificá o cancelá. El stock se ajusta solo.
          </p>
        </div>

        {pendientes.length > 0 && (
          <div className="rounded-sm border border-ambar/30 bg-ambar/5 px-4 py-2.5 text-right">
            <p className="text-[11px] uppercase tracking-widest text-ambar">
              Sin resolver
            </p>
            <p className="mt-0.5 text-sm tabular-nums">
              {pendientes.length}{" "}
              {pendientes.length === 1 ? "pedido" : "pedidos"} ·{" "}
              {formatARS(reservado)}
            </p>
          </div>
        )}
      </header>

      {pendientes.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-sm border border-dashed border-borde py-20 text-center">
          <Bandeja className="h-10 w-10 text-borde" />
          <p className="text-sm text-tinta-suave">
            No hay pedidos esperando respuesta.
          </p>
          <p className="text-xs text-tinta-tenue">
            Los pedidos nuevos aparecen automáticamente.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {pendientes.map((p) => (
            <TarjetaPedido key={p.id} pedido={p} />
          ))}
        </div>
      )}

      {resueltos.length > 0 && (
        <section className="mt-16">
          <h2 className="eyebrow text-tinta-suave">Historial</h2>

          <div className="mt-5 overflow-x-auto rounded-sm border border-borde bg-blanco">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-borde text-left text-[11px] uppercase tracking-widest text-tinta-tenue">
                  <th className="px-4 py-3 font-normal">Código</th>
                  <th className="px-4 py-3 font-normal">Cliente</th>
                  <th className="px-4 py-3 font-normal">Estado</th>
                  <th className="px-4 py-3 font-normal">Cuándo</th>
                  <th className="px-4 py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde/70">
                {resueltos.map((p) => {
                  const et = ETIQUETA[p.estado];
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <span className="wordmark text-xs">{p.codigo}</span>
                      </td>
                      <td className="px-4 py-3 text-tinta-suave">
                        {p.clienteNombre}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] ${et.clase}`}
                        >
                          {et.texto}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-tinta-tenue">
                        {fechaHora(p.resueltoEn ?? p.creadoEn)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {p.estado === "cancelado" || p.estado === "expirado"
                          ? "—"
                          : formatARS(p.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
