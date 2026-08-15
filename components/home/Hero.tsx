"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/siteConfig";

/*
 * Fotos del local, no de producto: el hero muestra el lugar, el market muestra
 * lo que se vende.
 *
 * Las seis son verticales de celular (~960×1280) y comprimidas por WhatsApp.
 * En una franja apaisada eso trae dos problemas:
 *
 *  1. Encuadre — el recorte por defecto (centro) cae en la parte menos
 *     interesante de cada foto. De ahí el `foco` de cada slide, que corre el
 *     object-position a donde realmente está el sujeto.
 *  2. Nitidez — 960 px de ancho estirados a 1440+ es un 1,5× de upscale y no
 *     hay forma de recuperarlo desde el código. Para que se vean nítidas hacen
 *     falta los originales del celular (WhatsApp recorta a 1280 px y
 *     recomprime). Ver AGENTS.md § Datos pendientes.
 */
const SLIDES = [
  {
    src: "/local/salon-gente.jpg",
    alt: "El salón de Senza Tacc con gente desayunando",
    foco: "50% 58%",
  },
  {
    src: "/local/market-gondolas.jpg",
    alt: "Las góndolas del market sin TACC",
    foco: "50% 42%",
  },
  {
    src: "/local/medialunas.jpg",
    alt: "Medialunas recién horneadas en el mostrador",
    foco: "50% 70%",
  },
  {
    src: "/local/market-gente.jpg",
    alt: "Clientes eligiendo productos en el market",
    foco: "50% 45%",
  },
];

const DURACION = 4200;
const EASE_CINE = [0.43, 0.13, 0.23, 0.96] as const;

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
            // Ken Burns contenido: con fotos de 960 px cada punto de zoom se
            // paga en nitidez.
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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_CINE, delay: 0.2 }}
          className="flex flex-col items-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
