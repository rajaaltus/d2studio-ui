# Story 3.2: Automated CLI Command Generation

Status: done

## Story

As an admin developer,
I want the system to automatically calculate the user-facing installation command,
so that I can copy it directly into documentation or share it with users.

## Acceptance Criteria

1. **Given** the registry build has successfully completed
2. **When** I look at the "Distribution" section
3. **Then** I should see the command: `npx shadcn@latest add https://[domain]/r/[slug].json`.
4. **And** the URL must update dynamically based on the component's slug.

## Tasks / Subtasks

- [x] Implement `DistributionCard` component (AC: 1, 3)
- [x] Logic for URL resolution (AC: 4)
  - [x] Use `process.env.NEXT_PUBLIC_APP_URL` or fallback to relative path.

## Dev Notes

- **URL Prefix:** The registry build outputs to `public/r/` by default, so the URL is typically `/r/[slug].json`.

### References

- [Requirements](_bmad-output/planning-artifacts/epics.md#L166-178)

## Dev Agent Record

### Agent Model Used
Gemini 2.0 Flash

### Debug Log References
- Resolved dynamic URL using `window.location.origin` with SSR safety.

### Completion Notes List
- Created `DistributionCard` that generates valid `shadcn` add commands.

### File List
- `app/admin/blocks/[slug]/components/distribution-card.tsx`
- `app/admin/blocks/[slug]/page.tsx`
