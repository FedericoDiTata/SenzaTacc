"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Taza } from "@/components/marca/Taza";
import { SITE } from "@/lib/siteConfig";

// Fotos del local, no de producto: el hero muestra el lugar, el market muestra
// lo que se vende.
const SLIDES = [
  { src: "/local/salon-gente.jpg", alt: "El salón de Senza Tacc con gente desayunando" },
  { src: "/local/market-gondolas.jpg", alt: "Las góndolas del market sin TACC" },
  { src: "/local/medialunas.jpg", alt: "Medialunas recién horneadas en el mostrador" },
  { src: "/local/market-gente.jpg", alt: "Clientes eligiendo productos en el market" },
];

const DURACION = 3500;
const EASE_CINE = [0.43, 0.13, 0.23, 0.96] as const;

export function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), DURACION);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-tinta">
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: DURACION / 1000 + 1.2, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[i].src}
            alt={SLIDES[i].alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="foto-bn object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Triple overlay: plano + vertical + horizontal, para que el texto
          respire sobre cualquiera de las fotos. */}
      <div className="absolute inset-0 bg-tinta/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-tinta/80 via-transparent to-tinta/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-tinta/30 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-6 text-center text-crema">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_CINE, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <Taza className="w-14 sm:w-16" />

          <h1 className="wordmark mt-8 text-4xl leading-[1.15] sm:text-6xl">
            SENZA TACC
          </h1>

          <p className="eyebrow mt-5 text-crema/80">
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

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Ver foto ${idx + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === i ? "w-8 bg-crema" : "w-1.5 bg-crema/40 hover:bg-crema/70"
            }`}
          />
        ))}
      </div>

      <span className="absolute bottom-8 right-8 hidden text-xs tabular-nums text-crema/50 lg:block">
        {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </span>
    </section>
  );
}
