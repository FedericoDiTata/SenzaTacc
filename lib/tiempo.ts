/** "hace 3 min", "hace 2 h", "ayer" — para las filas de pedidos. */
export function haceCuanto(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);

  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;

  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ayer";
  return `hace ${dias} días`;
}

/** Cuánto le queda a una reserva antes de liberarse sola. */
export function tiempoRestante(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "vencida";

  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min} min`;

  const horas = Math.floor(min / 60);
  if (horas < 48) return `${horas} h`;

  const dias = Math.floor(horas / 24);
  return `${dias} días`;
}

export function fechaHora(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
