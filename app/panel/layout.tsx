import type { Metadata } from "next";
import { NavPanel } from "./NavPanel";
import { usuarioActual } from "@/lib/auth";
import { haySupabase } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await usuarioActual();

  return (
    // El panel está fuera del grupo (sitio), así que no arrastra el navbar,
    // el footer ni el carrito del sitio público.
    <div className="flex min-h-full flex-col bg-crema">
      {!haySupabase && (
        <p className="bg-ambar px-4 py-2 text-center text-xs text-blanco">
          Modo local sin Supabase — el panel está sin contraseña y los datos se
          borran al reiniciar el servidor.
        </p>
      )}

      <NavPanel email={usuario?.email ?? null} />

      <main className="flex-1 pb-20">{children}</main>
    </div>
  );
}
