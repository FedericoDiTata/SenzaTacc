import type { Metadata } from "next";
import Image from "next/image";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { Ubicacion } from "@/components/home/Ubicacion";
import { EspigaTachada } from "@/components/marca/Taza";

export const metadata: Metadata = {
  title: "El local",
  description:
    "Una cafetería y un market 100% libres de gluten en Almagro. Sin cocina compartida, sin contaminación cruzada, sin asteriscos.",
};

const GALERIA = [
  {
    src: "/local/salon-gente.jpg",
    alt: "El salón lleno en un mediodía",
    clase: "col-span-2 aspect-[16/10]",
  },
  {
    src: "/local/market-gondolas.jpg",
    alt: "Las góndolas del market con el cartel MARKET",
    clase: "aspect-[3/4]",
  },
  {
    src: "/local/salon-mesas.jpg",
    alt: "Las mesas contra el listonado de madera",
    clase: "aspect-[3/4]",
  },
  {
    src: "/local/market-gente.jpg",
    alt: "Clientes eligiendo productos en el market",
    clase: "aspect-[3/4]",
  },
  {
    src: "/local/pared-cuadros.jpg",
    alt: "La pared de cuadros con el póster de Senza Tacc",
    clase: "aspect-[3/4]",
  },
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
            <EspigaTachada className="h-9 w-9 text-madera" />
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {GALERIA.map((foto) => (
              <figure
                key={foto.src}
                className={`group relative overflow-hidden rounded-sm ${foto.clase}`}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="foto-bn object-cover transition-transform duration-1000 group-hover:scale-105"
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
