"use client";

import Image from "next/image";
import Button from "@/features/common/components/Button";
import Select from "@/features/common/components/Select";
import { formatearPrecio } from "@/features/productos/domain/producto";
import type { ItemCanasta } from "../domain/canasta";
import { CANTIDAD_MAXIMA } from "../domain/solicitud";

type ItemCanastaFilaProps = {
  item: ItemCanasta;
  bloqueado: boolean;
  onCambiarCantidad: (productoId: number, cantidad: number) => void;
  onQuitar: (productoId: number) => void;
};

const opcionesCantidad = Array.from({ length: CANTIDAD_MAXIMA }, (_, indice) => ({
  value: String(indice + 1),
  label: String(indice + 1),
}));

export default function ItemCanastaFila({ item, bloqueado, onCambiarCantidad, onQuitar }: ItemCanastaFilaProps) {
  const tituloId = `canasta-${item.productoId}`;

  return (
    <li
      aria-labelledby={tituloId}
      className="grid grid-cols-[88px_1fr] gap-4 border border-linea bg-tarjeta p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-6"
    >
      {/* unoptimized: la imagen puede venir de cualquier URL guardada en el backend */}
      <Image
        src={item.imagen}
        alt={item.nombre}
        width={240}
        height={180}
        unoptimized
        className="block aspect-[4/3] w-full object-cover contrast-[1.2] grayscale"
      />

      <div className="min-w-0">
        <h3 id={tituloId} className="font-playfair text-[1rem] leading-[1.25] font-medium text-marfil">
          {item.nombre}
        </h3>
        <p className="mt-1 text-[0.68rem] text-gris">{formatearPrecio(item.precio)} c/u</p>
        <p className="mt-1 text-[0.72rem] font-bold text-precio">
          Subtotal: {formatearPrecio(item.precio * item.cantidad)}
        </p>
      </div>

      <div className="col-span-2 flex items-end justify-between gap-6 sm:col-span-1 sm:flex-col sm:items-end sm:gap-0">
        <div className="w-24">
          <Select
            id={`cantidad-${item.productoId}`}
            label="Cantidad"
            opciones={opcionesCantidad}
            value={String(item.cantidad)}
            disabled={bloqueado}
            onChange={(evento) => onCambiarCantidad(item.productoId, Number(evento.target.value))}
          />
        </div>
        <Button
          variante="secundario"
          className="mb-[1.4rem] sm:mb-0"
          disabled={bloqueado}
          aria-label={`Quitar ${item.nombre} de la canasta`}
          onClick={() => onQuitar(item.productoId)}
        >
          Quitar
        </Button>
      </div>
    </li>
  );
}
