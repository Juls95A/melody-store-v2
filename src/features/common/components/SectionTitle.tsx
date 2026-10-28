import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2
      className={`mb-[0.35rem] font-playfair text-[clamp(2.2rem,4vw,4rem)] leading-none font-normal tracking-[0.02em] text-marfil uppercase before:mb-4 before:block before:h-[3px] before:w-10 before:bg-rojo-brillante before:content-[''] ${className}`}
    >
      {children}
    </h2>
  );
}
