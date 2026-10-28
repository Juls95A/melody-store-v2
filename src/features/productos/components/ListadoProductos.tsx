"use client";

import Button from "@/features/common/components/Button";
import Pagination from "@/features/common/components/Pagination";
import type { ConsultaProductos } from "../domain/producto";
import { useProductos } from "../hooks/useProductos";
import ProductoGrid from "./ProductoGrid";

type ListadoProductosProps = {
  filtros: ConsultaProductos;
  onCambiarPagina: (pagina: number) => void;
};

const estiloMensaje = "mt-4 text-[0.73rem] text-gris";

export default function ListadoProductos({ filtros, onCambiarPagina }: ListadoProductosProps) {
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

  return (
    <>
      <ProductoGrid productos={data.data} />
      <Pagination
        pagina={data.pagination.page}
        totalPaginas={data.pagination.totalPages}
        onCambiar={onCambiarPagina}
      />
    </>
  );
}
