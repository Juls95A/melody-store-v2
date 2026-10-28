"use client";

import Button from "@/features/common/components/Button";
import Pagination from "@/features/common/components/Pagination";
import { NOMBRES_CATEGORIA, type Categoria, type ConsultaProductos } from "../domain/producto";
import { useProductos } from "../hooks/useProductos";
import CategoriaEncabezado from "./CategoriaEncabezado";
import ProductoGrid from "./ProductoGrid";

type ListadoProductosProps = {
  // Orden en que se agrupan los productos de cada página
  categorias: Categoria[];
  filtros: ConsultaProductos;
  onCambiarPagina: (pagina: number) => void;
};

const estiloMensaje = "mt-4 text-[0.73rem] text-gris";

export default function ListadoProductos({ categorias, filtros, onCambiarPagina }: ListadoProductosProps) {
  const { loading, data, error, reintentar } = useProductos(filtros);

  if (loading) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando productos...
      </p>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-4 flex flex-col gap-4" role="alert">
        <p className="text-[0.73rem] text-error">{error ?? "No se pudieron cargar los productos."}</p>
        <Button onClick={reintentar}>Reintentar</Button>
      </div>
    );
  }

  if (data.data.length === 0) {
    return <p className={estiloMensaje}>No hay productos con estos filtros</p>;
  }

  // Los productos de la página se agrupan por categoría; las que no tienen productos aquí no se muestran
  const grupos = categorias.flatMap((categoria) => {
    const productos = data.data.filter((producto) => producto.categoria === categoria);
    return productos.length > 0 ? [{ categoria, productos }] : [];
  });

  return (
    <>
      {grupos.map(({ categoria, productos }) => (
        <section key={categoria} id={categoria} aria-label={NOMBRES_CATEGORIA[categoria]} className="mt-8 first:mt-4">
          <CategoriaEncabezado categoria={categoria} />
          <ProductoGrid productos={productos} />
        </section>
      ))}
      <Pagination
        pagina={data.pagination.page}
        totalPaginas={data.pagination.totalPages}
        onCambiar={onCambiarPagina}
      />
    </>
  );
}
