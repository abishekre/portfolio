import fs from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

type Img = { default: ImageMetadata };

// Each project folder holds icon.* and screens/*; they're picked up by name.
const icons = import.meta.glob<Img>('/content/projects/*/icon.{png,svg,jpg,jpeg,webp}', { eager: true });
const shots = import.meta.glob<Img>('/content/projects/*/screens/*.{png,jpg,jpeg,webp}', { eager: true });

const folderOf = (path: string) => path.split('/')[3];

export type Project = CollectionEntry<'projects'> & { icon: ImageMetadata; screens: ImageMetadata[] };

export async function allProjects(): Promise<Project[]> {
  const list = (await getCollection('projects')).filter((p) => !p.data.hidden);
  return list
    .map((p) => {
      const icon = Object.entries(icons).find(([path]) => folderOf(path) === p.id)?.[1].default;
      if (!icon) throw new Error(`content/projects/${p.id}/ needs an icon file (icon.png or icon.svg).`);
      const screens = Object.entries(shots)
        .filter(([path]) => folderOf(path) === p.id)
        .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
        .map(([, m]) => m.default);
      return Object.assign(p, { icon, screens });
    })
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export const findProject = async (id?: string) => (id ? (await allProjects()).find((p) => p.id === id) : undefined);

// Share image for a project, or the home one if `npm run og` hasn't made it yet.
export const ogImageFor = (id: string) =>
  fs.existsSync(`public/og/${id}.png`) ? `/og/${id}.png` : '/og/home.png';

export const isPlayStore = (href: string) => href.includes('play.google.com');

export function counts(list: Project[]) {
  const links = list.flatMap((p) => p.data.links);
  return {
    total: list.length,
    play: links.filter((l) => isPlayStore(l.href)).length,
    web: links.filter((l) => !isPlayStore(l.href)).length,
  };
}
