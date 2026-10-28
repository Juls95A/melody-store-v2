import { request } from "@/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User, UserResponse } from "../domain/auth";

const RUTA = "/api/auth";

export function login(datos: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>(`${RUTA}/login`, { method: "POST", body: datos });
}

// El registro no devuelve token: para entrar hay que llamar a login después
export async function register(datos: RegisterRequest): Promise<User> {
  const { user } = await request<UserResponse>(`${RUTA}/register`, { method: "POST", body: datos });
  return user;
}

export async function me(): Promise<User> {
  const { user } = await request<UserResponse>(`${RUTA}/me`);
  return user;
}
