import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { Sello } from "@/components/marca/Logo";
import { CARTA } from "@/lib/carta";
import { formatARS } from "@/lib/types";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "La carta",
  description:
    "Café de especialidad, medialunas, tostados y pastelería. Todo 100% libre de gluten, horneado en el local.",
};

export default function CartaPage() {
  return (
    <>
      <CabeceraPagina
        etiqueta="La carta"
        titulo="Para tomar acá."
        bajada="Todo lo que sale de esta cocina es sin gluten, incluido el pan. No hay versión apta: hay una sola versión."
      />

      {/* La foto es vertical (960×1280, de celular). En una franja apaisada el
          encuadre por defecto cae sobre la máquina de café y las medialunas
          quedan fuera: por eso el object-position corrido hacia abajo. */}
      <section className="relative h-[42vh] min-h-[280px] overflow-hidden bg-tinta">
        <Image
          src="/local/medialunas.jpg"
          alt="Medialunas recién horneadas sobre el mostrador"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 72%" }}
        />
      </section>

      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 md:py-28">
        <div className="space-y-20">
          {CARTA.map((seccion) => (
            <section key={seccion.id}>
              <header className="border-b border-borde pb-5">
                <h2 className="font-display text-3xl">{seccion.titulo}</h2>
                <p className="mt-1.5 text-sm text-tinta-suave">
                  {seccion.bajada}
                </p>
              </header>

              <ul className="mt-7 space-y-5">
                {seccion.items.map((item) => (
                  <li
                    key={item.nombre}
                    className="flex items-baseline gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <span>{item.nombre}</span>
                      {item.detalle && (
                        <span className="ml-2 text-xs text-tinta-tenue">
                          {item.detalle}
                        </span>
                      )}
                    </div>
                    <span
                      aria-hidden
                      className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-borde"
                    />
                    <span className="shrink-0 tabular-nums text-tinta-suave">
                      {formatARS(item.precio)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-6 border-t border-borde pt-16 text-center">
          <Sello className="h-16 w-16" />
          <h2 className="font-display text-2xl">
            ¿Buscabas para llevar a casa?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-tinta-suave">
            La carta se disfruta en el salón. Si querés productos envasados —
            pastas, galletitas, alfajores — eso está en el market y se pide
            desde acá.
          </p>
          <Link
            href="/market"
            className="rounded-full bg-tinta px-8 py-3.5 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
          >
            Ir al market
          </Link>
          <p className="mt-2 text-xs text-tinta-tenue">
            {SITE.direccion}, {SITE.barrio}
          </p>
        </div>
      </div>
    </>
  );
}
