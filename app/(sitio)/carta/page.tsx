import type { Metadata } from "next";
import Link from "next/link";
import { Sello } from "@/components/marca/Logo";
import { EspigaTachada } from "@/components/marca/EspigaTachada";
import { FondoDoodles } from "@/components/carta/FondoDoodles";
import {
  CARTA,
  type ColorSeccion,
  type ItemCarta,
  type SeccionCarta,
} from "@/lib/carta";
import { formatARS } from "@/lib/types";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "La carta",
  description:
    "Café de especialidad, medialunas, tostados y pastelería. Todo 100% libre de gluten, horneado en el local.",
};

/**
 * Las clases van literales, no armadas con template strings: el JIT de
 * Tailwind lee el código fuente y no resuelve concatenaciones.
 */
const PALETA: Record<ColorSeccion, { banda: string; texto: string }> = {
  ladrillo: { banda: "bg-ladrillo", texto: "text-ladrillo" },
  verde: { banda: "bg-verde", texto: "text-verde" },
  ambar: { banda: "bg-ambar", texto: "text-ambar" },
  tinta: { banda: "bg-tinta", texto: "text-tinta" },
};

/**
 * Reparte las secciones en dos columnas.
 *
 * El peso aproxima la altura: cada item es una fila y la banda de título suma
 * un par más. Se prueban todos los cortes posibles y gana el que deja las dos
 * columnas más parejas, en vez de cortar en el primero que pasa la mitad.
 */
function repartir(secciones: SeccionCarta[]): [SeccionCarta[], SeccionCarta[]] {
  const peso = (s: SeccionCarta) => s.items.length + 2;
  const total = secciones.reduce((n, s) => n + peso(s), 0);

  let acumulado = 0;
  let mejor = { corte: 1, diferencia: Infinity };

  for (let i = 0; i < secciones.length - 1; i++) {
    acumulado += peso(secciones[i]);
    const diferencia = Math.abs(total - 2 * acumulado);
    if (diferencia < mejor.diferencia) mejor = { corte: i + 1, diferencia };
  }

  return [secciones.slice(0, mejor.corte), secciones.slice(mejor.corte)];
}

export default function CartaPage() {
  const [izquierda, derecha] = repartir(CARTA);

  return (
    <>
      {/* ── Portada ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-crema px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-32">
        <FondoDoodles />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow text-ladrillo">La carta</p>

          <h1 className="wordmark mt-4 text-4xl leading-[1] sm:text-6xl">
            PARA TOMAR ACÁ
          </h1>

          <div className="mx-auto mt-6 flex max-w-sm items-center gap-3">
            <span className="h-px flex-1 bg-borde" />
            <EspigaTachada className="h-6 w-6 shrink-0 text-ladrillo" />
            <span className="h-px flex-1 bg-borde" />
          </div>

          <p className="mx-auto mt-6 max-w-lg font-display text-lg leading-relaxed text-tinta-suave sm:text-xl">
            Todo lo que sale de esta cocina es sin gluten, incluido el pan.
          </p>
        </div>
      </header>

      {/* ── La carta, en una sola hoja ──────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-borde bg-crema px-5 py-14 sm:px-8 md:py-18">
        <FondoDoodles />

        {/* Dos columnas en desktop: es lo que baja el scroll a la mitad y hace
            que se lea como una carta impresa y no como una sucesión de
            secciones de landing.

            Grid explícito y no `columns-2`: el algoritmo de columnas de CSS no
            puede partir una sección al medio, así que reparte mal y deja una
            columna 500 px más corta que la otra. Acá el reparto lo calculamos
            nosotros. */}
        <div className="relative mx-auto grid max-w-5xl gap-x-14 lg:grid-cols-2">
          <div>
            {izquierda.map((seccion) => (
              <Seccion key={seccion.id} seccion={seccion} />
            ))}
          </div>

          <div>
            {derecha.map((seccion) => (
              <Seccion key={seccion.id} seccion={seccion} />
            ))}
          </div>
        </div>

        <p className="relative mx-auto mt-4 max-w-5xl text-center text-xs text-tinta-tenue">
          Consultanos por opciones veganas y sin lactosa.
        </p>
      </section>

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section className="border-t border-borde bg-crema-profundo px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <Sello className="h-14 w-14" />
          <h2 className="font-display text-2xl leading-snug">
            ¿Buscabas para llevar a casa?
          </h2>
          <p className="text-sm leading-relaxed text-tinta-suave">
            La carta se disfruta en el salón. Si querés productos envasados
            (pastas, galletitas, alfajores), eso está en el market y se pide
            desde acá.
          </p>
          <Link
            href="/market"
            className="rounded-full bg-tinta px-8 py-3.5 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
          >
            Ir al market
          </Link>
          <p className="text-xs text-tinta-tenue">
            {SITE.direccion}, {SITE.barrio}
          </p>
        </div>
      </section>
    </>
  );
}

/* ── Una sección de la carta ───────────────────────────────────────────── */

function Seccion({ seccion }: { seccion: SeccionCarta }) {
  const paleta = PALETA[seccion.color];

  return (
    // break-inside-avoid: sin esto las columnas CSS parten una sección al medio.
    <section id={seccion.id} className="mb-10 break-inside-avoid">
      <header
        className={`flex items-center gap-3 rounded-sm px-4 py-2.5 ${paleta.banda}`}
      >
        <EspigaTachada className="h-5 w-5 shrink-0 text-crema/55" />
        <h2 className="font-display text-2xl leading-none text-crema">
          {seccion.titulo}
        </h2>
      </header>

      <ul className="mt-2 px-1">
        {seccion.items.map((item) => (
          <Fila key={item.nombre} item={item} texto={paleta.texto} />
        ))}
      </ul>
    </section>
  );
}

function Fila({ item, texto }: { item: ItemCarta; texto: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-borde/70 py-2.5 last:border-0">
      <div className="min-w-0">
        <h3 className="font-display text-base leading-snug">{item.nombre}</h3>
        {item.detalle && (
          <p className="text-[11px] leading-snug text-tinta-tenue">
            {item.detalle}
          </p>
        )}
      </div>
      <span className={`shrink-0 font-display text-base tabular-nums ${texto}`}>
        {formatARS(item.precio)}
      </span>
    </li>
  );
}
