import Link from "next/link";
import { Encabezado } from "@/components/ui/Encabezado";
import { TarjetaProducto } from "@/components/market/TarjetaProducto";
import type { Producto } from "@/lib/types";

export function Destacados({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) return null;

  return (
    <section className="border-b border-borde bg-crema-profundo px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Encabezado
            etiqueta="Del market"
            titulo="Nuestro Market"
          />
          <Link
            href="/market"
            className="group inline-flex shrink-0 items-center gap-2 text-sm"
          >
            Ver los 41 productos
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productos.map((p, i) => (
            <TarjetaProducto key={p.id} producto={p} indice={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
