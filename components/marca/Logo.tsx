import Image from "next/image";

/**
 * El sello circular del local: anillo verde, campo ladrillo, espigas doradas y
 * la tipografía crema. Es el logo real que nos pasó el cliente, y de acá salió
 * toda la paleta del sitio (ver app/globals.css).
 */
export function Sello({
  className = "",
  prioridad = false,
}: {
  className?: string;
  prioridad?: boolean;
}) {
  return (
    <Image
      src="/logo-senza-tacc.png"
      alt="Senza Tacc — Gluten Free"
      width={500}
      height={500}
      priority={prioridad}
      className={className}
    />
  );
}

/**
 * Lockup de marca.
 *
 * `compacto` es la versión de navbar: sello chico + wordmark, porque a 36 px el
 * texto de adentro del sello no se lee y hace falta que la palabra esté suelta.
 * La versión completa muestra el sello solo, que a ese tamaño ya se lee entero.
 */
export function Logo({
  compacto = false,
  className = "",
}: {
  compacto?: boolean;
  className?: string;
}) {
  if (compacto) {
    return (
      <span className={`flex items-center gap-2.5 ${className}`}>
        <Sello className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" prioridad />
        <span className="wordmark text-lg leading-none sm:text-xl">
          SENZA TACC
        </span>
      </span>
    );
  }

  return (
    <span className={`flex flex-col items-center gap-3 ${className}`}>
      <Sello className="h-28 w-28" />
      <span className="eyebrow text-tinta-tenue">Almagro · CABA</span>
    </span>
  );
}
