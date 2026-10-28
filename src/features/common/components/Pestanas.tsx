"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

type Pestana = {
  id: string;
  texto: string;
  contenido: ReactNode;
};

type PestanasProps = {
  etiqueta: string;
  pestanas: Pestana[];
};

export default function Pestanas({ etiqueta, pestanas }: PestanasProps) {
  const [activa, setActiva] = useState(pestanas[0]?.id);
  const actual = pestanas.find((pestana) => pestana.id === activa) ?? pestanas[0];

  // Flechas izquierda/derecha para moverse entre pestañas, como pide el patrón de tabs accesibles
  function moverConTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    const indice = pestanas.findIndex((pestana) => pestana.id === actual?.id);
    const paso = evento.key === "ArrowRight" ? 1 : -1;
    const siguiente = pestanas[(indice + paso + pestanas.length) % pestanas.length];
    setActiva(siguiente.id);
    document.getElementById(`pestana-${siguiente.id}`)?.focus();
  }

  if (!actual) return null;

  return (
    <div className="mt-8">
      <div role="tablist" aria-label={etiqueta} className="flex border-b border-linea" onKeyDown={moverConTeclado}>
        {pestanas.map((pestana) => {
          const seleccionada = pestana.id === actual.id;
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

      <div id={`panel-${actual.id}`} role="tabpanel" aria-labelledby={`pestana-${actual.id}`} className="pt-6">
        {actual.contenido}
      </div>
    </div>
  );
}
