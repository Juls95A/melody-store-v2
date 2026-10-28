"use client";

import { useContext } from "react";
import { CanastaContext, type CanastaContextValue } from "../components/CanastaProvider";

// Canasta compartida por el Navbar y las páginas; se guarda en localStorage y no necesita sesión
export function useCanasta(): CanastaContextValue {
  const contexto = useContext(CanastaContext);
  if (!contexto) throw new Error("useCanasta debe usarse dentro de CanastaProvider");
  return contexto;
}
