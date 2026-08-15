/**
 * Datos del local y textos editables.
 *
 * Los marcados PENDIENTE son placeholders para la demo: hay que confirmarlos
 * con el cliente antes de publicar. Ver AGENTS.md § Datos pendientes.
 */
export const SITE = {
  nombre: "Senza Tacc",
  bajada: "Café & Market",
  claim: "100% libre de gluten",

  /** PENDIENTE — sólo dígitos, sin +, para wa.me */
  whatsapp: "5491100000000",
  /** PENDIENTE */
  whatsappVisible: "+54 9 11 0000-0000",

  instagram: "senzatacc_",
  instagramUrl: "https://www.instagram.com/senzatacc_/",

  /** PENDIENTE — según Google Maps es Pringles 432, falta confirmar con el cliente */
  direccion: "Pringles 432",
  barrio: "Almagro, CABA",
  mapsUrl: "https://maps.app.goo.gl/rnPbTJagJBcvf6W48",
  /** Coordenadas del pin de Google Maps */
  mapEmbed:
    "https://www.google.com/maps?q=-34.6069119,-58.42778&hl=es&z=17&output=embed",

  /** PENDIENTE — horarios de muestra */
  horarios: [
    { dias: "Lunes a viernes", horario: "08:00 – 20:00" },
    { dias: "Sábados", horario: "09:00 – 20:00" },
    { dias: "Domingos", horario: "09:00 – 14:00" },
  ],

  /** Retiro en el local. Falta confirmar si hacen envío. */
  soloRetiro: true,
} as const;

/** Horas que una reserva sobrevive sin que el dueño la resuelva. */
export const HORAS_EXPIRACION_PEDIDO = 24;

export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/market", label: "Market" },
  { href: "/carta", label: "La carta" },
  { href: "/local", label: "El local" },
] as const;
