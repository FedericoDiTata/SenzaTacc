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
 *
 * Todos los items pesan igual: no hay destacados ni bajadas de sección. Lo
 * único que distingue a una sección de otra es el color de su banda.
 */

export interface ItemCarta {
  nombre: string;
  detalle?: string;
  precio: number;
}

/** Color de la banda de cada sección. Son claves fijas, no valores CSS: las
 *  clases de Tailwind tienen que existir literales para que el JIT las vea. */
export type ColorSeccion = "ladrillo" | "verde" | "ambar" | "tinta";

export interface SeccionCarta {
  id: string;
  titulo: string;
  color: ColorSeccion;
  items: ItemCarta[];
}

export const CARTA: SeccionCarta[] = [
  {
    id: "cafe",
    titulo: "Café",
    color: "ladrillo",
    items: [
      { nombre: "Flat white", detalle: "Doble ristretto y leche texturada", precio: 4500 },
      { nombre: "Espresso", precio: 2600 },
      { nombre: "Espresso doble", precio: 3400 },
      { nombre: "Cortado", precio: 2900 },
      { nombre: "Americano", precio: 3100 },
      { nombre: "Café con leche", precio: 3800 },
      { nombre: "Capuccino", detalle: "Con cacao amargo", precio: 4300 },
      { nombre: "Latte", detalle: "Vainilla, caramelo o avellana", precio: 4700 },
      { nombre: "Cold brew", detalle: "24 horas de infusión en frío", precio: 4900 },
    ],
  },
  {
    id: "panaderia",
    titulo: "Panadería",
    color: "ambar",
    items: [
      { nombre: "Medialunas", detalle: "De manteca, por unidad", precio: 1800 },
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
    color: "tinta",
    items: [
      { nombre: "Tostado de jamón y queso", detalle: "En pan de molde propio, prensado", precio: 6800 },
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
    color: "ladrillo",
    items: [
      { nombre: "Cheesecake de frutos rojos", detalle: "Base de galleta propia y coulis del día", precio: 5200 },
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
    color: "verde",
    items: [
      { nombre: "Limonada con menta y jengibre", detalle: "Exprimida en el momento", precio: 3900 },
      { nombre: "Té e infusiones", detalle: "Negro, verde, rojo, hierbas", precio: 2800 },
      { nombre: "Submarino", precio: 4400 },
      { nombre: "Chocolatada", precio: 4200 },
      { nombre: "Jugo de naranja exprimido", precio: 4100 },
      { nombre: "Agua saborizada casera", precio: 2900 },
      { nombre: "Gaseosas", precio: 3200 },
    ],
  },
];
