"use client";

import { useState } from "react";
import type { DatosProducto, Producto } from "../domain/producto";
import { actualizar as actualizarProducto, crear as crearProducto, eliminar as eliminarProducto } from "../services/productosService";

// Crear, actualizar y eliminar (solo admin); los errores se lanzan para mostrarlos en cada campo
export function useGestionProductos() {
  const [guardando, setGuardando] = useState(false);

  async function ejecutar<T>(accion: () => Promise<T>): Promise<T> {
    setGuardando(true);
    try {
      return await accion();
    } finally {
      setGuardando(false);
    }
  }

  return {
    guardando,
    crear: (datos: DatosProducto): Promise<Producto> => ejecutar(() => crearProducto(datos)),
    actualizar: (id: number, datos: DatosProducto): Promise<Producto> => ejecutar(() => actualizarProducto(id, datos)),
    eliminar: (id: number): Promise<void> => ejecutar(() => eliminarProducto(id)),
  };
}
