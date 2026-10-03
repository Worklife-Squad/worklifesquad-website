// src/lib/contact-client.ts
import type { ContactResponse } from '@/lib/types';

const CONTACT_ENDPOINT = '/api/contact';

/** Posts the form and always resolves with a ContactResponse. */
export async function submitContact(
  formData: FormData,
): Promise<ContactResponse> {
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    return (await response.json()) as ContactResponse;
  } catch {
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}
