# Story 4.1: Standalone Preview Route

Status: done

## Story

As an admin developer,
I want a dedicated, "clean" route for component previews,
so that I can see the component rendered without any admin-specific CSS or layout bleed.

## Acceptance Criteria

1. **Given** a component slug exists in the registry
2. **When** I navigate to `/preview/[slug]`
3. **Then** the page should use `next/dynamic` to load the component.
4. **And** it should render against a blank background with no global navigation or footers.

## Tasks / Subtasks

- [x] Create `app/preview/[slug]/page.tsx` (AC: 1, 4)
  - [x] Use a layout that suppresses the root `AdminLayout` if necessary, or just a standalone directory.
- [x] Implement dynamic loading (AC: 3)
  - [x] Use `next/dynamic` to import from `registry/default/components/[slug].tsx`.

## Dev Notes

- **Dynamic Imports:** You may need to use `ssr: false` if the component uses client-only APIs.
- **Path Resolution:** The dynamic import path must be relative to the registry root.

### References

- [Architecture Decision 2.1](_bmad-output/planning-artifacts/architecture.md#L39-44)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L196-208)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Implemented `next/dynamic` with `@/registry` path alias.
- Added path resolution guard for missing components.

### Completion Notes List
- Created standalone `/preview/[slug]` route with zero layout bleed.
- [AI-Review Fix] Implemented dynamic folder resolution (`ui` vs `components`) via search params.

### File List
- `app/preview/[slug]/page.tsx`
