import { request } from "@/features/common/http";
import type { ConsultaProductos, DatosProducto, Paginado, Producto } from "../domain/producto";

const RUTA = "/api/productos";

// Arma ?page=1&categoria=... solo con los filtros que tienen valor
function crearQuery(filtros: ConsultaProductos): string {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor !== undefined && valor !== "") params.set(clave, String(valor));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function listar(filtros: ConsultaProductos = {}): Promise<Paginado<Producto>> {
  return request<Paginado<Producto>>(`${RUTA}${crearQuery(filtros)}`);
}

export function obtener(id: number): Promise<Producto> {
  return request<Producto>(`${RUTA}/${id}`);
}

export function crear(datos: DatosProducto): Promise<Producto> {
  return request<Producto>(RUTA, { method: "POST", body: datos });
}

export function actualizar(id: number, datos: Partial<DatosProducto>): Promise<Producto> {
  return request<Producto>(`${RUTA}/${id}`, { method: "PUT", body: datos });
}

export function eliminar(id: number): Promise<void> {
  return request<void>(`${RUTA}/${id}`, { method: "DELETE" });
}
