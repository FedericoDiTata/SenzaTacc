import { haySupabase } from "./supabase/config";
import { clienteServidor } from "./supabase/servidor";

/**
 * Guard para Server Actions del panel.
 *
 * El proxy ya bloquea la navegación a /panel, pero una Server Action se puede
 * invocar con un POST directo sin pasar por ninguna página. Toda acción que
 * escriba tiene que llamar a esto primero.
 */
export async function requerirSesion(): Promise<void> {
  if (!haySupabase) return; // modo local sin auth — ver AGENTS.md § Autenticación

  const sb = await clienteServidor();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) throw new Error("No autorizado");
}

export async function usuarioActual(): Promise<{ email: string } | null> {
  if (!haySupabase) return null;

  const sb = await clienteServidor();
  const {
    data: { user },
  } = await sb.auth.getUser();

  return user?.email ? { email: user.email } : null;
}
