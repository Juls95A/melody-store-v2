type FieldErrorProps = {
  id: string;
  error?: string;
};

export default function FieldError({ id, error }: FieldErrorProps) {
  return (
    <p id={id} className="min-h-[1.4rem] text-[0.65rem] text-error" aria-live="polite">
      {error}
    </p>
  );
}

export const estiloCampo =
  "w-full border border-linea bg-carbon px-[0.9rem] py-[0.8rem] text-xs text-marfil transition duration-[180ms] placeholder:text-gris-oscuro focus:border-marfil focus:outline-none focus:ring-2 focus:ring-marfil/12 aria-invalid:border-error-borde";

export const estiloLabel = "mt-[0.35rem] text-[0.68rem] font-medium uppercase text-gris";
