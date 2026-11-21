// Renders /resume/print to public/resume.pdf. Run with the dev server up: npm run dev, then npm run resume.
// Stops with an error if the résumé no longer fits on one A4 page.
import { chromium } from 'playwright';

const base = process.env.RESUME_BASE ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/resume/print`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, path: 'public/resume.pdf' });
await browser.close();

const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
if (pages !== 1) {
  console.error(`The résumé runs to ${pages} pages. Trim content/resume.yaml (or its projects list) and run again.`);
  process.exit(1);
}
console.log(`public/resume.pdf: 1 page, ${Math.round(pdf.length / 1024)} KB`);
