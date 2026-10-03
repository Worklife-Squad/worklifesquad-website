// src/components/ImageGallery.tsx
import { GalleryLightbox } from '@/components/GalleryLightbox';
import { useGalleryNavigation } from '@/hooks/use-gallery-navigation';
import type { GalleryImage } from '@/lib/types';

interface ImageGalleryProps {
  images: readonly GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const gallery = useGalleryNavigation(images.length);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.full.src}>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`View larger: ${image.alt}`}
              onClick={() => gallery.open(index)}
              className="group block w-full overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <img
                src={image.thumb.src}
                width={image.thumb.width}
                height={image.thumb.height}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <GalleryLightbox
        images={images}
        index={gallery.index}
        open={gallery.isOpen}
        onClose={gallery.close}
        onNext={gallery.next}
        onPrev={gallery.prev}
      />
    </>
  );
}
