"use client";

import type { Categoria } from "../domain/producto";
import { useFiltrosUrl } from "../hooks/useFiltrosUrl";
import FiltrosProductos from "./FiltrosProductos";
import ListadoProductos from "./ListadoProductos";

type CatalogoProps = {
  // Categorías que muestra la página; con una sola no hay botones de categoría
  categorias: Categoria[];
};

const POR_PAGINA = 4;

export default function Catalogo({ categorias }: CatalogoProps) {
  const { filtros, navegar } = useFiltrosUrl(categorias);

  // En "Todos" se piden todas las categorías de la página separadas por coma
  const categoria = filtros.categoria ?? categorias.join(",");

  return (
    <>
      <FiltrosProductos categorias={categorias} filtros={filtros} onCambiar={navegar} />
      <ListadoProductos
        filtros={{ ...filtros, categoria, limit: POR_PAGINA }}
        onCambiarPagina={(page) => navegar({ ...filtros, page })}
      />
    </>
  );
}
