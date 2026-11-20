import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function allProjects(): Promise<Project[]> {
  const list = await getCollection('projects');
  return list.sort((a, b) => a.data.order - b.data.order);
}

export const isPlayStore = (href: string) => href.includes('play.google.com');

export function counts(list: Project[]) {
  const links = list.flatMap((p) => p.data.links);
  return {
    total: list.length,
    play: links.filter((l) => isPlayStore(l.href)).length,
    web: links.filter((l) => !isPlayStore(l.href)).length,
  };
}
