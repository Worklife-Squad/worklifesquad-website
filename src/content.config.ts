// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      description: z.string(),
      client: z.string(),
      year: z.number().int(),
      tags: z.array(z.string()).default([]),
      images: z.array(z.object({ src: image(), alt: z.string() })).min(1),
    }),
});

export const collections = { projects };
