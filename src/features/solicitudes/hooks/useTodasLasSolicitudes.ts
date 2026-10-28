"use client";

import { useEffect, useState } from "react";
import type { Paginado } from "@/features/productos/domain/producto";
import type { EstadoSolicitud, Solicitud } from "../domain/solicitud";
import { actualizarEstado as actualizarEstadoSolicitud, todas } from "../services/solicitudesService";

type Resultado = {
  clave: string;
  data: Paginado<Solicitud> | null;
  error: string | null;
};

// Todas las solicitudes (solo admin)
export function useTodasLasSolicitudes(page: number, limit?: number) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Identifica la petición actual: si cambia, lo que hay guardado es de otra página
  const clave = JSON.stringify([page, limit, intento]);

  useEffect(() => {
    let activo = true;

    todas({ page, limit })
      .then((data) => {
        if (activo) setResultado({ clave, data, error: null });
      })
      .catch((error: unknown) => {
        const mensaje = error instanceof Error ? error.message : "No se pudieron cargar las solicitudes.";
        if (activo) setResultado({ clave, data: null, error: mensaje });
      });

    return () => {
      activo = false;
    };
  }, [clave, page, limit]);

  const loading = resultado?.clave !== clave;

  // Reemplaza la solicitud en la lista con lo que devuelve el backend, sin volver a pedir la página
  async function actualizarEstado(id: number, estado: EstadoSolicitud): Promise<void> {
    const actualizada = await actualizarEstadoSolicitud(id, estado);
    setResultado((actual) => {
      if (!actual?.data) return actual;
      const data = actual.data.data.map((solicitud) => (solicitud.id === id ? actualizada : solicitud));
      return { ...actual, data: { ...actual.data, data } };
    });
  }

  return {
    loading,
    data: loading ? null : (resultado?.data ?? null),
    error: loading ? null : (resultado?.error ?? null),
    reintentar: () => setIntento((actual) => actual + 1),
    actualizarEstado,
  };
}
