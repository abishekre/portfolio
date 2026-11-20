import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // Short name under the home-screen icon.
      label: z.string().optional(),
      order: z.number(),
      kind: z.enum(['app', 'client']).default('app'),
      icon: image(),
      // One line under the name. Keep it under ~80 characters.
      tagline: z.string(),
      status: z.string(),
      theme: z.object({
        bg: z.string(),
        fg: z.string(),
        muted: z.string(),
        accent: z.string(),
        onAccent: z.string(),
        line: z.string(),
        display: z.string(),
        body: z.string().optional(),
        // Google Fonts `family=` params, joined with &.
        fonts: z.string().optional(),
      }),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).length(3),
      what: z.string(),
      hardTitle: z.string(),
      links: z
        .array(z.object({ label: z.string(), href: z.url(), primary: z.boolean().default(false) }))
        .default([]),
      screens: z.array(image()).default([]),
      screensAlt: z.string().optional(),
      notes: z.object({
        stack: z.array(z.string()),
        tests: z.string().optional(),
        platforms: z.string(),
        when: z.coerce.string(),
      }),
    }),
});

export const collections = { projects };
