"use client";

import { useEffect, useState } from "react";
import type { ConsultaProductos, Paginado, Producto } from "../domain/producto";
import { listar } from "../services/productosService";

type Resultado = {
  clave: string;
  data: Paginado<Producto> | null;
  error: string | null;
};

export function useProductos(filtros: ConsultaProductos) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const { page, limit, categoria, q, precioMin, precioMax } = filtros;
  // Identifica la petición actual: si cambia, lo que hay guardado es de otra búsqueda
  const clave = JSON.stringify([page, limit, categoria, q, precioMin, precioMax, intento]);

  useEffect(() => {
    let activo = true;

    listar({ page, limit, categoria, q, precioMin, precioMax })
      .then((data) => {
        if (activo) setResultado({ clave, data, error: null });
      })
      .catch((error: unknown) => {
        const mensaje = error instanceof Error ? error.message : "No se pudieron cargar los productos.";
        if (activo) setResultado({ clave, data: null, error: mensaje });
      });

    return () => {
      activo = false;
    };
  }, [clave, page, limit, categoria, q, precioMin, precioMax]);

  const loading = resultado?.clave !== clave;

  return {
    loading,
    data: loading ? null : (resultado?.data ?? null),
    error: loading ? null : (resultado?.error ?? null),
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
