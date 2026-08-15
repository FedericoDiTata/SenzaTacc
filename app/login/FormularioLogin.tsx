"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";
import { haySupabase } from "@/lib/supabase/config";

export function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const volver = params.get("volver") ?? "/panel";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!haySupabase) {
    return (
      <div className="mt-8 rounded-sm border border-ambar/40 bg-ambar/5 p-5 text-sm leading-relaxed">
        <p className="font-medium text-ambar">Supabase no está configurado</p>
        <p className="mt-2 text-tinta-suave">
          Sin credenciales no hay usuarios que autenticar, así que el panel está
          abierto. Cargá las variables en <code>.env.local</code> para activar
          el login.
        </p>
        <button
          type="button"
          onClick={() => router.push(volver)}
          className="mt-4 w-full rounded-full bg-tinta py-3 text-sm tracking-wide text-crema transition-colors hover:bg-madera"
        >
          Entrar al panel
        </button>
      </div>
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const sb = clienteNavegador();
    const { error: err } = await sb.auth.signInWithPassword({ email, password });

    if (err) {
      setError(
        err.message.toLowerCase().includes("invalid")
          ? "Email o contraseña incorrectos."
          : err.message,
      );
      setCargando(false);
      return;
    }

    router.push(volver);
    router.refresh();
  }

  return (
    <form onSubmit={enviar} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="text-xs text-tinta-suave">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-sm border border-borde bg-blanco px-4 py-3 text-sm outline-none transition-colors focus:border-tinta"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-xs text-tinta-suave">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-sm border border-borde bg-blanco px-4 py-3 text-sm outline-none transition-colors focus:border-tinta"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-rojo/30 bg-rojo/5 px-4 py-3 text-sm text-rojo"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-full bg-tinta py-3.5 text-sm tracking-wide text-crema transition-colors hover:bg-madera disabled:opacity-50"
      >
        {cargando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
