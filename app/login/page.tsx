import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/marca/Logo";
import { FormularioLogin } from "./FormularioLogin";

export const metadata: Metadata = {
  title: "Acceso del local",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-5 py-24">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h1 className="mt-12 text-center font-display text-2xl">
          Panel del local
        </h1>
        <p className="mt-2 text-center text-sm text-tinta-suave">
          Pedidos, stock y ventas en mostrador.
        </p>

        <Suspense fallback={<div className="mt-8 h-56" />}>
          <FormularioLogin />
        </Suspense>
      </div>
    </div>
  );
}
