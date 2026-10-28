type PaginationProps = {
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
};

const estiloBoton =
  "min-w-9 border border-linea px-[0.8rem] py-[0.55rem] text-[0.65rem] uppercase text-gris transition-colors duration-[180ms] hover:border-marfil hover:text-marfil focus-visible:border-marfil focus-visible:text-marfil disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-linea disabled:hover:text-gris";

const estiloActivo = "border-marfil bg-marfil text-negro hover:text-negro focus-visible:text-negro";

export default function Pagination({ pagina, totalPaginas, onCambiar }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 1);

  return (
    <nav aria-label="Paginación" className="mt-8 flex flex-wrap items-center gap-2">
      <button type="button" className={estiloBoton} disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </button>
      {paginas.map((numero) => (
        <button
          key={numero}
          type="button"
          className={`${estiloBoton} ${numero === pagina ? estiloActivo : ""}`}
          aria-current={numero === pagina ? "page" : undefined}
          onClick={() => onCambiar(numero)}
        >
          {numero}
        </button>
      ))}
      <button
        type="button"
        className={estiloBoton}
        disabled={pagina >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
