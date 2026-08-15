/** Cabecera de páginas interiores. Compensa el navbar fijo. */
export function CabeceraPagina({
  etiqueta,
  titulo,
  bajada,
}: {
  etiqueta: string;
  titulo: string;
  bajada?: string;
}) {
  return (
    <header className="border-b border-borde bg-crema px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-madera">{etiqueta}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
          {titulo}
        </h1>
        {bajada && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta-suave">
            {bajada}
          </p>
        )}
      </div>
    </header>
  );
}
