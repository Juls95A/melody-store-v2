"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../components/AuthProvider";

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
