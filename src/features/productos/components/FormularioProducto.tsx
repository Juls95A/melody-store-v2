"use client";

import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import FieldError from "@/features/common/components/FieldError";
import Input from "@/features/common/components/Input";
import Select from "@/features/common/components/Select";
import Textarea from "@/features/common/components/Textarea";
import { ApiError } from "@/features/common/http";
import {
  aDatosProducto,
  CATEGORIAS,
  NOMBRES_CATEGORIA,
  validarProducto,
  type DatosProducto,
  type ErroresProducto,
  type FormularioProducto as DatosFormulario,
} from "../domain/producto";

type FormularioProductoProps = {
  inicial: DatosFormulario;
  guardando: boolean;
  textoEnviar: string;
  onGuardar: (datos: DatosProducto) => Promise<void>;
  onCancelar: () => void;
};

const opcionesCategoria = CATEGORIAS.map((categoria) => ({ value: categoria, label: NOMBRES_CATEGORIA[categoria] }));

export default function FormularioProducto({ inicial, guardando, textoEnviar, onGuardar, onCancelar }: FormularioProductoProps) {
  const [datos, setDatos] = useState<DatosFormulario>(inicial);
  const [errores, setErrores] = useState<ErroresProducto>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(campo: keyof DatosFormulario, valor: string) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setErrorGeneral("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const erroresCliente = validarProducto(datos);
    setErrores(erroresCliente);
    setErrorGeneral("");
    if (Object.keys(erroresCliente).length > 0) return;

    try {
      await onGuardar(aDatosProducto(datos));
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        const { nombre, categoria, precio, descripcion, imagen } = error.errors;
        setErrores({ nombre, categoria, precio, descripcion, imagen });
      } else {
        setErrorGeneral(error instanceof Error ? error.message : "No se pudo guardar el producto.");
      }
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-[0.35rem]" aria-describedby="producto-error">
      <Input
        id="producto-nombre"
        label="Nombre"
        value={datos.nombre}
        error={errores.nombre}
        onChange={(evento) => cambiar("nombre", evento.target.value)}
      />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Select
          id="producto-categoria"
          label="Categoría"
          opciones={opcionesCategoria}
          placeholder="Selecciona una categoría"
          value={datos.categoria}
          error={errores.categoria}
          onChange={(evento) => cambiar("categoria", evento.target.value)}
        />
        <Input
          id="producto-precio"
          label="Precio (COP)"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="Ej. 1299000"
          value={datos.precio}
          error={errores.precio}
          onChange={(evento) => cambiar("precio", evento.target.value)}
        />
      </div>
      <Textarea
        id="producto-descripcion"
        label="Descripción"
        rows={3}
        value={datos.descripcion}
        error={errores.descripcion}
        onChange={(evento) => cambiar("descripcion", evento.target.value)}
      />
      <Input
        id="producto-imagen"
        label="Imagen"
        placeholder="/img/guitarra_electrica.png"
        value={datos.imagen}
        error={errores.imagen}
        onChange={(evento) => cambiar("imagen", evento.target.value)}
      />
      <FieldError id="producto-error" error={errorGeneral} />
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : textoEnviar}
        </Button>
        <Button variante="secundario" disabled={guardando} onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
