// src/components/ContactForm.tsx
import { FormField } from '@/components/FormField';
import { HoneypotField } from '@/components/HoneypotField';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactForm } from '@/hooks/use-contact-form';

const TEXT_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
] as const;

export function ContactForm() {
  const { errors, pending, handleSubmit } = useContactForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <FieldGroup>
        {TEXT_FIELDS.map(({ name, label, type, autoComplete }) => (
          <FormField key={name} name={name} label={label} error={errors[name]}>
            <Input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              required
              aria-invalid={Boolean(errors[name])}
            />
          </FormField>
        ))}

        <FormField name="message" label="Message" error={errors.message}>
          <Textarea
            id="message"
            name="message"
            rows={6}
            required
            aria-invalid={Boolean(errors.message)}
          />
        </FormField>

        <HoneypotField />

        <div>
          <Button type="submit" disabled={pending}>
            {pending ? 'Sending...' : 'Send message'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
