"use client";

import { motion } from "framer-motion";
import { Encabezado } from "@/components/ui/Encabezado";
import { EspigaTachada } from "@/components/marca/EspigaTachada";

const PILARES = [
  {
    titulo: "Cocina 100% libre de gluten",
    texto:
      "No hay harina de trigo en el local. Ni en la cocina, ni en el depósito, ni en la máquina de café. No existe la contaminación cruzada porque no hay con qué.",
  },
  {
    titulo: "Un market, no una góndola",
    texto:
      "Más de cuarenta productos de las marcas que realmente conseguís: Schär, Doña Rosa, Maní King, Crudda, Mudra. Pastas, galletitas, alfajores, snacks y barritas.",
  },
  {
    titulo: "Café de especialidad",
    texto:
      "Porque comer sin gluten no debería significar resignar el café. Espresso, flat white y medialunas hechas acá, todos los días.",
  },
];

export function Propuesta() {
  return (
    <section
      id="propuesta"
      className="border-b border-borde bg-crema px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Encabezado
          etiqueta="Por qué existimos"
          titulo={
            <>
              Entrás y podés
              <br />
              pedir cualquier cosa.
            </>
          }
          bajada="Si sos celíaco sabés lo que es preguntar tres veces, leer etiquetas y desconfiar igual. Acá esa conversación no hace falta."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm bg-borde md:grid-cols-3">
          {PILARES.map((p, i) => (
            <motion.article
              key={p.titulo}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 18,
                delay: i * 0.1,
              }}
              className="flex flex-col bg-crema p-8 md:p-10"
            >
              <EspigaTachada className="h-9 w-9 text-ladrillo" />
              <h3 className="mt-6 font-display text-xl leading-snug">
                {p.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                {p.texto}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
