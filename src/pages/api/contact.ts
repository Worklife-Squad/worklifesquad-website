// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { sendContactEmail } from '@/lib/email';
import type { ContactResponse } from '@/lib/types';
import { isHoneypotFilled, validateContact } from '@/lib/validation';

export const prerender = false;

function json(body: ContactResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form submission.' }, 400);
  }

  // Bots fill the hidden field. Pretend it worked and send nothing.
  if (isHoneypotFilled(formData)) {
    return json({ ok: true }, 200);
  }

  const result = validateContact(formData);
  if (!result.ok) {
    return json({ ok: false, errors: result.errors }, 422);
  }

  try {
    await sendContactEmail(result.data);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error(error);
    return json(
      { ok: false, error: 'Could not send your message. Please try again.' },
      502,
    );
  }
};
