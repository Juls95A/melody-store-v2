"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import FieldError from "@/features/common/components/FieldError";
import Input from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { validarRegistro, type ErroresRegistro, type RegisterRequest } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [datos, setDatos] = useState<RegisterRequest>({ nombre: "", email: "", password: "" });
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(campo: keyof RegisterRequest, valor: string) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setErrorGeneral("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const erroresCliente = validarRegistro(datos);
    setErrores(erroresCliente);
    setErrorGeneral("");
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    try {
      await register({ nombre: datos.nombre.trim(), email: datos.email.trim(), password: datos.password });
      router.push("/");
    } catch (error) {
      setEnviando(false);
      // 409 ("Este correo ya está registrado") y 400 traen el mensaje de cada campo
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        setErrores({ nombre: error.errors.nombre, email: error.errors.email, password: error.errors.password });
      } else {
        setErrorGeneral(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
      }
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-[0.35rem]" aria-describedby="registro-error">
      <Input
        id="registro-nombre"
        label="Nombre"
        autoComplete="name"
        value={datos.nombre}
        error={errores.nombre}
        onChange={(evento) => cambiar("nombre", evento.target.value)}
      />
      <Input
        id="registro-email"
        label="Correo"
        type="email"
        autoComplete="email"
        value={datos.email}
        error={errores.email}
        onChange={(evento) => cambiar("email", evento.target.value)}
      />
      <Input
        id="registro-password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        value={datos.password}
        error={errores.password}
        onChange={(evento) => cambiar("password", evento.target.value)}
      />
      <Button type="submit" className="mt-2" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
      <FieldError id="registro-error" error={errorGeneral} />
      <p className="text-[0.68rem] text-gris">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-marfil underline underline-offset-4 hover:text-rojo-brillante">
          Ingresa
        </Link>
      </p>
    </form>
  );
}
