// The contact card: a vCard (served at /abishek.vcf) and a QR code that opens it.
// Both are built from content/site.yaml and content/resume.yaml.
import QRCode from 'qrcode';
import { SITE } from '../site';
import { RESUME } from './resume';

export const VCARD_PATH = '/abishek.vcf';
export const VCARD_URL = `https://www.abishekre.in${VCARD_PATH}`;

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export function vcard() {
  const parts = SITE.name.trim().split(/\s+/);
  const family = parts.length > 1 ? parts.pop()! : '';
  const given = parts.join(' ');
  const job = RESUME.experience[0];
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(SITE.name)}`,
    job ? `TITLE:${esc(job.role)}` : '',
    job ? `ORG:${esc(job.company)}` : '',
    `EMAIL;TYPE=INTERNET,PREF:${SITE.email}`,
    'URL:https://www.abishekre.in',
    `X-SOCIALPROFILE;TYPE=linkedin:${SITE.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${SITE.github}`,
    `ADR;TYPE=WORK:;;;${esc(SITE.city)};;;India`,
    `NOTE:${esc(`${RESUME.headline}. Portfolio: abishekre.in`)}`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');
}

/** The QR code as inline SVG markup (dark modules on a transparent background). */
export const qrSvg = (color = '#1d1a16') =>
  QRCode.toString(VCARD_URL, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: color, light: '#0000' } });
