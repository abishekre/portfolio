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
    // Position on the home screen; lower comes first.
    order: z.number().default(99),
    // true keeps the folder but takes the project off the site.
    hidden: z.boolean().default(false),
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
    links: z
      .array(z.object({ label: z.string(), href: z.url(), primary: z.boolean().default(false) }))
      // An empty `links:` (or one with only comments under it) means no links.
      .nullish()
      .transform((v) => v ?? []),
    screensAlt: z.string().optional(),
    // Landscape images (TV screens, banners) instead of phone screens.
    screensWide: z.boolean().default(false),
    notes: z.object({
      stack: z.array(z.string()),
      tests: z.string().optional(),
      platforms: z.string(),
      when: z.coerce.string(),
    }),
  }),
});

export const collections = { projects };
