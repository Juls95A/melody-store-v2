import Button from "@/features/common/components/Button";
import SectionTitle from "@/features/common/components/SectionTitle";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[590px] flex-col justify-center overflow-hidden bg-hero px-4 py-20 sm:min-h-[620px] sm:px-5 md:min-h-[670px] md:py-28">
        <div className="mx-auto w-full max-w-[1180px]">
          <span className="mb-6 block max-w-[82%] text-[0.65rem] tracking-[0.18em] text-rojo-brillante uppercase md:max-w-none">
            Melody Store / Instrumentos musicales
          </span>
          <h1 className="mb-6 max-w-full font-cormorant text-[2.7rem] leading-[0.93] font-semibold tracking-[-0.02em] uppercase sm:max-w-[82%] sm:text-[clamp(2.8rem,5.2vw,4.8rem)] md:max-w-[560px]">
            Encuentra el instrumento que va a acompañar tu música
          </h1>
          <p className="mb-10 max-w-[82%] text-[0.74rem] leading-[1.8] text-marfil-suave md:max-w-[485px]">
            En Melody Store reunimos guitarras, bajos, teclados, baterías e instrumentos de viento para músicos de
            todos los niveles, desde quienes empiezan hasta quienes tocan en escenarios grandes.
          </p>
          <Button href="/instrumentos">Explorar instrumentos</Button>
        </div>
      </section>

      <section className="mx-auto grid w-[min(100%-1.5rem,1180px)] grid-cols-1 gap-8 border-y border-linea py-[6.5rem] sm:w-[min(100%-2.5rem,1180px)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        <div>
          <span className="mb-6 block text-[0.65rem] tracking-[0.18em] text-rojo-brillante uppercase">
            La música empieza aquí
          </span>
          <SectionTitle className="max-w-[460px]">Todo lo que necesitas para encontrar tu sonido</SectionTitle>
        </div>
        <div className="max-w-[560px] self-end text-[0.78rem] text-gris">
          <p className="mb-4">
            En Melody Store reunimos instrumentos y accesorios para estudiantes, bandas y músicos que quieren seguir
            creciendo. Te ayudamos a elegir según tu nivel, tu estilo y la forma en que quieres tocar.
          </p>
          <p className="mb-4">
            Explora el catálogo, conoce nuestra historia o escríbenos para recibir asesoría antes de comprar.
          </p>
          <div className="mt-[1.8rem] flex flex-wrap gap-4">
            <Button href="/instrumentos">Ver instrumentos</Button>
            <Button href="/contacto" variante="secundario">
              Pedir asesoría
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
