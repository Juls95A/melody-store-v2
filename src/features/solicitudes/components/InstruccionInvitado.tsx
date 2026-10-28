"use client";

import Button from "@/features/common/components/Button";
import { formatearPrecio } from "@/features/productos/domain/producto";
import { useProducto } from "@/features/productos/hooks/useProducto";

type InstruccionInvitadoProps = {
  // Id que llegó por ?producto=, si lo hay
  productoId: number | null;
};

export default function InstruccionInvitado({ productoId }: InstruccionInvitadoProps) {
  const { producto } = useProducto(productoId);

  return (
    <div className="mt-6 max-w-[620px] border border-linea bg-carbon/70 p-6 sm:p-8">
      {producto && (
        <p className="mb-5 border-l-[3px] border-rojo-brillante pl-4 text-[0.73rem] text-marfil">
          Quieres pedir: <strong className="font-playfair text-[0.95rem] font-medium">{producto.nombre}</strong>{" "}
          <span className="text-precio">{formatearPrecio(producto.precio)}</span>
        </p>
      )}
      <p className="text-[0.78rem] text-marfil">Para hacer tu pedido inicia sesión o regístrate.</p>
      <p className="mt-2 text-[0.73rem] text-gris">
        Ten a mano tu dirección de envío, ciudad y el método de pago que prefieras (contra entrega, transferencia o
        tarjeta al recibir).
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button href="/login">Iniciar sesión</Button>
        <Button href="/registro" variante="secundario">
          Registrarme
        </Button>
      </div>
    </div>
  );
}
