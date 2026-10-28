"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/features/common/components/Button";
import { useCanasta } from "@/features/solicitudes/hooks/useCanasta";
import { formatearPrecio, type Producto } from "../domain/producto";

type ProductoCardProps = {
  producto: Producto;
};

const DURACION_AVISO = 2000;

export default function ProductoCard({ producto }: ProductoCardProps) {
  const { agregar } = useCanasta();
  // Cuenta los clics para reiniciar el aviso si se agrega varias veces seguidas
  const [aviso, setAviso] = useState(0);

  useEffect(() => {
    if (aviso === 0) return;
    const temporizador = window.setTimeout(() => setAviso(0), DURACION_AVISO);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden border border-linea bg-tarjeta transition duration-[180ms] hover:-translate-y-1 hover:border-rojo-brillante">
      {/* unoptimized: la imagen puede venir de cualquier URL guardada en el backend */}
      <Image
        src={producto.imagen}
        alt={producto.nombre}
        width={400}
        height={300}
        unoptimized
        className="block aspect-[4/3] w-full object-cover contrast-[1.2] grayscale"
      />
      <h4 className="mx-4 mt-[0.85rem] mb-[0.35rem] font-playfair text-[0.9rem] leading-[1.25] font-medium text-marfil">
        {producto.nombre}
      </h4>
      <p className="mx-4 my-[0.35rem] text-[0.63rem] text-gris">{producto.descripcion}</p>
      <p className="mx-4 mt-[0.35rem] mb-[0.65rem] text-[0.72rem] font-bold text-precio">
        {formatearPrecio(producto.precio)}
      </p>
      {/* Invitados y usuarios agregan igual: la sesión se pide al finalizar el pedido */}
      <div className="mx-4 mt-auto mb-4">
        <Button
          onClick={() => {
            agregar(producto);
            setAviso((actual) => actual + 1);
          }}
        >
          Agregar a la canasta
        </Button>
        <p className="mt-2 min-h-[1.1rem] text-[0.63rem] text-exito" role="status">
          {aviso > 0 ? "Agregado a la canasta" : ""}
        </p>
      </div>
    </article>
  );
}
