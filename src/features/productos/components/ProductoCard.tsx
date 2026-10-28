import Image from "next/image";
import Button from "@/features/common/components/Button";
import { formatearPrecio, type Producto } from "../domain/producto";

type ProductoCardProps = {
  producto: Producto;
};

export default function ProductoCard({ producto }: ProductoCardProps) {
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
      {/* Invitados y usuarios van al mismo lugar: /contacto decide si muestra el formulario */}
      <Button href={`/contacto?producto=${producto.id}`} className="mx-4 mt-auto mb-4">
        Solicitar
      </Button>
    </article>
  );
}
