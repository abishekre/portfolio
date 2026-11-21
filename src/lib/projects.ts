import fs from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { HOME } from './home';

type Img = { default: ImageMetadata };

// Each project folder holds icon.* and screens/*; they're picked up by name.
const icons = import.meta.glob<Img>('/content/projects/*/icon.{png,svg,jpg,jpeg,webp}', { eager: true });
const shots = import.meta.glob<Img>('/content/projects/*/screens/*.{png,jpg,jpeg,webp}', { eager: true });

const folderOf = (path: string) => path.split('/')[3];

export interface Link {
  kind: 'playStore' | 'web' | 'github';
  label: string;
  href: string;
  primary: boolean;
}

export type Project = CollectionEntry<'projects'> & { icon: ImageMetadata; screens: ImageMetadata[]; links: Link[] };

/** Google Play first, then the web, then GitHub. The first one is the main button. */
function linksOf(d: Project['data']): Link[] {
  const list: Omit<Link, 'primary'>[] = [];
  if (d.playStore) list.push({ kind: 'playStore', label: 'Get it on Google Play', href: d.playStore });
  if (d.web) list.push({ kind: 'web', label: 'Open it on the web', href: d.web });
  if (d.github) list.push({ kind: 'github', label: 'Source on GitHub', href: d.github });
  return list.map((l, i) => ({ ...l, primary: i === 0 }));
}

let warned = false;

/** The apps on the phone, in content/home.yaml's order, without the ones switched off there. */
export async function allProjects(): Promise<Project[]> {
  const byId = new Map((await getCollection('projects')).map((p) => [p.id, p]));

  for (const row of HOME.apps) {
    if (!byId.has(row.app)) throw new Error(`content/home.yaml lists "${row.app}", but there's no content/projects/${row.app}/ folder.`);
  }
  const unlisted = [...byId.keys()].filter((id) => !HOME.apps.some((r) => r.app === id));
  if (unlisted.length && !warned) {
    warned = true;
    console.warn(`[portfolio] Not on the home screen because content/home.yaml doesn't list them: ${unlisted.join(', ')}`);
  }

  return HOME.apps
    .filter((r) => r.show)
    .map((r) => {
      const p = byId.get(r.app)!;
      const icon = Object.entries(icons).find(([path]) => folderOf(path) === p.id)?.[1].default;
      if (!icon) throw new Error(`content/projects/${p.id}/ needs an icon file (icon.png or icon.svg).`);
      const screens = Object.entries(shots)
        .filter(([path]) => folderOf(path) === p.id)
        .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
        .map(([, m]) => m.default);
      return Object.assign(p, { icon, screens, links: linksOf(p.data) });
    });
}

// Share image for a project, or the home one if `npm run og` hasn't made it yet.
export const ogImageFor = (id: string) => (fs.existsSync(`public/og/${id}.png`) ? `/og/${id}.png` : '/og/home.png');

export function counts(list: Project[]) {
  return {
    total: list.length,
    play: list.filter((p) => p.data.playStore).length,
    web: list.filter((p) => p.data.web).length,
    openSource: list.filter((p) => p.data.github).length,
    client: list.filter((p) => p.data.kind === 'client').length,
  };
}
