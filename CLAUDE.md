# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development**: `pnpm dev` - Runs frontend (Next.js) and backend (Convex) in parallel
- **Build application**: `pnpm build` - Creates production build
- **Lint code**: `pnpm lint` - Runs Next.js ESLint
- **Start production**: `pnpm start` - Starts production server

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
`lib/catalog.ts` flattens the free (Convex) and pro (static) halves into the one
`CatalogItem` shape every card and filter reads.

### Convex-specific commands
- **Frontend only**: `pnpm dev:frontend` - Next.js dev server only
- **Backend only**: `pnpm dev:backend` - Convex dev server only
- **Convex setup**: `pnpm predev` - Initializes Convex dev environment and dashboard

## Architecture Overview

This is a **Next.js 15 + Convex + Clerk** full-stack application:

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and server functions)
- **Authentication**: Clerk (currently commented out, needs setup)
- **UI Components**: shadcn/ui components (New York style)
- **Package Manager**: pnpm

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `convex/` - Convex backend functions, schema, and configuration
- `components/` - React components including ConvexClientProvider
- `lib/` - Utility functions and configurations

### Key Files
- `app/layout.tsx` - Root layout with Clerk and Convex providers
- `convex/schema.ts` - Database schema definitions (currently has sample numbers table)
- `convex/myFunctions.ts` - Sample Convex functions (queries, mutations, actions)
- `convex/auth.config.ts` - Clerk authentication configuration (commented out)
- `components.json` - shadcn/ui configuration

## Important Convex Guidelines

This project uses Convex with comprehensive coding standards documented in `.cursor/rules/convex_rules.mdc`. Key patterns:

### Function Definition
Always use the new function syntax with validators:
```typescript
export const exampleQuery = query({
  args: { param: v.string() },
  returns: v.object({ result: v.string() }),
  handler: async (ctx, args) => {
    // implementation
  },
});
```

### Database Operations
- Use indexes instead of filters for queries
- Convex uses file-based routing (functions in `convex/` are automatically exposed)
- All functions must include `args` and `returns` validators

### Authentication Setup Required
The Clerk authentication is currently commented out. To enable:
1. Set up Clerk application and get JWT issuer domain
2. Configure `CLERK_JWT_ISSUER_DOMAIN` environment variable
3. Uncomment the Clerk provider in `convex/auth.config.ts`

## Development Notes

- Uses pnpm as package manager (see `pnpm-lock.yaml`)
- Tailwind CSS configured with custom variables and neutral base color
- Geist fonts loaded from Google Fonts
- Environment variables stored in `.env.local`

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
