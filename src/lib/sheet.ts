// What the clipboard on the desk shows for each page. Built at build time, rendered by DeskSheet.astro.
import type { Project } from './projects';
import { counts } from './projects';

export interface DeskSheet {
  /** Pages with the same id share a sheet, so the clipboard doesn't flip between them. */
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  chips?: string[];
  rows?: { label: string; value: string }[];
  links?: { label: string; href: string; primary?: boolean; download?: boolean }[];
  foot?: string;
}

export function homeSheet(list: Project[]): DeskSheet {
  const c = counts(list);
  const rows = [
    c.play && { label: 'On Google Play', value: String(c.play) },
    c.web && { label: 'Open on the web', value: String(c.web) },
    c.openSource && { label: 'Open source', value: String(c.openSource) },
    c.client && { label: 'Made for clients', value: String(c.client) },
  ].filter(Boolean) as { label: string; value: string }[];
  return {
    id: 'home',
    kicker: 'On this phone',
    title: `${c.total} apps`,
    rows,
    foot: 'Open an app and this page turns to its build notes. Keys: arrows move, Esc goes home, L pulls the lamp, P is the power button.',
  };
}

export function projectSheet(p: Project, next: Project): DeskSheet {
  const n = p.data.notes;
  return {
    id: p.id,
    kicker: 'Build notes',
    title: p.data.name,
    subtitle: p.data.status,
    chips: n.stack,
    rows: [
      ...(n.tests ? [{ label: 'Tested with', value: n.tests }] : []),
      { label: 'Runs on', value: n.platforms },
      { label: 'When', value: n.when },
    ],
    links: p.links.map((l) => ({ label: l.primary && l.kind === 'web' ? 'Try it live' : l.label, href: l.href, primary: l.primary })),
    foot: `Esc goes home. Next on the phone: ${next.data.name}.`,
  };
}
