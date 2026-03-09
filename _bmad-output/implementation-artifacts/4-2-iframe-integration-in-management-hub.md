# Story 4.2: Iframe Integration in Management Hub

Status: done

## Story

As an admin developer,
I want to see the interactive preview directly on the block management page,
so that I don't have to switch tabs to verify my code changes.

## Acceptance Criteria

1. **Given** I am on the block management page (`/admin/blocks/[slug]`)
2. **When** the page loads
3. **Then** I should see an `<iframe>` embedding the `/preview/[slug]` route.
4. **And** the iframe should accurately reflect the current state of the component's local file.

## Tasks / Subtasks

- [x] Implement `PreviewIframe` component (AC: 1, 3)
  - [x] Create `app/admin/blocks/[slug]/components/preview-iframe.tsx`.
- [x] Connect URL params for initial load (AC: 4)

## Dev Notes

- **Sandboxing:** Use the `sandbox` attribute on the iframe for additional security if needed.
- **Auto-Refresh:** The iframe will naturally refresh if the parent page HMR triggers, but consider adding a manual refresh button.

### References

- [Architecture Decision 2.1](_bmad-output/planning-artifacts/architecture.md#L39-44)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L209-221)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Used `sandbox` attribute for iframe isolation.
- Implemented transition effects for resizing.

### Completion Notes List
- Embedded preview into the block management hub with automatic loading states.

### File List
- `app/admin/blocks/[slug]/components/preview-iframe.tsx`
