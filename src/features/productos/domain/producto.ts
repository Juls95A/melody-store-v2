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
