# Story 3.3: One-Click Copy for Install Command

Status: done

## Story

As an admin developer,
I want a quick way to copy the generated CLI command,
so that I can verify the installation in a test project without manual typing.

## Acceptance Criteria

1. **Given** an installation command has been generated
2. **When** I click the "Copy" icon next to the command
3. **Then** the full string should be copied to my clipboard.
4. **And** a "Copied!" success indicator should briefly appear.

## Tasks / Subtasks

- [x] Add copy functionality to `DistributionCard` (AC: 1, 3)
- [x] Implement success toast or indicator (AC: 4)

## Dev Notes

- **UX:** Ensure the command is displayed in a non-editable but selectable code block style.

### References

- [Requirements](_bmad-output/planning-artifacts/epics.md#L179-191)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Integrated `navigator.clipboard` and `sonner` for smooth copy workflow.

### Completion Notes List
- Successfully implemented interactive "Copy" functionality with feedback on the distribution card.

### File List
- `app/admin/blocks/[slug]/components/distribution-card.tsx`
