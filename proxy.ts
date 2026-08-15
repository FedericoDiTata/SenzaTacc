import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, haySupabase } from "@/lib/supabase/config";

/**
 * En Next 16 el middleware pasó a llamarse Proxy (mismo comportamiento).
 * Ver node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md
 *
 * Hace dos cosas: renueva la sesión de Supabase en cada request y bloquea
 * /panel para quien no esté logueado.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sin Supabase configurado no hay a quién autenticar: el panel queda abierto
  // para poder desarrollar. El propio panel muestra un aviso bien visible.
  // Ver AGENTS.md § Autenticación.
  if (!haySupabase) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesNuevas) {
        for (const { name, value } of cookiesNuevas) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesNuevas) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() revalida contra Supabase; getSession() sólo lee la cookie y se
  // puede falsificar. Para decidir accesos hay que usar getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/panel") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("volver", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/panel/:path*", "/login"],
};
