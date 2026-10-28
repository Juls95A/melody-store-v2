"use client";

import { useState, type FormEvent } from "react";
import type { User } from "@/features/auth/domain/auth";
import Button from "@/features/common/components/Button";
import FieldError from "@/features/common/components/FieldError";
import Input from "@/features/common/components/Input";
import Select from "@/features/common/components/Select";
import Textarea from "@/features/common/components/Textarea";
import { formatearPrecio } from "@/features/productos/domain/producto";
import {
  DATOS_ENVIO_VACIOS,
  METODOS_PAGO,
  NOMBRES_METODO_PAGO,
  validarEnvio,
  type DatosEnvio,
  type ErroresEnvio,
} from "../domain/solicitud";
import type { ResultadoPedido } from "../hooks/useFinalizarPedido";

type FormularioPedidoProps = {
  user: User;
  total: number;
  enviando: boolean;
  onFinalizar: (envio: DatosEnvio) => Promise<ResultadoPedido>;
};

const opcionesPago = METODOS_PAGO.map((metodo) => ({ value: metodo, label: NOMBRES_METODO_PAGO[metodo] }));

// Orden de los campos en pantalla, para enfocar el primero con error
const idsCampos: Record<keyof DatosEnvio, string> = {
  telefono: "pedido-telefono",
  direccionEnvio: "pedido-direccion",
  ciudad: "pedido-ciudad",
  metodoPago: "pedido-pago",
  mensaje: "pedido-mensaje",
};

function enfocarPrimerError(errores: ErroresEnvio) {
  const primero = (Object.keys(idsCampos) as (keyof DatosEnvio)[]).find((campo) => errores[campo]);
  if (primero) document.getElementById(idsCampos[primero])?.focus();
}

// Datos de envío del pedido de la canasta; nunca se piden datos de tarjeta
export default function FormularioPedido({ user, total, enviando, onFinalizar }: FormularioPedidoProps) {
  const [datos, setDatos] = useState<DatosEnvio>(DATOS_ENVIO_VACIOS);
  const [errores, setErrores] = useState<ErroresEnvio>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(campo: keyof DatosEnvio, valor: string) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setErrorGeneral("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const erroresCliente = validarEnvio(datos);
    setErrores(erroresCliente);
    setErrorGeneral("");
    if (Object.keys(erroresCliente).length > 0) {
      enfocarPrimerError(erroresCliente);
      return;
    }

    const resultado = await onFinalizar(datos);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      setErrorGeneral(resultado.mensaje);
      enfocarPrimerError(resultado.errores);
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-[0.35rem]" aria-describedby="pedido-error">
      {/* Datos de la sesión: se muestran pero no se editan */}
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input id="pedido-nombre" label="Nombre" value={user.nombre} readOnly />
        <Input id="pedido-correo" label="Correo electrónico" type="email" value={user.email} readOnly />
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
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
        <Input
          id="pedido-ciudad"
          label="Ciudad"
          autoComplete="address-level2"
          placeholder="Ej. Medellín"
          value={datos.ciudad}
          error={errores.ciudad}
          onChange={(evento) => cambiar("ciudad", evento.target.value)}
        />
      </div>

      <Input
        id="pedido-direccion"
        label="Dirección de envío"
        autoComplete="street-address"
        placeholder="Ej. Calle 10 # 20-30, apto 401"
        value={datos.direccionEnvio}
        error={errores.direccionEnvio}
        onChange={(evento) => cambiar("direccionEnvio", evento.target.value)}
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

      <Textarea
        id="pedido-mensaje"
        label="Mensaje (opcional)"
        placeholder="Escribe tu mensaje aquí"
        value={datos.mensaje}
        error={errores.mensaje}
        onChange={(evento) => cambiar("mensaje", evento.target.value)}
      />

      <p className="flex items-baseline justify-between border-y border-linea py-[0.8rem] text-[0.68rem] uppercase text-gris">
        <span>Total a pagar</span>
        <span className="text-[0.9rem] font-bold text-precio">{formatearPrecio(total)}</span>
      </p>

      <Button type="submit" className="mt-3" disabled={enviando}>
        {enviando ? "Enviando pedido..." : "Confirmar pedido"}
      </Button>
      <FieldError id="pedido-error" error={errorGeneral} />
    </form>
  );
}
