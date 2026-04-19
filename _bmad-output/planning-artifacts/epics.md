---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - "/Users/godwinjanarthan/Documents/Projects/d2studio-ui/docs/epic-ui-assisted-development-workflow.md"
  - "/Users/godwinjanarthan/Documents/Projects/d2studio-ui/_bmad-output/planning-artifacts/architecture.md"
---

# d2studio-ui - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for d2studio-ui, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Create a "Create New Block" form in the Admin Dashboard with fields for Title, Slug, Category, Figma URL, and Preview Image.
FR2: Save component metadata to the Convex `blocks` database.
FR3: Redirect user to the individual block management page after creation.
FR4: Display dynamic local file path instructions (e.g., `registry/default/components/[slug].tsx`) based on the component slug.
FR5: Provide copy-to-clipboard shell commands (`mkdir`, `touch`) to create the local file structure.
FR6: "Generate Registry Build" button that triggers a server-side build process.
FR7: Finalize the `registry/default/[slug].json` file and update the index.
FR8: Display auto-generated CLI installation command (e.g., `npx shadcn@latest add ...`).
FR9: Provide a "Copy to Clipboard" button for the CLI command.
FR10: Display an iframe-based preview of the component on the block management page.
FR11: Provide theme toggling (Dark/Light) and responsive viewport controls for the preview iframe.

FR19: Admin can create, read, update, and delete (CRUD) block categories from a dedicated Categories Admin Panel page.
FR20: The "Create New Block" form must fetch the category list dynamically from the database instead of using a hardcoded list.
FR21: The public website's category navigation/display must fetch the list of categories dynamically from the database.

### NonFunctional Requirements

NFR1: Preview must be completely isolated from Admin Dashboard styles (Iframe Sandboxing).
NFR2: Registry build must only be triggerable in the local development environment (`process.env.NODE_ENV === 'development'`).
NFR3: Registry build must perform a pre-flight check to verify local file existence before indexing.
NFR4: Preview route (`/preview/[slug]`) must load components dynamically using `next/dynamic`.

NFR5: Category fetching on the public website should be optimized (e.g., cached or pre-fetched where appropriate) to ensure fast load times and avoid layout shift.

### Additional Requirements

- Integrated with Convex `blocks` schema.
- Uses existing `npm run build:registry` script.
- Responsive design for the Admin Dashboard.
- Secure authenticated session for admin routes.
- **Database Schema:** We will need to create a new `categories` table/schema in Convex to store category metadata (e.g., `name`, `slug`, `sortOrder`).
- **Data Migration/Relations:** Existing blocks will need to be associated with these new dynamic categories, replacing any hardcoded category strings they currently use.

### FR Coverage Map

FR1: Epic 1 - Create "Create New Block" form
FR2: Epic 1 - Save metadata to Convex
FR3: Epic 1 - Redirect after creation
FR4: Epic 2 - Display file path instructions
FR5: Epic 2 - Provide shell commands (mkdir/touch)
FR6: Epic 3 - Trigger registry build
FR7: Epic 3 - Update registry index
FR8: Epic 3 - Display install command
FR9: Epic 3 - Copy install command
FR10: Epic 4 - Iframe preview
FR11: Epic 4 - Preview controls (theme/viewport)
FR19: Epic 5 - Admin category CRUD operations
FR20: Epic 5 - Dynamic category selection in block creation
FR21: Epic 5 - Dynamic category navigation on public site

## Epic List

### Epic 1: Component Initialization & Metadata Management
Enable the admin to register a new component in the central database and automatically land in its management hub.
**FRs covered:** FR1, FR2, FR3

### Epic 2: Guided Local Development & Scaffolding
Provide yourself with exact local file system instructions and shell tools to jump-start the physical code implementation in your Git repo.
**FRs covered:** FR4, FR5

### Epic 3: Automated Registry Distribution
Transform local component code into the Shadcn registry JSON format and generate the ready-to-share public CLI installation command.
**FRs covered:** FR6, FR7, FR8, FR9

### Epic 4: Isolated Component Validation (Preview)
Provide a high-fidelity, sandboxed preview environment (Iframe) to test the component's interactive states and responsiveness without Admin style interference.
**FRs covered:** FR10, FR11

### Epic 5: Dynamic Category Management
Enable administrators to manage the taxonomy of blocks dynamically, ensuring the public site and admin tools are always in sync without code deployments.
**FRs covered:** FR19, FR20, FR21

## Epic 1: Component Initialization & Metadata Management

Enable the admin to register a new component in the central database and automatically land in its management hub.

### Story 1.1: Web Form for New Block registration

As an admin developer,
I want a dedicated form to input component metadata (Title, Slug, Category, Figma URL, Preview Image),
So that I can register a new premium block in the Convex database.

**Acceptance Criteria:**

**Given** I am on the Admin Dashboard (`/admin`)
**When** I click "Create New Block"
**Then** I should see a form with fields for Title, Slug, Category, Figma URL, and an image upload
**And** the "Save" button should be disabled until all required fields are valid.

### Story 1.2: Convex Mutation for Block Creation

As an admin developer,
I want the system to persist the form data into the `blocks` table,
So that the component exists as a "Coming Soon" or "Draft" entry in the registry system.

**Acceptance Criteria:**

**Given** the "Create New Block" form is valid
**When** I click "Save"
**Then** a new document should be created in the Convex `blocks` table with the provided metadata
**And** the `createdAt` and `updatedAt` timestamps should be automatically generated.

### Story 1.3: Post-Creation Redirect

As an admin developer,
I want to be automatically navigated to the management page of the newly created block,
So that I can immediately start the development and distribution workflow.

**Acceptance Criteria:**

**Given** a block has been successfully saved in Convex
**When** the mutation completes
**Then** the browser should navigate to `/admin/blocks/[slug]`
**And** the page should load the metadata for that specific component.

## Epic 2: Guided Local Development & Scaffolding

Provide yourself with exact local file system instructions and shell tools to jump-start the physical code implementation in your Git repo.

### Story 2.1: Dynamic Path & Instruction Display

As an admin developer,
I want to see the exact `registry/` file paths on the block management page,
So that I don't have to guess or manually calculate where to put my `.tsx` source code.

**Acceptance Criteria:**

**Given** I am on the block management page (`/admin/blocks/[slug]`)
**When** the page loads
**Then** it should display a "File Placement" section showing the target path (e.g., `registry/default/components/[slug].tsx`)
**And** the path should update dynamically if the component category or slug is changed.

### Story 2.2: One-Click Scaffolding Commands

As an admin developer,
I want copyable shell commands (`mkdir`, `touch`) generated for me,
So that I can instantly create the necessary folders and files in my terminal.

**Acceptance Criteria:**

**Given** I am on the block management page
**When** I view the "Getting Started" instructions
**Then** I should see a code block containing `mkdir -p registry/default/components` and `touch registry/default/components/[slug].tsx`
**And** each command should have a "Copy" button.

## Epic 3: Automated Registry Distribution

Transform local component code into the Shadcn registry JSON format and generate the ready-to-share public CLI installation command.

### Story 3.1: Trigger Registry Build via Server Action

As an admin developer,
I want a "Generate Registry Build" button that executes the build script,
So that I don't have to leave the browser to compile the component's JSON metadata.

**Acceptance Criteria:**

**Given** I am on the block management page
**When** I click "Generate Registry Build"
**Then** the system should execute `npm run build:registry` via a Next.js Server Action
**And** success/error logs should be displayed back to me in the UI.

### Story 3.2: Automated CLI Command Generation

As an admin developer,
I want the system to automatically calculate the user-facing installation command,
So that I can copy it directly into documentation or share it with users.

**Acceptance Criteria:**

**Given** the registry build has successfully completed
**When** I look at the "Distribution" section
**Then** I should see the command: `npx shadcn@latest add https://[domain]/r/[slug].json`
**And** the URL must update dynamically based on the component's slug.

### Story 3.3: One-Click Copy for Install Command

As an admin developer,
I want a quick way to copy the generated CLI command,
So that I can verify the installation in a test project without manual typing.

**Acceptance Criteria:**

**Given** an installation command has been generated
**When** I click the "Copy" icon next to the command
**Then** the full string should be copied to my clipboard
**And** a "Copied!" success indicator should briefly appear.

## Epic 4: Isolated Component Validation (Preview)

Provide a high-fidelity, sandboxed preview environment (Iframe) to test the component's interactive states and responsiveness without Admin style interference.

### Story 4.1: Standalone Preview Route

As an admin developer,
I want a dedicated, "clean" route for component previews,
So that I can see the component rendered without any admin-specific CSS or layout bleed.

**Acceptance Criteria:**

**Given** a component slug exists in the registry
**When** I navigate to `/preview/[slug]`
**Then** the page should use `next/dynamic` to load the component
**And** it should render against a blank background with no global navigation or footers.

### Story 4.2: Iframe Integration in Management Hub

As an admin developer,
I want to see the interactive preview directly on the block management page,
So that I don't have to switch tabs to verify my code changes.

**Acceptance Criteria:**

**Given** I am on the block management page (`/admin/blocks/[slug]`)
**When** the page loads
**Then** I should see an `<iframe>` embedding the `/preview/[slug]` route
**And** the iframe should accurately reflect the current state of the component's local file.

### Story 4.3: Theme & Viewport Controls

As an admin developer,
I want to toggle dark mode and resize the preview window from the admin dashboard,
So that I can test the component's responsiveness and color contrast.

**Acceptance Criteria:**

**Given** the active iframe preview
**When** I click the "Dark Mode" toggle
**Then** the iframe URL should update with a `?theme=dark` parameter, triggering the iframe's internal theme state
**When** I select "Mobile" or "Tablet" buttons
**Then** the iframe container's width should resize to standard breakpoints (e.g., 375px or 768px).

## Epic 5: Dynamic Category Management

Enable administrators to manage the taxonomy of blocks dynamically, ensuring the public site and admin tools are always in sync without code deployments.

### Story 5.1: Categories Admin Panel (CRUD)

As an admin developer,
I want a dedicated dashboard to create, read, update, and delete category records,
So that I can control the taxonomy of our block registry without modifying code.

**Acceptance Criteria:**

**Given** I am securely authenticated on the Admin Dashboard
**When** I navigate to `/admin/categories`
**Then** I should see a list of existing categories fetched from the Convex `categories` table
**And** I can add a new category by providing a Name, Slug, and Sort Order
**And** I can edit or delete existing categories.

### Story 5.2: Dynamic Category Selection in Block Creation

As an admin developer,
I want the "Create New Block" form to populate its category dropdown directly from the database,
So that I can immediately assign new blocks to any newly created category.

**Acceptance Criteria:**

**Given** categories exist in the database
**When** I open the "Create New Block" form (or edit an existing block)
**Then** the "Category" selector should dynamically list all available categories from Convex
**And** selecting a category properly links the block to that category slug in the database.

### Story 5.3: Dynamic Category Navigation on Public Site

As an end user,
I want the category navigation menu and browse pages to reflect the latest taxonomy from the database,
So that I can smoothly discover blocks under the most up-to-date categories.

**Acceptance Criteria:**

**Given** I am browsing the public block registry
**When** the page loads
**Then** the category navigation bar (e.g., in `line-navbar.tsx` or similar) must fetch and render its links dynamically from the Convex categories table
**And** this query must be performant/optimized (NFR5) to avoid visible layout shifts
**And** navigating to a category page filters blocks based on the live dynamic categories.
