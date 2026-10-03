// src/components/AppToaster.tsx
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';

// Passing `theme` explicitly means the generated ui/sonner.tsx never needs to
// read the theme from next-themes.
export function AppToaster() {
  const { theme } = useTheme();

  return <Toaster theme={theme} position="bottom-right" />;
}
