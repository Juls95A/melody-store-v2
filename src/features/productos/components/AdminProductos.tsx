"use client";

import { useState } from "react";
import Button from "@/features/common/components/Button";
import Modal from "@/features/common/components/Modal";
import Pagination from "@/features/common/components/Pagination";
import { aFormularioProducto, FORMULARIO_PRODUCTO_VACIO, type DatosProducto, type Producto } from "../domain/producto";
import { useGestionProductos } from "../hooks/useGestionProductos";
import { useProductos } from "../hooks/useProductos";
import EliminarProductoModal from "./EliminarProductoModal";
import FormularioProducto from "./FormularioProducto";
import TablaProductos from "./TablaProductos";

const POR_PAGINA = 8;

// Qué modal está abierto: el formulario (nuevo o edición) o la confirmación de borrado
type Dialogo = { tipo: "nuevo" } | { tipo: "editar"; producto: Producto } | { tipo: "eliminar"; producto: Producto } | null;

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";

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
        <TablaProductos
          productos={data.data}
          onEditar={(producto) => setDialogo({ tipo: "editar", producto })}
          onEliminar={(producto) => setDialogo({ tipo: "eliminar", producto })}
        />
        <Pagination pagina={data.pagination.page} totalPaginas={data.pagination.totalPages} onCambiar={setPagina} />
      </>
    );
  }

  const editando = dialogo?.tipo === "editar" ? dialogo.producto : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.73rem] text-gris">{data ? `${data.pagination.total} productos en el catálogo` : " "}</p>
        <Button onClick={() => setDialogo({ tipo: "nuevo" })}>Nuevo producto</Button>
      </div>

      {contenido}

      <Modal
        abierto={dialogo?.tipo === "nuevo" || dialogo?.tipo === "editar"}
        titulo={editando ? "Editar producto" : "Nuevo producto"}
        onCerrar={cerrar}
      >
        {(dialogo?.tipo === "nuevo" || dialogo?.tipo === "editar") && (
          <FormularioProducto
            // key: al pasar de un producto a otro el formulario arranca con sus datos
            key={editando ? editando.id : "nuevo"}
            inicial={editando ? aFormularioProducto(editando) : FORMULARIO_PRODUCTO_VACIO}
            guardando={guardando}
            textoEnviar={editando ? "Guardar cambios" : "Crear producto"}
            onGuardar={guardar}
            onCancelar={cerrar}
          />
        )}
      </Modal>

      <EliminarProductoModal
        producto={dialogo?.tipo === "eliminar" ? dialogo.producto : null}
        eliminando={guardando}
        error={errorEliminar}
        onConfirmar={confirmarEliminar}
        onCancelar={cerrar}
      />
    </div>
  );
}
