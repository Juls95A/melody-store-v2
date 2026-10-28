"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { CLAVE_TOKEN, CLAVE_USUARIO } from "@/features/common/http";
import type { LoginRequest, RegisterRequest, User } from "../domain/auth";
import * as authService from "../services/authService";

type Sesion = {
  token: string | null;
  user: User | null;
  loading: boolean;
};

export type AuthContextValue = Sesion & {
  login: (datos: LoginRequest) => Promise<User>;
  register: (datos: RegisterRequest) => Promise<User>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

// En el servidor y durante la hidratación todavía no se leyó localStorage
const SESION_CARGANDO: Sesion = { token: null, user: null, loading: true };

// --- Sesión guardada en localStorage, expuesta como store externo para useSyncExternalStore ---

const oyentes = new Set<() => void>();
let ultimaLectura: { token: string | null; userJson: string | null; sesion: Sesion } | null = null;

function leerClave(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
}

function parsearUsuario(json: string | null): User | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as User;
  } catch {
    return null;
  }
}

// Devuelve el mismo objeto mientras localStorage no cambie, como exige useSyncExternalStore
function leerSesion(): Sesion {
  const token = leerClave(CLAVE_TOKEN);
  const userJson = leerClave(CLAVE_USUARIO);
  if (ultimaLectura?.token !== token || ultimaLectura.userJson !== userJson) {
    const user = parsearUsuario(userJson);
    // Sin token o sin usuario la sesión no sirve
    const sesion: Sesion = token && user ? { token, user, loading: false } : { token: null, user: null, loading: false };
    ultimaLectura = { token, userJson, sesion };
  }
  return ultimaLectura.sesion;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // "storage" avisa cuando otra pestaña inicia o cierra sesión
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

function guardarSesion(token: string | null, user: User | null) {
  try {
    if (token && user) {
      window.localStorage.setItem(CLAVE_TOKEN, token);
      window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(CLAVE_TOKEN);
      window.localStorage.removeItem(CLAVE_USUARIO);
    }
  } catch {
    // Sin acceso a localStorage la sesión no se puede guardar
  }
  oyentes.forEach((oyente) => oyente());
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const sesion = useSyncExternalStore(suscribir, leerSesion, () => SESION_CARGANDO);

  const login = useCallback(async (datos: LoginRequest) => {
    const { token, user } = await authService.login(datos);
    guardarSesion(token, user);
    return user;
  }, []);

  // Registra y entra directamente con las mismas credenciales
  const register = useCallback(
    async (datos: RegisterRequest) => {
      await authService.register(datos);
      return login({ email: datos.email, password: datos.password });
    },
    [login]
  );

  const logout = useCallback(() => {
    guardarSesion(null, null);
    router.push("/");
  }, [router]);

  const valor = useMemo(() => ({ ...sesion, login, register, logout }), [sesion, login, register, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
