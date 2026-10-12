# rylezamayla.github.io

Joshua Ryle Zamayla Bracho's developer portfolio: a pixel-art hub page plus
readable, shareable case-study pages. Every project claim links back to the
commit or build that supports it.

## Stack

- React 19 and React Router 7 in pre-render mode, built with Vite. Every page
  is written to its own HTML file at build time (`ssr: false`), so the site is
  fully static, direct links and refreshes work on GitHub Pages, and search
  engines see each page's full text.
- TypeScript throughout. No backend, database or runtime git access.
- Fonts are self-hosted: Jersey 10 (headings) and JetBrains Mono (body), both
  under the SIL Open Font License.
- All pixel art is hand-drawn SVG in `app/components/HubScene.tsx`.

## Running it

Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # local development server
npm test           # content integrity checks
npm run typecheck  # TypeScript
npm run build      # static site in build/client
npm run preview    # serve build/client the way GitHub Pages does (port 4173)
```

## Where things live

| Path | What it is |
| --- | --- |
| `app/content/` | All site content: projects, milestones, skills, quest log, profile. Edit here, not in components. |
| `app/components/` | Presentation only. |
| `app/routes/` | Pages: hub, project index, project case study, not-found. |
| `tests/content.test.ts` | Fails the build if a skill or achievement points at a milestone that doesn't exist, commit counts stop adding up, an internal name leaks into content, or the email address is stored whole. |
| `scripts/postbuild.mjs` | Copies React Router's SPA fallback to `404.html` so unknown URLs get a styled 404. |
| `scripts/serve.mjs` | Local server that mimics GitHub Pages for checking a build. |

## Animation

Every animation is gated on one class, `motion-on`, on `<html>`. An inline
script in `app/root.tsx` sets it before first paint from the visitor's saved
choice, falling back to their system's reduced-motion setting. The header's
"Pause animations" button flips it and remembers the choice (WCAG 2.2.2).
Scroll-triggered effects (`app/hooks/useReveal.ts`) only hide content once
JavaScript is running and motion is on, so nothing is ever stuck invisible.

Easter eggs: pet the cat on the desk, and try the Konami code.

## Adding a project

1. Add a `Project` object to `app/content/projects.ts` with its phases and
   milestones. Give each milestone a unique `id` and an honest `verification`.
2. Give it a `sceneSpot` (the object on the desk that links to it).
3. Point any relevant skills in `app/content/skills.ts` at its milestone ids.
4. Run `npm test`. Pre-rendering picks the new page up automatically.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: install, content tests,
type-check, build, then publish `build/client` to GitHub Pages. No secrets or
environment variables are used, so nothing private can end up in the build.

One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**. The site is served from the root of
`https://rylezamayla.github.io/` because this is a user-site repository
(named `RyleZamayla.github.io`); see `vite.config.ts` if that ever changes.

## Content rules

- Professional projects use generic titles and are described from commit
  history only. No internal names, client names, code or screenshots.
- Numbers must name their source. Self-reported figures say so.
