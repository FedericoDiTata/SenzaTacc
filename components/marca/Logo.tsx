import { Taza } from "./Taza";

/**
 * Lockup del cartel del local: SENZA / TACC apilado, la taza, y la bajada.
 * `compacto` es la versión de navbar (una línea, sin taza).
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
      <span
        className={`wordmark text-lg leading-none sm:text-xl ${className}`}
      >
        SENZA TACC
      </span>
    );
  }

  return (
    <span className={`flex flex-col items-center gap-4 ${className}`}>
      <span className="wordmark text-center text-3xl leading-[1.1] sm:text-4xl">
        SENZA
        <br />
        TACC
      </span>
      <Taza className="w-12 sm:w-14" />
      <span className="eyebrow opacity-80">Gluten Free</span>
    </span>
  );
}
