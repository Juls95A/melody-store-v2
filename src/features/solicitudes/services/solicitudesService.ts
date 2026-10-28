import { request } from "@/features/common/http";
import type { Paginado } from "@/features/productos/domain/producto";
import type { CrearSolicitudRequest, EstadoSolicitud, Solicitud } from "../domain/solicitud";

const RUTA = "/api/solicitudes";

type Paginacion = {
  page?: number;
  limit?: number;
};

function crearQuery({ page, limit }: Paginacion): string {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function crear(datos: CrearSolicitudRequest): Promise<Solicitud> {
  return request<Solicitud>(RUTA, { method: "POST", body: datos });
}

// Solicitudes del usuario de la sesión
export function mias(paginacion: Paginacion = {}): Promise<Paginado<Solicitud>> {
  return request<Paginado<Solicitud>>(`${RUTA}/mias${crearQuery(paginacion)}`);
}

// Todas las solicitudes (solo admin)
export function todas(paginacion: Paginacion = {}): Promise<Paginado<Solicitud>> {
  return request<Paginado<Solicitud>>(`${RUTA}${crearQuery(paginacion)}`);
}

export function actualizarEstado(id: number, estado: EstadoSolicitud): Promise<Solicitud> {
  return request<Solicitud>(`${RUTA}/${id}`, { method: "PUT", body: { estado } });
}

export function eliminar(id: number): Promise<void> {
  return request<void>(`${RUTA}/${id}`, { method: "DELETE" });
}
