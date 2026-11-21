// Abishek's contact card, so a recruiter can save it to their phone or Outlook in one tap.
import type { APIRoute } from 'astro';
import { vcard } from '../lib/contact';

export const GET: APIRoute = () =>
  new Response(vcard(), {
    headers: { 'Content-Type': 'text/vcard; charset=utf-8' },
  });
