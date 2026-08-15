/**
 * Pedidos de demostración.
 *
 * Un panel vacío no vende. En la reunión el cliente tiene que abrirlo y ver
 * pedidos esperando, no un cartel de "todavía no hay nada".
 *
 * Se cargan solos en modo memoria, y en Supabase con supabase/seed-pedidos.sql
 * (generado desde este mismo archivo).
 */

export interface PedidoDemo {
  codigo: string;
  nombre: string;
  telefono: string;
  nota: string;
  /** Minutos hacia atrás desde ahora. */
  hace: number;
  lineas: { productoId: string; cantidad: number }[];
}

export const PEDIDOS_DEMO: PedidoDemo[] = [
  {
    codigo: "K7M2",
    nombre: "Carolina Benítez",
    telefono: "+54 9 11 5312-8840",
    nota: "Paso a buscarlo hoy a la tarde, tipo 18 h.",
    hace: 11,
    lineas: [
      { productoId: "dantelli-alfajor-ddl", cantidad: 4 },
      { productoId: "dona-rosa-tirabuzon", cantidad: 2 },
      { productoId: "crudda-brownie", cantidad: 3 },
    ],
  },
  {
    codigo: "R4XP",
    nombre: "Martín Sosa",
    telefono: "+54 9 11 6027-3915",
    nota: "",
    hace: 47,
    lineas: [
      { productoId: "schar-choco-chip-cookies", cantidad: 1 },
      { productoId: "oreo-sin-gluten", cantidad: 3 },
      { productoId: "mani-king-salado", cantidad: 1 },
    ],
  },
  {
    codigo: "B9TQ",
    nombre: "Lucía Ramírez",
    telefono: "+54 9 11 4488-2201",
    nota: "¿Tenés más variedad de barritas? Si hay de arándanos sumame dos.",
    hace: 143,
    lineas: [
      { productoId: "lulemuu-alfajor-arroz", cantidad: 6 },
      { productoId: "mudra-armonia", cantidad: 2 },
      { productoId: "schar-grissini", cantidad: 1 },
    ],
  },
];
