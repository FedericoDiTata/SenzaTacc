"use client";

import { motion } from "framer-motion";

/**
 * Encabezado de sección: etiqueta de acento + h2, ambos con wipe reveal desde
 * abajo. Todas las secciones usan este mismo componente para que tengan el
 * mismo peso visual.
 */
export function Encabezado({
  etiqueta,
  titulo,
  bajada,
  centrado = false,
  claro = false,
}: {
  etiqueta: string;
  titulo: React.ReactNode;
  bajada?: string;
  centrado?: boolean;
  claro?: boolean;
}) {
  return (
    <div className={centrado ? "text-center" : ""}>
      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className={`eyebrow ${claro ? "text-crema/70" : "text-madera"}`}
        >
          {etiqueta}
        </motion.p>
      </div>

      <div className="mt-3 overflow-hidden">
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.06 }}
          className={`font-display text-4xl leading-[1.15] md:text-5xl ${
            claro ? "text-crema" : "text-tinta"
          }`}
        >
          {titulo}
        </motion.h2>
      </div>

      {bajada && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className={`mt-5 max-w-xl text-base leading-relaxed ${
            centrado ? "mx-auto" : ""
          } ${claro ? "text-crema/75" : "text-tinta-suave"}`}
        >
          {bajada}
        </motion.p>
      )}
    </div>
  );
}
