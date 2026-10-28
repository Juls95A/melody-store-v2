"use client";

import Button from "@/features/common/components/Button";
import Modal from "@/features/common/components/Modal";
import type { Producto } from "../domain/producto";

type EliminarProductoModalProps = {
  // Producto a eliminar; null cierra el modal
  producto: Producto | null;
  eliminando: boolean;
  error: string;
  onConfirmar: (producto: Producto) => void;
  onCancelar: () => void;
};

export default function EliminarProductoModal({ producto, eliminando, error, onConfirmar, onCancelar }: EliminarProductoModalProps) {
  return (
    <Modal abierto={producto !== null} titulo="Eliminar producto" onCerrar={onCancelar}>
      {producto && (
        <div role="alert">
          <p className="text-[0.78rem] text-marfil">¿Seguro que quieres eliminar {producto.nombre}?</p>
          <p className="mt-2 text-[0.7rem] text-gris">
            También se eliminarán los pedidos de este producto. Esta acción no se puede deshacer.
          </p>
          {error && <p className="mt-3 text-[0.65rem] text-error">{error}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button disabled={eliminando} onClick={() => onConfirmar(producto)}>
              {eliminando ? "Eliminando..." : "Sí, eliminar"}
            </Button>
            <Button variante="secundario" disabled={eliminando} onClick={onCancelar}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
