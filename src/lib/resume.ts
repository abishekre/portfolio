// Reads content/resume.yaml and content/certs.yaml.
import type { ImageMetadata } from 'astro';
import { z } from 'astro/zod';
import { loadYaml, blank } from './yaml';
import resumeRaw from '../../content/resume.yaml?raw';
import certsRaw from '../../content/certs.yaml?raw';

const month = blank(z.coerce.string());

export const RESUME = loadYaml(
  resumeRaw,
  z.object({
    headline: z.string(),
    location: z.string(),
    summary: z.string(),
    experience: z.array(
      z.object({
        company: z.string(),
        role: z.string(),
        start: z.coerce.string(),
        end: month,
        place: blank(z.string()),
        points: z.array(z.string()).default([]),
        tools: z.array(z.string()).default([]),
      }),
    ),
    projects: z.array(z.string()).default([]),
    clients: z.array(z.object({ industry: z.string(), region: z.string(), product: z.string() })).default([]),
    skills: z.array(z.object({ group: z.string(), items: z.string() })).default([]),
    education: z.array(z.object({ school: z.string(), degree: z.string(), start: z.coerce.string(), end: month })),
  }),
  'content/resume.yaml',
);

type Img = { default: ImageMetadata };
const certImages = import.meta.glob<Img>('/content/certs/*.{png,jpg,jpeg,webp,svg}', { eager: true });

const certList = loadYaml(
  certsRaw,
  z.object({
    certs: z.array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: month,
        image: blank(z.string()),
        colour: z.string().default('#2A2620'),
        url: blank(z.url()),
        show: z.boolean().default(true),
      }),
    ),
  }),
  'content/certs.yaml',
).certs;

export const CERTS = certList
  .filter((c) => c.show)
  .map((c) => {
    // The web editor may store a path ("content/certs/x.png", "/content/certs/x.png"); only the file name matters.
    const file = c.image?.split('/').pop();
    const image = file ? certImages[`/content/certs/${file}`]?.default : undefined;
    if (c.image && !image) throw new Error(`content/certs.yaml: "${c.name}" names image ${c.image}, but content/certs/${c.image} isn't there.`);
    return { ...c, image };
  });
