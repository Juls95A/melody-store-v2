import type { Metadata } from "next";
import { Suspense } from "react";
import SectionTitle from "@/features/common/components/SectionTitle";
import PedidoContacto from "@/features/solicitudes/components/PedidoContacto";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <SectionTitle>Contacto</SectionTitle>
      <p className="max-w-[620px] text-[0.73rem] text-gris">
        ¿Tienes dudas sobre algún instrumento o quieres hacer un pedido especial? Escríbenos.
      </p>
      {/* useSearchParams (?producto=) necesita un límite de Suspense */}
      <Suspense fallback={<p className="mt-6 text-[0.73rem] text-gris">Cargando...</p>}>
        <PedidoContacto />
      </Suspense>
    </section>
  );
}
