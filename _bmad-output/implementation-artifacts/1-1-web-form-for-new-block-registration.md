# Story 1.1: Web Form for New Block registration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin developer,
I want a dedicated form to input component metadata (Title, Slug, Category, Figma URL, Preview Image),
so that I can register a new premium block in the Convex database.

## Acceptance Criteria

1. **Given** I am on the Admin Dashboard (`/admin`)
2. **When** I click "Create New Block"
3. **Then** I should see a form (Modal/Dialog) with fields for:
   - **Title**: High-level name of the component.
   - **Slug**: Unique identifier for the registry (e.g., `primary-button`).
   - **Category**: Dropdown or multi-select for block categories.
   - **Figma URL**: Link to the design file.
   - **Preview Image**: Upload or URL field for the initial screenshot.
4. **And** the "Save" button should be disabled until all required fields are valid.

## Tasks / Subtasks

- [x] Add "Create New Block" button to Admin Quick Actions (AC: 1, 2)
  - [x] Modify `app/admin/components/quick-actions.tsx` to include the toggle.
- [x] Implement `CreateBlockDialog` component (AC: 3)
  - [x] Create `app/admin/components/create-block-dialog.tsx`.
  - [x] Use Shadcn `Dialog`, `Form`, `Input`, and `Select` components.
- [x] Implement Form Validation with Zod (AC: 4)
  - [x] Define schema for block metadata.
  - [x] Connect `react-hook-form` to the UI.
- [x] Mock local state for "Save" button transition (AC: 4)
  - [x] Ensure button disables/enables based on validity.
  - [x] Provide empty handler for Story 1.2 to implement.

## Dev Notes

- **Architecture Pattern:** Use Shadcn UI Dialog for a seamless overlay experience. [Source: architecture.md#Decision 2.3]
- **Target Folder:** `app/admin/components/` for UI elements.
- **Form Patterns:** Use `react-hook-form` + `zod` for consistency with existing project patterns.
- **Convex Types:** Refer to `convex/schema.ts` for field types (e.g., `categories` is an array of strings).

### Project Structure Notes

- Alignment with `app/admin` folder structure.
- Component naming convention: `PascalCase` for React components.

### References

- [Architecture: Data Flow Architecture](_bmad-output/planning-artifacts/architecture.md#L61-74)
- [Requirements: Functional Requirements](_bmad-output/planning-artifacts/epics.md#L16-29)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- No major issues encountered. Form validation working as expected.

### Completion Notes List
- Created `app/admin/components/create-block-dialog.tsx` with Zod validation.
- Integrated `CreateBlockDialog` into `app/admin/components/quick-actions.tsx`.
- Form includes Title, Slug, Category, Figma URL, and Preview Image URL.
- Save button is disabled until the form is valid.

### File List
- `app/admin/components/create-block-dialog.tsx`
- `app/admin/components/quick-actions.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
