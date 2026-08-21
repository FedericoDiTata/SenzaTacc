"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CATEGORIAS,
  disponible,
  estadoStock,
  normalizarTexto,
  type CategoriaId,
  type Producto,
} from "@/lib/types";
import { venderEnMostrador } from "../acciones";

type Filtro = CategoriaId | "todos";

export function GrillaMostrador({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ultimas, setUltimas] = useState<{ id: number; texto: string }[]>([]);
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  const visibles = useMemo(() => {
    // Sin diacríticos: "mani" tiene que encontrar "Maní King".
    const q = normalizarTexto(busqueda.trim());
    return productos.filter((p) => {
      if (filtro !== "todos" && p.categoria !== filtro) return false;
      if (!q) return true;
      return (
        normalizarTexto(p.nombre).includes(q) || normalizarTexto(p.marca).includes(q)
      );
    });
  }, [productos, filtro, busqueda]);

  function vender(p: Producto) {
    if (disponible(p) <= 0) return;
    setError("");

    const marca = { id: Date.now(), texto: `${p.marca} ${p.nombre}` };
    setUltimas((prev) => [marca, ...prev].slice(0, 6));

    iniciar(async () => {
      const r = await venderEnMostrador(p.id, 1);
      if (!r.ok) {
        setError(r.error);
        setUltimas((prev) => prev.filter((u) => u.id !== marca.id));
      }
    });
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="scroll-fino -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {([{ id: "todos", nombre: "Todo" }, ...CATEGORIAS] as const).map(
            (c) => {
              const activo = filtro === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFiltro(c.id as Filtro)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${
                    activo
                      ? "border-tinta bg-tinta text-crema"
                      : "border-borde text-tinta-suave hover:border-tinta"
                  }`}
                >
                  {c.nombre}
                </button>
              );
            },
          )}
        </div>

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar…"
          aria-label="Buscar producto"
          className="w-full rounded-full border border-borde bg-blanco px-4 py-2 text-sm outline-none focus:border-tinta lg:w-56"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-rojo">
          {error}
        </p>
      )}

      <AnimatePresence>
        {ultimas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            <div className="rounded-sm border border-verde/30 bg-verde/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-widest text-verde">
                Registrado {pendiente && "· guardando…"}
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-tinta-suave">
                {ultimas.map((u) => (
                  <li key={u.id}>− {u.texto}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibles.map((p) => {
          const libre = disponible(p);
          const estado = estadoStock(p);

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => vender(p)}
              disabled={libre <= 0}
              className="group flex flex-col overflow-hidden rounded-sm border border-borde bg-blanco text-left transition-colors hover:border-tinta active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative aspect-square bg-blanco">
                <Image
                  src={p.imagen}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain p-3"
                />
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] tabular-nums ${
                    estado === "agotado"
                      ? "bg-rojo/10 text-rojo"
                      : estado === "ultimas"
                        ? "bg-ambar/15 text-ambar"
                        : "bg-verde/15 text-verde"
                  }`}
                >
                  {libre}
                </span>
              </div>

              <div className="border-t border-borde px-3 py-2.5">
                <p className="truncate text-[11px] text-tinta-tenue">
                  {p.marca}
                </p>
                <p className="truncate text-xs leading-snug">{p.nombre}</p>
              </div>
            </button>
          );
        })}
      </div>

      {visibles.length === 0 && (
        <p className="mt-16 text-center text-sm text-tinta-tenue">
          No hay productos con ese filtro.
        </p>
      )}
    </>
  );
}
