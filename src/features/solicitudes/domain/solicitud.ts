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

// Datos de envío del pedido, tal como se escriben en los campos; son los mismos para todos los productos de la canasta
export type DatosEnvio = {
  telefono: string;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: string;
  mensaje: string;
};

export type ErroresEnvio = Partial<Record<keyof DatosEnvio, string>>;

export const DATOS_ENVIO_VACIOS: DatosEnvio = {
  telefono: "",
  direccionEnvio: "",
  ciudad: "",
  metodoPago: "",
  mensaje: "",
};

const PATRON_TELEFONO = /^[+\d][\d\s()-]{6,}$/;
const OBLIGATORIO = "Este campo es obligatorio.";

// Mismas reglas que el formulario original y el backend
export function validarEnvio(datos: DatosEnvio): ErroresEnvio {
  const errores: ErroresEnvio = {};
  const telefono = datos.telefono.trim();
  const direccion = datos.direccionEnvio.trim();
  const ciudad = datos.ciudad.trim();
  const mensaje = datos.mensaje.trim();

  if (!telefono) errores.telefono = OBLIGATORIO;
  else if (!PATRON_TELEFONO.test(telefono)) errores.telefono = "Escribe un teléfono válido.";

  if (!direccion) errores.direccionEnvio = OBLIGATORIO;
  else if (direccion.length < 5) errores.direccionEnvio = "La dirección de envío debe tener al menos 5 caracteres.";

  if (!ciudad) errores.ciudad = OBLIGATORIO;
  else if (ciudad.length < 3) errores.ciudad = "La ciudad debe tener al menos 3 caracteres.";

  if (!esMetodoPago(datos.metodoPago)) errores.metodoPago = "Selecciona un método de pago.";

  // El mensaje es opcional, pero si se escribe debe tener al menos 10 caracteres
  if (mensaje && mensaje.length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";

  return errores;
}

// Cuerpo que espera la API para un producto de la canasta (los datos de envío ya validados)
export function aCrearSolicitud(
  item: { productoId: number; nombre: string; cantidad: number },
  envio: DatosEnvio
): CrearSolicitudRequest {
  const mensaje = envio.mensaje.trim();
  return {
    productoId: item.productoId,
    cantidad: item.cantidad,
    telefono: envio.telefono.trim(),
    asunto: `Pedido de ${item.nombre}`,
    mensaje: mensaje || undefined,
    direccionEnvio: envio.direccionEnvio.trim(),
    ciudad: envio.ciudad.trim(),
    metodoPago: envio.metodoPago as MetodoPago,
  };
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}
