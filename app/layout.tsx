import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SITE } from "@/lib/siteConfig";
import "./globals.css";

// Serif de alto contraste: es lo más cercano al cartel "SENZA TACC" del local.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.nombre} — ${SITE.bajada} 100% sin gluten en ${SITE.barrio}`,
    template: `%s · ${SITE.nombre}`,
  },
  description:
    "Cafetería y market 100% libre de gluten en Almagro. Todo lo que hay acá es apto celíaco, sin excepciones. Pedí del market por WhatsApp.",
  openGraph: {
    title: `${SITE.nombre} — ${SITE.bajada}`,
    description: "100% libre de gluten. Café de especialidad y market en Almagro.",
    type: "website",
    locale: "es_AR",
  },
};

/**
 * Root minimalista: sólo html/body y las fuentes.
 *
 * El navbar y el footer viven en app/(sitio)/layout.tsx. El panel y el login
 * quedan fuera de ese grupo porque son otra aplicación: el dueño los usa desde
 * el mostrador y no necesita la navegación del sitio público.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
