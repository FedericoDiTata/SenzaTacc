"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/marca/Logo";
import { contarCarrito, useCarrito } from "@/lib/cartStore";
import { NAV } from "@/lib/siteConfig";

export function Navbar() {
  const pathname = usePathname();
  const [scrolleado, setScrolleado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [montado, setMontado] = useState(false);

  const lineas = useCarrito((s) => s.lineas);
  const abrirCarrito = useCarrito((s) => s.abrir);
  const cantidad = contarCarrito(lineas);

  // El badge sólo aparece después de hidratar: el carrito vive en
  // localStorage y el servidor no lo conoce.
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuAbierto(false), [pathname]);

  // Transparente sólo sobre el hero de la home. En cualquier otro lado el
  // texto blanco sería invisible.
  const transparente = pathname === "/" && !scrolleado && !menuAbierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        transparente
          ? "bg-transparent text-blanco"
          : "border-b border-borde bg-crema/95 text-tinta backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link href="/" aria-label="Senza Tacc — inicio" className="shrink-0">
          <Logo compacto />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const activo =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative text-sm tracking-wide"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ${
                      activo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={abrirCarrito}
            aria-label={`Abrir carrito${cantidad > 0 ? ` (${cantidad})` : ""}`}
            className="relative rounded-full p-2.5 transition-colors hover:bg-current/10"
          >
            <BolsaIcono className="h-5 w-5" />
            {montado && cantidad > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-madera px-1 text-[10px] font-semibold text-blanco">
                {cantidad}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            className="rounded-full p-2.5 transition-colors hover:bg-current/10 md:hidden"
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  menuAbierto ? "translate-y-[7.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition-opacity duration-200 ${
                  menuAbierto ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${
                  menuAbierto ? "-translate-y-[7.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-borde bg-crema text-tinta md:hidden"
          >
            <ul className="flex flex-col px-5 py-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block border-b border-borde/60 py-4 text-base last:border-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function BolsaIcono({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
