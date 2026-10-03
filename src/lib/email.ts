// src/lib/email.ts
import { env } from 'cloudflare:workers';
import { EMAIL_FROM, EMAIL_TO } from './config';
import type { ContactInput } from './validation';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendContactEmail({
  name,
  email,
  message,
}: ContactInput): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      reply_to: email,
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${detail}`);
  }
}
