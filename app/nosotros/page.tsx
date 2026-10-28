import type { Metadata } from "next";
import SectionTitle from "@/features/common/components/SectionTitle";

export const metadata: Metadata = {
  title: "Nosotros",
};

export default function NosotrosPage() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <SectionTitle>Nosotros</SectionTitle>
      <div className="max-w-[620px] space-y-[1em] text-[0.73rem] text-gris">
        <p>
          Melody Store nació de la idea de acercar instrumentos de buena calidad a músicos reales: estudiantes que
          están dando sus primeros pasos, bandas que ensayan cada semana y profesionales que buscan renovar su equipo.
        </p>
        <p>
          Trabajamos con marcas confiables y ofrecemos asesoría para que cada persona encuentre el instrumento
          adecuado para su nivel y su estilo.
        </p>
      </div>
    </section>
  );
}
