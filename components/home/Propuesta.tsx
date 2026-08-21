"use client";

import { motion } from "framer-motion";
import { EspigaTachada } from "@/components/marca/EspigaTachada";

/**
 * La primera tarjeta es la que da el marco y las tres siguientes lo sostienen.
 * Por eso abre la grilla y no hay encabezado de sección arriba: el mensaje ya
 * está adentro de la tarjeta.
 */
const TARJETAS = [
  {
    titulo: "Entrás, elegís y te quedás tranquilo.",
    texto:
      "Un lugar donde todo está pensado para que puedas comer sin TACC con la tranquilidad que debería ser normal.",
  },
  {
    titulo: "Cocina 100% libre de gluten",
    texto:
      "Todo el local está pensado para evitar la contaminación cruzada: no hay harina de trigo en la cocina, el depósito ni la máquina de café.",
  },
  {
    titulo: "Un market para encontrar de todo",
    texto:
      "Más de 40 productos sin TACC, de marcas que ya conocés y otras para descubrir: Schär, Doña Rosa, Maní King, Crudda, Mudra y más.",
  },
  {
    titulo: "Café para disfrutar",
    texto:
      "Porque comer sin TACC no significa resignar un buen café. Espresso, flat white y medialunas hechas acá, para disfrutar en el local o llevar.",
  },
];

export function Propuesta() {
  return (
    <section
      id="propuesta"
      className="border-b border-borde bg-crema px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* gap-px sobre el borde: las cuatro tarjetas se leen como un bloque
            único dividido, no como cuatro cajas sueltas. */}
        <div className="grid gap-px overflow-hidden rounded-sm bg-borde sm:grid-cols-2 lg:grid-cols-4">
          {TARJETAS.map((t, i) => (
            <motion.article
              key={t.titulo}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 18,
                delay: i * 0.08,
              }}
              className="flex flex-col bg-crema p-8 md:p-9"
            >
              <EspigaTachada className="h-8 w-8 text-ladrillo" />
              <h3 className="mt-6 font-display text-xl leading-snug">
                {t.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                {t.texto}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
