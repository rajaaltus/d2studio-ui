# EPIC: UI-Assisted Component Development & Distribution Workflow

## Overview
We are building a platform to create and distribute premium Shadcn blocks for free using the CLI and Convex. This Epic streamlines the process of creating, documenting, testing, and distributing new UI blocks so that the workflow is highly efficient and fully managed through the existing admin dashboard. 

The goal is to provide a "UI-assisted development" experience. When producing a new block, the admin dashboard (`app/admin/page.tsx`) will guide the creation, provide file placement instructions, integrate with Convex to handle metadata (Figma links, screenshots), seamlessly trigger the existing Shadcn CLI registry build scripts, and provide a sandboxed preview environment.

## Goals & Objectives
- **Centralized Management:** Manage all component metadata (name, description, figma source, cover screenshot, code file paths) in Convex via the secure admin dashboard (`app/admin/page.tsx`).
- **Guided Development:** Upon creating a new component entry, immediately present the developer with the exact file structure and paths required for the new component directly into the local Git repository.
- **Automated Distribution:** Trigger the existing registry build scripts (`npm run build:registry` / `shadcn build`) directly from the admin UI via a server action or API route.
- **Zero-Friction Testing:** Auto-generate the user-facing CLI command (`npx shadcn@latest add ...`) and provide an isolated iframe-based test page to preview and verify the component before it ships to the public.

---

## User Stories

### Story 1: Component Initialization via Admin Dashboard
**As an** admin developer,
**I want to** create a new component entry in the existing admin dashboard (`app/admin/page.tsx`) by providing basic metadata (Name, Category, Figma URL, initial screenshot),
**So that** I have a single source of truth stored in Convex for the new block.

**Acceptance Criteria:**
- Extend the `app/admin/page.tsx` Quick Actions with a "Create New Block" flow, integrating with the `blocks` Convex schema.
- Form accepts: Title, Slug, Category, Figma URL, and an image upload for the screenshot.
- Saving creates a document in the Convex `blocks` database.
- Upon successful creation, the UI redirects to the component's detailed management screen (`app/admin/blocks/[slug]/page.tsx`).

### Story 2: Guided File Structure Instructions
**As an** admin developer,
**I want to** see the required local file paths and structure for the newly created block on its management screen,
**So that** I know exactly where to write my React component (`.tsx`) code in the local Git repository.

**Acceptance Criteria:**
- The component management screen displays a directory tree showing where the block file should be placed (e.g., `components/blocks/[slug]/[slug].tsx` or `registry/blocks/[slug].tsx`).
- File paths are dynamically generated based on the chosen component slug and aligned with the `shadcn` configuration (`components.json`).
- Provide terminal commands (`mkdir`, `touch`) to easily create the files locally.

### Story 3: Generate Shadcn Registry Build
**As an** admin developer,
**I want to** click a "Generate Registry Build" button on the component management screen,
**So that** the system executes the existing `build:registry` script to compile the registry JSON format.

**Acceptance Criteria:**
- A "Generate Build" action is available on the component screen.
- A Next.js Server Action executes the `npm run build:registry` (or `npx shadcn registry:build`) command on the host machine.
- The `registry.json` index is updated to include the new component.
- The UI surfaces the build logs (success or error states) back to the admin dashboard.

### Story 4: Auto-Generate CLI Command
**As an** admin developer,
**I want to** see the auto-generated Shadcn CLI installation command on the component management screen after the registry build is complete,
**So that** I know exactly how users will install it and that it is ready for the public library.

**Acceptance Criteria:**
- The UI exposes a ready-to-copy CLI command in the format `npx shadcn@latest add https://[domain]/r/[slug].json`.
- The command updates dynamically if the block's slug changes.
- Provide a clear "Copy to Clipboard" button.

### Story 5: Isolated Component Test/Preview Page
**As an** admin developer,
**I want to** navigate to a dedicated preview route (e.g., `/admin/preview/[slug]`) to interact with the finished component,
**So that** I can verify its styling, responsiveness, and interactive states before publishing it.

**Acceptance Criteria:**
- Implement an iframe-based preview rendering method. Why iframe? Because it perfectly isolates the component from the admin dashboard's layout wrappers and styles, providing a true 1:1 preview of how the component will render in an empty environment.
- Create a dedicated Next.js dynamic route (`app/preview/[slug]/page.tsx`) that simply dynamically imports and renders the React component without any dashboard layout.
- The admin dashboard embeds this preview page via an `<iframe>`.
- The admin page provides basic controls wrapping the iframe (e.g., toggling dark/light mode via query params passed to the iframe, and viewport resizing for device testing).
