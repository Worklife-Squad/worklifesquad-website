// src/lib/validation.ts

export const HONEYPOT_FIELD = 'website';

const LIMITS = { name: 100, email: 254, message: 5000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ValidationResult =
  { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors };

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export function isHoneypotFilled(formData: FormData): boolean {
  return readText(formData, HONEYPOT_FIELD) !== '';
}

export function validateContact(formData: FormData): ValidationResult {
  const data: ContactInput = {
    name: readText(formData, 'name'),
    email: readText(formData, 'email'),
    message: readText(formData, 'message'),
  };
  const errors: FieldErrors = {};

  if (!data.name) {
    errors.name = 'Please enter your name.';
  } else if (data.name.length > LIMITS.name) {
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
  }

  if (!data.email) {
    errors.email = 'Please enter your email address.';
  } else if (
    data.email.length > LIMITS.email ||
    !EMAIL_PATTERN.test(data.email)
  ) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.message) {
    errors.message = 'Please enter a message.';
  } else if (data.message.length > LIMITS.message) {
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}
