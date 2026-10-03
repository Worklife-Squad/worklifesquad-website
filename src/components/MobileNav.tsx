// src/components/MobileNav.tsx
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { isActivePath } from '@/lib/nav';
import type { NavLink } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  links: readonly NavLink[];
  currentPath: string;
}

export function MobileNav({ links, currentPath }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Open menu"
          />
        }>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {links.map(({ href, label }) => {
            const active = isActivePath(currentPath, href);
            return (
              <a
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm hover:bg-accent',
                  active
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground',
                )}>
                {label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
