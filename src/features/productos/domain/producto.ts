export const CATEGORIAS = ["guitarras", "bajos", "teclados", "baterias", "accesorios"] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIAS_INSTRUMENTOS: Categoria[] = ["guitarras", "bajos", "teclados", "baterias"];

export const NOMBRES_CATEGORIA: Record<Categoria, string> = {
  guitarras: "Guitarras",
  bajos: "Bajos",
  teclados: "Teclados",
  baterias: "Baterías",
  accesorios: "Accesorios",
};

// Imagen de cada categoría en /instrumentos, igual que en instrumentos.html (accesorios no tenía)
export const IMAGENES_CATEGORIA: Partial<Record<Categoria, { src: string; alt: string }>> = {
  guitarras: { src: "/img/guitarras.png", alt: "Guitarra acústica" },
  bajos: { src: "/img/bajos.png", alt: "Bajo eléctrico" },
  teclados: { src: "/img/teclado_electronico.png", alt: "Teclado electrónico" },
  baterias: { src: "/img/baterias.png", alt: "Batería acústica" },
};

export type Producto = {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  descripcion: string;
  imagen: string;
  createdAt: string;
  updatedAt: string;
};

// Campos que se envían al crear o actualizar
export type DatosProducto = Pick<Producto, "nombre" | "categoria" | "precio" | "descripcion" | "imagen">;

export type Paginado<T> = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
};

export type FiltrosProducto = {
  page?: number;
  limit?: number;
  categoria?: Categoria;
  q?: string;
  precioMin?: number;
  precioMax?: number;
};

// Lo que se pide a la API: categoria puede llevar varias separadas por coma (guitarras,bajos)
export type ConsultaProductos = Omit<FiltrosProducto, "categoria"> & {
  categoria?: string;
};

export function esCategoria(valor: string | null): valor is Categoria {
  return CATEGORIAS.some((categoria) => categoria === valor);
}

// Precio en pesos con separador de miles colombiano: $1.299.000
export function formatearPrecio(valor: number): string {
  return `$${valor.toLocaleString("es-CO")}`;
}

// Valores del formulario de producto, tal como se escriben en los campos
export type FormularioProducto = {
  nombre: string;
  categoria: string;
  precio: string;
  descripcion: string;
  imagen: string;
};

export type ErroresProducto = Partial<Record<keyof FormularioProducto, string>>;

export const FORMULARIO_PRODUCTO_VACIO: FormularioProducto = {
  nombre: "",
  categoria: "",
  precio: "",
  descripcion: "",
  imagen: "",
};

export function aFormularioProducto(producto: Producto): FormularioProducto {
  return {
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: String(producto.precio),
    descripcion: producto.descripcion,
    imagen: producto.imagen,
  };
}

// Mismas reglas que el backend; la imagen además debe ser una ruta de /public/img
export function validarProducto(datos: FormularioProducto): ErroresProducto {
  const errores: ErroresProducto = {};
  const nombre = datos.nombre.trim();
  const precio = Number(datos.precio);
  const descripcion = datos.descripcion.trim();
  const imagen = datos.imagen.trim();

  if (!nombre) errores.nombre = "El nombre es obligatorio.";
  else if (nombre.length < 2) errores.nombre = "El nombre debe tener al menos 2 caracteres.";

  if (!esCategoria(datos.categoria)) errores.categoria = "Selecciona una categoría.";

  if (!datos.precio.trim()) errores.precio = "El precio es obligatorio.";
  else if (!Number.isInteger(precio) || precio <= 0) errores.precio = "El precio debe ser un número entero mayor que 0.";

  if (!descripcion) errores.descripcion = "La descripción es obligatoria.";
  else if (descripcion.length < 10) errores.descripcion = "La descripción debe tener al menos 10 caracteres.";

  if (!imagen) errores.imagen = "La imagen es obligatoria.";
  else if (!/^\/img\/\S+$/.test(imagen)) errores.imagen = "La imagen debe ser una ruta como /img/guitarra.png.";

  return errores;
}

// Convierte el formulario (ya validado) en el cuerpo que espera la API
export function aDatosProducto(datos: FormularioProducto): DatosProducto {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria as Categoria,
    precio: Number(datos.precio),
    descripcion: datos.descripcion.trim(),
    imagen: datos.imagen.trim(),
  };
}
