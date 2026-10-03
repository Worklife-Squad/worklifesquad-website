// src/components/HoneypotField.tsx
import { Input } from '@/components/ui/input';
import { HONEYPOT_FIELD } from '@/lib/validation';

/** Hidden from people, filled in by bots. See isHoneypotFilled(). */
export function HoneypotField() {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <Input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
