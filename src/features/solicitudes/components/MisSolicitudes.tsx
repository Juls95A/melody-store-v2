"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Button from "@/features/common/components/Button";
import Pagination from "@/features/common/components/Pagination";
import { useMisSolicitudes } from "../hooks/useMisSolicitudes";
import SolicitudCard from "./SolicitudCard";

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";

function ListaSolicitudes() {
  const [pagina, setPagina] = useState(1);
  const { loading, data, error, reintentar, eliminar } = useMisSolicitudes(pagina);

  if (loading) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando tus solicitudes...
      </p>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-6 flex flex-col gap-4" role="alert">
        <p className="text-[0.73rem] text-error">{error ?? "No se pudieron cargar tus solicitudes."}</p>
        <Button onClick={reintentar}>Reintentar</Button>
      </div>
    );
  }

  if (data.data.length === 0) {
    // Página vacía (por ejemplo, si se borraron pedidos desde otra pestaña)
    if (pagina > 1) {
      return (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-[0.73rem] text-gris">No hay más pedidos en esta página.</p>
          <Button variante="secundario" onClick={() => setPagina(pagina - 1)}>
            Volver a la página anterior
          </Button>
        </div>
      );
    }
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p className="text-[0.73rem] text-gris">Todavía no has hecho ningún pedido.</p>
        <Button href="/instrumentos">Ver instrumentos</Button>
      </div>
    );
  }

  const quedaUno = data.data.length === 1;

  async function eliminarYAjustar(id: number) {
    await eliminar(id);
    // Al borrar el último pedido de la página, se pasa a la anterior
    if (quedaUno && pagina > 1) setPagina(pagina - 1);
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-[0.7rem]">
        {data.data.map((solicitud) => (
          <SolicitudCard key={solicitud.id} solicitud={solicitud} onEliminar={eliminarYAjustar} />
        ))}
      </div>
      <Pagination pagina={data.pagination.page} totalPaginas={data.pagination.totalPages} onCambiar={setPagina} />
    </>
  );
}

export default function MisSolicitudes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando...
      </p>
    );
  }

  // La protección real de la ruta llega en F5; mientras tanto no se pide nada sin sesión
  if (!user) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p className="text-[0.73rem] text-gris">Inicia sesión para ver tus solicitudes.</p>
        <Button href="/login">Ingresar</Button>
      </div>
    );
  }

  return <ListaSolicitudes />;
}
