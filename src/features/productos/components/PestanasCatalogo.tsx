import Link from "next/link";

type PaginaCatalogo = "instrumentos" | "accesorios";

type PestanasCatalogoProps = {
  actual: PaginaCatalogo;
};

const PAGINAS: { id: PaginaCatalogo; texto: string; href: string }[] = [
  { id: "instrumentos", texto: "Instrumentos", href: "/instrumentos" },
  { id: "accesorios", texto: "Accesorios", href: "/accesorios" },
];

// Pestañas para pasar entre catálogos sin abrir el menú; se ven en todos los tamaños de pantalla
export default function PestanasCatalogo({ actual }: PestanasCatalogoProps) {
  return (
    <nav aria-label="Catálogos" className="mb-8 flex border-b border-linea">
      {PAGINAS.map((pagina) => {
        const seleccionada = pagina.id === actual;
        return (
          <Link
            key={pagina.id}
            href={pagina.href}
            aria-current={seleccionada ? "page" : undefined}
            className={`-mb-px flex-1 border-b-[3px] px-5 py-3 text-center text-[0.68rem] uppercase tracking-[0.13em] transition-colors duration-[180ms] sm:flex-none ${
              seleccionada
                ? "border-rojo-brillante text-marfil"
                : "border-transparent text-gris hover:text-marfil focus-visible:text-marfil"
            }`}
          >
            {pagina.texto}
          </Link>
        );
      })}
    </nav>
  );
}
