---
stepsCompleted: [1, 2]
inputDocuments:
  - "/Users/godwinjanarthan/Documents/Projects/d2studio-ui/docs/epic-ui-assisted-development-workflow.md"
  - "convex/schema.ts"
  - "app/admin/page.tsx"
  - "registry/default/components"
workflowType: 'architecture'
project_name: 'd2studio-ui'
user_name: 'Godwin'
date: '2026-03-08T11:45:00+07:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## 1. Project Context Analysis

### Technical Foundation
- **Framework:** Next.js (App Router)
- **Backend/Database:** Convex (with `blocks`, `blockAnalytics`, and `blockStats` tables)
- **UI Framework:** Shadcn UI (using Radix + Tailwind CSS)
- **Registry System:** Custom Shadcn CLI registry architecture located in `/registry`
- **Development Environment:** Local development using `pnpm dev:local` (Next.js + Convex Local)

### Strategic Objectives
The primary architectural challenge is bridging the gap between a **cloud-hosted database (Convex)** and the **local file system (Registry Source Code)** during the development phase, while providing a seamless "admin-driven" experience.

### Architecture Guardrails
- **Isolation:** Component previews must be visually and functionally isolated from the Admin Dashboard to ensure accurate styling tests.
- **Automation:** Registry builds must be triggerable via the UI, requiring coordination between the browser and local shell commands.
- **Local-First Development:** The source of truth for component code remains in the local Git repository under `/registry`, while metadata resides in Convex.

---

## 2. Solution Design Decisions

### [Decision 2.1] Component Preview Methodology: Iframe Sandboxing
**Context:** We need to preview components without inheriting Admin Dashboard styles or layout constraints.
- **Decision:** Implement a dedicated, minimal Next.js route at `/preview/[slug]`.
- **Implementation:** This route will use `next/dynamic` to load components from the local `/registry` path. It will contain no global layout elements (navbars, footers) and will toggle themes via URL parameters.
- **Benefit:** Provides a "clean room" environment for true visual validation.

### [Decision 2.2] Registry Build Integration: Next.js Server Actions
**Context:** The `shaden registry:build` command needs to run on the developer's machine but be triggered from the browser.
- **Decision:** Use a Next.js Server Action (`action.ts`) that invokes the `child_process.exec` to run `npm run build:registry`.
- **Security:** This action will be restricted to the development environment (`process.env.NODE_ENV === 'development'`) and authenticated admin sessions.

### [Decision 2.3] Local Development Workflow: UI-Assisted File Scaffolding
**Context:** Creating a new block in the database should simplify the physical file creation.
- **Decision:** The Block Management page will dynamically generate a set of shell commands (`mkdir`, `touch`) and boilerplates based on the chosen slug.
- **Target Path:** `registry/default/components/[slug].tsx` (following established registry patterns).

### [Decision 2.4] Database & Registry Sync
**Context:** Ensuring the Convex metadata matches the physical file availability.
- **Decision:** The "Generate Build" process will perform a pre-flight check to verify the existence of the physical `.tsx` file before attempting to index it into the registry.

---

## 3. Data Flow Architecture

### 3.1 New Component Creation Flow
1. **Admin UI:** User fills out "Create New Block" form.
2. **Convex:** `createBlock` mutation saves metadata.
3. **Step UI:** Management Page displays `mkdir` and `touch` commands for the user to run locally.
4. **Local Dev:** User creates `.tsx` file and implements the UI block.

### 3.2 Build & Test Flow
1. **Admin UI:** User clicks "Generate Registry Build".
2. **Server Action:** Executes `npm run build:registry`.
3. **Admin UI:** Success/Error logs are streamed back; auto-generates `npx shadcn@latest add ...` command.
4. **Preview:** Admin embeds `app/preview/[slug]` via an iframe for visual interactive testing.
