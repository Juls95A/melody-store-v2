import Image from "next/image";
import { ENCABEZADOS_CATEGORIA, NOMBRES_CATEGORIA, type Categoria } from "../domain/producto";

type CategoriaEncabezadoProps = {
  categoria: Categoria;
};

// Encabezado de cada grupo del catálogo, como las tarjetas .categoria de instrumentos.html
export default function CategoriaEncabezado({ categoria }: CategoriaEncabezadoProps) {
  const encabezado = ENCABEZADOS_CATEGORIA[categoria];
  if (!encabezado) return null;

  return (
    <header className="grid grid-cols-1 items-center gap-5 border border-linea bg-carbon p-5 md:grid-cols-2">
      <div className="min-w-0">
        <h3 className="mb-[0.85rem] font-playfair text-[1.35rem] font-medium text-marfil">
          {NOMBRES_CATEGORIA[categoria]}
        </h3>
        <p className="text-[0.73rem] text-gris">{encabezado.texto}</p>
      </div>
      <Image
        src={encabezado.src}
        alt={encabezado.alt}
        width={800}
        height={400}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="block aspect-[16/8] w-full border border-marfil/12 bg-[#d5d1c9] object-cover contrast-[1.2] grayscale"
      />
    </header>
  );
}
