"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/instrumentos", texto: "Instrumentos" },
  { href: "/accesorios", texto: "Accesorios" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

const estiloEnlace =
  "whitespace-nowrap text-[0.68rem] uppercase tracking-[0.13em] text-gris transition-colors duration-[180ms] hover:text-marfil focus-visible:text-marfil";

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { user, loading, logout } = useAuth();

  const cerrarMenu = () => setAbierto(false);

  // Enlaces según la sesión; mientras se lee localStorage no se muestra nada para evitar parpadeos
  const enlacesSesion = loading
    ? []
    : user
      ? [
          ...(user.role === "admin" ? [{ href: "/admin", texto: "Administración" }] : []),
          { href: "/mis-solicitudes", texto: "Mis solicitudes" },
        ]
      : [{ href: "/login", texto: "Ingresar" }];

  return (
    <header className="relative z-[2] border-b border-linea bg-negro/92">
      <div className="mx-auto flex max-w-[1220px] flex-col items-start gap-3 px-5 py-[1.15rem] lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-[0.55rem] whitespace-nowrap font-cormorant text-[clamp(1.25rem,6vw,1.9rem)] font-medium uppercase tracking-[0.08em] text-marfil after:mb-[0.2rem] after:ml-[0.45rem] after:inline-block after:size-[0.45rem] after:bg-rojo-brillante after:content-['']"
        >
          <Image
            src="/img/logo.png.png"
            alt="Logo Melody Store"
            width={36}
            height={36}
            className="size-[2.2rem] shrink-0 object-contain brightness-170 grayscale"
          />
          <span>Melody Store</span>
        </Link>

        <button
          type="button"
          className="absolute top-3 right-5 flex size-11 flex-col justify-center gap-[5px] rounded-lg border border-white/55 bg-transparent p-[0.65rem] lg:hidden"
          aria-expanded={abierto}
          aria-controls="menu-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="block h-0.5 w-full bg-white" />
          <span className="block h-0.5 w-full bg-white" />
          <span className="block h-0.5 w-full bg-white" />
        </button>

        <nav
          id="menu-principal"
          className={`w-full overflow-hidden transition-[max-height] duration-[220ms] lg:flex lg:max-h-none lg:w-auto lg:items-center lg:gap-[1.6rem] ${
            abierto ? "max-h-[32rem]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-x-[0.8rem] gap-y-2 pt-2 sm:gap-x-4 sm:gap-y-[0.7rem] lg:flex-row lg:gap-[1.6rem] lg:pt-0">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className={estiloEnlace} onClick={cerrarMenu}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>

          {!loading && (
            <ul className="mt-3 flex flex-col gap-y-2 border-t border-linea pt-3 sm:gap-y-[0.7rem] lg:mt-0 lg:flex-row lg:items-center lg:gap-[1.6rem] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-[1.6rem]">
              {user && (
                <li className="whitespace-nowrap text-[0.68rem] uppercase tracking-[0.13em] text-marfil before:mr-[0.45rem] before:inline-block before:size-[0.35rem] before:bg-rojo-brillante before:align-middle before:content-['']">
                  {user.nombre}
                </li>
              )}
              {enlacesSesion.map((enlace) => (
                <li key={enlace.href}>
                  <Link href={enlace.href} className={estiloEnlace} onClick={cerrarMenu}>
                    {enlace.texto}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <button
                    type="button"
                    className={`${estiloEnlace} cursor-pointer`}
                    onClick={() => {
                      cerrarMenu();
                      logout();
                    }}
                  >
                    Salir
                  </button>
                </li>
              )}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
