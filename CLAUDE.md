# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development**: `pnpm dev` - Runs frontend (Next.js) and backend (Convex) in parallel
- **Build application**: `pnpm build` - Creates production build
- **Lint code**: `pnpm lint` - Runs Next.js ESLint
- **Start production**: `pnpm start` - Starts production server

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