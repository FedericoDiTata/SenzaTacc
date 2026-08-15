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
  items: ItemCarta[];
}

export const CARTA: SeccionCarta[] = [
  {
    id: "cafe",
    titulo: "Café",
    bajada: "De especialidad, tostado por lote chico.",
    items: [
      { nombre: "Espresso", precio: 2600 },
      { nombre: "Cortado", precio: 2900 },
      { nombre: "Americano", precio: 3100 },
      { nombre: "Café con leche", precio: 3800 },
      { nombre: "Capuccino", detalle: "Con cacao amargo", precio: 4300 },
      { nombre: "Flat white", precio: 4500 },
      { nombre: "Latte", detalle: "Vainilla, caramelo o avellana", precio: 4700 },
      { nombre: "Cold brew", detalle: "24 horas de infusión en frío", precio: 4900 },
    ],
  },
  {
    id: "otras",
    titulo: "Otras bebidas",
    bajada: "Para los que no toman café.",
    items: [
      { nombre: "Té e infusiones", detalle: "Negro, verde, rojo, hierbas", precio: 2800 },
      { nombre: "Submarino", precio: 4400 },
      { nombre: "Chocolatada", precio: 4200 },
      { nombre: "Jugo de naranja exprimido", precio: 4100 },
      { nombre: "Limonada con menta y jengibre", precio: 3900 },
    ],
  },
  {
    id: "panaderia",
    titulo: "Panadería",
    bajada: "Todo horneado acá, todos los días.",
    items: [
      { nombre: "Medialunas", detalle: "De manteca. Unidad", precio: 1800 },
      { nombre: "Medialunas x3", precio: 4900 },
      { nombre: "Chipá", detalle: "Porción", precio: 3200 },
      { nombre: "Scon de queso", precio: 2700 },
      { nombre: "Budín del día", detalle: "Preguntá cuál hay hoy", precio: 3600 },
      { nombre: "Pan casero", detalle: "Media hogaza", precio: 5200 },
    ],
  },
  {
    id: "salado",
    titulo: "Para almorzar",
    bajada: "Con pan propio, sin excepciones.",
    items: [
      { nombre: "Tostado de jamón y queso", precio: 6800 },
      { nombre: "Sándwich de pollo", detalle: "Con rúcula y alioli", precio: 8900 },
      { nombre: "Avocado toast", detalle: "Con huevo poché", precio: 8400 },
      { nombre: "Tarta del día", detalle: "Con ensalada", precio: 7900 },
      { nombre: "Pizzeta individual", detalle: "Muzzarella o del día", precio: 8200 },
    ],
  },
  {
    id: "dulce",
    titulo: "Pastelería",
    bajada: "La vitrina cambia todos los días.",
    items: [
      { nombre: "Brownie con nuez", precio: 4200 },
      { nombre: "Lemon pie", detalle: "Porción", precio: 4800 },
      { nombre: "Cheesecake de frutos rojos", detalle: "Porción", precio: 5200 },
      { nombre: "Alfajor de maicena", precio: 2400 },
      { nombre: "Torta del día", detalle: "Porción", precio: 4900 },
    ],
  },
];
