// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  build: { assets: 'assets' },

  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    open: true,
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [
    react(),
    favicons({
      name: 'Worklife Squad',
      short_name: 'WLS',
    }),
  ],
});
