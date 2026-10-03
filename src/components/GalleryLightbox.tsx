// src/components/GalleryLightbox.tsx
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GalleryImage } from '@/lib/types';

interface GalleryLightboxProps {
  images: readonly GalleryImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function GalleryLightbox({
  images,
  index,
  open,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const total = images.length;
  const hasMany = total > 1;
  const image = images[index];

  // Load the neighbours early so previous and next feel instant.
  useEffect(() => {
    if (!open || !hasMany) return;
    for (const offset of [1, -1]) {
      const neighbour = images[(index + offset + total) % total];
      new window.Image().src = neighbour.full.src;
    }
  }, [open, hasMany, images, index, total]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMany) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrev();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-4xl"
        onKeyDown={handleKeyDown}>
        <DialogTitle className="sr-only">{image.alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Image {index + 1} of {total}
        </DialogDescription>

        <div className="relative flex min-h-48 items-center justify-center bg-muted">
          <img
            key={image.full.src}
            src={image.full.src}
            width={image.full.width}
            height={image.full.height}
            alt={image.alt}
            className="h-auto max-h-[75vh] w-auto max-w-full object-contain"
          />
          {hasMany && (
            <>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Previous image"
                onClick={onPrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full">
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Next image"
                onClick={onNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full">
                <ChevronRightIcon />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <p className="truncate">{image.alt}</p>
          <p className="shrink-0 text-muted-foreground tabular-nums">
            {index + 1} / {total}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
