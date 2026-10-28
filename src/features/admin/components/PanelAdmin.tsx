"use client";

import { useState, type KeyboardEvent } from "react";
import AdminProductos from "@/features/productos/components/AdminProductos";
import AdminSolicitudes from "@/features/solicitudes/components/AdminSolicitudes";

const pestanas = [
  { id: "productos", texto: "Productos" },
  { id: "solicitudes", texto: "Solicitudes" },
] as const;

type Pestana = (typeof pestanas)[number]["id"];

export default function PanelAdmin() {
  const [activa, setActiva] = useState<Pestana>("productos");

  // Flechas izquierda/derecha para moverse entre pestañas, como pide el patrón de tabs accesibles
  function moverConTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    const indice = pestanas.findIndex((pestana) => pestana.id === activa);
    const paso = evento.key === "ArrowRight" ? 1 : -1;
    const siguiente = pestanas[(indice + paso + pestanas.length) % pestanas.length];
    setActiva(siguiente.id);
    document.getElementById(`pestana-${siguiente.id}`)?.focus();
  }

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Secciones de administración" className="flex border-b border-linea" onKeyDown={moverConTeclado}>
        {pestanas.map((pestana) => {
          const seleccionada = pestana.id === activa;
          return (
            <button
              key={pestana.id}
              id={`pestana-${pestana.id}`}
              type="button"
              role="tab"
              aria-selected={seleccionada}
              aria-controls={`panel-${pestana.id}`}
              tabIndex={seleccionada ? 0 : -1}
              onClick={() => setActiva(pestana.id)}
              className={`-mb-px border-b-[3px] px-5 py-3 text-[0.68rem] uppercase tracking-[0.13em] transition-colors duration-[180ms] ${
                seleccionada
                  ? "border-rojo-brillante text-marfil"
                  : "border-transparent text-gris hover:text-marfil focus-visible:text-marfil"
              }`}
            >
              {pestana.texto}
            </button>
          );
        })}
      </div>

      <div id={`panel-${activa}`} role="tabpanel" aria-labelledby={`pestana-${activa}`} className="pt-6">
        {activa === "productos" ? <AdminProductos /> : <AdminSolicitudes />}
      </div>
    </div>
  );
}
