# Editing the portfolio

Everything you'd want to change lives in this `content/` folder. You never need to touch `src/`.

```
content/
  home.yaml        the home screen: every app with show: true/false, in order; the widgets; lock-screen notifications
  site.yaml        you: name, bio, city, email, links
  resume.yaml      the résumé: jobs, clients (by industry), skills, education; feeds Work, Résumé and the PDF
  certs.yaml       certifications and badges for the Wallet and résumé
  certs/           their images
  notes.md         the Notes app
  projects/
    tally/         one folder per project; the folder name is the URL (/tally)
      project.md   its text, colours, numbers and links
      icon.png     its icon (or icon.svg)
      screens/     its screenshots, shown in filename order: 1.png, 2.png, …
```

## Two ways to edit

**In the browser (any device):** sign in at [app.pagescms.org](https://app.pagescms.org) with GitHub and open `abishekre/portfolio`. Every file above has a form, with checkboxes for show/hide. Saving commits to GitHub, and Vercel puts it live in a minute or two.

**On this computer:** edit the files in VS Code, run `npm run dev` and open http://localhost:4321 (it reloads as you save). Then commit and push.

## Common jobs

| I want to… | Do this |
|---|---|
| Hide an app, or bring it back | `home.yaml`: set its `show` to `false` or `true` |
| Reorder the home screen | `home.yaml`: move its line up or down |
| Add a project | `npm run new -- my-app "My App"`, then fill in the new `project.md`, icon and screens. It's added to `home.yaml` for you. |
| Remove a project for good | Delete its folder and its line in `home.yaml` |
| Change an app's links | `playStore`, `web`, `github` in its `project.md`. Buttons come out in that order; leave out what it doesn't have. |
| Change screenshots | Put files in its `screens/` and name them 1.png, 2.png, … |
| Add a certification | Put its image in `certs/`, add a row to `certs.yaml` |
| Update the résumé | `resume.yaml`, then `npm run resume` to remake the PDF (it refuses if it no longer fits one page) |
| Change "Now building", the photo or the lock screen | `home.yaml` |
| Change my bio, city or links | `site.yaml` |

## Before it goes live

1. `npm run build`. A missing icon, only two stats or a bad link stops the build and names the file and field.
2. New or renamed project? With `npm run dev` running, `npm run og` makes its link-preview image. Until then it uses the home one.
3. Changed the résumé? `npm run resume`.
4. Optionally `npm test`.
