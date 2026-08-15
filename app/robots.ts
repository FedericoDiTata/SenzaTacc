import type { MetadataRoute } from "next";

/**
 * El panel y el login quedan fuera de los buscadores.
 *
 * Es la última de tres capas, no la única — robots.txt es una petición, no un
 * candado, y además es público: cualquiera puede leerlo. Las que realmente
 * protegen son el login (proxy.ts) y la validación de sesión dentro de cada
 * Server Action. Esto sólo evita que /panel aparezca en Google.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/login", "/pedido"],
    },
  };
}
