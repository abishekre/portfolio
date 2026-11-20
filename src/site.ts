// Reads content/site.yaml. Edit that file, not this one.
import { parse } from 'yaml';
import { z } from 'astro/zod';
import raw from '../content/site.yaml?raw';

const schema = z.object({
  name: z.string(),
  bio: z.string(),
  description: z.string().default(''),
  city: z.string(),
  lat: z.number(),
  lon: z.number(),
  email: z.string(),
  github: z.url(),
  linkedin: z.url(),
  nowBuilding: z.object({ project: z.string(), note: z.string().default('') }).optional(),
  photo: z
    .object({ project: z.string(), screen: z.number().int().min(1).default(1), caption: z.string().default('') })
    .optional(),
  skills: z.record(z.string(), z.string()).default({}),
});

const result = schema.safeParse(parse(raw));
if (!result.success) {
  throw new Error(`content/site.yaml has a problem:\n${z.prettifyError(result.error)}`);
}

export const SITE = { ...result.data, resumePdf: '/resume.pdf' };
