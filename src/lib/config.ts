// src/lib/config.ts

export const SITE_NAME = 'Worklife Squad';

export const EMAIL_FROM =
  'WLS Contact Form <contact-form@mailer.worklifesquad.com>';
export const EMAIL_TO = 'Worklife Squad <hello@worklifesquad.com>';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
] as const;

/** How many of the newest projects the home page shows. */
export const HOME_PROJECT_LIMIT = 4;
