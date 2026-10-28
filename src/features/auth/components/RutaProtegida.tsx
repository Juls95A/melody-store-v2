"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import type { User } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

type RutaProtegidaProps = {
  soloAdmin?: boolean;
  soloInvitados?: boolean;
  children: ReactNode;
};

// A dónde mandar al visitante, o null si puede quedarse
function destino(user: User | null, soloAdmin: boolean, soloInvitados: boolean, habiaSesion: boolean): string | null {
  if (soloInvitados) return user ? "/" : null;
  // Si la sesión se cerró estando aquí (Salir), se va al inicio como hace logout
  if (!user) return habiaSesion ? "/" : "/login";
  if (soloAdmin && user.role !== "admin") return "/";
  return null;
}

export default function RutaProtegida({ soloAdmin = false, soloInvitados = false, children }: RutaProtegidaProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const habiaSesion = useRef(false);

  // Mientras loading, todavía no se leyó localStorage: decidir ahora expulsaría al usuario al refrescar
  const permitido = !loading && destino(user, soloAdmin, soloInvitados, false) === null;

  useEffect(() => {
    if (loading) return;
    const ruta = destino(user, soloAdmin, soloInvitados, habiaSesion.current);
    if (user) habiaSesion.current = true;
    if (ruta) router.replace(ruta);
  }, [loading, user, soloAdmin, soloInvitados, router]);

  if (!permitido) {
    return (
      <p className="mt-6 text-[0.73rem] text-gris" role="status">
        Cargando...
      </p>
    );
  }

  return <>{children}</>;
}
