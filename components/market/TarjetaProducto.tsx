"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCarrito } from "@/lib/cartStore";
import {
  disponible,
  estadoStock,
  formatARS,
  type Producto,
} from "@/lib/types";

export function TarjetaProducto({
  producto,
  indice = 0,
}: {
  producto: Producto;
  indice?: number;
}) {
  const agregar = useCarrito((s) => s.agregar);
  const lineas = useCarrito((s) => s.lineas);
  const [agregado, setAgregado] = useState(false);

  const stock = disponible(producto);
  const estado = estadoStock(producto);
  const enCarrito =
    lineas.find((l) => l.productoId === producto.id)?.cantidad ?? 0;
  const sinMargen = enCarrito >= stock;

  function onAgregar() {
    agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      marca: producto.marca,
      unidad: producto.unidad,
      imagen: producto.imagen,
      precioUnitario: producto.precio,
      maximo: stock,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        delay: Math.min(indice, 8) * 0.05,
      }}
      className="group flex flex-col overflow-hidden rounded-sm border border-borde bg-blanco"
    >
      <div className="relative aspect-square overflow-hidden bg-blanco">
        <Image
          src={producto.imagen}
          alt={`${producto.marca} ${producto.nombre}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-contain p-5 transition-transform duration-700 group-hover:scale-105 ${
            estado === "agotado" ? "opacity-40 grayscale" : ""
          }`}
        />

        {estado === "agotado" && (
          <span className="absolute left-3 top-3 rounded-full bg-tinta/85 px-3 py-1 text-[10px] uppercase tracking-widest text-crema">
            Sin stock
          </span>
        )}
        {estado === "ultimas" && (
          <span className="absolute left-3 top-3 rounded-full bg-ambar px-3 py-1 text-[10px] uppercase tracking-widest text-blanco">
            Quedan {stock}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-borde p-4">
        <p className="eyebrow text-tinta-tenue">{producto.marca}</p>
        <h3 className="mt-1 text-sm leading-snug">{producto.nombre}</h3>
        <p className="mt-0.5 text-xs text-tinta-suave">{producto.unidad}</p>

        <div className="mt-4 flex items-end justify-between gap-2 pt-1">
          <span className="font-display text-lg tabular-nums">
            {formatARS(producto.precio)}
          </span>

          <button
            type="button"
            onClick={onAgregar}
            disabled={estado === "agotado" || sinMargen}
            aria-label={`Agregar ${producto.nombre} al pedido`}
            className="rounded-full bg-tinta px-4 py-2 text-xs tracking-wide text-crema transition-colors hover:bg-madera disabled:cursor-not-allowed disabled:bg-borde disabled:text-tinta-tenue"
          >
            {estado === "agotado"
              ? "Agotado"
              : agregado
                ? "Agregado ✓"
                : sinMargen
                  ? "Sin más"
                  : "Agregar"}
          </button>
        </div>

        {enCarrito > 0 && (
          <p className="mt-2 text-[11px] text-madera">
            {enCarrito} en tu pedido
          </p>
        )}
      </div>
    </motion.article>
  );
}
