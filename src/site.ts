// Reads content/site.yaml. Edit that file, not this one.
import { z } from 'astro/zod';
import { loadYaml } from './lib/yaml';
import raw from '../content/site.yaml?raw';

export const SITE = {
  ...loadYaml(
    raw,
    z.object({
      name: z.string(),
      bio: z.string(),
      description: z.string().default(''),
      city: z.string(),
      lat: z.number(),
      lon: z.number(),
      hometown: z.string().optional(),
      email: z.string(),
      github: z.url(),
      linkedin: z.url(),
    }),
    'content/site.yaml',
  ),
  resumePdf: '/resume.pdf',
};
