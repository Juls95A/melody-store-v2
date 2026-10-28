import type { Producto } from "../domain/producto";
import ProductoCard from "./ProductoCard";

type ProductoGridProps = {
  productos: Producto[];
};

export default function ProductoGrid({ productos }: ProductoGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-[0.7rem] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductoCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
