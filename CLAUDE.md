# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development**: `pnpm dev` — Next.js on port 4500
- **Build application**: `pnpm build` — production build
- **Lint code**: `pnpm lint`
- **Start production**: `pnpm start`

There is no backend. The site is static files end to end: the catalogue, the
registry and the pro mirror are all committed TypeScript and JSON.

### The registry

`lib/blocks.ts` is the source of truth for everything this site publishes.
`pnpm registry:build` reads it, walks `registry/default/**` for each item's
files, rewrites `registry.json`, and runs `shadcn build` to emit
`public/r/<name>.json` — what `npx shadcn add` actually fetches.

**Adding a block:**

1. Drop the source at `registry/default/ui/<name>.tsx` (a primitive) or
   `registry/default/components/<name>.tsx` (a section). Multi-file blocks put
   their parts in a `<name>/` beside the entry and import them relatively — the
   build walks that directory, so nothing is listed by hand.
2. Add an entry to `BLOCK_LIBRARY` in `lib/blocks.ts`: `name`, `title`,
   `description` (card copy and registry description at once), `categories`,
   `dependencies` in `pkg@range` form, and `registryDependencies` if it installs
   other items alongside itself.
3. Give it `shelf: "blocks"` plus `image`, `status`, `author` and `version` if it
   should be drawn on `/blocks`. Without a shelf it is installable but unlisted —
   which is right for a ui primitive or a part another block pulls in.
4. Run `pnpm registry:build` and commit `registry.json` and `public/r/`.

The route, the card, the category filter, the sitemap entry and the install
command all fall out of that entry. Nothing else to touch.

Spinner items are generated from `lib/spinner-patterns.ts`, one wrapper
component per preset, but only for the names listed in `PUBLISHED_SPINNERS` in
`lib/blocks.ts` — several presets are sold on pro, so publishing one here is a
decision rather than a side effect of drawing it in the playground.

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
to `pro.d2studio.dev` in a new tab with UTM parameters, built in `lib/pro.ts`;
`lib/catalog.ts` flattens the free and pro halves into the one `CatalogItem`
shape every card and filter reads.

## Architecture Overview

A **Next.js 16 + React 19** static site.

### Tech Stack
- **Frontend**: Next.js with React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Package Manager**: pnpm

### Project Structure
- `app/` — App Router pages. `/blocks` and `/components` are two shelves of one
  browser; `/blocks/[name]` is the detail page; `/preview/[slug]` is the bare
  component the detail iframe loads.
- `registry/default/{ui,components}/` — the published sources.
- `lib/blocks.ts` — the free catalogue. `lib/pro-catalog.ts` and
  `lib/pro-spinners.ts` — generated mirrors of the pro library.
- `lib/catalog.ts` — the seam both halves flatten through.
- `public/r/` — the built registry, served with CORS (see `vercel.json`).
- `public/blocks/`, `public/pro/` — card art.

### Key Files
- `app/layout.tsx` — root layout, theme provider, dock, command palette
- `scripts/build-registry.mjs` — the one script that writes `registry.json`
- `components.json` — shadcn/ui configuration

## Development Notes

- Uses pnpm as package manager (see `pnpm-lock.yaml`)
- Tailwind CSS configured with custom variables and neutral base color
- Deploys on Vercel with `pnpm registry:build && pnpm build` (see `vercel.json`)
