"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import {
  disponible,
  estadoStock,
  formatARS,
  type Producto,
} from "@/lib/types";
import { ajustarStock, reponerStock } from "../acciones";

export function FilaStock({ producto }: { producto: Producto }) {
  const [valor, setValor] = useState(String(producto.stock));
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  // Si el stock cambió por otra vía (una venta en mostrador, un pedido
  // confirmado), el input tiene que reflejarlo.
  useEffect(() => setValor(String(producto.stock)), [producto.stock]);

  const libre = disponible(producto);
  const estado = estadoStock(producto);
  const editado = valor !== String(producto.stock);

  const color =
    estado === "agotado"
      ? "text-rojo"
      : estado === "ultimas"
        ? "text-ambar"
        : "text-verde";

  function guardar() {
    const n = Number(valor);
    if (!Number.isFinite(n) || n < 0) {
      setError("Número inválido");
      return;
    }
    setError("");
    iniciar(async () => {
      const r = await ajustarStock(producto.id, n);
      if (!r.ok) setError(r.error);
    });
  }

  function reponer(cantidad: number) {
    setError("");
    iniciar(async () => {
      const r = await reponerStock(producto.id, cantidad);
      if (!r.ok) setError(r.error);
    });
  }

  return (
    <tr className={pendiente ? "opacity-60" : ""}>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-9 shrink-0 bg-blanco">
            <Image
              src={producto.imagen}
              alt=""
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm">{producto.nombre}</p>
            <p className="text-[11px] text-tinta-tenue">
              {producto.marca} · {producto.unidad}
            </p>
          </div>
        </div>
      </td>

      <td className="px-3 py-3 text-right text-xs tabular-nums text-tinta-suave">
        {formatARS(producto.precio)}
      </td>

      <td className="px-3 py-3 text-center">
        <span className={`text-sm tabular-nums ${color}`}>{libre}</span>
        {producto.reservado > 0 && (
          <p className="text-[10px] text-ambar">
            {producto.reservado} reservada{producto.reservado > 1 ? "s" : ""}
          </p>
        )}
      </td>

      <td className="px-3 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <input
            type="number"
            min={0}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && guardar()}
            aria-label={`Stock de ${producto.nombre}`}
            className="w-16 rounded-sm border border-borde bg-blanco px-2 py-1.5 text-center text-sm tabular-nums outline-none focus:border-tinta"
          />
          {editado && (
            <button
              type="button"
              onClick={guardar}
              disabled={pendiente}
              className="rounded-full bg-tinta px-3 py-1.5 text-[11px] text-crema transition-colors hover:bg-madera"
            >
              Guardar
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-center text-[10px] text-rojo">{error}</p>}
      </td>

      <td className="px-3 py-3">
        <div className="flex justify-end gap-1">
          {[6, 12].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => reponer(n)}
              disabled={pendiente}
              className="rounded-full border border-borde px-2.5 py-1 text-[11px] text-tinta-suave transition-colors hover:border-verde hover:text-verde"
            >
              +{n}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}
