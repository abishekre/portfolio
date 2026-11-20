import { test, expect, type Page } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';

// Every project, with its display name, read from the content files.
const projects = readdirSync('content/projects')
  .map((slug) => {
    const src = readFileSync(`content/projects/${slug}/project.md`, 'utf8');
    return { slug, name: /^name: (.+)$/m.exec(src)![1].trim(), hidden: /^hidden: true$/m.test(src) };
  })
  .filter((p) => !p.hidden);

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

test.describe('home screen', () => {
  test('shows every app, the dock and the list link', async ({ page }) => {
    await page.goto('/');
    for (const p of projects) await expect(page.locator(`a.app[href="/${p.slug}"]`)).toBeVisible();
    await expect(page.locator('a.app[href="/notes"]')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'All projects as a list' })).toBeVisible();
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
