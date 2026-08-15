/**
 * Íconos de línea para estados vacíos y controles.
 *
 * Son deliberadamente neutros: el lugar de la marca es el sello
 * (components/marca/Logo.tsx), no los estados vacíos.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Bolsa de compras. Carrito, en el navbar y en el carrito vacío. */
export function Bolsa({ className = "" }: Props) {
  return (
    <svg {...base} strokeWidth={1.5} className={className}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

/** Lupa. Buscador y "no encontramos nada". */
export function Lupa({ className = "" }: Props) {
  return (
    <svg {...base} strokeWidth={1.5} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </svg>
  );
}

/** Bandeja vacía. "No hay pedidos esperando" en el panel. */
export function Bandeja({ className = "" }: Props) {
  return (
    <svg {...base} strokeWidth={1.5} className={className}>
      <path d="M3 13h4l1.5 3h7L17 13h4" />
      <path d="M4.5 6.5 3 13v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5l-1.5-6.5a1 1 0 0 0-1-.5H5.5a1 1 0 0 0-1 .5z" />
    </svg>
  );
}
