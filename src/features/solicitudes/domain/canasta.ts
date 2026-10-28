import type { Producto } from "@/features/productos/domain/producto";
import { CANTIDAD_MAXIMA } from "./solicitud";

export const CLAVE_CANASTA = "melody_canasta";

// Producto guardado en la canasta, con lo necesario para mostrarlo sin volver a pedirlo
export type ItemCanasta = {
  productoId: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
};

export function aItemCanasta(producto: Producto, cantidad = 1): ItemCanasta {
  return {
    productoId: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagen,
    precio: producto.precio,
    cantidad: limitarCantidad(cantidad),
  };
}

// Cantidad entera entre 1 y 10
export function limitarCantidad(cantidad: number): number {
  if (!Number.isFinite(cantidad)) return 1;
  return Math.min(CANTIDAD_MAXIMA, Math.max(1, Math.trunc(cantidad)));
}

// Si el producto ya está, suma la cantidad (sin pasar de 10)
export function agregarItem(items: ItemCanasta[], nuevo: ItemCanasta): ItemCanasta[] {
  const existente = items.find((item) => item.productoId === nuevo.productoId);
  if (!existente) return [...items, nuevo];
  return items.map((item) =>
    item.productoId === nuevo.productoId ? { ...item, cantidad: limitarCantidad(item.cantidad + nuevo.cantidad) } : item
  );
}

export function quitarItem(items: ItemCanasta[], productoId: number): ItemCanasta[] {
  return items.filter((item) => item.productoId !== productoId);
}

export function cambiarCantidadItem(items: ItemCanasta[], productoId: number, cantidad: number): ItemCanasta[] {
  return items.map((item) => (item.productoId === productoId ? { ...item, cantidad: limitarCantidad(cantidad) } : item));
}

export function contarItems(items: ItemCanasta[]): number {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

export function calcularTotal(items: ItemCanasta[]): number {
  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function esItemCanasta(valor: unknown): valor is ItemCanasta {
  if (typeof valor !== "object" || valor === null) return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.productoId === "number" &&
    typeof item.nombre === "string" &&
    typeof item.imagen === "string" &&
    typeof item.precio === "number" &&
    typeof item.cantidad === "number"
  );
}

// Lee lo guardado en localStorage descartando lo que no tenga la forma esperada
export function parsearCanasta(json: string | null): ItemCanasta[] {
  if (!json) return [];
  try {
    const datos: unknown = JSON.parse(json);
    if (!Array.isArray(datos)) return [];
    return datos.filter(esItemCanasta).map((item) => ({ ...item, cantidad: limitarCantidad(item.cantidad) }));
  } catch {
    return [];
  }
}
