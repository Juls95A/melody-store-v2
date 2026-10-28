"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { User } from "@/features/auth/domain/auth";
import Button from "@/features/common/components/Button";
import FieldError from "@/features/common/components/FieldError";
import Input from "@/features/common/components/Input";
import Select from "@/features/common/components/Select";
import Textarea from "@/features/common/components/Textarea";
import { ApiError } from "@/features/common/http";
import { formatearPrecio } from "@/features/productos/domain/producto";
import { useTodosLosProductos } from "@/features/productos/hooks/useTodosLosProductos";
import {
  aCrearSolicitud,
  CANTIDAD_MAXIMA,
  leerCantidad,
  METODOS_PAGO,
  NOMBRES_METODO_PAGO,
  validarPedido,
  type ErroresPedido,
  type FormularioPedido as DatosFormulario,
} from "../domain/solicitud";
import { useCrearSolicitud } from "../hooks/useCrearSolicitud";

type FormularioPedidoProps = {
  user: User;
  // Producto que llega por ?producto=
  productoInicial: string;
};

const opcionesPago = METODOS_PAGO.map((metodo) => ({ value: metodo, label: NOMBRES_METODO_PAGO[metodo] }));

// Orden de los campos en pantalla, para enfocar el primero con error
const idsCampos: Record<keyof DatosFormulario, string> = {
  productoId: "pedido-producto",
  cantidad: "pedido-cantidad",
  telefono: "pedido-telefono",
  asunto: "pedido-asunto",
  direccionEnvio: "pedido-direccion",
  ciudad: "pedido-ciudad",
  metodoPago: "pedido-pago",
  mensaje: "pedido-mensaje",
};

const formularioVacio = (productoId: string): DatosFormulario => ({
  productoId,
  cantidad: "1",
  telefono: "",
  asunto: "",
  direccionEnvio: "",
  ciudad: "",
  metodoPago: "",
  mensaje: "",
});

export default function FormularioPedido({ user, productoInicial }: FormularioPedidoProps) {
  const catalogo = useTodosLosProductos();
  const { crear, enviando, creada, reiniciar } = useCrearSolicitud();
  const [datos, setDatos] = useState<DatosFormulario>(() => formularioVacio(productoInicial));
  // Mientras el usuario no escriba su propio asunto, se arma con el producto elegido
  const [asuntoEditado, setAsuntoEditado] = useState(false);
  const [errores, setErrores] = useState<ErroresPedido>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const producto = catalogo.productos.find((item) => String(item.id) === datos.productoId) ?? null;
  const asunto = asuntoEditado ? datos.asunto : producto ? `Pedido de ${producto.nombre}` : "";
  const cantidad = leerCantidad(datos.cantidad);
  const total = producto && cantidad ? producto.precio * cantidad : null;

  function cambiar(campo: keyof DatosFormulario, valor: string) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setErrorGeneral("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // Si el id de ?producto= no está en el catálogo, cuenta como no seleccionado
    const completos = { ...datos, asunto, productoId: producto ? datos.productoId : "" };
    const erroresCliente = validarPedido(completos);
    setErrores(erroresCliente);
    setErrorGeneral("");
    if (Object.keys(erroresCliente).length > 0) {
      const primero = (Object.keys(idsCampos) as (keyof DatosFormulario)[]).find((campo) => erroresCliente[campo]);
      if (primero) document.getElementById(idsCampos[primero])?.focus();
      return;
    }

    try {
      await crear(aCrearSolicitud(completos));
      setDatos(formularioVacio(""));
      setAsuntoEditado(false);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        const { productoId, cantidad, telefono, asunto, mensaje, direccionEnvio, ciudad, metodoPago } = error.errors;
        setErrores({ productoId, cantidad, telefono, asunto, mensaje, direccionEnvio, ciudad, metodoPago });
      } else {
        setErrorGeneral(error instanceof Error ? error.message : "No se pudo enviar tu pedido.");
      }
    }
  }

  if (creada) {
    return (
      <div className="mt-6 max-w-[620px] border border-exito-borde bg-exito-fondo px-4 py-[0.85rem] text-xs font-bold text-exito" role="status">
        <p>¡Gracias! Tu pedido de {creada.producto.nombre} fue enviado correctamente.</p>
        <p className="mt-2 font-normal">
          Puedes seguir su estado en{" "}
          <Link href="/mis-solicitudes" className="underline underline-offset-4 hover:text-marfil">
            Mis solicitudes
          </Link>
          .
        </p>
        <Button variante="secundario" className="mt-4" onClick={reiniciar}>
          Hacer otro pedido
        </Button>
      </div>
    );
  }

  const opcionesProducto = catalogo.productos.map((item) => ({
    value: String(item.id),
    label: `${item.nombre} — ${formatearPrecio(item.precio)}`,
  }));

  return (
    <form noValidate onSubmit={enviar} className="mt-6 flex max-w-[620px] flex-col gap-[0.35rem]" aria-describedby="pedido-error">
      {/* Datos de la sesión: se muestran pero no se editan */}
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input id="pedido-nombre" label="Nombre" value={user.nombre} readOnly />
        <Input id="pedido-correo" label="Correo electrónico" type="email" value={user.email} readOnly />
      </div>

      <Select
        id="pedido-producto"
        label="Producto"
        opciones={opcionesProducto}
        placeholder={catalogo.loading ? "Cargando productos..." : "Selecciona un producto"}
        disabled={catalogo.loading || catalogo.error !== null}
        value={producto ? datos.productoId : ""}
        error={errores.productoId ?? catalogo.error ?? undefined}
        onChange={(evento) => cambiar("productoId", evento.target.value)}
      />
      {catalogo.error && (
        <Button variante="secundario" className="mb-2" onClick={catalogo.reintentar}>
          Reintentar
        </Button>
      )}

      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input
          id="pedido-cantidad"
          label="Cantidad"
          type="number"
          inputMode="numeric"
          min={1}
          max={CANTIDAD_MAXIMA}
          value={datos.cantidad}
          error={errores.cantidad}
          onChange={(evento) => cambiar("cantidad", evento.target.value)}
        />
        <Input
          id="pedido-telefono"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          placeholder="Ej. 3001234567"
          value={datos.telefono}
          error={errores.telefono}
          onChange={(evento) => cambiar("telefono", evento.target.value)}
        />
      </div>

      <Input
        id="pedido-asunto"
        label="Asunto"
        placeholder="¿Sobre qué quieres hablar?"
        value={asunto}
        error={errores.asunto}
        onChange={(evento) => {
          setAsuntoEditado(true);
          cambiar("asunto", evento.target.value);
        }}
      />
      <Input
        id="pedido-direccion"
        label="Dirección de envío"
        autoComplete="street-address"
        placeholder="Ej. Calle 10 # 20-30, apto 401"
        value={datos.direccionEnvio}
        error={errores.direccionEnvio}
        onChange={(evento) => cambiar("direccionEnvio", evento.target.value)}
      />

      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input
          id="pedido-ciudad"
          label="Ciudad"
          autoComplete="address-level2"
          placeholder="Ej. Medellín"
          value={datos.ciudad}
          error={errores.ciudad}
          onChange={(evento) => cambiar("ciudad", evento.target.value)}
        />
        <Select
          id="pedido-pago"
          label="Método de pago"
          opciones={opcionesPago}
          placeholder="Selecciona un método de pago"
          value={datos.metodoPago}
          error={errores.metodoPago}
          onChange={(evento) => cambiar("metodoPago", evento.target.value)}
        />
      </div>

      <Textarea
        id="pedido-mensaje"
        label="Mensaje (opcional)"
        placeholder="Escribe tu mensaje aquí"
        value={datos.mensaje}
        error={errores.mensaje}
        onChange={(evento) => cambiar("mensaje", evento.target.value)}
      />

      <p className="flex items-baseline justify-between border-y border-linea py-[0.8rem] text-[0.68rem] uppercase text-gris" aria-live="polite">
        <span>Total</span>
        <span className="text-[0.9rem] font-bold text-precio">{total === null ? "—" : formatearPrecio(total)}</span>
      </p>

      <Button type="submit" className="mt-3" disabled={enviando || catalogo.loading}>
        {enviando ? "Enviando..." : "Enviar"}
      </Button>
      <FieldError id="pedido-error" error={errorGeneral} />
    </form>
  );
}
