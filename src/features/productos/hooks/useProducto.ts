"use client";

import { useEffect, useState } from "react";
import type { Producto } from "../domain/producto";
import { obtener } from "../services/productosService";

type Resultado = {
  id: number;
  producto: Producto | null;
};

// Carga un producto por id; con id null no pide nada
export function useProducto(id: number | null) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    if (id === null) return;
    let activo = true;

    obtener(id)
      .then((producto) => {
        if (activo) setResultado({ id, producto });
      })
      .catch(() => {
        // Si no existe, simplemente no se muestra
        if (activo) setResultado({ id, producto: null });
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const loading = id !== null && resultado?.id !== id;

  return {
    loading,
    producto: loading || id === null ? null : (resultado?.producto ?? null),
  };
}
