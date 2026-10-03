<!-- README.md -->

# Worklife Squad Website

A static-first Astro site on Cloudflare Workers. Pages are pre-rendered to HTML at build time, project pages are generated from JSON, and a contact form sends email through Resend. Interactive pieces are React islands built with shadcn/ui.

**Stack:** Astro 7, `@astrojs/cloudflare`, React 19, shadcn/ui (Base UI), Tailwind CSS v4, TypeScript, Resend, Wrangler.

## Requirements

- Node 24
- pnpm 12 (the build environment must use the same major version, see [Deployment](#deployment))

## Getting started

```sh
pnpm install
```

Create `.dev.vars` in the project root (gitignored):

```
RESEND_API=re_xxxxxxxx
```

Generate Worker types, then start the dev server:

```sh
pnpm cf-typegen
pnpm dev
```

The site runs at `http://localhost:4321`.

## Commands

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `pnpm dev`        | Start the dev server                               |
| `pnpm build`      | Build to `./dist`                                  |
| `pnpm preview`    | Build, then preview locally on the Workers runtime |
| `pnpm deploy`     | Build and deploy with Wrangler                     |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts`             |
| `pnpm format`     | Format the codebase with Prettier                  |
| `pnpm typecheck`  | Run the TypeScript compiler without emitting       |

Run `pnpm cf-typegen` again whenever `wrangler.jsonc` or `.dev.vars` changes.

## How it works

- **Build time:** every page is prerendered to static HTML in `dist/` and served by Cloudflare's static assets.
- **Request time:** only `src/pages/api/contact.ts` runs in the Worker (`export const prerender = false`). Requests that match no static file fall through to the Worker.
- **Islands:** React components hydrate only where a `client:*` directive is used (`ContactForm`, `ThemeToggle`, `MobileNav`, `AppToaster`, `ImageGallery`). shadcn components used without a directive, such as `Card` and `Badge`, render to plain HTML.
- **Contact flow:** `ContactForm` posts `FormData` to `/api/contact` through `submitContact()`. The endpoint checks the honeypot field, validates the input, then sends the email. It returns `422` with per-field errors, `502` if Resend fails, and `200` on success. The shared response type is `ContactResponse` in `src/lib/types.ts`.
- **Theme:** `ThemeScript.astro` applies the saved or system theme before first paint. `useTheme()` toggles the `dark` class on `<html>` and stores the choice in `localStorage`.
- **Gallery:** `[slug].astro` calls `buildGalleryImages()` at build time, which uses `getImage()` to make a thumbnail and a large version of each image listed in the project JSON. `ImageGallery` receives plain URLs, so the optimized images work inside React. Clicking a thumbnail opens `GalleryLightbox` (a shadcn `Dialog`) with previous and next buttons and arrow key support.

## Common tasks

**Add a project**

1. Add images to `src/assets/projects/<slug>/`.
2. Create `src/content/projects/<slug>.json` using the fields in `src/content.config.ts`. Image paths are relative to the JSON file, for example `../../assets/projects/<slug>/image-1.png`.
3. The page appears at `/projects/<slug>` and in the list at `/projects`. The home page shows the newest `HOME_PROJECT_LIMIT` projects (set in `src/lib/config.ts`). The build fails if a field or image path is wrong.

**Add a page:** create a `.astro` file in `src/pages/`, wrap it in `Layout`, and pass `title` and `description`. Add a link in `NAV_LINKS` in `src/lib/config.ts`.

**Add a shadcn component:**

```sh
pnpm dlx shadcn@latest add <component>
```

Components land in `src/components/ui/`. Do not edit them by hand unless you need to change the design system.

**Change the email sender or recipient:** edit `EMAIL_FROM` and `EMAIL_TO` in `src/lib/config.ts`. The sender domain must be verified in Resend.

## Secrets and config

| Name         | Where                                                               | Purpose        |
| :----------- | :------------------------------------------------------------------ | :------------- |
| `RESEND_API` | `.dev.vars` locally, `wrangler secret put RESEND_API` in production | Resend API key |

Read secrets in server code with `import { env } from 'cloudflare:workers'`. The older `Astro.locals.runtime` API no longer exists.

## Deployment

**Wrangler:** `pnpm deploy`.

**Git-connected builds (Workers Builds):** the build image may default to an older pnpm. This repo's `pnpm-workspace.yaml` uses pnpm 12 settings, so set a build variable `PNPM_VERSION` to the version you use locally (`pnpm -v`). Set `RESEND_API` as a runtime secret, not a build variable.

## Conventions

- Prettier config in `.prettierrc` (single quotes, 80 columns, trailing commas). Run `pnpm format` before committing.
- Import from `src/` with the `@/` alias (for example `@/lib/config`).
- Keep route files thin and put logic in `src/lib/` (plain functions) or `src/hooks/` (React state).
- One responsibility per file, with the file path as a comment on the first line.
- Use `.astro` for static markup and React only where interactivity is needed.
- Use theme tokens (`text-muted-foreground`, `border-border`, `bg-background`) instead of fixed colors such as `slate-*`, so the dark theme works.
- Tailwind utility classes in markup. The only stylesheet is `src/styles/global.css`.

## Known gaps and next steps

- Spam protection is a honeypot only. Add Cloudflare Turnstile and the Rate Limiting binding.
- Set `site` in `astro.config.mjs` so canonical URLs are rendered.
- Add `@astrojs/sitemap` and JSON-LD structured data for SEO.
- Replace the placeholder favicon and sample images.
