# Story 2.2: One-Click Scaffolding Commands

Status: done

## Story

As an admin developer,
I want copyable shell commands (`mkdir`, `touch`) generated for me,
so that I can instantly create the necessary folders and files in my terminal.

## Acceptance Criteria

1. **Given** I am on the block management page
2. **When** I view the "Getting Started" instructions
3. **Then** I should see a code block containing `mkdir -p registry/default/components` and `touch registry/default/components/[slug].tsx`.
4. **And** each command should have a "Copy" button.

## Tasks / Subtasks

- [x] Implement `ScaffoldCommands` section (AC: 1, 3)
  - [x] Add copy-to-clipboard functionality to the path instruction card.
- [x] Add "Copy" success state (AC: 4)
  - [x] Toggle icon from `Copy` to `Check` on click.

## Dev Notes

- **Command Syntax:** Ensure `-p` is used for `mkdir` to handle potentially missing parent directories.
- **Library:** Use the existing `navigator.clipboard.writeText` API.

### References

- [Requirements](_bmad-output/planning-artifacts/epics.md#L136-148)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Used `navigator.clipboard` for copy functionality.
- Implemented visual feedback with toast and icon toggle.

### Completion Notes List
- Enhanced `PathInstructionCard` with copyable `mkdir` and `touch` commands.

### File List
- `app/admin/blocks/[slug]/components/path-instruction-card.tsx`
