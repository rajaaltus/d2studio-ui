# Story 2.1: Dynamic Path & Instruction Display

Status: done

## Story

As an admin developer,
I want to see the exact `registry/` file paths on the block management page,
so that I don't have to guess or manually calculate where to put my `.tsx` source code.

## Acceptance Criteria

1. **Given** I am on the block management page (`/admin/blocks/[slug]`)
2. **When** the page loads
3. **Then** it should display a "File Placement" section showing the target path (e.g., `registry/default/components/[slug].tsx`).
4. **And** the path should update dynamically if the component category or slug is changed.

## Tasks / Subtasks

- [x] Implement `PathInstructionCard` component (AC: 1, 3)
  - [x] Create `app/admin/blocks/[slug]/components/path-instruction-card.tsx`.
- [x] Logic for dynamic path resolution (AC: 4)
  - [x] Map categories to their respective registry folders (e.g., `ui` -> `components`).

## Dev Notes

- **Registry Strategy:** Standard components go to `registry/default/components/`.
- **UI:** Use Shadcn `Card` and `Code` components for a premium look.

### References

- [Architecture Decision 2.3](_bmad-output/planning-artifacts/architecture.md#L50-54)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L123-135)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Standardized registry paths: `type="ui"` -> `registry/default/ui`, `type="component"` -> `registry/default/components`.

### Completion Notes List
- Created `PathInstructionCard` with dynamic mapping.
- Integrated card into `/admin/blocks/[slug]/page.tsx`.
- [AI-Review Fix] Synchronized `type` prop with preview route to support UI primitives.

### File List
- `app/admin/blocks/[slug]/components/path-instruction-card.tsx`
- `app/admin/blocks/[slug]/page.tsx`
