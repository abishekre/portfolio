# Portfolio: "Home Screen" — design and build plan

## Context

Abishek has ~10 shipped or near-shipped apps in `C:\Users\abish\Documents\js\vibecode\claude\` but no portfolio that shows them. He wants a site that is mainly a **showcase** (hiring is occasional — "showcase only" tone, no open-to-work language), is **highly creative**, must **not look AI-generated**, and must be **equally good on mobile and desktop**. It will **replace abishekre.in** (Kcal stays on `kcal.abishekre.in`).

He reviewed four clickable mockups (Home Screen, Magazine, Town, Channel Surf) and picked **Home Screen**: the site is a phone. On mobile it *is* your home screen; on desktop the phone lies on a desk. Tapping an icon opens that project, dressed in its own brand.

The new project lives in a new folder: `C:\Users\abish\Documents\js\vibecode\claude\portfolio\`.

## What goes on the phone (decided)

10 projects plus 1 personal app, with a 4-app dock.

| Grid order | Project | Source folder | Live link |
|---|---|---|---|
| 1 | Tally | `Tally/` | Play Store `app.tally.client` |
| 2 | ByTwo | `ByTwo-main/` (the v2; ignore `ByTwo/`) | bytwo.vercel.app |
| 3 | Kcal | `Kcal/` (ignore `kcal2-main/`) | kcal.abishekre.in |
| 4 | Silicon Streets | `silicon-streets/` | needs deploying |
| 5 | Hearth | `Hearth/` | none (home-network app) |
| 6 | Kallan | `kallan/` (ignore `kallan-nattukar-main/`) | Play Store (coming) |
| 7 | Thodi | `saiju app/` | thodi.vercel.app |
| 8 | Deuce | `Deuce/` | deuce-olive.vercel.app |
| 9 | Rally | `Badminton tracker/` | needs deploying |
| 10 | Dazzle Designs | `Dazzle Design/` (labelled client work) | none yet |
| 11 | Notes (about me + how this site was made) | — | — |
| Dock | Résumé (PDF download), Mail, GitHub (`abishekre`), LinkedIn | — | — |

Excluded: CleanMonitor (someone else's project), the Archive of v1s, `Imp/` (empty).

## Anti-goals (what would make this a failure)

- Generic AI look: purple gradients, glassy panels, 3D blobs, identical card templates, "blazing fast" copy.
- A gimmick that hides the work: every project must be readable in under 30 seconds.
- A desktop version that feels like a phone stuck in the middle of empty space.
- Leaking secrets: nothing from any project's `.env` / `.env.local` may be copied in.

## Behaviour

### Desktop (≥1100px)
- **Desk.** A warm, flat paper surface (no gradients). Left: an index card with the name "Abishek R Edakkalathur" and one line about him. Right: a small "on this phone" summary. The desk has a few handmade flat-SVG objects (a chai glass, a pen). The desk tint shifts subtly toward the open app's palette.
- **Phone.** It sits in the centre and is real-sized (about 390×844 CSS px, scaled to fit the viewport height). The status bar shows the **real Kochi time (IST)** and, optionally, the live temperature from Open-Meteo (the same source Silicon Streets uses).
- **Opening an app.** Clicking an icon morphs it into the full app screen (View Transitions). The URL changes to `/tally` and so on. Inside the phone, the project page scrolls.
- **Build notes.** While an app is open, the side panels become build notes: stack chips, test counts, timeline, the repo link and a "Try it live" button. The desk is part of the content, not padding.
- **Keyboard.** Arrow keys move between icons, Enter opens, Esc or Backspace goes home, and browser Back works.

### Mobile (<768px)
- **No frame and no desk.** The page *is* a home screen, full-bleed with safe areas. The top shows "Abishek's apps · 9:41 Kochi", then a 4-column grid, then a fixed dock.
- **Opening and closing.** Tapping an icon morphs it to full screen. You close it by swiping down from the top, using the back gesture, or tapping the home bar at the bottom.
- **Build notes.** With no desk on mobile, build notes appear as the last section of each app page.

### Tablet (768–1099px)
The phone is centred, with the build notes stacked under it.

### Everywhere
- Every app page is a real, static URL with semantic HTML, so it works without JS and is good for SEO and sharing.
- A quiet "All projects as a list" link (`/list`) at the bottom of the home screen.
- `prefers-reduced-motion` swaps the morphs for crossfades.
- Wallpaper follows time of day in Kochi: paper by day, lamp-lit dark at night. It also respects the system dark mode.
- One easter egg: long-pressing an icon starts the iOS-style "jiggle" mode, and the Notes app explains it.
- A 404 page: the phone shows "App not installed".

## What each app page contains (inside the phone)

1. **Hero.** The app's real icon, its name and one line, in that app's own colours and fonts.
2. **Recording.** A looping screen recording at phone ratio. Hearth is the exception: its TV screenshots go in a landscape TV frame.
3. **Three real numbers.** For example 149 SMS / 17 banks / 96%, or 82,000 buildings, or 363 tests.
4. **What it does.** Two or three sentences in Abishek's voice.
5. **The hard part.** One engineering story, for example:
   - Tally: the SMS parser tested on 149 real messages.
   - ByTwo: the encrypted, conflict-free ledger.
   - Deuce: the BWF-exact rules engine.
   - Kcal: every value cited from IFCT 2017.
   - Silicon Streets: streaming OSM tiles.
   - Hearth: Direct Play first.
   - Kallan: a mascot rigged from one data file.
   - Thodi: Malayalam-first, with escrow.
   - Rally: partner-weighted rotation.
   - Dazzle: lead pipeline into Discord.
6. **Links.** Live / Play Store / repo.

Each app page loads only its own brand fonts:
- Tally and Kcal: Geist
- ByTwo: Space Grotesk and Space Mono
- Kallan: Bungee
- Hearth: Schibsted Grotesk
- Thodi: Noto Sans Malayalam
- Dazzle: Fraunces and Hanken Grotesk
- Silicon Streets: Space Grotesk
- Rally: Barlow Semi Condensed (stand-in for Bahnschrift)

The site's own type is **Instrument Serif** (display), **Inter Tight** (UI) and **Space Mono** (labels), as in the approved mockup.

## Tech choices (my calls)

- **Astro + TypeScript**, static output. Reasons:
  - Every app is its own static page.
  - Very little JS, so it's fast on mid-range Android phones.
  - Built-in View Transitions give the icon-to-app morph.
  - `transition:persist` keeps the phone and desk mounted between pages.
- **Small React islands** only where needed: swipe-to-close gestures and the live-demo iframe. He already knows React.
- **Content collections.** One `src/content/projects/<slug>.mdx` per project. Its frontmatter schema covers: slug, name, order, theme `{bg, fg, accent, fonts}`, icon, tagline, `stats[3]`, links, media, buildNotes `{stack[], tests, timeline, repo}`, and a `kind` field (`app` or `client-work`).
- **Real icons** copied from each repo's assets:
  - Tally: `assets/icon.png`
  - ByTwo-main: `assets/brand/`
  - Kcal: `assets/images/`
  - Kallan: `docs/store/icon-512.png`
  - Thodi: `assets/icon.png`
  - Rally: `public/icon-512.png`
  - Deuce: `public/icon.svg`
  - Dazzle: `app/icon.svg`
  - Hearth: convert its XML drawable to SVG
  - Silicon Streets: has no icon, so design one
- **Media capture.** Playwright scripts in `scripts/capture/` run each web build locally at 390×844 and record webm/mp4 (≤1.5 MB each, with a poster frame). Tally uses its existing Play Store screenshots in `Tally/docs/play-store/assets/`, and Hearth its `docs/test-reports/phase-1b/*.png`.
- **Live demos.** "Try it live" loads the web build in an iframe inside the phone, but only if the target allows framing. Check each target's `X-Frame-Options` / `frame-ancestors`; if framing is blocked, open the build in a new tab. Silicon Streets always opens in a full tab.
- **Per-project OG images** generated at build time (the icon and name in brand colours), plus a sitemap.
- **Deploy** on Vercel, then point abishekre.in at it. The domain switch is a confirm-first step.

## Folder layout

```
portfolio/
  astro.config.mjs  package.json  tsconfig.json
  docs/superpowers/specs/2026-11-20-portfolio-design.md   (this design, committed)
  scripts/capture/            Playwright recording scripts, one per project
  public/media/<slug>/        posters, videos, screenshots
  public/resume.pdf           (supplied by Abishek)
  src/
    content.config.ts         project schema
    content/projects/*.mdx    one per project
    styles/tokens.css         site tokens (paper, ink, wallpaper day/night)
    layouts/Base.astro
    components/
      Desk.astro  Phone.astro  StatusBar.astro  HomeGrid.astro
      AppIcon.astro  Dock.astro  AppView.astro  BuildNotes.astro
      LiveDemo.tsx  SwipeClose.tsx
    pages/
      index.astro  [slug].astro  notes.astro  list.astro  404.astro
```

## Build order

1. **Scaffold the slice.** Run `git init` and set up Astro. Create the tokens, the content schema, and Desk, Phone, HomeGrid and Dock. Build **Tally and ByTwo end to end**: the icon-to-app morph, URLs, Back, Esc, the mobile full-bleed mode and swipe to close. Check desktop and mobile in the browser pane before going further.
2. **Content for all 10.** Draft copy from each repo's README and docs (`Tally/docs/marketing/launch-kit.md`, `ByTwo-main/docs/...`, `Deuce/PLAN.md`, `Hearth/design/tokens.json`, and so on). Abishek reviews the voice.
3. **Icons and media.** Import the real icons and design one for Silicon Streets. Write and run the capture scripts.
4. **Live demos.** Check framing headers and wire up the iframe-or-new-tab fallback.
5. **Polish.** Day and night wallpaper, live Kochi time and weather, build notes, the jiggle easter egg, the Notes app, reduced motion, focus management, OG images, sitemap, `/list` and the 404 page.
6. **Deploy.** Ship to Vercel on a preview URL, then switch abishekre.in after Abishek confirms.

## Needed from Abishek (can arrive during the build)

- The résumé PDF. A placeholder is used until then.
- Approval of the copy, especially the one-line bio.
- Confirm abishekre31@gmail.com is the address the Mail app should open.
- Recordings of Kallan and Tally (`adb shell screenrecord`) if their web builds can't be captured well.
- A Silicon Streets and Rally deploy, if he wants those live (they currently have no URL).

## Verification

- `npm run build` and `npx astro check` pass with no errors.
- Playwright tests at 390×844 and 1440×900:
  - Open every app from its icon, and also by direct URL.
  - Back and Esc close the app.
  - Arrow and Enter keyboard navigation works.
  - On mobile, no frame or desk is rendered.
  - The `/list` and 404 pages render.
- Manually check desktop, tablet and mobile, in light and dark, in the browser pane. Also check with reduced motion.
- Lighthouse on mobile: Performance ≥ 90, Accessibility ≥ 95. Home-screen JS stays under 100 KB.
- Secret scan: grep `dist/` for `SUPABASE`, `sk_`, `eyJ` and similar, and confirm nothing from any `.env` is included.
