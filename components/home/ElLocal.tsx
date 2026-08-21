"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Encabezado } from "@/components/ui/Encabezado";

export function ElLocal() {
  return (
    <section className="border-b border-borde bg-tinta px-5 py-24 text-crema sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Encabezado
            claro
            etiqueta="El lugar"
            titulo="Todo en un mismo lugar"
            bajada="Lugar cálido para tomar y comer algo rico. Al otro lado del salón, el market: 2 góndolas con productos sin TACC para llevar, elegir y descubrir."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10"
          >
            <Link
              href="/local"
              className="group inline-flex items-center gap-2 border-b border-crema/40 pb-1 text-sm transition-colors hover:border-crema"
            >
              Conocé el local
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-sm"
          >
            <Image
              src="/local/salon-amplio.jpg"
              alt="El salón con las luces colgantes y el listonado de madera"
              fill
              quality={88}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectPosition: "50% 55%" }}
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.1,
            }}
            className="relative aspect-square overflow-hidden rounded-sm"
          >
            <Image
              src="/local/pared-cuadros.jpg"
              alt="La pared de cuadros con el póster de Senza Tacc"
              fill
              quality={88}
              sizes="25vw"
              style={{ objectPosition: "50% 35%" }}
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.2,
            }}
            className="relative aspect-square overflow-hidden rounded-sm"
          >
            <Image
              src="/local/market-pasillo.jpg"
              alt="El pasillo del market bajo el cartel MARKET"
              fill
              quality={88}
              sizes="25vw"
              style={{ objectPosition: "50% 40%" }}
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
