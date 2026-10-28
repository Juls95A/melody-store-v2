"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { esCategoria, type Categoria, type FiltrosProducto } from "../domain/producto";

// Lee un entero >= minimo de la URL; si no es válido lo ignora
function leerEntero(valor: string | null, minimo: number): number | undefined {
  if (!valor) return undefined;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= minimo ? numero : undefined;
}

// Filtros y página guardados en la URL (?page=2&categoria=guitarras&q=...)
export function useFiltrosUrl(categorias: Categoria[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoria = searchParams.get("categoria");

  const filtros: FiltrosProducto = {
    page: leerEntero(searchParams.get("page"), 1),
    categoria: esCategoria(categoria) && categorias.includes(categoria) ? categoria : undefined,
    q: searchParams.get("q")?.trim() || undefined,
    precioMin: leerEntero(searchParams.get("precioMin"), 0),
    precioMax: leerEntero(searchParams.get("precioMax"), 0),
  };

  function navegar(nuevos: FiltrosProducto) {
    const params = new URLSearchParams();
    if (nuevos.page && nuevos.page > 1) params.set("page", String(nuevos.page));
    if (nuevos.categoria) params.set("categoria", nuevos.categoria);
    if (nuevos.q) params.set("q", nuevos.q);
    if (nuevos.precioMin !== undefined) params.set("precioMin", String(nuevos.precioMin));
    if (nuevos.precioMax !== undefined) params.set("precioMax", String(nuevos.precioMax));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return { filtros, navegar };
}
