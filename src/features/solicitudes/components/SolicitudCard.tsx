"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/features/common/components/Button";
import { formatearPrecio } from "@/features/productos/domain/producto";
import { formatearFecha, NOMBRES_ESTADO, NOMBRES_METODO_PAGO, type EstadoSolicitud, type Solicitud } from "../domain/solicitud";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onEliminar: (id: number) => Promise<void>;
};

const estilosEstado: Record<EstadoSolicitud, string> = {
  pendiente: "border-marfil text-marfil",
  atendida: "border-exito-borde bg-exito-fondo text-exito",
  cancelada: "border-rojo text-precio",
};

export default function SolicitudCard({ solicitud, onEliminar }: SolicitudCardProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const { producto } = solicitud;
  const tituloId = `solicitud-${solicitud.id}`;

  async function eliminar() {
    setEliminando(true);
    setError("");
    try {
      await onEliminar(solicitud.id);
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo eliminar el pedido.");
      setEliminando(false);
      setConfirmando(false);
    }
  }

  const datos = [
    { termino: "Cantidad", valor: String(solicitud.cantidad) },
    { termino: "Total", valor: formatearPrecio(producto.precio * solicitud.cantidad) },
    { termino: "Dirección", valor: solicitud.direccionEnvio },
    { termino: "Ciudad", valor: solicitud.ciudad },
    { termino: "Método de pago", valor: NOMBRES_METODO_PAGO[solicitud.metodoPago] },
    { termino: "Fecha", valor: formatearFecha(solicitud.createdAt) },
  ];

  return (
    <article
      aria-labelledby={tituloId}
      className="grid gap-4 border border-linea bg-tarjeta p-4 sm:grid-cols-[140px_1fr] sm:gap-6 sm:p-5"
    >
      {/* unoptimized: la imagen puede venir de cualquier URL guardada en el backend */}
      <Image
        src={producto.imagen}
        alt={producto.nombre}
        width={280}
        height={210}
        unoptimized
        className="block aspect-[4/3] w-full object-cover contrast-[1.2] grayscale"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 id={tituloId} className="font-playfair text-[1.05rem] leading-[1.25] font-medium text-marfil">
            {producto.nombre}
          </h3>
          <span
            className={`border px-[0.6rem] py-[0.2rem] text-[0.6rem] uppercase tracking-[0.12em] ${estilosEstado[solicitud.estado]}`}
          >
            {NOMBRES_ESTADO[solicitud.estado]}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
          {datos.map(({ termino, valor }) => (
            <div key={termino} className="min-w-0">
              <dt className="text-[0.6rem] uppercase tracking-[0.1em] text-gris-oscuro">{termino}</dt>
              <dd className={`text-[0.7rem] break-words ${termino === "Total" ? "font-bold text-precio" : "text-marfil-suave"}`}>
                {valor}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border-t border-linea pt-3">
          {confirmando ? (
            <div role="group" aria-label="Confirmar eliminación" className="flex flex-wrap items-center gap-4">
              <p className="text-[0.68rem] text-marfil">¿Eliminar este pedido? No se puede deshacer.</p>
              <Button disabled={eliminando} onClick={eliminar}>
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </Button>
              <Button variante="secundario" disabled={eliminando} onClick={() => setConfirmando(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variante="secundario" onClick={() => setConfirmando(true)}>
              Eliminar
            </Button>
          )}
          {error && (
            <p className="mt-2 text-[0.65rem] text-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
