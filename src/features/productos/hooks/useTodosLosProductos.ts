"use client";

import { useEffect, useState } from "react";
import type { Producto } from "../domain/producto";
import { listar } from "../services/productosService";

type Resultado = {
  intento: number;
  productos: Producto[];
  error: string | null;
};

// El backend permite como máximo 50 por página
const POR_PAGINA = 50;

// Recorre todas las páginas del catálogo (para llenar selects)
async function cargarTodos(): Promise<Producto[]> {
  const primera = await listar({ page: 1, limit: POR_PAGINA });
  const productos = [...primera.data];
  for (let page = 2; page <= primera.pagination.totalPages; page++) {
    const siguiente = await listar({ page, limit: POR_PAGINA });
    productos.push(...siguiente.data);
  }
  return productos;
}

export function useTodosLosProductos() {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let activo = true;

    cargarTodos()
      .then((productos) => {
        if (activo) setResultado({ intento, productos, error: null });
      })
      .catch((error: unknown) => {
        const mensaje = error instanceof Error ? error.message : "No se pudieron cargar los productos.";
        if (activo) setResultado({ intento, productos: [], error: mensaje });
      });

    return () => {
      activo = false;
    };
  }, [intento]);

  const loading = resultado?.intento !== intento;

  return {
    loading,
    productos: loading ? [] : (resultado?.productos ?? []),
    error: loading ? null : (resultado?.error ?? null),
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
