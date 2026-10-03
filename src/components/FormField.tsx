// src/components/FormField.tsx
import type { ReactNode } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface FormFieldProps {
  /** Must match the `id` of the control passed as children. */
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ name, label, error, children }: FormFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
