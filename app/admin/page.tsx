import type { Metadata } from "next";
import PanelAdmin from "@/features/admin/components/PanelAdmin";
import RutaProtegida from "@/features/auth/components/RutaProtegida";
import SectionTitle from "@/features/common/components/SectionTitle";

export const metadata: Metadata = {
  title: "Administración",
};

export default function AdminPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <RutaProtegida soloAdmin>
        <SectionTitle>Administración</SectionTitle>
        <p className="max-w-[620px] text-[0.73rem] text-gris">Gestiona el catálogo y los pedidos de Melody Store.</p>
        <PanelAdmin />
      </RutaProtegida>
    </section>
  );
}
