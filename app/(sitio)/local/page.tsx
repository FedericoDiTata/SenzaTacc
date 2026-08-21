import type { Metadata } from "next";
import Image from "next/image";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { Ubicacion } from "@/components/home/Ubicacion";
import { EspigaTachada } from "@/components/marca/EspigaTachada";

export const metadata: Metadata = {
  title: "El local",
  description:
    "Una cafetería y un market 100% libres de gluten en Almagro. Sin cocina compartida y sin contaminación cruzada.",
};

/*
 * Seis fotos, con la primera de doble tamaño.
 *
 * En mobile van uniformes en dos columnas: seis entran justo en tres filas.
 * En desktop la grilla pasa a 3×3 y la primera ocupa 2×2, con lo que las nueve
 * celdas quedan exactas y la página abre con una foto grande en vez de un
 * mosaico parejo.
 *
 * Todas en 3/4 porque las originales son verticales de celular: recortarlas a
 * formato apaisado tira la mitad de la foto.
 */
const GALERIA = [
  { src: "/local/salon-amplio.jpg", alt: "El salón con las luces colgantes y el listonado de madera" },
  { src: "/local/market-pasillo.jpg", alt: "El pasillo del market bajo el cartel MARKET" },
  { src: "/local/medialunas.jpg", alt: "Medialunas recién horneadas en el mostrador" },
  { src: "/local/market-barritas.jpg", alt: "La góndola de barritas y snacks" },
  { src: "/local/salon-mesas.jpg", alt: "Las mesas del salón bajo las lámparas colgantes" },
  { src: "/local/market-canasta.jpg", alt: "Una canasta con compras en el pasillo del market" },
];

export default function LocalPage() {
  return (
    <>
      <CabeceraPagina
        etiqueta="El local"
        titulo="Cafetería de un lado, market del otro. Todo lo que ves es sin TACC."
      />

      {/* La galería va apenas debajo de la cabecera: es lo que la gente viene
          a ver, y antes quedaba a dos pantallas de scroll. */}
      <section className="border-b border-borde bg-crema px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:grid-rows-3">
            {GALERIA.map((foto, i) => (
              <figure
                key={foto.src}
                className={`group relative overflow-hidden rounded-sm ${
                  i === 0
                    ? "aspect-[3/4] lg:col-span-2 lg:row-span-2 lg:aspect-auto"
                    : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  priority={i === 0}
                  quality={88}
                  style={i === 0 ? { objectPosition: "50% 55%" } : undefined}
                  sizes={
                    i === 0
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 50vw, 33vw"
                  }
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Un solo párrafo: antes eran tres y empujaban las fotos hacia abajo. */}
      <section className="border-b border-borde bg-crema-profundo px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <EspigaTachada className="mx-auto h-9 w-9 text-ladrillo" />
          <h2 className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
            Dos cosas en un mismo lugar
          </h2>
          <p className="mt-4 text-base leading-relaxed text-tinta-suave">
            De un lado, la cafetería: café de especialidad, medialunas que salen
            del horno a la mañana y una vitrina que cambia todos los días. Del
            otro, el market: más de cuarenta productos para llevarte la semana
            resuelta en el mismo viaje.
          </p>
        </div>
      </section>

      <Ubicacion />
    </>
  );
}
