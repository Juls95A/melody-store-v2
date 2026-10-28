"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import FieldError from "@/features/common/components/FieldError";
import Input from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { validarLogin, type ErroresLogin, type LoginRequest } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [datos, setDatos] = useState<LoginRequest>({ email: "", password: "" });
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(campo: keyof LoginRequest, valor: string) {
    setDatos({ ...datos, [campo]: valor });
    // El error del campo desaparece en cuanto se corrige
    setErrores({ ...errores, [campo]: undefined });
    setErrorGeneral("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const erroresCliente = validarLogin(datos);
    setErrores(erroresCliente);
    setErrorGeneral("");
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    try {
      await login({ email: datos.email.trim(), password: datos.password });
      router.push("/");
    } catch (error) {
      setEnviando(false);
      // 400 trae errores por campo; 401 ("Credenciales inválidas") y los demás van debajo del formulario
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        setErrores({ email: error.errors.email, password: error.errors.password });
      } else {
        setErrorGeneral(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
      }
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-[0.35rem]" aria-describedby="login-error">
      <Input
        id="login-email"
        label="Correo"
        type="email"
        autoComplete="email"
        value={datos.email}
        error={errores.email}
        onChange={(evento) => cambiar("email", evento.target.value)}
      />
      <Input
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={datos.password}
        error={errores.password}
        onChange={(evento) => cambiar("password", evento.target.value)}
      />
      <Button type="submit" className="mt-2" disabled={enviando}>
        {enviando ? "Ingresando..." : "Ingresar"}
      </Button>
      <FieldError id="login-error" error={errorGeneral} />
      <p className="text-[0.68rem] text-gris">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-marfil underline underline-offset-4 hover:text-rojo-brillante">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
