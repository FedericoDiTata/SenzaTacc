/**
 * La taza de línea del póster que tienen colgado en el local.
 *
 * Es el único elemento gráfico propio de la marca, así que se repite a
 * propósito: logo, separador de secciones, carrito vacío, favicon.
 */
export function Taza({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 54"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 10h40v18c0 11-9 20-20 20S8 39 8 28V10z" />
      <path d="M48 16h6a9 9 0 0 1 0 18h-6" />
    </svg>
  );
}

/**
 * Espiga tachada dentro de un círculo — evoca el sello oficial "Sin T.A.C.C.",
 * que cualquier celíaco reconoce de inmediato.
 *
 * El círculo no es decorativo: sin él el dibujo se lee como un garabato por
 * debajo de ~32 px.
 */
export function EspigaTachada({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="16" r="13.2" />
      <path d="M16 24.5V12" />
      <path d="M16 17c-2.7 0-4.4-1.7-4.4-4.4 2.7 0 4.4 1.7 4.4 4.4z" />
      <path d="M16 17c2.7 0 4.4-1.7 4.4-4.4-2.7 0-4.4 1.7-4.4 4.4z" />
      <path d="M16 12.4c-2.7 0-4.4-1.7-4.4-4.4 2.7 0 4.4 1.7 4.4 4.4z" />
      <path d="M16 12.4c2.7 0 4.4-1.7 4.4-4.4-2.7 0-4.4 1.7-4.4 4.4z" />
      <path d="M6.7 25.3 25.3 6.7" />
    </svg>
  );
}
