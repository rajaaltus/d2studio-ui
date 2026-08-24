# Cleanup plan

What the static-registry migration (`2d6fed0`) left behind, and what to do about
each. Six items: 2, 3 and 4 are done; 6 was found while doing them; 5 is a
pricing decision only you can make; 1 waits.

Order matters only in one place: **item 1 last**, after you are satisfied the
site is fine without a backend.

---

## 1. Two dead Convex deployments

**What.** `perceptive-starling-525` (prod) and `clever-tortoise-435` (dev) are
still running. Nothing reads them: `convex/` is gone, the client provider is
gone, and no page opens a subscription. They hold the old `blocks`, `categories`
and three analytics tables.

**Evidence they are safe to drop.** The analytics tables were never populated by
a real user path — `trackDownload` and `trackBlockInteraction` had exactly one
caller each, both admin test buttons, and `seedSampleBlocks` filled the rest with
`Math.random()`. The block rows are reproduced verbatim in `lib/blocks.ts`. The
preview images they hosted are now committed under `public/blocks/`.

**Backups already on disk** (both gitignored, so they stay local):

- `prod-backup/pre-static-migration.zip` — full prod snapshot, taken immediately
  before the schema change
- `convex-backup/` — an older dev snapshot plus per-table JSONL

**Do.**

1. Confirm the deployed site is healthy for a few days first — this is the only
   irreversible step in the list.
2. Delete both projects from the Convex dashboard.
3. Remove the three dead vars from `.env.local` and from Vercel's environment:
   `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`.
4. Drop the `convex-mcp` server from `.mcp.json` (`.mcp.json:10`) — it shells out
   to `convex@latest mcp start` against a project that will not exist.

**Risk.** Deleting the deployment is permanent. The snapshots are the only way
back, and they live on this machine alone — copy `prod-backup/` somewhere else
first if that matters to you.

---

## 2. Orphaned sources in `registry/default` — done

**Done in `HEAD`.** Six duplicates plus two dead consumers were removed; a
seventh file, `ui/d2-card.tsx`, turned out not to be an orphan at all and is
covered by item 6 instead.

They sat on disk with no entry in `lib/blocks.ts`, so nothing shipped them.

| File | What it actually is |
| --- | --- |
| `components/hero-01.tsx` | Byte-identical to `ui/hero-01.tsx`, which is the published one. |
| `components/ai-content-creator-card.tsx` | March draft; `ui/` version is April and 168 lines longer |
| `components/ai-content-creator-card-v2.tsx` | March draft; `ui/` version is April and 442 lines longer |
| `components/ai-v2.tsx` | March draft; `ui/` version is April and 117 lines longer |
| `components/bento-01.tsx` | March draft; `ui/` version is April and 186 lines longer |
| `components/dashboard-01.tsx` | March draft; `ui/` version is April and 90 lines longer |

The five drafts all date to `c11614c`/`629b7af` (2026-03-09/10) and were
superseded by `da4018c` "fixed" (2026-04-20), which edited the `ui/` copies only.
The published items point at `ui/`, and so does the preview iframe, so the
`components/` copies have not rendered anywhere since April.

**One live import, itself dead:** `components/search/component-search.tsx:16`
imports `components/hero-01`. That file is imported by nothing — no route, no
component — and it carries a hand-written two-entry `componentRegistry` that
predates the catalogue. It should go with them.

Removed together with `config/components.ts`, which only that search component
imported.

**If you would rather bring a draft back**, the honest move is to publish it:
give it an entry in `lib/blocks.ts` without a `shelf`, and it becomes installable
but unlisted instead of invisible.

---

## 3. `registry/new-york/`, a second unreferenced tree — done

Four `.tsx` files under `registry/new-york/`, referenced by nothing:
`registry.json` does not list them, `components.json` does not point at them, and
the build only walks `registry/default`. One of them (`footer/footer.tsx`) still
carried the "Built with … Convex • Clerk" credit line, which is how it surfaced.

**Done in `HEAD`.** Removed. If you want a second style variant later it needs a
real decision — shadcn style variants mean every item exists twice, and today
exactly four did.

---

## 4. Stale documentation — done

`docs/epic-ui-assisted-development-workflow.md` and `docs/index.md` describe the
admin-dashboard authoring flow: "create a new component entry in the existing
admin dashboard by providing basic metadata (Name, Category, Figma URL, initial
screenshot)". Every part of that sentence is now wrong — the dashboard, the
Convex metadata and the Figma field are all gone.

**Done in `HEAD`.** Both deleted — `CLAUDE.md` already carries the workflow, and
a second copy is a second thing to keep true.

`_bmad-output/**` describes the same dead workflow across a dozen files, but
those are dated planning artifacts rather than live docs. Leave them as history.

---

## 5. Decision needed: 22 unpublished pro spinners

**The situation.** `lib/spinner-patterns.ts` defines 38 presets in
`PRO_LIBRARY`. Only `pro-1` … `pro-16` were ever built into the registry;
`pro-17` … `pro-38` have been drawn in the playground for some time without ever
being installable. During the migration I pinned the published set explicitly in
`PUBLISHED_SPINNERS` (`lib/blocks.ts`) rather than let the generator ship all 38,
because that would have been a pricing change disguised as a rebuild.

**What makes it a real question:** all 38 are also sold on `pro.d2studio.dev`
(they are in the `lib/pro-spinners.ts` mirror) — including all 16 that are
already free here. So the line between free and paid spinners is not "pro
presets are paid"; it is "the first 16 pro presets happen to be free". Whichever
way you go, it is worth making deliberate.

**Three options.**

1. **Publish all 38** — consistent with what is already free, gives the free
   registry more to offer. Add the names to `PUBLISHED_SPINNERS` and rebuild.
   The generator writes the 22 wrapper components on its own.
2. **Keep 16** (status quo) — no action. The gap stays, and the playground keeps
   showing 22 presets a visitor cannot install here.
3. **Retire the overlap** — drop the 16 from the free registry so the pro set is
   genuinely pro. The most defensible line, and the only one that removes
   something people can install today, so it needs a deprecation note.

I would take option 1 if the spinners are a funnel into pro, and option 3 if they
are a product. Option 2 is the one to avoid — it is the current state only
because a build was never run, not because anyone chose it.

---

## 6. Four published items were broken for installers — done

Found while doing item 2, and the reason `ui/d2-card.tsx` survived it.

**What.** Four items ship imports that cannot resolve in a consumer's project:

| Item | Import it ships |
| --- | --- |
| `pricing-01` | `../ui/d2-card`, plus `@/registry/default/ui/{button,badge}` |
| `hero-section-01` | `@/registry/default/…` |
| `hero-section-02` | `@/registry/default/…` |
| `hero-01` | `@/registry/default/…` |

`shadcn build` copies file contents verbatim — it does not rewrite import paths.
So `npx shadcn add pricing-01` drops a file importing `@/registry/default/ui/button`
into a project that has no `registry/` directory at all. The paths are correct
inside this repo, which is why nothing here ever noticed.

`pricing-01` has the extra problem: `../ui/d2-card` resolves in the source tree
but not after install (the file lands in `components/`, the card would land in
`components/ui/`), and `d2-card` is not published at all, so nothing ships it
either way. That is why it looked like an orphan.

**Fixed.** All four now import `@/components/ui/*`, the same path every other
item in the registry already used. `d2-card` is published as an unlisted item
(no `shelf`) with a copy at `components/ui/d2-card.tsx` so previews resolve it,
matching how `pixel-spinner` already works. `pricing-01` declares it as
`https://d2studio.dev/r/d2-card.json` — the absolute form, because a bare name
resolves against shadcn's own registry and `@d2/` requires the consumer to have
configured this registry. The other three declare `button`, `badge` and `avatar`,
which correctly resolve to shadcn's official primitives.

**Verified by installing, not by reading.** All four items were installed from a
local copy of `public/r` into a scratch project with the standard aliases:
`pricing-01` pulled in `d2-card` from this registry plus `button` and `badge`
from shadcn's, and every `@/` import in the installed files resolves to a file
that exists. The four previews still render in the browser.

**One consequence worth knowing:** those four previews now use the app's
`components/ui/{button,badge,avatar}`, which are current shadcn v4 files, rather
than the older copies under `registry/default/ui/`. That is the point — the
preview now shows what an installer actually gets — but the styling shifts
slightly (`shadow-xs`, the newer focus rings).

**Follow-up, done:** `button`, `badge` and `avatar` were unpublished and their
sources deleted. They were forks of shadcn primitives that nothing imported, and
the five items that name them as dependencies were always resolving to shadcn's
own registry — a bare name in `registryDependencies` never pointed here. The
install test confirms it: the `button.tsx` that landed in the scratch project is
shadcn's current one (`import { Slot } from "radix-ui"`), neither of the two
copies in this repo.

**Still published, same shape:** `input`, `label`, `card`, `select`, `checkbox`,
`progress`, `alert` and `drawer` are also forks with no importer, and most have
drifted well behind the app's own copy — `select` by 291 lines, `card` by 149.
`progress` and `alert` have no app copy at all, so they are the only two that
would need one written if anything ever imports them. Unpublishing the other six
is the same one-line-per-item change.

---

## Suggested sequence

1. ~~Items 2, 3 and 4~~ — done.
2. Item 6 next: four broken items is the only thing here a user can actually
   trip over.
3. Item 5 whenever you have decided; a few lines in `lib/blocks.ts` plus a rebuild.
4. Item 1 after the site has run a few days on the static registry.
