"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Taza } from "@/components/marca/Taza";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { totalCarrito, useCarrito } from "@/lib/cartStore";
import { formatARS } from "@/lib/types";
import { HORAS_EXPIRACION_PEDIDO, SITE } from "@/lib/siteConfig";
import { confirmarPedido } from "./acciones";

export function FormularioPedido() {
  const { lineas, setCantidad, quitar, vaciar } = useCarrito();
  const [montado, setMontado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState<{ codigo: string; url: string } | null>(
    null,
  );
  const [pendiente, iniciar] = useTransition();

  useEffect(() => setMontado(true), []);

  const total = totalCarrito(lineas);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    iniciar(async () => {
      const r = await confirmarPedido(
        nombre,
        telefono,
        nota,
        lineas.map((l) => ({ productoId: l.productoId, cantidad: l.cantidad })),
      );

      if (!r.ok) {
        setError(r.error);
        return;
      }

      setListo({ codigo: r.codigo, url: r.url });
      vaciar();

      // Pestaña nueva, no redirección. Con location.href el usuario se va del
      // sitio y nunca llega a ver su código de pedido — que es justo lo que
      // necesita tener a mano. Si el navegador bloquea el popup, queda el
      // botón grande de la pantalla de éxito.
      window.open(r.url, "_blank", "noopener,noreferrer");
    });
  }

  if (!montado) {
    return <div className="min-h-[60vh]" />;
  }

  /* ── Pedido registrado ─────────────────────────────────────────────────── */
  if (listo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-5 pb-24 pt-36 text-center sm:px-8"
      >
        <Taza className="mx-auto w-14 text-ladrillo" />
        <h2 className="mt-8 font-display text-3xl">Tu pedido quedó guardado</h2>

        <p className="mt-6 text-sm leading-relaxed text-tinta-suave">
          Anotá este código, es el que vamos a usar para encontrar tu pedido:
        </p>
        <p className="wordmark mt-3 text-4xl text-ladrillo">{listo.codigo}</p>

        <p className="mt-8 text-sm leading-relaxed text-tinta-suave">
          Se te abrió WhatsApp con el mensaje ya escrito. Si no pasó nada,
          tocá acá:
        </p>

        <a
          href={listo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block w-full rounded-full bg-tinta px-8 py-4 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo sm:w-auto"
        >
          Abrir WhatsApp y enviar
        </a>

        <p className="mt-10 border-t border-borde pt-8 text-xs leading-relaxed text-tinta-tenue">
          Te reservamos las unidades por {HORAS_EXPIRACION_PEDIDO} horas. Si no
          llegamos a confirmarte, vuelven al stock solas.
        </p>

        <Link
          href="/market"
          className="mt-6 inline-block text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Volver al market
        </Link>
      </motion.div>
    );
  }

  /* ── Carrito vacío ─────────────────────────────────────────────────────── */
  if (lineas.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-5 pb-24 pt-36 text-center sm:px-8">
        <Taza className="w-14 text-borde" />
        <h2 className="font-display text-2xl">Tu pedido está vacío</h2>
        <p className="text-sm text-tinta-suave">
          Elegí lo que quieras del market y volvé por acá.
        </p>
        <Link
          href="/market"
          className="rounded-full bg-tinta px-8 py-3.5 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
        >
          Ir al market
        </Link>
      </div>
    );
  }

  /* ── Formulario ────────────────────────────────────────────────────────── */
  return (
    <>
      <CabeceraPagina
        etiqueta="Último paso"
        titulo="Confirmá tu pedido."
        bajada="Dejanos tu nombre y te abrimos WhatsApp con todo escrito. Reservamos las unidades mientras tanto."
      />
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <form onSubmit={enviar} className="order-2 lg:order-1">
          <h2 className="eyebrow text-ladrillo">Tus datos</h2>

          <div className="mt-6 space-y-5">
            <Campo
              id="nombre"
              etiqueta="Nombre"
              obligatorio
              valor={nombre}
              onChange={setNombre}
              placeholder="Cómo te anotamos"
              autoComplete="name"
            />
            <Campo
              id="telefono"
              etiqueta="Teléfono"
              valor={telefono}
              onChange={setTelefono}
              placeholder="Opcional — te escribimos por WhatsApp igual"
              autoComplete="tel"
              tipo="tel"
            />

            <div>
              <label htmlFor="nota" className="text-xs text-tinta-suave">
                Algo que quieras aclarar
              </label>
              <textarea
                id="nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                placeholder="Cuándo pasás a buscarlo, si querés cambiar algo…"
                className="mt-2 w-full resize-none rounded-sm border border-borde bg-blanco px-4 py-3 text-sm outline-none transition-colors placeholder:text-tinta-tenue focus:border-tinta"
              />
            </div>
          </div>

          <div className="mt-8 rounded-sm border border-borde bg-crema-profundo p-5">
            <h3 className="text-sm">Cómo sigue</h3>
            <ol className="mt-3 space-y-2 text-xs leading-relaxed text-tinta-suave">
              <li>
                <strong className="font-medium text-tinta">1.</strong> Te abrimos
                WhatsApp con el pedido ya escrito y un código.
              </li>
              <li>
                <strong className="font-medium text-tinta">2.</strong> Nos llega
                al panel del local y te confirmamos por ahí mismo.
              </li>
              <li>
                <strong className="font-medium text-tinta">3.</strong> Lo pasás a
                buscar por {SITE.direccion}.
              </li>
            </ol>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-sm border border-rojo/30 bg-rojo/5 px-4 py-3 text-sm text-rojo"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pendiente}
            className="mt-8 w-full rounded-full bg-tinta py-4 text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo disabled:opacity-50"
          >
            {pendiente ? "Registrando…" : "Confirmar y abrir WhatsApp"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-tinta-tenue">
            No es una compra: es una consulta de pedido. El pago y el retiro se
            coordinan por WhatsApp.
          </p>
        </form>

        {/* Resumen */}
        <aside className="order-1 lg:order-2">
          <div className="rounded-sm border border-borde bg-blanco p-6 lg:sticky lg:top-28">
            <h2 className="eyebrow text-tinta-suave">Tu pedido</h2>

            <ul className="mt-5 divide-y divide-borde">
              {lineas.map((l) => (
                <li key={l.productoId} className="flex gap-3 py-4">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-blanco">
                    <Image
                      src={l.imagen}
                      alt={l.nombre}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{l.nombre}</p>
                    <p className="text-[11px] text-tinta-tenue">
                      {l.marca} · {l.unidad}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-borde text-xs">
                        <button
                          type="button"
                          aria-label="Quitar uno"
                          onClick={() => setCantidad(l.productoId, l.cantidad - 1)}
                          className="px-2 py-0.5 transition-colors hover:text-ladrillo"
                        >
                          −
                        </button>
                        <span className="min-w-4 text-center tabular-nums">
                          {l.cantidad}
                        </span>
                        <button
                          type="button"
                          aria-label="Agregar uno"
                          disabled={l.cantidad >= l.maximo}
                          onClick={() => setCantidad(l.productoId, l.cantidad + 1)}
                          className="px-2 py-0.5 transition-colors hover:text-ladrillo disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => quitar(l.productoId)}
                        className="text-[11px] text-tinta-tenue underline underline-offset-2 hover:text-rojo"
                      >
                        quitar
                      </button>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums">
                    {formatARS(l.precioUnitario * l.cantidad)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-borde pt-4">
              <span className="eyebrow text-tinta-suave">Total</span>
              <span className="wordmark text-xl tabular-nums">
                {formatARS(total)}
              </span>
            </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Campo({
  id,
  etiqueta,
  valor,
  onChange,
  placeholder,
  obligatorio = false,
  tipo = "text",
  autoComplete,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  obligatorio?: boolean;
  tipo?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-tinta-suave">
        {etiqueta}
        {obligatorio && <span className="ml-0.5 text-ladrillo">*</span>}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        required={obligatorio}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-borde bg-blanco px-4 py-3 text-sm outline-none transition-colors placeholder:text-tinta-tenue focus:border-tinta"
      />
    </div>
  );
}
