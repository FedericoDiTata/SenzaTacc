"use client";

import { useMemo, useState } from "react";
import { TarjetaProducto } from "./TarjetaProducto";
import { Lupa } from "@/components/ui/Iconos";
import {
  CATEGORIAS,
  disponible,
  normalizarTexto,
  type CategoriaId,
  type Producto,
} from "@/lib/types";

type Filtro = CategoriaId | "todos";

export function GrillaMarket({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ocultarAgotados, setOcultarAgotados] = useState(false);

  const visibles = useMemo(() => {
    // Sin diacríticos: "mani" tiene que encontrar "Maní King".
    const q = normalizarTexto(busqueda.trim());
    return productos.filter((p) => {
      if (filtro !== "todos" && p.categoria !== filtro) return false;
      if (ocultarAgotados && disponible(p) <= 0) return false;
      if (!q) return true;
      return (
        normalizarTexto(p.nombre).includes(q) ||
        normalizarTexto(p.marca).includes(q) ||
        normalizarTexto(p.descripcion).includes(q)
      );
    });
  }, [productos, filtro, busqueda, ocultarAgotados]);

  const contarPor = (id: Filtro) =>
    id === "todos"
      ? productos.length
      : productos.filter((p) => p.categoria === id).length;

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-borde bg-crema/95 backdrop-blur-sm sm:top-20">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="scroll-fino -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {([{ id: "todos", nombre: "Todo" }, ...CATEGORIAS] as const).map(
                (c) => {
                  const activo = filtro === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFiltro(c.id as Filtro)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
                        activo
                          ? "border-tinta bg-tinta text-crema"
                          : "border-borde text-tinta-suave hover:border-tinta hover:text-tinta"
                      }`}
                    >
                      {c.nombre}
                      <span
                        className={`ml-1.5 tabular-nums ${
                          activo ? "text-crema/60" : "text-tinta-tenue"
                        }`}
                      >
                        {contarPor(c.id as Filtro)}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-tinta-suave">
                <input
                  type="checkbox"
                  checked={ocultarAgotados}
                  onChange={(e) => setOcultarAgotados(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[var(--ladrillo)]"
                />
                Sólo con stock
              </label>

              <div className="relative flex-1 lg:w-56 lg:flex-none">
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar producto o marca"
                  aria-label="Buscar en el market"
                  className="w-full rounded-full border border-borde bg-blanco py-2 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-tinta-tenue focus:border-tinta"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tinta-tenue"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        {visibles.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <Lupa className="h-10 w-10 text-borde" />
            <p className="text-sm text-tinta-suave">
              No encontramos nada con ese filtro.
            </p>
            <button
              type="button"
              onClick={() => {
                setFiltro("todos");
                setBusqueda("");
                setOcultarAgotados(false);
              }}
              className="text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Ver todo el market
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-xs text-tinta-tenue">
              {visibles.length}{" "}
              {visibles.length === 1 ? "producto" : "productos"}
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {visibles.map((p, i) => (
                <TarjetaProducto key={p.id} producto={p} indice={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
