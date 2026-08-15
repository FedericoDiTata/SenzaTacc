import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sello } from "@/components/marca/Logo";
import { EspigaTachada } from "@/components/marca/EspigaTachada";
import { FondoDoodles } from "@/components/carta/FondoDoodles";
import { CARTA, PROMOS, type ItemCarta, type SeccionCarta } from "@/lib/carta";
import { formatARS } from "@/lib/types";
import { SITE } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "La carta",
  description:
    "Café de especialidad, medialunas, tostados y pastelería. Todo 100% libre de gluten, horneado en el local.",
};

export default function CartaPage() {
  return (
    <>
      {/* ── Portada ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-borde bg-crema px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <FondoDoodles />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="eyebrow text-ladrillo">La carta</p>

          <h1 className="wordmark mt-5 text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
            PARA
            <br />
            TOMAR ACÁ
          </h1>

          <div className="mx-auto mt-8 flex max-w-lg items-center gap-4">
            <span className="h-px flex-1 bg-borde" />
            <EspigaTachada className="h-7 w-7 shrink-0 text-ladrillo" />
            <span className="h-px flex-1 bg-borde" />
          </div>

          <p className="mx-auto mt-8 max-w-xl font-display text-xl leading-relaxed text-tinta-suave sm:text-2xl">
            Todo lo que sale de esta cocina es sin gluten, incluido el pan. No
            hay versión apta: hay una sola versión.
          </p>
        </div>
      </header>

      {/* La foto es vertical (960×1280, de celular). En una franja apaisada el
          encuadre por defecto cae sobre la máquina de café y las medialunas
          quedan fuera: por eso el object-position corrido hacia abajo. */}
      <section className="relative h-[42vh] min-h-[280px] overflow-hidden bg-tinta">
        <Image
          src="/local/medialunas.jpg"
          alt="Medialunas recién horneadas sobre el mostrador"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 72%" }}
        />
      </section>

      {/* ── Capítulos ───────────────────────────────────────────────────── */}
      {CARTA.map((seccion, i) => (
        <Capitulo key={seccion.id} seccion={seccion} numero={i + 1} />
      ))}

      {/* ── Promos ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-borde bg-crema-profundo px-5 py-20 sm:px-8 md:py-28">
        <FondoDoodles opacidad={0.045} />

        <div className="relative mx-auto max-w-4xl">
          <h2 className="text-center font-display text-4xl md:text-5xl">
            Combinados
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {PROMOS.map((p) => (
              <div
                key={p.titulo}
                className="rounded-sm border-2 border-dashed border-ladrillo/35 bg-crema p-7 text-center"
              >
                <h3 className="font-display text-2xl">{p.titulo}</h3>
                <p className="mt-2 text-sm text-tinta-suave">{p.detalle}</p>
                <p className="wordmark mt-5 text-3xl text-ladrillo tabular-nums">
                  {formatARS(p.precio)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cierre ──────────────────────────────────────────────────────── */}
      <section className="bg-crema px-5 py-24 sm:px-8 md:py-28">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <Sello className="h-16 w-16" />
          <h2 className="font-display text-2xl leading-snug">
            ¿Buscabas para llevar a casa?
          </h2>
          <p className="text-sm leading-relaxed text-tinta-suave">
            La carta se disfruta en el salón. Si querés productos envasados —
            pastas, galletitas, alfajores — eso está en el market y se pide
            desde acá.
          </p>
          <Link
            href="/market"
            className="rounded-full bg-tinta px-8 py-3.5 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
          >
            Ir al market
          </Link>
          <p className="mt-2 text-xs text-tinta-tenue">
            {SITE.direccion}, {SITE.barrio}
          </p>
        </div>
      </section>
    </>
  );
}

/* ── Un capítulo de la carta ───────────────────────────────────────────── */

function Capitulo({
  seccion,
  numero,
}: {
  seccion: SeccionCarta;
  numero: number;
}) {
  const oscuro = seccion.oscuro ?? false;

  return (
    <section
      id={seccion.id}
      className={`relative overflow-hidden px-5 py-20 sm:px-8 md:py-28 ${
        oscuro
          ? "bg-tinta text-crema"
          : numero % 2 === 0
            ? "border-y border-borde bg-crema-profundo"
            : "bg-crema"
      }`}
    >
      <FondoDoodles
        color={oscuro ? "var(--crema)" : "var(--ladrillo)"}
        opacidad={oscuro ? 0.05 : 0.05}
      />

      <div className="relative mx-auto max-w-4xl">
        <header
          className={`flex flex-col gap-4 border-b-2 pb-6 sm:flex-row sm:items-end sm:justify-between ${
            oscuro ? "border-crema/25" : "border-ladrillo/30"
          }`}
        >
          <div>
            <p
              className={`wordmark text-xs ${
                oscuro ? "text-crema/50" : "text-ladrillo"
              }`}
            >
              {String(numero).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none md:text-6xl">
              {seccion.titulo}
            </h2>
          </div>
          <p
            className={`max-w-xs text-sm sm:text-right ${
              oscuro ? "text-crema/65" : "text-tinta-suave"
            }`}
          >
            {seccion.bajada}
          </p>
        </header>

        {/* Destacado de la sección */}
        <article
          className={`mt-10 flex flex-col gap-5 rounded-sm p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9 ${
            oscuro ? "bg-crema text-tinta" : "bg-ladrillo text-crema"
          }`}
        >
          <div className="min-w-0">
            <p
              className={`eyebrow ${
                oscuro ? "text-ladrillo" : "text-crema/70"
              }`}
            >
              {seccion.destacado.porque}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
              {seccion.destacado.nombre}
            </h3>
            {seccion.destacado.detalle && (
              <p
                className={`mt-2 max-w-md text-sm leading-relaxed ${
                  oscuro ? "text-tinta-suave" : "text-crema/80"
                }`}
              >
                {seccion.destacado.detalle}
              </p>
            )}
          </div>
          <span className="wordmark shrink-0 text-3xl tabular-nums md:text-4xl">
            {formatARS(seccion.destacado.precio)}
          </span>
        </article>

        {/* Resto de la sección */}
        <div className="mt-10 grid gap-x-12 gap-y-1 sm:grid-cols-2">
          {seccion.items.map((item) => (
            <Fila key={item.nombre} item={item} oscuro={oscuro} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Fila({ item, oscuro }: { item: ItemCarta; oscuro: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-5 border-b py-4 ${
        oscuro ? "border-crema/15" : "border-borde"
      }`}
    >
      <div className="min-w-0">
        <h3 className="font-display text-lg leading-snug md:text-xl">
          {item.nombre}
        </h3>
        {item.detalle && (
          <p
            className={`mt-0.5 text-xs ${
              oscuro ? "text-crema/55" : "text-tinta-tenue"
            }`}
          >
            {item.detalle}
          </p>
        )}
      </div>
      <span
        className={`shrink-0 font-display text-lg tabular-nums ${
          oscuro ? "text-dorado" : "text-ladrillo"
        }`}
      >
        {formatARS(item.precio)}
      </span>
    </div>
  );
}
