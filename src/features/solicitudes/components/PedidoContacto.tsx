"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import FormularioPedido from "./FormularioPedido";
import InstruccionInvitado from "./InstruccionInvitado";

// Id positivo de ?producto=, o null si no viene o no es válido
function leerProductoId(valor: string | null): number | null {
  const id = Number(valor);
  return valor && Number.isInteger(id) && id > 0 ? id : null;
}

export default function PedidoContacto() {
  const { user, loading } = useAuth();
  const productoId = leerProductoId(useSearchParams().get("producto"));

  if (loading) {
    return (
      <p className="mt-6 text-[0.73rem] text-gris" role="status">
        Cargando...
      </p>
    );
  }

  if (!user) return <InstruccionInvitado productoId={productoId} />;

  // La key reinicia el formulario si se llega con otro ?producto= sin salir de la página
  return <FormularioPedido key={productoId ?? "sin-producto"} user={user} productoInicial={productoId ? String(productoId) : ""} />;
}
