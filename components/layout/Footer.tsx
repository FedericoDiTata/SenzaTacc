import Link from "next/link";
import { Sello } from "@/components/marca/Logo";
import { SITE, NAV } from "@/lib/siteConfig";
import { linkWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-borde bg-crema-profundo">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Sello className="h-28 w-28" />
          <p className="max-w-[15rem] text-center text-sm leading-relaxed text-tinta-suave md:text-left">
            Cafetería y market 100% libre de gluten.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="eyebrow text-tinta-suave">Dónde estamos</h3>
          <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed">
            <p>{SITE.direccion}</p>
            <p className="text-tinta-suave">{SITE.barrio}</p>
          </address>
          <dl className="mt-5 space-y-1 text-sm">
            {SITE.horarios.map((h) => (
              <div key={h.dias} className="flex justify-center gap-2 md:justify-start">
                <dt className="text-tinta-suave">{h.dias}</dt>
                <dd className="tabular-nums">{h.horario}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="text-center md:text-left">
          <h3 className="eyebrow text-tinta-suave">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-opacity hover:opacity-60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="eyebrow mt-8 text-tinta-suave">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
              >
                @{SITE.instagram}
              </a>
            </li>
            <li>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
              >
                Cómo llegar
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-borde/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-[11px] text-tinta-tenue sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.nombre}. {SITE.claim}.
          </p>
          <Link href="/panel" className="transition-opacity hover:opacity-60">
            Acceso del local
          </Link>
        </div>
      </div>
    </footer>
  );
}
