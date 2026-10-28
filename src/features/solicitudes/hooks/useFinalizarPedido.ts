"use client";

import { useState } from "react";
import { ApiError, type ErroresCampo } from "@/features/common/http";
import { aCrearSolicitud, type DatosEnvio, type ErroresEnvio } from "../domain/solicitud";
import { crear } from "../services/solicitudesService";
import { useCanasta } from "./useCanasta";

export type ResultadoPedido =
  | { ok: true; creados: number }
  | { ok: false; creados: number; mensaje: string; errores: ErroresEnvio };

// Crea una solicitud por cada producto de la canasta, una tras otra
export function useFinalizarPedido() {
  const { items, quitar, vaciar } = useCanasta();
  const [enviando, setEnviando] = useState(false);
  // Cantidad de pedidos creados en el último envío exitoso
  const [completado, setCompletado] = useState<number | null>(null);

  async function finalizar(envio: DatosEnvio): Promise<ResultadoPedido> {
    setEnviando(true);
    const pendientes = [...items];
    let creados = 0;
    try {
      for (const item of pendientes) {
        try {
          await crear(aCrearSolicitud(item, envio));
        } catch (error) {
          const causa = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
          const enviados =
            creados === 0
              ? ""
              : creados === 1
                ? " El producto anterior sí se pidió y se quitó de la canasta."
                : ` Los ${creados} productos anteriores sí se pidieron y se quitaron de la canasta.`;
          const campos: ErroresCampo = error instanceof ApiError ? error.errors : {};
          const { telefono, direccionEnvio, ciudad, metodoPago, mensaje } = campos;
          return {
            ok: false,
            creados,
            mensaje: `No se pudo enviar el pedido de ${item.nombre}: ${causa}${enviados}`,
            errores: { telefono, direccionEnvio, ciudad, metodoPago, mensaje },
          };
        }
        // Lo que ya se creó sale de la canasta para no pedirlo dos veces al reintentar
        quitar(item.productoId);
        creados += 1;
      }
      vaciar();
      setCompletado(creados);
      return { ok: true, creados };
    } finally {
      setEnviando(false);
    }
  }

  return {
    finalizar,
    enviando,
    completado,
    reiniciar: () => setCompletado(null),
  };
}
