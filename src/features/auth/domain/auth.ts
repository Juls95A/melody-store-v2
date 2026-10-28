export type Role = "admin" | "user";

// Usuario tal como lo devuelve el backend (sin password)
export type User = {
  id: number;
  nombre: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  nombre: string;
};

// Respuesta del login
export type AuthResponse = {
  token: string;
  user: User;
};

// Respuesta del registro y de /me
export type UserResponse = {
  user: User;
};

export type ErroresLogin = Partial<Record<keyof LoginRequest, string>>;
export type ErroresRegistro = Partial<Record<keyof RegisterRequest, string>>;

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mismas reglas que el backend, para no esperar la respuesta en los errores obvios
export function validarLogin({ email, password }: LoginRequest): ErroresLogin {
  const errores: ErroresLogin = {};
  if (!email.trim()) errores.email = "El correo es obligatorio";
  else if (!PATRON_EMAIL.test(email.trim())) errores.email = "El correo no es válido";
  if (!password) errores.password = "La contraseña es obligatoria";
  else if (password.length < 6) errores.password = "La contraseña debe tener al menos 6 caracteres";
  return errores;
}

export function validarRegistro(datos: RegisterRequest): ErroresRegistro {
  const errores: ErroresRegistro = validarLogin(datos);
  if (!datos.nombre.trim()) errores.nombre = "El nombre es obligatorio";
  else if (datos.nombre.trim().length < 3) errores.nombre = "El nombre debe tener al menos 3 caracteres";
  return errores;
}
