/**
 * Trama de dibujos de línea para el fondo de la carta.
 *
 * La idea la trae la referencia que pasó el cliente (una carta de cookies con
 * garabatos de fondo), pero el vocabulario es el nuestro: espiga, medialuna,
 * grano de café y galletita. Nada de tazas — el motivo de la taza se eliminó
 * del proyecto.
 *
 * Va a opacidad muy baja: tiene que leerse como textura del papel, no competir
 * con los precios.
 */
export function FondoDoodles({
  className = "",
  color = "var(--ladrillo)",
  opacidad = 0.055,
}: {
  className?: string;
  color?: string;
  opacidad?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: opacidad }}
    >
      <defs>
        <pattern
          id="doodles-carta"
          width="240"
          height="240"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-8)"
        >
          <g
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Espiga */}
            <g transform="translate(26 28)">
              <path d="M10 44V16" />
              <path d="M10 24c-4 0-6.5-2.5-6.5-6.5C7.5 17.5 10 20 10 24z" />
              <path d="M10 24c4 0 6.5-2.5 6.5-6.5C12.5 17.5 10 20 10 24z" />
              <path d="M10 17c-4 0-6.5-2.5-6.5-6.5C7.5 10.5 10 13 10 17z" />
              <path d="M10 17c4 0 6.5-2.5 6.5-6.5C12.5 10.5 10 13 10 17z" />
            </g>

            {/* Medialuna */}
            <g transform="translate(140 36) rotate(15)">
              <path d="M6 2a16 16 0 1 0 13 26A13 13 0 0 1 6 2z" />
              <path d="M9 9c2.5 1.5 4 4.5 4 7.5" />
            </g>

            {/* Galletita con chips */}
            <g transform="translate(52 148)">
              <circle cx="16" cy="16" r="14" />
              <circle cx="11" cy="12" r="1.9" />
              <circle cx="21" cy="15" r="1.9" />
              <circle cx="15" cy="22" r="1.9" />
            </g>

            {/* Grano de café */}
            <g transform="translate(160 156) rotate(-25)">
              <ellipse cx="12" cy="15" rx="8" ry="12" />
              <path d="M12 4c-3 6-3 16 0 22" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#doodles-carta)" />
    </svg>
  );
}
