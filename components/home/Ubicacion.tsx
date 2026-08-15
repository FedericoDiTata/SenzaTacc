import { Encabezado } from "@/components/ui/Encabezado";
import { SITE } from "@/lib/siteConfig";
import { linkWhatsApp } from "@/lib/whatsapp";

export function Ubicacion() {
  return (
    <section className="bg-crema px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Encabezado
            etiqueta="Visitanos"
            titulo={
              <>
                {SITE.direccion},
                <br />
                {SITE.barrio}.
              </>
            }
            bajada="A pasos de la estación. Si venís a buscar un pedido, escribinos antes por WhatsApp así lo dejamos listo."
          />

          <dl className="mt-10 space-y-3 border-t border-borde pt-8">
            {SITE.horarios.map((h) => (
              <div
                key={h.dias}
                className="flex items-baseline justify-between gap-4 text-sm"
              >
                <dt className="text-tinta-suave">{h.dias}</dt>
                <dd className="tabular-nums">{h.horario}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-tinta px-7 py-3.5 text-center text-sm tracking-wide text-crema transition-colors hover:bg-ladrillo"
            >
              Escribinos por WhatsApp
            </a>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-tinta/25 px-7 py-3.5 text-center text-sm tracking-wide transition-colors hover:border-tinta"
            >
              Cómo llegar
            </a>
          </div>
        </div>

        <div className="min-h-[340px] overflow-hidden rounded-sm border border-borde bg-crema-profundo lg:min-h-0">
          <iframe
            src={SITE.mapEmbed}
            title={`Mapa: ${SITE.nombre}, ${SITE.direccion}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[340px] w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
