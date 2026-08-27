# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development**: `pnpm dev` — Next.js on port 4500
- **Build application**: `pnpm build` — production build
- **Lint code**: `pnpm lint` — `eslint .`
- **Start production**: `pnpm start`
- **Rebuild the registry**: `pnpm registry:build` — clean + generate + `shadcn build`
- **Validate the registry**: `pnpm registry:validate` — `shadcn validate`

There is no test suite and no test runner configured.

There is no backend. The site is static files end to end: the catalogue, the
registry and the pro mirror are all committed TypeScript and JSON. The only
route handler is `app/api/component-code/[name]` (rate-limited file read).

**Not a Convex project.** The repo was scaffolded from a Convex + Clerk starter
and traces of it survive: the six Convex skills under `skills/` and
`.claude/skills/` are vestigial, and `vercel.json`'s CSP still allow-lists
`*.convex.cloud`. There is no `convex/` directory and nothing here talks to a
database. (The starter's `README.md` and `AGENTS.md` were deleted for this
reason — `AGENTS.md` told agents to read a `convex/_generated/` file that does
not exist.)

### The registry

`lib/blocks.ts` is the source of truth for everything this site publishes.
`pnpm registry:build` reads it, walks `registry/default/**` for each item's
files, rewrites `registry.json`, and runs `shadcn build` to emit
`public/r/<name>.json` — what `npx shadcn add` actually fetches.

**Adding a block:**

1. Drop the source at `registry/default/ui/<name>.tsx` (a primitive) or
   `registry/default/components/<name>.tsx` (a section). Multi-file blocks put
   their parts in a `<name>/` beside the entry and import them relatively — the
   build walks that directory, so nothing is listed by hand. A `<name>.css`
   beside the entry ships with it too.
2. Add an entry to `BLOCK_LIBRARY` in `lib/blocks.ts`: `name`, `title`,
   `description` (card copy and registry description at once), `categories`,
   `dependencies` in `pkg@range` form, and `registryDependencies` if it installs
   other items alongside itself. `css`/`cssVars` inject global styles into the
   consumer's stylesheet.
3. Give it `shelf: "blocks"` plus `image`, `status`, `author` and `version` if it
   should be drawn on `/blocks`. Without a shelf it is installable but unlisted —
   which is right for a ui primitive or a part another block pulls in. A
   `featured` rank puts it on the home page showcase (nothing carries one today).
4. Run `pnpm registry:build` and commit `registry.json` and `public/r/`.

The route, the card, the category filter, the sitemap entry and the install
command all fall out of that entry. Nothing else to touch.

Two constraints the build imposes:

- **`lib/blocks.ts` and `lib/spinner-patterns.ts` must stay pure data.**
  `scripts/build-registry.mjs` compiles just those two files with a bare `tsc`
  outside any tsconfig and imports the output from node. Types and literals only —
  a value import breaks the build. (`lib/blocks.ts` has no imports at all;
  `spinner-patterns.ts` has one `import type`.)
- The build prints **orphans**: sources on disk that no item ships. That is a
  warning, not an error — a block can sit staged before it is published.

Spinner items are generated from `lib/spinner-patterns.ts`, one wrapper
component per preset written into `registry/default/components/spinner-*.tsx`,
but only for the names listed in `PUBLISHED_SPINNERS` in `lib/blocks.ts` —
several presets are sold on pro, so publishing one here is a decision rather
than a side effect of drawing it in the playground. Wrappers for presets no
longer listed are deleted on each build; do not hand-edit `spinner-*.tsx`.

### Pro catalogue commands

The pro blocks, components, illustrations and templates sold on
`pro.d2studio.dev` are showcased here from a generated mirror. Both scripts are
dev-time only — their committed output is what ships.

- **Sync the catalogue**: `pnpm pro:sync` — reads `../pro-d2/lib/blocks.ts` and
  `lib/spinner-patterns.ts` and rewrites `lib/pro-catalog.ts` and
  `lib/pro-spinners.ts`. Items the pro source declares but the live site does not
  serve yet are skipped and named; `--offline` mirrors the source as written.
  Point elsewhere with `PRO_D2_DIR=/path/to/pro-d2`.
- **Capture card art**: `pnpm pro:previews` — screenshots each item off
  `pro.d2studio.dev/preview/<name>` into `public/pro/<name>.jpg`. Only missing
  ones by default; `--force` re-shoots, and named items re-shoot just those.
  Drives the installed Chrome through `playwright-core`, so no browser download.

Run them in that order after the pro repo ships new items. A pro card links out
to `pro.d2studio.dev` in a new tab with UTM parameters, built in `lib/pro.ts`
(`proHref`, `proShelfHref`, `PRO_LINK_PROPS` — `noreferrer` is deliberately
omitted so pro sees the referral).

## Architecture Overview

A **Next.js 16 + React 19** static site.

### Tech Stack
- **Frontend**: Next.js App Router, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style, neutral base, CSS variables)
- **Animation**: `motion`, `gsap`/`@gsap/react`, `three`, `cobe`
- **Package Manager**: pnpm

### The three seams worth knowing

**1. `lib/catalog.ts` — where free and pro flatten into one shape.**
`BlockDef` (free, this repo's own registry) and `ProItem` (a line in the
generated pro mirror) share almost no fields, so both are mapped to one
`CatalogItem` here rather than teaching every card and filter about both.
`components/blocks/blocks-browser.tsx` is the single browser both `/blocks`
(`scope="blocks"`) and `/components` (`scope="components"`) render. Where a name
exists in both catalogues (`bento-04`, `bento-05`, `notification-bento`) the
free row wins — resolved at render time by `proItemsFor(group, source, owned)`,
not baked into the mirror, so adding or removing a free block settles it without
a re-sync.

**2. `/preview/[slug]` — the bare component the detail iframe loads.**
A client route that `dynamic()`-imports `@/registry/default/{ui,components}/<slug>`
picking the folder from a `?type=` query param, falling back to the first
capitalised function export when a module has no default. `?theme=` forces
light/dark. It wraps everything in `.luminous-spinners`, which is the scope
class the spinner `.cell` / `.spinner-grid` rules in `app/globals.css` live
under — spinner CSS will not apply outside it.

**3. `/blocks/[name]` reads `public/r/<name>.json`, not the working tree.**
The Code tab shows the *built* item, so it is stale until `pnpm registry:build`
runs, and the item's `type` there is what decides whether the preview loads from
`ui/` or `components/`. `generateStaticParams` from `SHELVED` with
`dynamicParams = false`, so an unshelved item has no detail page.

### Project Structure
- `app/` — App Router pages. `/blocks` and `/components` are two shelves of one
  browser; `/blocks/[name]` is the detail page; `/preview/[slug]` is the bare
  component the detail iframe loads. `/illustration`, `/templates` and
  `/spinners` are pro-mirror shelves.
- `app/` also holds scratch prototype routes (`bento-2`…`bento-5`, `cosmo`,
  `notification`, `demo`, `test`, `inspector`, `*-preview`) used while designing
  a block. They are not published surfaces; the shipped source is whatever lives
  under `registry/default/`.
- `registry/default/{ui,components}/` — the published sources.
- `components/` — the site's own chrome, not published. `components/ui/` is
  local shadcn; a registry item's copy lives under `registry/default/`.
- `lib/blocks.ts` — the free catalogue. `lib/pro-catalog.ts` and
  `lib/pro-spinners.ts` — generated mirrors of the pro library, committed.
- `lib/catalog.ts` — the seam both halves flatten through.
- `public/r/` — the built registry, served with CORS (see `vercel.json`).
- `public/blocks/`, `public/pro/` — card art.

### Key Files
- `app/layout.tsx` — root layout, theme provider, dock, command palette
- `app/globals.css` — Tailwind v4 `@theme`, the `dark` custom variant, and the
  `.luminous-spinners` scoped spinner stylesheet (~1000 lines)
- `scripts/build-registry.mjs` — the one script that writes `registry.json`
- `components.json` — shadcn/ui config; also registers the `@d2`, `@magicui`
  and `@dotmatrix` remote registries for `npx shadcn add @d2/<name>`
- `vercel.json` — build command (`pnpm registry:build && pnpm build`), the
  permissive CORS + cache headers on `/r/*`, and the site CSP

## Development Notes

- Uses pnpm as package manager (see `pnpm-lock.yaml`)
- Tailwind CSS v4 configured through `app/globals.css`, no tailwind.config file
- Deploys on Vercel; the registry is rebuilt as part of the deploy
- The repo root is littered with design-iteration PNGs and one-off planning
  markdown (`PRODUCTION_LAUNCH_PLAN.md`, `REGISTRY_SETUP_PLAN.md`, `ref.md`) —
  scratch, not documentation
