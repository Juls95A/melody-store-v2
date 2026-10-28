"use client";

import Image from "next/image";
import { useState } from "react";
import Select from "@/features/common/components/Select";
import { formatearPrecio } from "@/features/productos/domain/producto";
import {
  ESTADOS_SOLICITUD,
  esEstadoSolicitud,
  formatearFecha,
  NOMBRES_ESTADO,
  NOMBRES_METODO_PAGO,
  type EstadoSolicitud,
  type Solicitud,
} from "../domain/solicitud";

type SolicitudAdminCardProps = {
  solicitud: Solicitud;
  onCambiarEstado: (id: number, estado: EstadoSolicitud) => Promise<void>;
};

const opcionesEstado = ESTADOS_SOLICITUD.map((estado) => ({ value: estado, label: NOMBRES_ESTADO[estado] }));

export default function SolicitudAdminCard({ solicitud, onCambiarEstado }: SolicitudAdminCardProps) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const { producto, user } = solicitud;
  const tituloId = `solicitud-admin-${solicitud.id}`;

  async function cambiarEstado(valor: string) {
    if (!esEstadoSolicitud(valor) || valor === solicitud.estado) return;
    setGuardando(true);
    setError("");
    try {
      await onCambiarEstado(solicitud.id, valor);
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : "No se pudo cambiar el estado.");
    } finally {
      setGuardando(false);
    }
  }

  const datos = [
    { termino: "Cliente", valor: `${user.nombre} · ${user.email}` },
    { termino: "Teléfono", valor: solicitud.telefono },
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
      className="grid gap-4 border border-linea bg-tarjeta p-4 sm:grid-cols-[120px_1fr] sm:gap-6 sm:p-5 lg:grid-cols-[120px_1fr_200px]"
    >
      {/* unoptimized: la imagen puede venir de cualquier URL guardada en el backend */}
      <Image
        src={producto.imagen}
        alt={producto.nombre}
        width={240}
        height={180}
        unoptimized
        className="block aspect-[4/3] w-full object-cover contrast-[1.2] grayscale"
      />

      <div className="min-w-0">
        <h3 id={tituloId} className="font-playfair text-[1.05rem] leading-[1.25] font-medium text-marfil">
          {producto.nombre}
        </h3>
        <p className="mt-1 text-[0.65rem] text-gris">{solicitud.asunto}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
          {datos.map(({ termino, valor }) => (
            <div key={termino} className={`min-w-0 ${termino === "Cliente" ? "col-span-2 md:col-span-3" : ""}`}>
              <dt className="text-[0.6rem] uppercase tracking-[0.1em] text-gris-oscuro">{termino}</dt>
              <dd className={`text-[0.7rem] break-words ${termino === "Total" ? "font-bold text-precio" : "text-marfil-suave"}`}>
                {valor}
              </dd>
            </div>
          ))}
        </dl>
        {solicitud.mensaje && (
          <p className="mt-3 border-l-2 border-linea pl-3 text-[0.68rem] text-gris">{solicitud.mensaje}</p>
        )}
      </div>

      <div className="sm:col-start-2 lg:col-start-auto">
        <Select
          id={`estado-${solicitud.id}`}
          label={guardando ? "Guardando..." : "Estado"}
          opciones={opcionesEstado}
          value={solicitud.estado}
          disabled={guardando}
          error={error}
          onChange={(evento) => cambiarEstado(evento.target.value)}
        />
      </div>
    </article>
  );
}
