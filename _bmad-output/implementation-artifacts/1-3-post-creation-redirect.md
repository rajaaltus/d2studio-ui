# Story 1.3: Post-Creation Redirect

Status: done

## Story

As an admin developer,
I want to be automatically navigated to the management page of the newly created block,
so that I can immediately start the development and distribution workflow.

## Acceptance Criteria

1. **Given** a block has been successfully saved in Convex
2. **When** the mutation completes
3. **Then** the browser should navigate to `/admin/blocks/[slug]`
4. **And** the page should load the metadata for that specific component.

## Tasks / Subtasks

- [x] Implement redirect logic in `CreateBlockDialog` (AC: 1, 2, 3)
  - [x] Use `useRouter` from `next/navigation`.
  - [x] Extract the slug from the form data or mutation response.
- [x] Create basic Block Management Shell (AC: 4)
  - [x] Create `app/admin/blocks/[slug]/page.tsx`.
  - [x] Implement a simple layout to display the block title and metadata.

## Dev Notes

- **Routing:** Ensure the path matches the decision in `architecture.md`.
- **Next.js:** Use `useRouter.push()` for client-side navigation after the Convex promise resolves.

### References

- [Architecture Decision 2.3](_bmad-output/planning-artifacts/architecture.md#L50-54)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L106-118)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Implemented `[slug]` route for block details.
- Integrated `useRouter` for post-creation redirection.

### Completion Notes List
- Updated `CreateBlockDialog` to redirect to `/admin/blocks/[slug]` after successful creation.
- Created `app/admin/blocks/[slug]/page.tsx` with a comprehensive detail view (Preview, Metadata, Details).

### File List
- `app/admin/components/create-block-dialog.tsx`
- `app/admin/blocks/[slug]/page.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
