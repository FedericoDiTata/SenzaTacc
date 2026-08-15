import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CarritoDrawer } from "@/components/layout/CarritoDrawer";

/** Cascarón del sitio público: navegación, carrito y pie. */
export default function SitioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <CarritoDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
