export const ESTADOS_SOLICITUD = ["pendiente", "atendida", "cancelada"] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export const NOMBRES_ESTADO: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

export function esEstadoSolicitud(valor: string): valor is EstadoSolicitud {
  return ESTADOS_SOLICITUD.some((estado) => estado === valor);
}

// Solo la opción elegida: nunca se piden ni se guardan datos de tarjeta
export const METODOS_PAGO = ["contra_entrega", "transferencia", "tarjeta_al_recibir"] as const;

export type MetodoPago = (typeof METODOS_PAGO)[number];

export const NOMBRES_METODO_PAGO: Record<MetodoPago, string> = {
  contra_entrega: "Pago contra entrega",
  transferencia: "Transferencia bancaria",
  tarjeta_al_recibir: "Tarjeta al recibir",
};

export function esMetodoPago(valor: string): valor is MetodoPago {
  return METODOS_PAGO.some((metodo) => metodo === valor);
}

// Solicitud (pedido) tal como la devuelve el backend, con datos del usuario y del producto
export type Solicitud = {
  id: number;
  userId: number;
  productoId: number;
  telefono: string;
  asunto: string;
  mensaje: string | null;
  cantidad: number;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: MetodoPago;
  estado: EstadoSolicitud;
  createdAt: string;
  user: { nombre: string; email: string };
  producto: { nombre: string; imagen: string; precio: number };
};

export type CrearSolicitudRequest = {
  productoId: number;
  cantidad: number;
  telefono: string;
  asunto: string;
  mensaje?: string;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: MetodoPago;
};

export const CANTIDAD_MAXIMA = 10;

// Valores del formulario de pedido, tal como se escriben en los campos
export type FormularioPedido = {
  productoId: string;
  cantidad: string;
  telefono: string;
  asunto: string;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: string;
  mensaje: string;
};

export type ErroresPedido = Partial<Record<keyof FormularioPedido, string>>;

const PATRON_TELEFONO = /^[+\d][\d\s()-]{6,}$/;
const OBLIGATORIO = "Este campo es obligatorio.";

// Cantidad entera entre 1 y 10, o null si no es válida
export function leerCantidad(valor: string): number | null {
  const cantidad = Number(valor);
  return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= CANTIDAD_MAXIMA ? cantidad : null;
}

// Mismas reglas que el formulario original y el backend
export function validarPedido(datos: FormularioPedido): ErroresPedido {
  const errores: ErroresPedido = {};
  const telefono = datos.telefono.trim();
  const direccion = datos.direccionEnvio.trim();
  const ciudad = datos.ciudad.trim();
  const mensaje = datos.mensaje.trim();

  if (!datos.productoId) errores.productoId = "Selecciona un producto.";

  if (!datos.cantidad.trim()) errores.cantidad = OBLIGATORIO;
  else if (leerCantidad(datos.cantidad) === null) errores.cantidad = `La cantidad debe ser un número entre 1 y ${CANTIDAD_MAXIMA}.`;

  if (!telefono) errores.telefono = OBLIGATORIO;
  else if (!PATRON_TELEFONO.test(telefono)) errores.telefono = "Escribe un teléfono válido.";

  if (!datos.asunto.trim()) errores.asunto = "El asunto es obligatorio.";

  if (!direccion) errores.direccionEnvio = OBLIGATORIO;
  else if (direccion.length < 5) errores.direccionEnvio = "La dirección de envío debe tener al menos 5 caracteres.";

  if (!ciudad) errores.ciudad = OBLIGATORIO;
  else if (ciudad.length < 3) errores.ciudad = "La ciudad debe tener al menos 3 caracteres.";

  if (!esMetodoPago(datos.metodoPago)) errores.metodoPago = "Selecciona un método de pago.";

  // El mensaje es opcional, pero si se escribe debe tener al menos 10 caracteres
  if (mensaje && mensaje.length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";

  return errores;
}

// Convierte el formulario (ya validado) en el cuerpo que espera la API
export function aCrearSolicitud(datos: FormularioPedido): CrearSolicitudRequest {
  const mensaje = datos.mensaje.trim();
  return {
    productoId: Number(datos.productoId),
    cantidad: Number(datos.cantidad),
    telefono: datos.telefono.trim(),
    asunto: datos.asunto.trim(),
    mensaje: mensaje || undefined,
    direccionEnvio: datos.direccionEnvio.trim(),
    ciudad: datos.ciudad.trim(),
    metodoPago: datos.metodoPago as MetodoPago,
  };
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}
