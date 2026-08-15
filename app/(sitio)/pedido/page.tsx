import type { Metadata } from "next";
import { FormularioPedido } from "./FormularioPedido";

export const metadata: Metadata = {
  title: "Confirmar pedido",
  robots: { index: false },
};

// La cabecera vive dentro del formulario: tiene que cambiar cuando el pedido
// ya está hecho (si no, sigue diciendo "dejanos tu nombre" sobre la pantalla
// de "tu pedido quedó guardado").
export default function PedidoPage() {
  return <FormularioPedido />;
}
