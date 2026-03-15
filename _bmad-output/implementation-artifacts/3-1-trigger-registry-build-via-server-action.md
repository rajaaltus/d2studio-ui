# Story 3.1: Trigger Registry Build via Server Action

Status: done

## Story

As an admin developer,
I want a "Generate Registry Build" button that executes the build script,
so that I don't have to leave the browser to compile the component's JSON metadata.

## Acceptance Criteria

1. **Given** I am on the block management page
2. **When** I click "Generate Registry Build"
3. **Then** the system should execute `npm run build:registry` via a Next.js Server Action.
4. **And** success/error logs should be displayed back to me in the UI.

## Tasks / Subtasks

- [x] Create Server Action `buildRegistryAction` (AC: 1, 3)
  - [x] Implement in `app/admin/blocks/[slug]/actions.ts`.
  - [x] Use `exec` from `child_process`.
- [x] Implement `BuildControlCard` component (AC: 2, 4)
  - [x] Add loading states and log display area.

## Dev Notes

- **Environment Guard:** Check `process.env.NODE_ENV === 'development'` inside the action. [Source: architecture.md#Decision 2.2]
- **Feedback:** Use `useEffect` or a state to clear logs between runs.

### References

- [Architecture Decision 2.2](_bmad-output/planning-artifacts/architecture.md#L45-49)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L153-165)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Implemented `buildRegistryAction` with `NODE_ENV` guard.
- Created `BuildControlCard` with terminal-style output.

### Completion Notes List
- Successfully linked browser action to local `npm run build:registry` command via Server Action.
- [AI-Review Fix] Added shell output matching to provide helpful errors for empty builds.
- [AI-Review Fix] Increased console output height for better legibility.

### File List
- `app/admin/blocks/[slug]/actions.ts`
- `app/admin/blocks/[slug]/components/build-control-card.tsx`
- `app/admin/blocks/[slug]/page.tsx`
