# Story 4.3: Theme & Viewport Controls

Status: done

## Story

As an admin developer,
I want to toggle dark mode and resize the preview window from the admin dashboard,
so that I can test the component's responsiveness and color contrast.

## Acceptance Criteria

1. **Given** the active iframe preview
2. **When** I click the "Dark Mode" toggle
3. **Then** the iframe URL should update with a `?theme=dark` parameter, triggering the iframe's internal theme state.
4. **When** I select "Mobile" or "Tablet" buttons
5. **Then** the iframe container's width should resize to standard breakpoints (e.g., 375px or 768px).

## Tasks / Subtasks

- [x] Implement `IframeControls` toolbar (AC: 1, 2, 4)
  - [x] Add theme toggle and viewport preset buttons.
- [x] Connect state to Iframe size and URL (AC: 3, 5)

## Dev Notes

- **Theme Sync:** Inside `app/preview/[slug]/page.tsx`, check for the `theme` search param and wrap the component in a `ThemeProvider` or apply a `.dark` class.
- **Viewport:** Use Tailwind `w-[375px]` type classes or inline styles on the iframe wrapper.

### References

- [Requirements](_bmad-output/planning-artifacts/epics.md#L222-235)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Coordinated state between `PreviewSection` and `PreviewIframe` via URL params.

### Completion Notes List
- Implemented full responsiveness testing suite (Mobile, Tablet, Desktop) and Theme Toggle.

### File List
- `app/admin/blocks/[slug]/components/preview-section.tsx`
- `app/admin/blocks/[slug]/page.tsx`
