// src/hooks/use-contact-form.ts
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { submitContact } from '@/lib/contact-client';
import type { FieldErrors } from '@/lib/validation';

export function useContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // currentTarget is cleared once the event finishes, so keep a reference.
    const form = event.currentTarget;

    setErrors({});
    setPending(true);

    const result = await submitContact(new FormData(form));
    setPending(false);

    if (result.ok) {
      form.reset();
      toast.success('Thanks, your message has been sent.');
      return;
    }

    setErrors(result.errors ?? {});
    toast.error(result.error ?? 'Please fix the highlighted fields.');
  }

  return { errors, pending, handleSubmit };
}
