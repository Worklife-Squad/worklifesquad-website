// src/hooks/use-gallery-navigation.ts
import { useCallback, useState } from 'react';

/**
 * Open state and current index for a lightbox. The index is kept when the
 * lightbox closes so the closing animation does not flash another image.
 */
export function useGalleryNavigation(count: number) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = useCallback((target: number) => {
    setIndex(target);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(
    () => setIndex((current) => (current + 1) % count),
    [count],
  );

  const prev = useCallback(
    () => setIndex((current) => (current - 1 + count) % count),
    [count],
  );

  return { isOpen, index, open, close, next, prev };
}
