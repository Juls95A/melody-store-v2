import { API_BASE_URL } from "./config";

export const CLAVE_TOKEN = "melody_token";
export const CLAVE_USUARIO = "melody_user";

export type ErroresCampo = Record<string, string>;

// Error que lanza request cuando la respuesta no es ok
export class ApiError extends Error {
  status: number;
  errors: ErroresCampo;

  constructor(status: number, message: string, errors: ErroresCampo = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type Metodo = "GET" | "POST" | "PUT" | "DELETE";

type OpcionesRequest = {
  method?: Metodo;
  body?: unknown;
};

// localStorage no existe en el servidor (y puede estar bloqueado en el navegador)
function leerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

function cerrarSesion() {
  try {
    window.localStorage.removeItem(CLAVE_TOKEN);
    window.localStorage.removeItem(CLAVE_USUARIO);
  } catch {
    // Si no hay acceso a localStorage no hay nada que borrar
  }
  // Fuera de React no hay router; además la recarga completa limpia el estado de la sesión
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/login";
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

// Convierte el cuerpo { message, errors } del backend en un ApiError
function crearError(status: number, cuerpo: unknown): ApiError {
  if (!esObjeto(cuerpo)) return new ApiError(status, "Ocurrió un error inesperado.");

  const mensaje = typeof cuerpo.message === "string" ? cuerpo.message : "Ocurrió un error inesperado.";
  const errores: ErroresCampo = {};
  if (esObjeto(cuerpo.errors)) {
    for (const [campo, texto] of Object.entries(cuerpo.errors)) {
      if (typeof texto === "string") errores[campo] = texto;
    }
  }
  return new ApiError(status, mensaje, errores);
}

// Único punto del proyecto que llama a fetch
export async function request<T>(path: string, { method = "GET", body }: OpcionesRequest = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = leerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor.");
  }

  const texto = await respuesta.text();
  let datos: unknown = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = null;
    }
  }

  if (respuesta.status === 401 && path !== "/api/auth/login" && typeof window !== "undefined") {
    cerrarSesion();
  }

  if (!respuesta.ok) throw crearError(respuesta.status, datos);

  return datos as T;
}
