// src/lib/types.ts
import type { FieldErrors } from '@/lib/validation';

export interface NavLink {
  href: string;
  label: string;
}

/** Shape returned by POST /api/contact, shared by the route and the client. */
export type ContactResponse =
  { ok: true } | { ok: false; errors?: FieldErrors; error?: string };

export interface GalleryImageSource {
  src: string;
  width: number;
  height: number;
}

/** An image prepared at build time for the React gallery island. */
export interface GalleryImage {
  alt: string;
  thumb: GalleryImageSource;
  full: GalleryImageSource;
}
