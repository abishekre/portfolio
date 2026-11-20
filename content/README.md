# Editing the portfolio

Everything you'd want to change lives in this `content/` folder. You never need to touch `src/`.

```
content/
  site.yaml          you: name, bio, links, the home-screen widget and photo, résumé skills
  notes.md           the Notes app
  projects/
    tally/           one folder per project; the folder name is the URL (/tally)
      project.md     its text, colours, numbers and links
      icon.png       its icon (or icon.svg)
      screens/       its screenshots, shown in filename order: 1.png, 2.png, …
```

Run `npm run dev` and open http://localhost:4321. The page reloads as you save.

## Common jobs

| I want to… | Do this |
|---|---|
| Change my bio, email or links | Edit `site.yaml` |
| Change what an app's page says | Edit `projects/<app>/project.md`. The story under the `---` is plain text. |
| Add a project | `npm run new -- my-app "My App"`, then fill in the new `project.md`, icon and screens |
| Remove a project | Delete its folder. To keep it for later, add `hidden: true` to its `project.md` instead. |
| Reorder the home screen | Change the `order:` numbers. Lower comes first. |
| Change or reorder screenshots | Put files in `screens/` and name them 1.png, 2.png, … |
| Change "Now building" | `nowBuilding:` in `site.yaml` |
| Change the photo under the grid | `photo:` in `site.yaml` |
| Add my résumé PDF | Save it as `public/resume.pdf`. A "Download PDF" button appears by itself. |

## Then check and publish

1. `npm run build`. If something's off (a missing icon, only two stats, a bad link) it stops and tells you which file and field.
2. New or renamed project? Run `npm run og` with `npm run dev` running. That makes its preview image for WhatsApp and LinkedIn. Until then it uses the home one.
3. Optionally run `npm test`.
4. Commit and push. Vercel deploys it.

## Fields in project.md

| Field | What it is |
|---|---|
| `name` | Full name, the page heading |
| `label` | Optional shorter name under the icon |
| `order` | Position on the home screen |
| `hidden` | `true` takes it off the site |
| `kind` | `client` for work made for someone else |
| `tagline` | One line under the name, under ~80 characters |
| `status` | For example "On Google Play" or "In progress" |
| `theme` | The app's colours and font, so its page looks like the real app |
| `stats` | Exactly three `{ value, label }` numbers |
| `what` | Two or three sentences on what it does |
| `hardTitle` | Headline for the hard-part story (the text under `---`) |
| `links` | Buttons. `primary: true` is the filled one and the desk's "Try it live". |
| `screensAlt` | Optional description of the screenshots, for screen readers |
| `screensWide` | `true` for landscape screens (TV, banners) |
| `notes` | Build notes on the desk: `stack`, `tests`, `platforms`, `when` |
