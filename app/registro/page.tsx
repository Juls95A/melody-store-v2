import type { Metadata } from "next";
import SectionTitle from "@/features/common/components/SectionTitle";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Registro",
};

export default function RegistroPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <div className="mx-auto max-w-[440px]">
        <SectionTitle>Registro</SectionTitle>
        <p className="mb-8 text-[0.73rem] text-gris">Crea tu cuenta para enviar y seguir tus solicitudes.</p>
        <div className="border border-linea bg-carbon/70 p-6 sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
