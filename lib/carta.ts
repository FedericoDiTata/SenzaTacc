/**
 * Carta de la cafetería.
 *
 * ⚠️ CONTENIDO DE MUESTRA. El cliente todavía no pasó su carta real. Los
 * nombres y precios son plausibles pero inventados — aclararlo en la reunión.
 * Ver AGENTS.md § Datos pendientes.
 *
 * Esta carta NO se pide online: el pedido web es sólo del market. Acá se
 * muestra para que la web sea el lugar centralizado de información que hoy
 * les falta.
 */

export interface ItemCarta {
  nombre: string;
  detalle?: string;
  precio: number;
}

export interface SeccionCarta {
  id: string;
  titulo: string;
  bajada: string;
  /** El item que abre la sección, en tarjeta grande. Uno por sección. */
  destacado: ItemCarta & { porque: string };
  items: ItemCarta[];
  /** Invierte la sección a fondo oscuro. Sirve para cortar el ritmo. */
  oscuro?: boolean;
}

export const CARTA: SeccionCarta[] = [
  {
    id: "cafe",
    titulo: "Café",
    bajada: "De especialidad, tostado por lote chico.",
    destacado: {
      nombre: "Flat white",
      detalle: "Doble ristretto y leche texturada. Sin espuma de más.",
      porque: "El que más sale",
      precio: 4500,
    },
    items: [
      { nombre: "Espresso", precio: 2600 },
      { nombre: "Cortado", precio: 2900 },
      { nombre: "Americano", precio: 3100 },
      { nombre: "Café con leche", precio: 3800 },
      { nombre: "Capuccino", detalle: "Con cacao amargo", precio: 4300 },
      { nombre: "Latte", detalle: "Vainilla, caramelo o avellana", precio: 4700 },
      { nombre: "Cold brew", detalle: "24 horas de infusión en frío", precio: 4900 },
      { nombre: "Espresso doble", precio: 3400 },
    ],
  },
  {
    id: "panaderia",
    titulo: "Panadería",
    bajada: "Todo horneado acá, todos los días.",
    destacado: {
      nombre: "Medialunas",
      detalle: "De manteca, recién salidas del horno. Por unidad o por tres.",
      porque: "Se agotan antes del mediodía",
      precio: 1800,
    },
    items: [
      { nombre: "Medialunas x3", precio: 4900 },
      { nombre: "Chipá", detalle: "Porción", precio: 3200 },
      { nombre: "Scon de queso", precio: 2700 },
      { nombre: "Budín del día", detalle: "Preguntá cuál hay hoy", precio: 3600 },
      { nombre: "Pan casero", detalle: "Media hogaza", precio: 5200 },
      { nombre: "Tostadas con manteca y mermelada", precio: 4100 },
    ],
  },
  {
    id: "salado",
    titulo: "Para almorzar",
    bajada: "Con pan propio, sin excepciones.",
    oscuro: true,
    destacado: {
      nombre: "Tostado de jamón y queso",
      detalle: "En pan de molde propio, prensado. El clásico que no podías pedir en ningún lado.",
      porque: "El pedido de todos los mediodías",
      precio: 6800,
    },
    items: [
      { nombre: "Sándwich de pollo", detalle: "Con rúcula y alioli", precio: 8900 },
      { nombre: "Avocado toast", detalle: "Con huevo poché", precio: 8400 },
      { nombre: "Tarta del día", detalle: "Con ensalada", precio: 7900 },
      { nombre: "Pizzeta individual", detalle: "Muzzarella o del día", precio: 8200 },
      { nombre: "Ensalada de estación", precio: 7400 },
      { nombre: "Sopa del día", detalle: "Con pan tostado", precio: 6200 },
    ],
  },
  {
    id: "dulce",
    titulo: "Pastelería",
    bajada: "La vitrina cambia todos los días.",
    destacado: {
      nombre: "Cheesecake de frutos rojos",
      detalle: "Base de galleta propia y coulis del día.",
      porque: "La que se lleva la vitrina",
      precio: 5200,
    },
    items: [
      { nombre: "Brownie con nuez", precio: 4200 },
      { nombre: "Lemon pie", detalle: "Porción", precio: 4800 },
      { nombre: "Alfajor de maicena", precio: 2400 },
      { nombre: "Torta del día", detalle: "Porción", precio: 4900 },
      { nombre: "Cookie", detalle: "Chocolate o avena y pasas", precio: 2900 },
      { nombre: "Budín de chocolate", detalle: "Porción", precio: 3800 },
    ],
  },
  {
    id: "otras",
    titulo: "Otras bebidas",
    bajada: "Para los que no toman café.",
    destacado: {
      nombre: "Limonada con menta y jengibre",
      detalle: "Exprimida en el momento. Jarra o vaso.",
      porque: "La del verano",
      precio: 3900,
    },
    items: [
      { nombre: "Té e infusiones", detalle: "Negro, verde, rojo, hierbas", precio: 2800 },
      { nombre: "Submarino", precio: 4400 },
      { nombre: "Chocolatada", precio: 4200 },
      { nombre: "Jugo de naranja exprimido", precio: 4100 },
      { nombre: "Agua saborizada casera", precio: 2900 },
      { nombre: "Gaseosas", precio: 3200 },
    ],
  },
];

/** Promos del pie de la carta. */
export const PROMOS = [
  {
    titulo: "Desayuno completo",
    detalle: "Café con leche + 3 medialunas",
    precio: 7900,
  },
  {
    titulo: "Merienda para dos",
    detalle: "2 cafés + porción de torta a elección",
    precio: 12400,
  },
];
