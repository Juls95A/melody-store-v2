"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

// <dialog> nativo: atrapa el foco, cierra con Escape y deja inerte el resto de la página
export default function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    if (abierto && !elemento.open) elemento.showModal();
    if (!abierto && elemento.open) elemento.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="modal-titulo"
      onClose={onCerrar}
      className="m-auto max-h-[90vh] w-[min(100%-1.5rem,560px)] overflow-y-auto border border-linea bg-carbon p-6 text-marfil backdrop:bg-negro/80 sm:p-8"
    >
      {abierto && (
        <>
          <h3
            id="modal-titulo"
            className="mb-5 font-playfair text-[1.4rem] leading-[1.2] font-normal uppercase before:mb-3 before:block before:h-[3px] before:w-8 before:bg-rojo-brillante before:content-['']"
          >
            {titulo}
          </h3>
          {children}
        </>
      )}
    </dialog>
  );
}
