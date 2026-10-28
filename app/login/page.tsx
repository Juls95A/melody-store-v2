import type { Metadata } from "next";
import SectionTitle from "@/features/common/components/SectionTitle";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <div className="mx-auto max-w-[440px]">
        <SectionTitle>Ingresar</SectionTitle>
        <p className="mb-8 text-[0.73rem] text-gris">Entra a tu cuenta para seguir tus solicitudes.</p>
        <div className="border border-linea bg-carbon/70 p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
