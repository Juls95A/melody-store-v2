import Image from "next/image";
import Button from "@/features/common/components/Button";
import { formatearPrecio, NOMBRES_CATEGORIA, type Producto } from "../domain/producto";

type TablaProductosProps = {
  productos: Producto[];
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
};

const estiloCelda = "border-b border-linea px-3 py-[0.7rem] align-middle";
const estiloEncabezado =
  "border-b border-linea px-3 py-[0.6rem] text-left text-[0.6rem] font-medium uppercase tracking-[0.12em] text-gris";

export default function TablaProductos({ productos, onEditar, onEliminar }: TablaProductosProps) {
  return (
    // La tabla se desplaza dentro de su caja en pantallas angostas
    <div className="mt-6 overflow-x-auto border border-linea bg-tarjeta">
      <table className="w-full min-w-[620px] border-collapse text-[0.7rem]">
        <thead>
          <tr>
            <th scope="col" className={estiloEncabezado}>
              Imagen
            </th>
            <th scope="col" className={estiloEncabezado}>
              Nombre
            </th>
            <th scope="col" className={estiloEncabezado}>
              Categoría
            </th>
            <th scope="col" className={estiloEncabezado}>
              Precio
            </th>
            <th scope="col" className={`${estiloEncabezado} text-right`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td className={estiloCelda}>
                {/* unoptimized: la imagen puede venir de cualquier URL guardada en el backend */}
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={64}
                  height={48}
                  unoptimized
                  className="aspect-[4/3] w-16 object-cover contrast-[1.2] grayscale"
                />
              </td>
              <td className={`${estiloCelda} font-playfair text-[0.85rem] text-marfil`}>{producto.nombre}</td>
              <td className={`${estiloCelda} text-gris`}>{NOMBRES_CATEGORIA[producto.categoria]}</td>
              <td className={`${estiloCelda} font-bold whitespace-nowrap text-precio`}>{formatearPrecio(producto.precio)}</td>
              <td className={`${estiloCelda} text-right`}>
                <div className="flex justify-end gap-4">
                  <Button variante="secundario" onClick={() => onEditar(producto)}>
                    Editar
                  </Button>
                  <Button variante="secundario" onClick={() => onEliminar(producto)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
