import type { Metadata } from "next";
import Image from "next/image";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { Ubicacion } from "@/components/home/Ubicacion";
import { EspigaTachada } from "@/components/marca/EspigaTachada";

export const metadata: Metadata = {
  title: "El local",
  description:
    "Una cafetería y un market 100% libres de gluten en Almagro. Sin cocina compartida, sin contaminación cruzada, sin asteriscos.",
};

/*
 * Seis fotos en grilla uniforme.
 *
 * Antes eran cinco con anchos mezclados y la última fila quedaba a medias,
 * dejando un hueco grande a la derecha. Seis entran justo tanto en 2 columnas
 * (mobile) como en 3 (desktop).
 *
 * Todas van en 3/4 porque las originales son verticales de celular: recortarlas
 * a formato apaisado tira la mitad de la foto y encima obliga a agrandarlas.
 */
const GALERIA = [
  { src: "/local/market-pasillo.jpg", alt: "El pasillo del market bajo el cartel MARKET" },
  { src: "/local/salon-mesas.jpg", alt: "Las mesas del salón bajo las lámparas colgantes" },
  { src: "/local/market-barritas.jpg", alt: "La góndola de barritas y snacks" },
  { src: "/local/pared-cuadros.jpg", alt: "La pared de cuadros con el póster de Senza Tacc" },
  { src: "/local/medialunas.jpg", alt: "Medialunas recién horneadas en el mostrador" },
  { src: "/local/market-canasta.jpg", alt: "Una canasta con compras en el pasillo del market" },
];

export default function LocalPage() {
  return (
    <>
      <CabeceraPagina
        etiqueta="El local"
        titulo="Acá no hay harina de trigo."
        bajada="Y eso lo cambia todo. No es una carta con opciones aptas: es un local entero donde podés pedir cualquier cosa sin preguntar nada."
      />

      {/* Relato */}
      <section className="border-b border-borde bg-crema px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
          <div>
            <EspigaTachada className="h-9 w-9 text-ladrillo" />
            <h2 className="mt-6 font-display text-2xl leading-snug">
              Dos cosas en un mismo lugar
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-tinta-suave">
            <p>
              De un lado, la cafetería: café de especialidad, medialunas que
              salen del horno a la mañana, tostados con pan propio y una vitrina
              de pastelería que cambia todos los días.
            </p>
            <p>
              Del otro, el market. Dos góndolas con más de cuarenta productos
              envasados de las marcas que un celíaco conoce de memoria y que
              normalmente hay que salir a buscar de a una por distintos
              supermercados. Pastas, galletitas, alfajores, snacks, barritas.
            </p>
            <p className="text-tinta">
              La idea es simple: que puedas desayunar tranquilo y llevarte la
              semana resuelta en el mismo viaje.
            </p>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="border-b border-borde bg-crema-profundo px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {GALERIA.map((foto) => (
              <figure
                key={foto.src}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  quality={88}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Ubicacion />
    </>
  );
}
