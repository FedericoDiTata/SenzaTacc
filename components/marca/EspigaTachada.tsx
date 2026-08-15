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
