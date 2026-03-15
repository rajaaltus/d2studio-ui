# Story 5.2: Dynamic Category Selection in Block Creation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin developer,
I want the "Create New Block" form to populate its category dropdown directly from the database,
so that I can immediately assign new blocks to any newly created category.

## Acceptance Criteria

1. **Given** categories exist in the database
2. **When** I open the "Create New Block" form (or edit an existing block)
3. **Then** the "Category" selector should dynamically list all available categories from Convex
4. **And** selecting a category properly links the block to that category slug in the database.

## Tasks / Subtasks

- [x] Fetch categories in the related form component
  - [x] Identify where the "Create New Block" form is located (e.g. `app/admin/blocks/new/page.tsx` or similar).
  - [x] Import the `useQuery` hook and fetch all categories from the `convex` database via the `get` query initialized in 5.1.
- [x] Update the Category Dropdown UI
  - [x] Replace hardcoded categories with the dynamically fetched ones in the `Select`/dropdown component.
  - [x] Map the options to use the category `name` for display and `slug` for the value.
  - [x] Add a loading state while categories are being fetched.
- [x] Test the form submission
  - [x] Verify that selecting a dynamic category updates the form state successfully.
  - [x] Confirm that saving a new block submits the correct `slug` for the category to the blocks database.

## Dev Notes

- **Convex Database Integration**: 
  - Ensure the query matches the `convex/categories` schema definitions from story 5.1. 
  - Use `useQuery` to reactively capture changes so that newly added categories appear automatically.
- **Form components**: 
  - We likely use `react-hook-form` and `@hookform/resolvers/zod` along with `shadcn-ui`. Check if the `zod` schema requires any changes to accommodate dynamic string values instead of a hard-coded enum.
- **Loading states**: 
  - Avoid layout jank when the dropdown populates. 

### Project Structure Notes

- Architecture relies heavily on the generic Shadcn/UI configuration, apply correctly for standard forms.

### References

- Epics Listing: `_bmad-output/planning-artifacts/epics.md`

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 3 Pro)

### Debug Log References

- Fixed missing `useQuery` import in `app/admin/blocks/create/page.tsx`.
- Resolved duplicate `categoriesList` declaration issue during multi-file edit.

### Completion Notes List

- Integrated dynamic categories into `CreateBlockPage` and `EditBlockPage`.
- Replaced hardcoded `BLOCK_TYPES` with live data from Convex.
- Implemented skeleton/loading states to maintain UX during data fetch.

### File List

- `app/admin/blocks/create/page.tsx`
- `app/admin/blocks/[slug]/edit/page.tsx`
- `app/admin/components/create-block-dialog.tsx` (Critical bug fix: was missed, still had hardcoded categories)
