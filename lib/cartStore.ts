"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LineaCarrito {
  productoId: string;
  nombre: string;
  marca: string;
  unidad: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  /** Unidades disponibles al momento de agregar. Tope del selector. */
  maximo: number;
}

interface EstadoCarrito {
  lineas: LineaCarrito[];
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregar: (linea: Omit<LineaCarrito, "cantidad">, cantidad?: number) => void;
  setCantidad: (productoId: string, cantidad: number) => void;
  quitar: (productoId: string) => void;
  vaciar: () => void;
}

export const useCarrito = create<EstadoCarrito>()(
  persist(
    (set) => ({
      lineas: [],
      abierto: false,

      abrir: () => set({ abierto: true }),
      cerrar: () => set({ abierto: false }),

      agregar: (linea, cantidad = 1) =>
        set((s) => {
          const existente = s.lineas.find(
            (l) => l.productoId === linea.productoId,
          );
          if (existente) {
            return {
              abierto: true,
              lineas: s.lineas.map((l) =>
                l.productoId === linea.productoId
                  ? {
                      ...l,
                      // Datos frescos por si cambió el precio o el disponible.
                      ...linea,
                      cantidad: Math.min(l.cantidad + cantidad, linea.maximo),
                    }
                  : l,
              ),
            };
          }
          return {
            abierto: true,
            lineas: [
              ...s.lineas,
              { ...linea, cantidad: Math.min(cantidad, linea.maximo) },
            ],
          };
        }),

      // Bajar a cero elimina la línea.
      setCantidad: (productoId, cantidad) =>
        set((s) => ({
          lineas: s.lineas
            .map((l) =>
              l.productoId === productoId
                ? { ...l, cantidad: Math.min(cantidad, l.maximo) }
                : l,
            )
            .filter((l) => l.cantidad > 0),
        })),

      quitar: (productoId) =>
        set((s) => ({
          lineas: s.lineas.filter((l) => l.productoId !== productoId),
        })),

      vaciar: () => set({ lineas: [] }),
    }),
    {
      name: "senza-carrito",
      // `abierto` no se persiste: el drawer nunca rehidrata abierto.
      partialize: (s) => ({ lineas: s.lineas }),
    },
  ),
);

/* Totales como funciones puras, no selectores: se pueden usar desde el
   servidor y no provocan re-renders de más. */

export function contarCarrito(lineas: LineaCarrito[]): number {
  return lineas.reduce((n, l) => n + l.cantidad, 0);
}

export function totalCarrito(lineas: LineaCarrito[]): number {
  return lineas.reduce((n, l) => n + l.precioUnitario * l.cantidad, 0);
}
