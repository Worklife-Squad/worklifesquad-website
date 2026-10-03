// src/lib/gallery.ts
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import type { GalleryImage, GalleryImageSource } from '@/lib/types';

const THUMB_WIDTH = 640;
const FULL_WIDTH = 1920;

interface ProjectImage {
  src: ImageMetadata;
  alt: string;
}

async function resize(
  src: ImageMetadata,
  maxWidth: number,
): Promise<GalleryImageSource> {
  // Never ask for more pixels than the original has.
  const image = await getImage({ src, width: Math.min(maxWidth, src.width) });
  return {
    src: image.src,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
  };
}

/** Builds optimized thumbnail and full size versions of every image. */
export function buildGalleryImages(
  images: readonly ProjectImage[],
): Promise<GalleryImage[]> {
  return Promise.all(
    images.map(async ({ src, alt }) => ({
      alt,
      thumb: await resize(src, THUMB_WIDTH),
      full: await resize(src, FULL_WIDTH),
    })),
  );
}
