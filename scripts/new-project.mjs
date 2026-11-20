// Makes a new project folder with every field filled in, ready to edit.
// Usage: npm run new -- my-app "My App"
import { mkdir, writeFile, access } from 'node:fs/promises';

const [slug, ...rest] = process.argv.slice(2);
const name = rest.join(' ') || slug;

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new -- my-app "My App"\nThe first word becomes the URL (/my-app): lowercase letters, numbers and dashes only.');
  process.exit(1);
}
const dir = `content/projects/${slug}`;
if (await access(dir).then(() => true, () => false)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

const md = `---
name: ${name}
# label: Short     # shorter name under the icon, if the name is long
order: 99          # position on the home screen; lower comes first
# hidden: true     # keep the folder but take it off the site
# kind: client     # for work made for someone else
tagline: One line about what it is, under 80 characters.
status: In progress
theme:             # the app's own colours, so its page looks like it
  bg: '#111111'
  fg: '#F5F5F2'
  muted: '#9A9A95'
  accent: '#FFB020'
  onAccent: '#111111'
  line: '#2A2A2A'
  display: "'Inter Tight', system-ui, sans-serif"
  # fonts: family=Inter+Tight:wght@400;600   # Google Fonts, if it needs its own
stats:             # exactly three
  - { value: '1', label: first number worth bragging about }
  - { value: '2', label: second number }
  - { value: '3', label: third number }
what: Two or three sentences on what it does and who it's for.
hardTitle: The hardest problem, as a headline
links:
  # - { label: Try it live, href: 'https://example.com', primary: true }
# screensWide: true   # for landscape screens (TV, banners)
notes:
  stack: [TypeScript]
  # tests: Vitest
  platforms: Web
  when: ${new Date().getFullYear()}
---

The story of the hard part goes here. Plain paragraphs, like an email.
`;

const initial = name.trim()[0]?.toUpperCase() ?? '?';
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#FFB020"/><text x="60" y="80" font-family="system-ui, sans-serif" font-size="60" font-weight="700" text-anchor="middle" fill="#111">${initial}</text></svg>\n`;

await mkdir(`${dir}/screens`, { recursive: true });
await writeFile(`${dir}/project.md`, md);
await writeFile(`${dir}/icon.svg`, icon);
console.log(`Made ${dir}/
  project.md   fill this in
  icon.svg     a placeholder; replace with the real icon (icon.png works too)
  screens/     drop screenshots here: 1.png, 2.png, …
It's live at /${slug} once you run npm run dev.`);
