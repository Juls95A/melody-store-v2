import type { Metadata } from "next";
import { Suspense } from "react";
import SectionTitle from "@/features/common/components/SectionTitle";
import Catalogo from "@/features/productos/components/Catalogo";
import PestanasCatalogo from "@/features/productos/components/PestanasCatalogo";
import { CATEGORIAS_INSTRUMENTOS } from "@/features/productos/domain/producto";

export const metadata: Metadata = {
  title: "Instrumentos",
};

export default function InstrumentosPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <PestanasCatalogo actual="instrumentos" />
      <SectionTitle>Instrumentos</SectionTitle>
      <p className="max-w-[620px] text-[0.73rem] text-gris">Explora nuestro catálogo de instrumentos musicales.</p>
      <Suspense fallback={<p className="mt-8 text-[0.73rem] text-gris">Cargando productos...</p>}>
        <Catalogo categorias={CATEGORIAS_INSTRUMENTOS} />
      </Suspense>
    </section>
  );
}
