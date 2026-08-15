"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/marca/Logo";
import { cerrarSesion } from "./acciones";

const TABS = [
  { href: "/panel", label: "Pedidos" },
  { href: "/panel/stock", label: "Stock" },
  { href: "/panel/mostrador", label: "Mostrador" },
];

export function NavPanel({ email }: { email: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-borde bg-crema/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Ir al sitio">
            <Logo compacto className="text-sm" />
          </Link>
          <span className="hidden text-[11px] text-tinta-tenue sm:inline">
            Panel del local
          </span>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-[11px] text-tinta-tenue md:inline">
              {email}
            </span>
          )}
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-full border border-borde px-3 py-1.5 text-[11px] transition-colors hover:border-tinta"
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      <nav className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6">
        {TABS.map((tab) => {
          const activo =
            tab.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-4 py-3 text-sm transition-colors ${
                activo ? "text-tinta" : "text-tinta-tenue hover:text-tinta"
              }`}
            >
              {tab.label}
              {activo && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 bg-madera" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
