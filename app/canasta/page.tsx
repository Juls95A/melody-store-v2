import type { Metadata } from "next";
import SectionTitle from "@/features/common/components/SectionTitle";
import Canasta from "@/features/solicitudes/components/Canasta";

export const metadata: Metadata = {
  title: "Canasta",
};

export default function CanastaPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <SectionTitle>Canasta</SectionTitle>
      <p className="max-w-[620px] text-[0.73rem] text-gris">
        Revisa los productos que elegiste, ajusta las cantidades y finaliza tu pedido.
      </p>
      <Canasta />
    </section>
  );
}
