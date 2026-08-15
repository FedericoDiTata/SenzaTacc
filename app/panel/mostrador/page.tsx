import { datos } from "@/lib/data";
import { GrillaMostrador } from "./GrillaMostrador";

export const dynamic = "force-dynamic";

export default async function MostradorPage() {
  const productos = await datos.listarProductos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header>
        <h1 className="font-display text-3xl">Venta en mostrador</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-tinta-suave">
          Un toque descuenta una unidad. Sirve para que el stock de la web
          refleje también lo que se vende en el local.
        </p>
      </header>

      <div className="mt-5 rounded-sm border border-borde bg-crema-profundo px-4 py-3">
        <p className="text-xs leading-relaxed text-tinta-suave">
          <strong className="font-medium text-tinta">
            Esta pantalla es provisoria.
          </strong>{" "}
          El día que conectemos el sistema del mostrador, estas bajas van a
          entrar solas y no vas a tener que tocar nada acá.
        </p>
      </div>

      <GrillaMostrador productos={productos} />
    </div>
  );
}
