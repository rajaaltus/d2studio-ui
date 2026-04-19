# Story 5.1: Categories Admin Panel (CRUD)

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin developer,
I want a dedicated dashboard to create, read, update, and delete category records,
so that I can control the taxonomy of our block registry without modifying code.

## Acceptance Criteria

1. **Given** I am securely authenticated on the Admin Dashboard
2. **When** I navigate to `/admin/categories`
3. **Then** I should see a list of existing categories fetched from the Convex `categories` table
4. **And** I can add a new category by providing a Name, Slug, and Sort Order
5. **And** I can edit or delete existing categories.

## Tasks / Subtasks

- [x] Create `categories` table schema in Convex
  - [x] Define `categories` schema in `convex/schema.ts` with `name` (string), `slug` (string), and `sortOrder` (number) fields. Add any standard timestamp fields like `createdAt`, `updatedAt` if required by the system pattern.
  - [x] Create `convex/categories.ts` containing the necessary queries and mutations.
  - [x] Implement `get` query to fetch all categories, sorted by `sortOrder`.
  - [x] Implement `create` mutation to insert a new category.
  - [x] Implement `update` mutation to update an existing category.
  - [x] Implement `delete` mutation to remove a category.
- [x] Implement UI for Categories Admin Panel
  - [x] Create new page at `app/admin/categories/page.tsx`
  - [x] Ensure the page uses the Admin dashboard layout components (e.g., Sidebar/Header integrations if any).
  - [x] Implement Category List view using Shadcn/UI table or list components.
  - [x] Create a form (possibly in a Dialog or Sheet) to add/edit categories.
  - [x] Hook up the Convex queries and mutations to the list and form.
  - [x] Add toast notifications for success/error states on CRUD operations.
  - [x] Add a confirmation dialog before deleting a category.

## Dev Notes

- **Convex Database**: 
  - Ensure the schema index maps perfectly to our query needs (e.g. indexing `slug` for uniqueness, and indexing `sortOrder` for fast ordered retrieval).
  - Add uniqueness checks for the `slug` when creating or updating.
- **Authentication**: 
  - Admin routes should be protected by Clerk. Ensure `/admin/categories` leverages the same layout restrictions as `/admin` and `/admin/blocks`.
- **UI Components**: 
  - Use `Table`, `Button`, `Input`, `Dialog`/`Sheet`, and `Toast` from the configured Shadcn/UI library.
- **Defensive Coding**: 
  - The Readiness Report recommended checking for `slug` uniqueness to prevent data corruption. Make sure the Server/Convex mutation checks this.

### Project Structure Notes

- Architecture requires using Next.js App Router and server actions or Convex mutations where appropriate. Follow established patterns in `convex/blocks.ts`.

### References

- Epics Listing: `_bmad-output/planning-artifacts/epics.md`
- Readiness Report Notes on Defensive Coding: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-08.md`

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 3 Pro)

### Debug Log References

- [C3] Fixed Rules of Hooks violation in `columns.tsx`: `useMutation` and `useState` were called inside a `ColumnDef` cell render function. Extracted into a proper `CategoryRowActions` React component.
- [M1] Fixed broken regex `/^[a-z0-0-]+$/` → `/^[a-z0-9-]+$/` in `category-form.tsx` slug validation. The range `0-0` matched nothing.

### Completion Notes List

- All CRUD backend logic is implemented and correct in `convex/categories.ts`.
- Admin UI at `/admin/categories` is complete with data table, forms, and dialogs.
- Admin navigation updated to include Categories link.
- Two bugs found during code review and fixed: Hooks violation in columns.tsx, broken regex in category-form.tsx.

### File List

- `convex/schema.ts`
- `convex/categories.ts`
- `app/admin/categories/page.tsx`
- `app/admin/categories/components/columns.tsx` (bug fix: Hooks violation)
- `app/admin/categories/components/category-form.tsx` (bug fix: broken regex)
- `app/admin/categories/components/data-table.tsx`
- `app/admin/categories/components/data-table-toolbar.tsx`
- `components/admin/admin-navigation.tsx`
