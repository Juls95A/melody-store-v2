import Link from "next/link";
import type { ComponentProps } from "react";

type Variante = "principal" | "secundario";

type ButtonProps = ComponentProps<"button"> & {
  variante?: Variante;
  href?: string;
};

const estilos: Record<Variante, string> = {
  principal:
    "inline-flex min-h-11 w-fit items-center justify-center border border-marfil bg-transparent px-[1.35rem] py-[0.9rem] text-[0.68rem] uppercase tracking-[0.12em] text-marfil transition duration-[180ms] hover:-translate-y-0.5 hover:border-rojo-brillante hover:bg-rojo-brillante focus-visible:-translate-y-0.5 focus-visible:border-rojo-brillante focus-visible:bg-rojo-brillante disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
  secundario:
    "inline-flex w-fit items-center justify-center border-b border-marfil text-[0.68rem] uppercase tracking-[0.12em] text-marfil transition-colors duration-[180ms] hover:border-rojo-brillante hover:text-rojo-brillante focus-visible:border-rojo-brillante focus-visible:text-rojo-brillante",
};

export default function Button({
  variante = "principal",
  href,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const clases = `${estilos[variante]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={clases} {...props}>
      {children}
    </button>
  );
}
