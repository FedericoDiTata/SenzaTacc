"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { formatARS, totalPedido, type ItemPedido, type Pedido } from "@/lib/types";
import { haceCuanto, tiempoRestante } from "@/lib/tiempo";
import { resolverPedido } from "./acciones";

export function TarjetaPedido({ pedido }: { pedido: Pedido }) {
  const [editando, setEditando] = useState(false);
  const [items, setItems] = useState<ItemPedido[]>(pedido.items);
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  const total = editando ? totalPedido(items) : pedido.total;
  const cambiado =
    JSON.stringify(items) !== JSON.stringify(pedido.items);

  function accionar(accion: "confirmado" | "modificado" | "cancelado") {
    setError("");
    iniciar(async () => {
      const r = await resolverPedido(
        pedido.id,
        accion,
        accion === "modificado" ? items.filter((i) => i.cantidad > 0) : undefined,
      );
      if (!r.ok) setError(r.error);
    });
  }

  function setCantidad(productoId: string, cantidad: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId
          ? { ...i, cantidad: Math.max(0, cantidad) }
          : i,
      ),
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="overflow-hidden rounded-sm border border-borde bg-blanco"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-borde px-5 py-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="wordmark rounded bg-tinta px-2.5 py-1 text-sm text-crema">
              {pedido.codigo}
            </span>
            <span className="text-xs text-tinta-tenue">
              {haceCuanto(pedido.creadoEn)}
            </span>
          </div>
          <p className="mt-2 text-sm">{pedido.clienteNombre}</p>
          {pedido.clienteTelefono && (
            <p className="text-xs text-tinta-tenue">{pedido.clienteTelefono}</p>
          )}
        </div>

        <div className="text-right">
          <p className="wordmark text-lg tabular-nums">{formatARS(total)}</p>
          <p className="mt-0.5 text-[11px] text-ambar">
            Reserva vence en {tiempoRestante(pedido.expiraEn)}
          </p>
        </div>
      </header>

      <ul className="divide-y divide-borde/70 px-5">
        {items.map((item) => (
          <li
            key={item.productoId}
            className={`flex items-center gap-3 py-3 text-sm ${
              item.cantidad === 0 ? "opacity-40" : ""
            }`}
          >
            {editando ? (
              <div className="flex shrink-0 items-center rounded-full border border-borde">
                <button
                  type="button"
                  aria-label="Quitar uno"
                  onClick={() => setCantidad(item.productoId, item.cantidad - 1)}
                  className="px-2.5 py-1 transition-colors hover:text-madera"
                >
                  −
                </button>
                <span className="min-w-5 text-center text-xs tabular-nums">
                  {item.cantidad}
                </span>
                <button
                  type="button"
                  aria-label="Agregar uno"
                  onClick={() => setCantidad(item.productoId, item.cantidad + 1)}
                  className="px-2.5 py-1 transition-colors hover:text-madera"
                >
                  +
                </button>
              </div>
            ) : (
              <span className="w-7 shrink-0 text-center text-xs tabular-nums text-tinta-suave">
                {item.cantidad}×
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate">{item.nombre}</p>
              <p className="text-[11px] text-tinta-tenue">
                {item.marca} · {item.unidad}
              </p>
            </div>

            <span className="shrink-0 text-xs tabular-nums text-tinta-suave">
              {formatARS(item.precioUnitario * item.cantidad)}
            </span>
          </li>
        ))}
      </ul>

      {pedido.nota && (
        <p className="mx-5 mb-4 rounded-sm bg-crema-profundo px-3 py-2 text-xs leading-relaxed text-tinta-suave">
          💬 {pedido.nota}
        </p>
      )}

      {error && (
        <p role="alert" className="mx-5 mb-3 text-xs text-rojo">
          {error}
        </p>
      )}

      <footer className="flex flex-wrap gap-2 border-t border-borde bg-crema/50 px-5 py-4">
        {editando ? (
          <>
            <button
              type="button"
              disabled={pendiente || !cambiado}
              onClick={() => accionar("modificado")}
              className="flex-1 rounded-full bg-madera px-4 py-2.5 text-xs tracking-wide text-blanco transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {pendiente ? "Guardando…" : "Guardar cambios y confirmar"}
            </button>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => {
                setItems(pedido.items);
                setEditando(false);
              }}
              className="rounded-full border border-borde px-4 py-2.5 text-xs transition-colors hover:border-tinta"
            >
              Cancelar edición
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => accionar("confirmado")}
              className="flex-1 rounded-full bg-verde px-4 py-2.5 text-xs tracking-wide text-blanco transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {pendiente ? "Aplicando…" : "Confirmar y descontar stock"}
            </button>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => setEditando(true)}
              className="rounded-full border border-borde px-4 py-2.5 text-xs transition-colors hover:border-tinta"
            >
              Modificar
            </button>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => accionar("cancelado")}
              className="rounded-full border border-borde px-4 py-2.5 text-xs text-rojo transition-colors hover:border-rojo"
            >
              Cancelar
            </button>
          </>
        )}
      </footer>
    </motion.article>
  );
}
