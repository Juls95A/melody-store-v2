"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Button from "@/features/common/components/Button";
import { formatearPrecio } from "@/features/productos/domain/producto";
import { useCanasta } from "../hooks/useCanasta";
import { useFinalizarPedido } from "../hooks/useFinalizarPedido";
import FormularioPedido from "./FormularioPedido";
import InstruccionInvitado from "./InstruccionInvitado";
import ItemCanastaFila from "./ItemCanastaFila";

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";

export default function Canasta() {
  const { items, loading, totalItems, total, quitar, cambiarCantidad } = useCanasta();
  const sesion = useAuth();
  const { finalizar, enviando, completado, reiniciar } = useFinalizarPedido();
  const [finalizando, setFinalizando] = useState(false);

  if (loading || sesion.loading) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando tu canasta...
      </p>
    );
  }

  if (completado !== null) {
    return (
      <div
        className="mt-6 max-w-[620px] border border-exito-borde bg-exito-fondo px-4 py-[0.85rem] text-xs font-bold text-exito"
        role="status"
      >
        <p>
          ¡Gracias! Tu pedido fue enviado correctamente
          {completado === 1 ? "." : ` (${completado} productos).`}
        </p>
        <p className="mt-2 font-normal">
          Puedes seguir su estado en{" "}
          <Link href="/mis-solicitudes" className="underline underline-offset-4 hover:text-marfil">
            Mis solicitudes
          </Link>
          .
        </p>
        <Button
          variante="secundario"
          className="mt-4"
          onClick={() => {
            reiniciar();
            setFinalizando(false);
          }}
        >
          Seguir comprando
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p className="text-[0.73rem] text-gris">Tu canasta está vacía.</p>
        <Button href="/instrumentos">Ver instrumentos</Button>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
      <div>
        <ul className="flex flex-col gap-[0.7rem]" aria-label="Productos en la canasta">
          {items.map((item) => (
            <ItemCanastaFila
              key={item.productoId}
              item={item}
              bloqueado={enviando}
              onCambiarCantidad={cambiarCantidad}
              onQuitar={quitar}
            />
          ))}
        </ul>
        <p
          className="mt-4 flex items-baseline justify-between border-y border-linea py-[0.8rem] text-[0.68rem] uppercase text-gris"
          aria-live="polite"
        >
          <span>
            Total ({totalItems} {totalItems === 1 ? "producto" : "productos"})
          </span>
          <span className="text-[1rem] font-bold text-precio">{formatearPrecio(total)}</span>
        </p>
      </div>

      <section aria-labelledby="titulo-finalizar">
        <h2 id="titulo-finalizar" className="mb-4 font-playfair text-[1.2rem] font-medium text-marfil">
          Finalizar pedido
        </h2>
        {!finalizando ? (
          <Button onClick={() => setFinalizando(true)}>Finalizar pedido</Button>
        ) : sesion.user ? (
          <FormularioPedido user={sesion.user} total={total} enviando={enviando} onFinalizar={finalizar} />
        ) : (
          <InstruccionInvitado />
        )}
      </section>
    </div>
  );
}
