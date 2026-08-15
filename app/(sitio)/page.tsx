import { Hero } from "@/components/home/Hero";
import { Propuesta } from "@/components/home/Propuesta";
import { Destacados } from "@/components/home/Destacados";
import { ElLocal } from "@/components/home/ElLocal";
import { Ubicacion } from "@/components/home/Ubicacion";
import { datos } from "@/lib/data";

export default async function Home() {
  const productos = await datos.listarProductos();
  const destacados = productos.filter((p) => p.destacado).slice(0, 8);

  return (
    <>
      <Hero />
      <Propuesta />
      <Destacados productos={destacados} />
      <ElLocal />
      <Ubicacion />
    </>
  );
}
