"use client";

import { useState } from "react";
import Button from "@/features/common/components/Button";
import Pagination from "@/features/common/components/Pagination";
import { useTodasLasSolicitudes } from "../hooks/useTodasLasSolicitudes";
import SolicitudAdminCard from "./SolicitudAdminCard";

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";

export default function AdminSolicitudes() {
  const [pagina, setPagina] = useState(1);
  const { loading, data, error, reintentar, actualizarEstado } = useTodasLasSolicitudes(pagina);

  if (loading) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando solicitudes...
      </p>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-6 flex flex-col gap-4" role="alert">
        <p className="text-[0.73rem] text-error">{error ?? "No se pudieron cargar las solicitudes."}</p>
        <Button onClick={reintentar}>Reintentar</Button>
      </div>
    );
  }

  if (data.data.length === 0) {
    return <p className={estiloMensaje}>Todavía no hay pedidos.</p>;
  }

  return (
    <>
      <p className="text-[0.73rem] text-gris">{data.pagination.total} pedidos en total</p>
      <div className="mt-6 flex flex-col gap-[0.7rem]">
        {data.data.map((solicitud) => (
          <SolicitudAdminCard key={solicitud.id} solicitud={solicitud} onCambiarEstado={actualizarEstado} />
        ))}
      </div>
      <Pagination pagina={data.pagination.page} totalPaginas={data.pagination.totalPages} onCambiar={setPagina} />
    </>
  );
}
