"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/features/common/components/Button";
import Modal from "@/features/common/components/Modal";
import Pagination from "@/features/common/components/Pagination";
import {
  aFormularioProducto,
  formatearPrecio,
  FORMULARIO_PRODUCTO_VACIO,
  NOMBRES_CATEGORIA,
  type DatosProducto,
  type Producto,
} from "../domain/producto";
import { useGestionProductos } from "../hooks/useGestionProductos";
import { useProductos } from "../hooks/useProductos";
import FormularioProducto from "./FormularioProducto";

const POR_PAGINA = 8;

// Qué modal está abierto: el formulario (nuevo o edición) o la confirmación de borrado
type Dialogo = { tipo: "nuevo" } | { tipo: "editar"; producto: Producto } | { tipo: "eliminar"; producto: Producto } | null;

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";
const estiloCelda = "border-b border-linea px-3 py-[0.7rem] align-middle";
const estiloEncabezado = "border-b border-linea px-3 py-[0.6rem] text-left text-[0.6rem] font-medium uppercase tracking-[0.12em] text-gris";

export default function AdminProductos() {
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [errorEliminar, setErrorEliminar] = useState("");
  const { loading, data, error, reintentar } = useProductos({ page: pagina, limit: POR_PAGINA });
  const { guardando, crear, actualizar, eliminar } = useGestionProductos();

  function cerrar() {
    setDialogo(null);
    setErrorEliminar("");
  }

  async function guardar(datos: DatosProducto) {
    if (dialogo?.tipo === "editar") await actualizar(dialogo.producto.id, datos);
    else await crear(datos);
    cerrar();
    reintentar();
  }

  async function confirmarEliminar(producto: Producto) {
    setErrorEliminar("");
    try {
      await eliminar(producto.id);
      cerrar();
      // Si era el último de la página, se pasa a la anterior
      if (data?.data.length === 1 && pagina > 1) setPagina(pagina - 1);
      else reintentar();
    } catch (causa) {
      setErrorEliminar(causa instanceof Error ? causa.message : "No se pudo eliminar el producto.");
    }
  }

  let contenido;
  if (loading) {
    contenido = (
      <p className={estiloMensaje} role="status">
        Cargando productos...
      </p>
    );
  } else if (error || !data) {
    contenido = (
      <div className="mt-6 flex flex-col gap-4" role="alert">
        <p className="text-[0.73rem] text-error">{error ?? "No se pudieron cargar los productos."}</p>
        <Button onClick={reintentar}>Reintentar</Button>
      </div>
    );
  } else if (data.data.length === 0) {
    contenido = <p className={estiloMensaje}>Todavía no hay productos. Crea el primero con &quot;Nuevo producto&quot;.</p>;
  } else {
    contenido = (
      <>
        {/* La tabla se desplaza dentro de su caja en pantallas angostas */}
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
              {data.data.map((producto) => (
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
                      <Button variante="secundario" onClick={() => setDialogo({ tipo: "editar", producto })}>
                        Editar
                      </Button>
                      <Button variante="secundario" onClick={() => setDialogo({ tipo: "eliminar", producto })}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pagina={data.pagination.page} totalPaginas={data.pagination.totalPages} onCambiar={setPagina} />
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.73rem] text-gris">{data ? `${data.pagination.total} productos en el catálogo` : " "}</p>
        <Button onClick={() => setDialogo({ tipo: "nuevo" })}>Nuevo producto</Button>
      </div>

      {contenido}

      <Modal
        abierto={dialogo?.tipo === "nuevo" || dialogo?.tipo === "editar"}
        titulo={dialogo?.tipo === "editar" ? "Editar producto" : "Nuevo producto"}
        onCerrar={cerrar}
      >
        {(dialogo?.tipo === "nuevo" || dialogo?.tipo === "editar") && (
          <FormularioProducto
            // key: al pasar de un producto a otro el formulario arranca con sus datos
            key={dialogo.tipo === "editar" ? dialogo.producto.id : "nuevo"}
            inicial={dialogo.tipo === "editar" ? aFormularioProducto(dialogo.producto) : FORMULARIO_PRODUCTO_VACIO}
            guardando={guardando}
            textoEnviar={dialogo.tipo === "editar" ? "Guardar cambios" : "Crear producto"}
            onGuardar={guardar}
            onCancelar={cerrar}
          />
        )}
      </Modal>

      <Modal abierto={dialogo?.tipo === "eliminar"} titulo="Eliminar producto" onCerrar={cerrar}>
        {dialogo?.tipo === "eliminar" && (
          <div role="alert">
            <p className="text-[0.78rem] text-marfil">¿Seguro que quieres eliminar {dialogo.producto.nombre}?</p>
            <p className="mt-2 text-[0.7rem] text-gris">
              También se eliminarán los pedidos de este producto. Esta acción no se puede deshacer.
            </p>
            {errorEliminar && <p className="mt-3 text-[0.65rem] text-error">{errorEliminar}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Button disabled={guardando} onClick={() => confirmarEliminar(dialogo.producto)}>
                {guardando ? "Eliminando..." : "Sí, eliminar"}
              </Button>
              <Button variante="secundario" disabled={guardando} onClick={cerrar}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
