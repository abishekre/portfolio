// Reads content/home.yaml: which apps are on the phone, in what order, plus widgets and lock-screen notes.
import { z } from 'astro/zod';
import { loadYaml, blank } from './yaml';
import raw from '../../content/home.yaml?raw';

export const HOME = loadYaml(
  raw,
  z.object({
    apps: z.array(z.object({ app: z.string(), show: z.boolean().default(true) })),
    nowBuilding: z.object({ app: z.string(), note: z.string().default('') }).optional(),
    photo: z
      .object({ app: z.string(), screen: z.number().int().min(1).default(1), caption: z.string().default('') })
      .optional(),
    milestones: z
      .array(z.object({ title: z.string(), text: z.string(), app: blank(z.string()) }))
      .nullish()
      .transform((v) => v ?? []),
  }),
  'content/home.yaml',
);
