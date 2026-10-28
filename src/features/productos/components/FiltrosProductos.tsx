"use client";

import type { FormEvent } from "react";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import { NOMBRES_CATEGORIA, type Categoria, type FiltrosProducto } from "../domain/producto";

type FiltrosProductosProps = {
  categorias: Categoria[];
  filtros: FiltrosProducto;
  onCambiar: (filtros: FiltrosProducto) => void;
};

const estiloFiltro =
  "border border-linea px-[0.8rem] py-[0.55rem] text-[0.65rem] uppercase text-gris transition-colors duration-[180ms] hover:border-marfil hover:bg-marfil hover:text-negro focus-visible:border-marfil focus-visible:bg-marfil focus-visible:text-negro";

const estiloActivo = "border-marfil bg-marfil text-negro";

function leerPrecio(valor: FormDataEntryValue | null): number | undefined {
  const texto = typeof valor === "string" ? valor.trim() : "";
  return texto === "" ? undefined : Number(texto);
}

export default function FiltrosProductos({ categorias, filtros, onCambiar }: FiltrosProductosProps) {
  // Al cambiar de filtro siempre se vuelve a la página 1
  function elegirCategoria(categoria?: Categoria) {
    onCambiar({ ...filtros, categoria, page: undefined });
  }

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const q = datos.get("q");
    onCambiar({
      categoria: filtros.categoria,
      q: typeof q === "string" ? q.trim() || undefined : undefined,
      precioMin: leerPrecio(datos.get("precioMin")),
      precioMax: leerPrecio(datos.get("precioMax")),
    });
  }

  return (
    <div className="my-[2.4rem] border-b border-linea pb-[1.2rem]">
      {categorias.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtros de productos">
          <button
            type="button"
            className={`${estiloFiltro} ${filtros.categoria ? "" : estiloActivo}`}
            aria-pressed={!filtros.categoria}
            onClick={() => elegirCategoria(undefined)}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={`${estiloFiltro} ${filtros.categoria === categoria ? estiloActivo : ""}`}
              aria-pressed={filtros.categoria === categoria}
              onClick={() => elegirCategoria(categoria)}
            >
              {NOMBRES_CATEGORIA[categoria]}
            </button>
          ))}
        </div>
      )}

      {/* key: si la URL cambia (ej: botón atrás) el formulario se reinicia con los valores nuevos */}
      <form
        key={`${filtros.q ?? ""}-${filtros.precioMin ?? ""}-${filtros.precioMax ?? ""}`}
        onSubmit={buscar}
        className="grid grid-cols-1 items-end gap-x-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        <Input id="q" name="q" label="Buscar" placeholder="Nombre del producto" defaultValue={filtros.q} />
        <Input
          id="precioMin"
          name="precioMin"
          label="Precio mínimo"
          type="number"
          min={0}
          step={1}
          defaultValue={filtros.precioMin}
        />
        <Input
          id="precioMax"
          name="precioMax"
          label="Precio máximo"
          type="number"
          min={0}
          step={1}
          defaultValue={filtros.precioMax}
        />
        <div className="mb-[1.4rem] flex items-center gap-4">
          <Button type="submit">Filtrar</Button>
          <Button variante="secundario" onClick={() => onCambiar({ categoria: filtros.categoria })}>
            Limpiar
          </Button>
        </div>
      </form>
    </div>
  );
}
