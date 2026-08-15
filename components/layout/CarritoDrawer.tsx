"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bolsa } from "@/components/ui/Iconos";
import { contarCarrito, totalCarrito, useCarrito } from "@/lib/cartStore";
import { formatARS } from "@/lib/types";

export function CarritoDrawer() {
  const { lineas, abierto, cerrar, setCantidad, quitar } = useCarrito();
  const [montado, setMontado] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMontado(true), []);
  useEffect(() => cerrar(), [pathname, cerrar]);

  // Bloquea el scroll del fondo mientras el drawer está abierto.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [cerrar]);

  if (!montado) return null;

  const total = totalCarrito(lineas);
  const cantidad = contarCarrito(lineas);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="fixed inset-0 z-[60] bg-tinta/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            role="dialog"
            aria-label="Tu pedido"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-crema shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-borde px-6 py-5">
              <div>
                <h2 className="wordmark text-base">TU PEDIDO</h2>
                {cantidad > 0 && (
                  <p className="mt-0.5 text-xs text-tinta-suave">
                    {cantidad} {cantidad === 1 ? "producto" : "productos"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="rounded-full p-2 transition-colors hover:bg-crema-profundo"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            {lineas.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <Bolsa className="h-12 w-12 text-borde" />
                <p className="text-sm text-tinta-suave">
                  Todavía no agregaste nada.
                </p>
                <Link
                  href="/market"
                  onClick={cerrar}
                  className="text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  Ver el market
                </Link>
              </div>
            ) : (
              <>
                <ul className="scroll-fino flex-1 divide-y divide-borde overflow-y-auto px-6">
                  {lineas.map((l) => (
                    <li key={l.productoId} className="flex gap-4 py-5">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-blanco">
                        <Image
                          src={l.imagen}
                          alt={l.nombre}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <p className="eyebrow text-tinta-tenue">{l.marca}</p>
                          <p className="mt-0.5 truncate text-sm">{l.nombre}</p>
                          <p className="text-xs text-tinta-suave">{l.unidad}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border border-borde">
                            <button
                              type="button"
                              aria-label="Quitar uno"
                              onClick={() =>
                                setCantidad(l.productoId, l.cantidad - 1)
                              }
                              className="px-2.5 py-1 text-sm transition-colors hover:text-ladrillo"
                            >
                              −
                            </button>
                            <span className="min-w-5 text-center text-sm tabular-nums">
                              {l.cantidad}
                            </span>
                            <button
                              type="button"
                              aria-label="Agregar uno"
                              disabled={l.cantidad >= l.maximo}
                              onClick={() =>
                                setCantidad(l.productoId, l.cantidad + 1)
                              }
                              className="px-2.5 py-1 text-sm transition-colors hover:text-ladrillo disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">
                            {formatARS(l.precioUnitario * l.cantidad)}
                          </span>
                        </div>

                        {l.cantidad >= l.maximo && (
                          <p className="mt-1 text-[11px] text-ambar">
                            Es todo lo que queda
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => quitar(l.productoId)}
                        aria-label={`Quitar ${l.nombre}`}
                        className="self-start p-1 text-tinta-tenue transition-colors hover:text-rojo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                        >
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-borde px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-tinta-suave">Total</span>
                    <span className="wordmark text-xl tabular-nums">
                      {formatARS(total)}
                    </span>
                  </div>
                  <Link
                    href="/pedido"
                    onClick={cerrar}
                    className="mt-4 block w-full rounded-full bg-tinta py-3.5 text-center text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
                  >
                    Confirmar pedido
                  </Link>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-tinta-tenue">
                    Te lleva a WhatsApp con el pedido escrito.
                    <br />
                    Reservamos las unidades hasta que lo confirmemos.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
