import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The apps switched on in content/home.yaml, in order, with their display names.
const projects = [...readFileSync('content/home.yaml', 'utf8').matchAll(/- \{ app: ([\w-]+), show: (true|false) \}/g)]
  .filter((m) => m[2] === 'true')
  .map(([, slug]) => {
    const src = readFileSync(`content/projects/${slug}/project.md`, 'utf8');
    const field = (k: string) => new RegExp(`^${k}: (.+)$`, 'm').exec(src)?.[1].trim();
    return { slug, name: field('name')!, links: ['playStore', 'web', 'github'].filter((k) => field(k)) };
  });

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

// Most tests start past the lock screen, as a returning visitor would.
test.beforeEach(async ({ page }, info) => {
  if (info.title.startsWith('lock screen')) return;
  await page.addInitScript(() => {
    localStorage.setItem('pf-unlocked', '1');
    localStorage.setItem('pf-peeked', '1');
  });
});

test.describe('home screen', () => {
  test('shows every app, the dock and the list link', async ({ page }) => {
    await page.goto('/');
    for (const p of projects) await expect(page.locator(`a.app[href="/${p.slug}"]`)).toBeVisible();
    await expect(page.locator('a.app[href="/notes"]')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'List view' })).toBeVisible();
  });

  test('desk and frame only on wide screens', async ({ page }) => {
    await page.goto('/');
    const desk = page.locator('.desk-l');
    const radius = await page.locator('.phone').evaluate((el) => getComputedStyle(el).borderRadius);
    if (isMobile(page)) {
      await expect(desk).toBeHidden();
      expect(radius).toBe('0px');
      await expect(page.getByText('Abishek R Edakkalathur').first()).toBeVisible();
    } else {
      await expect(desk).toBeVisible();
      expect(radius).not.toBe('0px');
    }
  });

  test('long-press starts jiggle mode, Done ends it', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('a.app[href="/tally"]');
    const box = (await icon.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.waitForTimeout(800);
    await page.mouse.up();
    await expect(page.locator('[data-home]')).toHaveClass(/jiggle/);
    await expect(page).toHaveURL('/');
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('[data-home]')).not.toHaveClass(/jiggle/);
  });
});

test.describe('apps', () => {
  for (const p of projects) {
    test(`${p.slug}: opens from its icon and closes again`, async ({ page }) => {
      await page.goto('/');
      await page.locator(`a.app[href="/${p.slug}"]`).click();
      await expect(page).toHaveURL(`/${p.slug}`);
      await expect(page.getByRole('heading', { level: 1, name: p.name })).toBeVisible();
      await expect(page.locator('.stats li')).toHaveCount(3);
      if (isMobile(page)) {
        await page.goBack();
      } else {
        await page.keyboard.press('Escape');
      }
      await expect(page).toHaveURL('/');
      await expect(page.locator(`a.app[href="/${p.slug}"]`)).toBeVisible();
    });

    test(`${p.slug}: works as a direct link`, async ({ page }) => {
      const res = await page.goto(`/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: p.name })).toBeVisible();
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new RegExp(`/og/${p.slug}\\.png$`));
      // Buttons follow the link rule: Play Store, then web, then GitHub; none if it has none.
      await expect(page.locator('.appview .links .btn')).toHaveCount(p.links.length);
      const notes = page.locator('.in-app-notes');
      if (isMobile(page)) await expect(notes).toBeVisible();
      else await expect(notes).toBeHidden();
    });
  }
});

test('keyboard: arrows move between icons, Enter opens', async ({ page }) => {
  test.skip(isMobile(page), 'keyboard is a desktop path');
  await page.goto('/');
  await page.locator(`a.app[href="/${projects.find((p) => p.slug === 'tally')!.slug}"]`).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('a.app[href="/bytwo"]')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('a.app[href="/kallan"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/kallan');
});

test('notes, résumé, list and 404 render', async ({ page }) => {
  await page.goto('/notes');
  await expect(page.getByRole('heading', { name: 'hi,' })).toBeVisible();
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Abishek R Edakkalathur' })).toBeVisible();
  await page.goto('/list');
  await expect(page.locator('.appview li')).toHaveCount(projects.length);
  const res = await page.goto('/no-such-app');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'App not installed' })).toBeVisible();
});

test('sitemap lists every project', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const p of projects) expect(xml).toContain(`/${p.slug}</loc>`);
  expect(xml).not.toContain('/og/');
});

test('/hearth now goes to /lumen', async () => {
  const v = JSON.parse(readFileSync('vercel.json', 'utf8'));
  expect(v.redirects).toContainEqual({ source: '/hearth', destination: '/lumen', permanent: true });
});

test('lock screen: shown on a first visit, gone after unlocking, back with the Lock button', async ({ page }) => {
  await page.goto('/');
  const lock = page.getByRole('dialog', { name: 'Lock screen' });
  await expect(lock).toBeVisible();
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(lock).toBeHidden();
  await page.reload();
  await expect(lock).toBeHidden();
  await page.getByRole('button', { name: 'Lock the phone' }).click();
  await expect(lock).toBeVisible();
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(lock).toBeHidden();
});

test('lock screen: never on a deep link', async ({ page }) => {
  await page.goto('/tally');
  await expect(page.getByRole('dialog', { name: 'Lock screen' })).toBeHidden();
});

test('page two is Work, and closing an app there comes back to page two', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Work page' }).click();
  const work = page.locator('a.app[href="/work"]');
  await expect(work).toBeInViewport();
  await work.click();
  await expect(page).toHaveURL('/work');
  await page.locator('.appview .back').click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('a.app[href="/work"]')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Work page' })).toHaveAttribute('aria-current', 'true');
});

test('keyboard: → at the end of a row goes to page two', async ({ page }) => {
  test.skip(isMobile(page), 'keyboard is a desktop path');
  await page.goto('/');
  await page.locator('a.app[href="/streets"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('a.app[href="/work"]')).toBeFocused();
});

test('wallet: a pass opens and closes', async ({ page }) => {
  await page.goto('/wallet');
  // Tap the visible strip of the top pass, as a person would.
  const first = page.locator('[data-pass]').first();
  await first.click({ position: { x: 30, y: 24 } });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await first.click({ position: { x: 30, y: 24 } });
  await expect(first).toHaveAttribute('aria-expanded', 'false');
});

test('developer options: seven taps on the clock', async ({ page }) => {
  await page.goto('/');
  const dev = page.locator('[data-dev-app]');
  await expect(dev).toBeHidden();
  for (let i = 0; i < 7; i++) await page.locator('[data-dev-tap]').click();
  await expect(page.locator('[data-toast]')).toContainText('You are now a developer');
  await page.goto('/developer');
  await expect(page.getByRole('heading', { name: 'Developer options' })).toBeVisible();
  await expect(page.locator('[data-egg="dev"]')).toHaveClass(/got/);
});

test('coffee: three sips, then a refill', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  const cup = page.locator('[data-cup]');
  for (let i = 0; i < 3; i++) await cup.click();
  await expect(page.locator('[data-coffee]')).toHaveAttribute('data-level', '0');
  await cup.click();
  await expect(page.locator('[data-coffee]')).toHaveAttribute('data-level', '3');
  await expect(page.locator('[data-cup-note]')).toContainText('cup today');
});

test('résumé print page has the job and no client names', async ({ page }) => {
  await page.goto('/resume/print');
  await expect(page.getByText('Associate Technical Consultant').first()).toBeVisible();
  const text = await page.locator('body').innerText();
  for (const name of ['Martin', 'Servera', 'ABB', 'Endeavour', 'Axis']) expect(text).not.toContain(name);
});
