"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/siteConfig";

/*
 * Fotos del local, no de producto: el hero muestra el lugar, el market
 * muestra lo que se vende.
 *
 * Acá van sólo las de alta resolución (originales del iPhone, 2000 px de
 * ancho ya procesadas). El hero ocupa el ancho completo, así que es el único
 * lugar donde una foto chica se notaría; las de 1024 px van a la galería, que
 * las muestra a un tercio del ancho.
 *
 * El `foco` corre el object-position: son verticales y el recorte por defecto
 * (el centro) suele caer en el techo o en el piso, no en el sujeto.
 */
const SLIDES = [
  {
    src: "/local/salon-gente.jpg",
    alt: "El salón de Senza Tacc lleno de gente desayunando",
    foco: "50% 55%",
  },
  {
    src: "/local/desayuno.jpg",
    alt: "Dos capuchinos con arte en la leche, medialunas y jugo de naranja",
    foco: "50% 35%",
  },
  {
    src: "/local/mostrador.jpg",
    alt: "El mostrador con la vitrina de pastelería",
    foco: "50% 45%",
  },
  {
    src: "/local/salon-amplio.jpg",
    alt: "Vista general del salón con las luces colgantes",
    foco: "50% 50%",
  },
];

const DURACION = 4200;

export function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), DURACION);
    return () => clearInterval(t);
  }, []);

  return (
    // 86svh y no 100: que la sección siguiente asome por abajo es lo que le
    // avisa al visitante que hay más para ver.
    <section className="relative flex h-[86svh] min-h-[540px] items-center justify-center overflow-hidden bg-tinta">
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.3, ease: "easeInOut" },
            // Ken Burns contenido: da vida sin que el recorte se vaya de foco.
            scale: { duration: DURACION / 1000 + 1.3, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[i].src}
            alt={SLIDES[i].alt}
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: SLIDES[i].foco }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay medido: que el texto se lea sin apagar el color de las fotos.
          El `via` NO puede ser transparente: el texto vive en el medio vertical
          y ahí es donde algunas fotos tienen la ventana del local a pleno sol. */}
      <div className="absolute inset-0 bg-tinta/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-tinta/70 via-tinta/45 to-tinta/65" />

      <div className="relative mx-auto max-w-3xl px-6 text-center text-crema">
        {/* La entrada va por CSS y no por Framer Motion a propósito: dentro de
            un motion.div con `initial: opacity 0`, el titular no se pinta hasta
            que hidrata el JS. En una conexión lenta eso es medio segundo de
            hero vacío. El CSS corre en el primer paint, sin depender de nada. */}
        <div className="entrada-hero flex flex-col items-center">
          <h1 className="wordmark text-4xl leading-[1.15] sm:text-6xl">
            SENZA TACC
          </h1>

          <p className="eyebrow mt-4 text-crema/80">
            Café de especialidad · Market · {SITE.barrio}
          </p>

          <p className="mt-8 max-w-xl font-display text-xl leading-relaxed sm:text-2xl">
            Todo lo que hay acá es sin gluten.
            <br className="hidden sm:block" /> Sin excepciones, sin asteriscos,
            sin preguntar.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/market"
              className="rounded-full bg-crema px-8 py-3.5 text-sm tracking-wide text-tinta transition-colors hover:bg-blanco"
            >
              Pedí del market
            </Link>
            <Link
              href="/carta"
              className="rounded-full border border-crema/50 px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-crema hover:bg-crema/10"
            >
              Ver la carta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
