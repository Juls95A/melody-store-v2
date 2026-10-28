"use client";

import { useEffect, useState } from "react";
import type { Paginado } from "@/features/productos/domain/producto";
import type { Solicitud } from "../domain/solicitud";
import { eliminar as eliminarSolicitud, mias } from "../services/solicitudesService";

type Resultado = {
  clave: string;
  data: Paginado<Solicitud> | null;
  error: string | null;
};

export function useMisSolicitudes(page: number, limit?: number) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Identifica la petición actual: si cambia, lo que hay guardado es de otra página
  const clave = JSON.stringify([page, limit, intento]);

  useEffect(() => {
    let activo = true;

    mias({ page, limit })
      .then((data) => {
        if (activo) setResultado({ clave, data, error: null });
      })
      .catch((error: unknown) => {
        const mensaje = error instanceof Error ? error.message : "No se pudieron cargar tus solicitudes.";
        if (activo) setResultado({ clave, data: null, error: mensaje });
      });

    return () => {
      activo = false;
    };
  }, [clave, page, limit]);

  const loading = resultado?.clave !== clave;
  const reintentar = () => setIntento((actual) => actual + 1);

  // Borra y vuelve a pedir la página para que el total y la paginación queden al día
  async function eliminar(id: number): Promise<void> {
    await eliminarSolicitud(id);
    reintentar();
  }

  return {
    loading,
    data: loading ? null : (resultado?.data ?? null),
    error: loading ? null : (resultado?.error ?? null),
    reintentar,
    eliminar,
  };
}
