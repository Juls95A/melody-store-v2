import type { Metadata } from "next";
import { Suspense } from "react";
import SectionTitle from "@/features/common/components/SectionTitle";
import Catalogo from "@/features/productos/components/Catalogo";

export const metadata: Metadata = {
  title: "Accesorios",
};

export default function AccesoriosPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <SectionTitle>Accesorios</SectionTitle>
      <p className="max-w-[620px] text-[0.73rem] text-gris">
        Todo lo que necesitas para mantener y complementar tus instrumentos.
      </p>
      <Suspense fallback={<p className="mt-8 text-[0.73rem] text-gris">Cargando productos...</p>}>
        <Catalogo categorias={["accesorios"]} />
      </Suspense>
    </section>
  );
}
