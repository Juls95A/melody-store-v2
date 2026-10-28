"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Button from "@/features/common/components/Button";
import { useProducto } from "@/features/productos/hooks/useProducto";
import { useCanasta } from "../hooks/useCanasta";

// Id positivo de ?producto=, o null si no viene o no es válido
function leerProductoId(valor: string | null): number | null {
  const id = Number(valor);
  return valor && Number.isInteger(id) && id > 0 ? id : null;
}

const estiloMensaje = "mt-6 text-[0.73rem] text-gris";

// Los pedidos se hacen desde la canasta: ?producto= lo agrega y lleva a /canasta
export default function PedidoContacto() {
  const router = useRouter();
  const productoId = leerProductoId(useSearchParams().get("producto"));
  const { producto, loading: cargandoProducto } = useProducto(productoId);
  const canasta = useCanasta();
  // Evita agregarlo dos veces (Strict Mode ejecuta los efectos dos veces en desarrollo)
  const agregado = useRef(false);

  const tieneItems = !canasta.loading && canasta.items.length > 0;

  useEffect(() => {
    if (producto && !agregado.current) {
      agregado.current = true;
      canasta.agregar(producto);
      router.replace("/canasta");
    } else if (productoId === null && tieneItems) {
      router.replace("/canasta");
    }
  }, [producto, productoId, tieneItems, canasta, router]);

  if (canasta.loading || cargandoProducto || producto || (productoId === null && tieneItems)) {
    return (
      <p className={estiloMensaje} role="status">
        Cargando...
      </p>
    );
  }

  return (
    <div className="mt-6 max-w-[620px] border border-linea bg-carbon/70 p-6 sm:p-8">
      {productoId !== null && (
        <p className="mb-5 border-l-[3px] border-error pl-4 text-[0.73rem] text-error" role="alert">
          No encontramos el producto que quieres pedir.
        </p>
      )}
      <p className="text-[0.78rem] text-marfil">Para hacer un pedido agrega productos a tu canasta.</p>
      <p className="mt-2 text-[0.73rem] text-gris">
        Elige lo que quieras en el catálogo con &quot;Agregar a la canasta&quot; y finaliza tu pedido desde la canasta
        con tu dirección de envío, ciudad y método de pago.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button href="/instrumentos">Ver instrumentos</Button>
        <Button href="/accesorios" variante="secundario">
          Ver accesorios
        </Button>
      </div>
    </div>
  );
}
