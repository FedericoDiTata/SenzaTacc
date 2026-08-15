"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Refresca el panel cada pocos segundos para que los pedidos nuevos aparezcan
 * solos, sin que el dueño tenga que recargar. Es lo que hace que en la demo el
 * pedido "entre" en vivo mientras el cliente mira su celular.
 *
 * Se pausa con la pestaña en segundo plano para no consumir de más.
 */
export function AutoRefresco({ segundos = 6 }: { segundos?: number }) {
  const router = useRouter();
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    const onVisibilidad = () => {
      const visible = document.visibilityState === "visible";
      setActivo(visible);
      if (visible) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisibilidad);
    return () => document.removeEventListener("visibilitychange", onVisibilidad);
  }, [router]);

  useEffect(() => {
    if (!activo) return;
    const t = setInterval(() => router.refresh(), segundos * 1000);
    return () => clearInterval(t);
  }, [router, segundos, activo]);

  return null;
}
