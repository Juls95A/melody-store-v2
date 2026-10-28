"use client";

import { useState } from "react";
import type { CrearSolicitudRequest, Solicitud } from "../domain/solicitud";
import { crear as crearSolicitud } from "../services/solicitudesService";

// Envía el pedido; los errores se lanzan para que el formulario los ubique debajo de cada campo
export function useCrearSolicitud() {
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState<Solicitud | null>(null);

  async function crear(datos: CrearSolicitudRequest): Promise<Solicitud> {
    setEnviando(true);
    try {
      const solicitud = await crearSolicitud(datos);
      setCreada(solicitud);
      return solicitud;
    } finally {
      setEnviando(false);
    }
  }

  return {
    crear,
    enviando,
    creada,
    reiniciar: () => setCreada(null),
  };
}
