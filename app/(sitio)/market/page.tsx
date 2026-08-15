import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/ui/CabeceraPagina";
import { GrillaMarket } from "@/components/market/GrillaMarket";
import { datos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Market",
  description:
    "Más de 40 productos sin TACC: pastas, galletitas, alfajores, snacks y barritas. Armá tu pedido y lo terminamos por WhatsApp.",
};

// El stock cambia con cada pedido y con cada venta en mostrador: nunca cachear.
export const dynamic = "force-dynamic";

export default async function MarketPage() {
  // Antes de mostrar disponibilidad, liberamos las reservas que nadie resolvió.
  await datos.expirarPedidos();
  const productos = await datos.listarProductos();

  return (
    <>
      <CabeceraPagina
        etiqueta="El market"
        titulo="Todo lo que te llevás a casa."
        bajada="Elegí lo que necesites y confirmá: te abrimos WhatsApp con el pedido ya escrito. Te reservamos las unidades hasta que lo confirmemos."
      />
      <GrillaMarket productos={productos} />
    </>
  );
}
