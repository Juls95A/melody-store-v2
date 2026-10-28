"use client";

import { createContext, useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Producto } from "@/features/productos/domain/producto";
import {
  agregarItem,
  aItemCanasta,
  calcularTotal,
  cambiarCantidadItem,
  CLAVE_CANASTA,
  contarItems,
  parsearCanasta,
  quitarItem,
  type ItemCanasta,
} from "../domain/canasta";

type EstadoCanasta = {
  items: ItemCanasta[];
  loading: boolean;
};

export type CanastaContextValue = EstadoCanasta & {
  totalItems: number;
  total: number;
  agregar: (producto: Producto, cantidad?: number) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
};

export const CanastaContext = createContext<CanastaContextValue | null>(null);

// En el servidor y durante la hidratación todavía no se leyó localStorage
const CANASTA_CARGANDO: EstadoCanasta = { items: [], loading: true };

// --- Canasta guardada en localStorage, expuesta como store externo para useSyncExternalStore ---

const oyentes = new Set<() => void>();
// Copia en memoria por si localStorage está bloqueado: la canasta funciona aunque no sobreviva al refrescar
let enMemoria: string | null = null;
let ultimaLectura: { json: string | null; estado: EstadoCanasta } | null = null;

function leerJson(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_CANASTA);
  } catch {
    return enMemoria;
  }
}

// Devuelve el mismo objeto mientras localStorage no cambie, como exige useSyncExternalStore
function leerCanasta(): EstadoCanasta {
  const json = leerJson();
  if (!ultimaLectura || ultimaLectura.json !== json) {
    ultimaLectura = { json, estado: { items: parsearCanasta(json), loading: false } };
  }
  return ultimaLectura.estado;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // "storage" avisa cuando otra pestaña cambia la canasta
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

// Parte siempre de lo guardado, así varias llamadas seguidas no se pisan
function actualizarCanasta(cambio: (items: ItemCanasta[]) => ItemCanasta[]) {
  const items = cambio(leerCanasta().items);
  const json = items.length > 0 ? JSON.stringify(items) : null;
  enMemoria = json;
  try {
    if (json) window.localStorage.setItem(CLAVE_CANASTA, json);
    else window.localStorage.removeItem(CLAVE_CANASTA);
  } catch {
    // Sin acceso a localStorage queda solo la copia en memoria
  }
  oyentes.forEach((oyente) => oyente());
}

export default function CanastaProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(suscribir, leerCanasta, () => CANASTA_CARGANDO);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    actualizarCanasta((items) => agregarItem(items, aItemCanasta(producto, cantidad)));
  }, []);

  const quitar = useCallback((productoId: number) => {
    actualizarCanasta((items) => quitarItem(items, productoId));
  }, []);

  const cambiarCantidad = useCallback((productoId: number, cantidad: number) => {
    actualizarCanasta((items) => cambiarCantidadItem(items, productoId, cantidad));
  }, []);

  const vaciar = useCallback(() => actualizarCanasta(() => []), []);

  const valor = useMemo(
    () => ({
      ...estado,
      totalItems: contarItems(estado.items),
      total: calcularTotal(estado.items),
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
    }),
    [estado, agregar, quitar, cambiarCantidad, vaciar]
  );

  return <CanastaContext.Provider value={valor}>{children}</CanastaContext.Provider>;
}
