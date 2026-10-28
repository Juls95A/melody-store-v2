import type { ComponentProps } from "react";
import FieldError, { estiloCampo, estiloLabel } from "./FieldError";

type InputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
};

export default function Input({ id, label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-[0.55rem]">
      <label htmlFor={id} className={estiloLabel}>
        {label}
      </label>
      <input
        id={id}
        className={estiloCampo}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-error`}
        {...props}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
