// The shape of content/projects/<folder>/project.md. The guide is content/README.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({
    pattern: '*/project.md',
    base: './content/projects',
    // The folder name is the URL: content/projects/tally → /tally
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    name: z.string(),
    // Short name under the home-screen icon.
    label: z.string().optional(),
    kind: z.enum(['app', 'client']).default('app'),
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
    stats: z.array(z.object({ value: z.string(), label: z.string() })).length(3, 'stats needs exactly 3 numbers'),
    what: z.string(),
    hardTitle: z.string(),
    // Links. Buttons are made from these: Google Play first, then the web, then GitHub (public repos only).
    playStore: z.url().optional(),
    web: z.url().optional(),
    github: z.url().optional(),
    screensAlt: z.string().optional(),
    // Landscape images (TV screens, banners) instead of phone screens.
    screensWide: z.boolean().default(false),
    // Shown instead of screenshots when there are none yet (see lumen).
    design: z
      .object({
        title: z.string().optional(),
        swatches: z.array(z.object({ name: z.string(), value: z.string(), note: z.string().optional() })).default([]),
        type: z
          .array(z.object({ name: z.string(), family: z.string(), weight: z.number().default(400), sample: z.string(), size: z.number().default(20) }))
          .default([]),
        rules: z.array(z.string()).default([]),
      })
      .optional(),
    notes: z.object({
      stack: z.array(z.string()),
      tests: z.string().optional(),
      platforms: z.string(),
      when: z.coerce.string(),
    }),
  }),
});

export const collections = { projects };
