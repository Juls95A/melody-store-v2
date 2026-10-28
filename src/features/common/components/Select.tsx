import type { ComponentProps } from "react";
import FieldError, { estiloCampo, estiloLabel } from "./FieldError";

type Opcion = {
  value: string;
  label: string;
};

type SelectProps = ComponentProps<"select"> & {
  id: string;
  label: string;
  opciones: Opcion[];
  placeholder?: string;
  error?: string;
};

export default function Select({ id, label, opciones, placeholder, error, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-[0.55rem]">
      <label htmlFor={id} className={estiloLabel}>
        {label}
      </label>
      <select
        id={id}
        className={estiloCampo}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-error`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
