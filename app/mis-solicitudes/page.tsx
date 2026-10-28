import type { Metadata } from "next";
import SectionTitle from "@/features/common/components/SectionTitle";
import MisSolicitudes from "@/features/solicitudes/components/MisSolicitudes";

export const metadata: Metadata = {
  title: "Mis solicitudes",
};

export default function MisSolicitudesPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <SectionTitle>Mis solicitudes</SectionTitle>
      <p className="max-w-[620px] text-[0.73rem] text-gris">Sigue el estado de los pedidos que nos has enviado.</p>
      <MisSolicitudes />
    </section>
  );
}
