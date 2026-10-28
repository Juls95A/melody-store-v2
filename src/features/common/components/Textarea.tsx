import type { ComponentProps } from "react";
import FieldError, { estiloCampo, estiloLabel } from "./FieldError";

type TextareaProps = ComponentProps<"textarea"> & {
  id: string;
  label: string;
  error?: string;
};

export default function Textarea({ id, label, error, rows = 5, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-[0.55rem]">
      <label htmlFor={id} className={estiloLabel}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`${estiloCampo} resize-y`}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-error`}
        {...props}
      />
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
