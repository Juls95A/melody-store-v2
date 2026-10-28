import Image from "next/image";
import { IMAGENES_CATEGORIA, NOMBRES_CATEGORIA, type Categoria } from "../domain/producto";

type CategoriasDestacadasProps = {
  categorias: Categoria[];
  activa?: Categoria;
  onElegir: (categoria: Categoria) => void;
};

// Tarjetas de categoría de instrumentos.html; al hacer clic filtran el catálogo (?categoria=...)
export default function CategoriasDestacadas({ categorias, activa, onElegir }: CategoriasDestacadasProps) {
  const tarjetas = categorias.flatMap((categoria) => {
    const imagen = IMAGENES_CATEGORIA[categoria];
    return imagen ? [{ categoria, imagen }] : [];
  });
  if (tarjetas.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-1 gap-px bg-linea md:grid-cols-2">
      {tarjetas.map(({ categoria, imagen }) => {
        const seleccionada = activa === categoria;
        return (
          <article
            key={categoria}
            id={categoria}
            className={`group relative min-w-0 bg-carbon p-5 transition-colors duration-[180ms] hover:bg-tarjeta focus-within:bg-tarjeta ${
              seleccionada ? "shadow-[inset_0_3px_0_var(--color-rojo-brillante)]" : ""
            }`}
          >
            <h3 className="mb-[0.85rem] font-playfair text-[1.35rem] font-medium">
              {/* El botón se estira sobre toda la tarjeta (after:inset-0) para que cualquier parte sea clicable */}
              <button
                type="button"
                aria-pressed={seleccionada}
                onClick={() => onElegir(categoria)}
                className={`text-left transition-colors duration-[180ms] after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-marfil ${
                  seleccionada ? "text-rojo-brillante" : "text-marfil group-hover:text-rojo-brillante"
                }`}
              >
                {NOMBRES_CATEGORIA[categoria]}
              </button>
            </h3>
            <Image
              src={imagen.src}
              alt={imagen.alt}
              width={800}
              height={400}
              sizes="(min-width: 721px) 50vw, 100vw"
              className="block aspect-[16/8] w-full border border-marfil/12 bg-[#d5d1c9] object-cover contrast-[1.2] grayscale"
            />
          </article>
        );
      })}
    </div>
  );
}
