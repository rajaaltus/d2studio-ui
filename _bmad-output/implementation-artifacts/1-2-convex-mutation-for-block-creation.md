# Story 1.2: Convex Mutation for Block Creation

Status: done

## Story

As an admin developer,
I want the system to persist the form data into the `blocks` table,
so that the component exists as a "Coming Soon" or "Draft" entry in the registry system.

## Acceptance Criteria

1. **Given** the "Create New Block" form is valid
2. **When** I click "Save"
3. **Then** a new document should be created in the Convex `blocks` table with the provided metadata.
4. **And** the `createdAt` and `updatedAt` timestamps should be automatically generated.
5. **And** the default `isActive` should be `true` and `codeStatus` should be `coming_soon`.

## Tasks / Subtasks

- [x] Create Convex mutation `createBlock` (AC: 3, 4, 5)
  - [x] Add the mutation to `convex/blocks.ts`.
  - [x] Implement field validation matching the Zod schema.
- [x] Connect Form to Server-side Mutation (AC: 1, 2)
  - [x] Use `useMutation` hook in `CreateBlockDialog`.
  - [x] Add toast notifications for success/error states.

## Dev Notes

- **Convex Schema:** Use the `v.object` validators in `blocks.ts` that mirror `schema.ts`.
- **Timestamps:** Use `Date.now()` for `createdAt` and `updatedAt`.
- **Defensive Coding:** Check if a block with the same `slug` (indexed as `name` in schema) already exists before inserting.

### References

- [Convex Schema](convex/schema.ts#L13-38)
- [Requirements](_bmad-output/planning-artifacts/epics.md#L93-105)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Verified `createBlock` mutation already exists and performs necessary initialization (analytics, stats).
- Added `description` and `author` fields to the form to satisfy schema requirements.

### Completion Notes List
- Connected `CreateBlockDialog` to `api.blocks.createBlock` mutation.
- Updated form schema and UI to include required fields.
- Implemented success and error toast notifications.

### File List
- `app/admin/components/create-block-dialog.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
