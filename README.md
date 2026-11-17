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
- Fonts are self-hosted: Jersey 10 (pixel headings), Inter (body) and
  JetBrains Mono (labels and code), all under the SIL Open Font License.
- All pixel art is hand-drawn SVG: the project desk in `HubScene.tsx`, the
  title-screen workstation in `TitleScene.tsx`, and small sprites (motorcycles,
  chess pieces, rackets, PC, chest, campfire) from character maps in
  `app/lib/sprites.ts`. The portrait on the character card is a real image
  (`public/profile.webp`), not pixel art.

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

## The story (home page)

The home page is a scroll-driven story in chapters: title screen, I the hub,
II side quests, III the main quest, IV skill tree, V loot, then a save point.
Chapters II and III cycle through the personal and company projects.

On a screen at least 900 x 620 with animations on, `<html>` gets
`story-pinned` and each chapter becomes a tall track with a full-height stage
that sticks while you scroll (`app/lib/story.ts`). The hook publishes progress
to CSS as `--p` and `--sp` and marks the active step, so every visual is plain
CSS. Everywhere else (phones, short screens, reduced motion, animations
paused) nothing is pinned and every step simply shows, one after another.

- `data-step-i` marks a step inside a chapter; `data-pip-i` marks progress pips.
- Tabbing into a hidden step scrolls to it, so keyboard use never lands on
  something invisible.
- The pin class is set by an inline script before first paint, so the page does
  not jump when it loads.
- Content is all in the static HTML; the effects only enhance it.
- Chapter ids (`about`, `side-quests`, `main-quest`, `skills`, `quests`,
  `contact`) double as the header's "you are here" label and nav highlight.

### The skill web and the loot

- `app/content/skills.ts`: every skill, its verified milestones (one level
  each, up to 5) and `links` to the skills it was used with. A test fails if
  any milestone backs no skill, so new work can't be added without the tree
  noticing. `secretSkills` are self-reported hobbies for the hidden Garage
  branch and are kept apart from the evidence rules.
- `app/lib/skillGraph.ts`: lays the web out deterministically (branch islands,
  no overlapping labels, tested), finds paths between skills and arrow-key
  neighbours. `SkillTree.tsx` is the interface: hover, click, trace a path,
  surprise me, explore everything to unlock the Garage.
- `app/lib/loot.ts`: a quest's rarity is how many verified milestones back it
  (none = common, 1-2 rare, 3 epic, 4+ legendary), and XP follows rarity.
  `QuestLog.tsx` adds filters, sorting, expandable proof and the chest.

Styles for all of this live in `app/styles/story.css`, loaded after
`global.css`, which also gives every page the glass-and-glow theme.

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
3. Add its snapshots to `app/content/snapshots.ts`. Personal projects use real
   screenshots (images in `public/snapshots/<slug>/`); company projects use
   illustrations built from blocks, never real screens.
4. Add a product tile for the project lists to `thumbs` in the same file.
5. Point any relevant skills in `app/content/skills.ts` at its milestone ids.
6. Run `npm test`. Pre-rendering picks the new page up automatically.

## Resume

The one-page resume lives at `public/Bracho_Joshua_Ryle_Resume.pdf` and is
linked from the hero, the contact terminal and the footer (`profile.resume`).
It is a public file, so it contains whatever contact details are printed on it.
Replace the file when the resume changes and keep its project list in step
with `app/content/projects.ts`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: install, content tests,
type-check, build, then publish `build/client` to GitHub Pages. No secrets or
environment variables are used, so nothing private can end up in the build.

One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**. The site is served from the root of
`https://rylezamayla.github.io/` because this is a user-site repository
(named `RyleZamayla.github.io`); see `vite.config.ts` if that ever changes.

## Content rules

- Company projects use generic titles and are described from commit history
  only. No internal names, client names, code or screenshots. Their snapshots
  are illustrations with invented data and are labelled as such.
- Personal projects show real screenshots only, captured on demo or sample data.
- Numbers must name their source. Self-reported figures say so.
