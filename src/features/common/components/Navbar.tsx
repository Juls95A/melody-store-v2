"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/instrumentos", texto: "Instrumentos" },
  { href: "/accesorios", texto: "Accesorios" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

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
          className={`w-full overflow-hidden transition-[max-height] duration-[220ms] lg:max-h-none lg:w-auto ${
            abierto ? "max-h-80" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-x-[0.8rem] gap-y-2 pt-2 sm:gap-x-4 sm:gap-y-[0.7rem] lg:flex-row lg:gap-[1.6rem] lg:pt-0">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="whitespace-nowrap text-[0.68rem] uppercase tracking-[0.13em] text-gris transition-colors duration-[180ms] hover:text-marfil focus-visible:text-marfil"
                  onClick={() => setAbierto(false)}
                >
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
