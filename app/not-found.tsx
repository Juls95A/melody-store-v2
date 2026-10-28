import Button from "@/features/common/components/Button";
import SectionTitle from "@/features/common/components/SectionTitle";

export default function NotFound() {
  return (
    <section className="mx-auto w-[min(100%-1.5rem,1180px)] py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)]">
      <span className="mb-6 block text-[0.65rem] tracking-[0.18em] text-rojo-brillante uppercase">Error 404</span>
      <SectionTitle>Esta página no existe</SectionTitle>
      <p className="mt-4 mb-10 max-w-[620px] text-[0.73rem] text-gris">
        Parece que esta nota se salió de la partitura. La página que buscas no está disponible o cambió de lugar.
      </p>
      <Button href="/">Volver al inicio</Button>
    </section>
  );
}
