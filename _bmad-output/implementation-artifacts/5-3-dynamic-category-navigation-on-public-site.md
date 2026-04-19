# Story 5.3: Dynamic Category Navigation on Public Site

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,
I want the category navigation menu and browse pages to reflect the latest taxonomy from the database,
so that I can smoothly discover blocks under the most up-to-date categories.

## Acceptance Criteria

1. **Given** I am browsing the public block registry
2. **When** the page loads
3. **Then** the category navigation bar (e.g., in `line-navbar.tsx` or similar) must fetch and render its links dynamically from the Convex categories table
4. **And** this query must be performant/optimized (NFR5) to avoid visible layout shifts
5. **And** navigating to a category page filters blocks based on the live dynamic categories.

## Tasks / Subtasks

- [x] Fetch categories dynamically for the public navigation
  - [x] Locate the main navigation component(s) displaying categories (e.g., `components/line-navbar.tsx` or related page context).
  - [x] Use a `useQuery` (if client-side) or `fetchQuery` (if Server Component) to retrieve categories from Convex.
- [x] Render the navigation dynamically
  - [x] Replace any static/hardcoded category links with the dynamically fetched ones.
  - [x] Use `slug` as the route identifier and `name` for display purposes.
  - [x] Prioritize categories sorted by `sortOrder`.
- [x] Optimize performance (NFR5)
  - [x] Ensure Server Components or proper Suspense boundaries are used so that SEO can still parse links effectively.
  - [x] Avoid Layout Shift by providing a suitable skeleton or initial data if fetching client-side.
- [x] Implement/verify category filtering pages
  - [x] Check the target route (e.g., `/blocks/[category]`) to ensure it queries the blocks using the correct dynamic `category` slug constraint.
  - [x] Fetch blocks correctly based on the new category mappings and display appropriately.

## Dev Notes

- **Convex Data Fetching**: 
  - For server elements, prefer fetching from Convex within the Next.js Server Components. Next.js 14+ fetch options should be used.
- **Client Components**: 
  - If components must be client-side due to interactivity, inject initial data to avoid loading flickers (Next.js layout shift avoidance).
- **Fallback States**: 
  - When categories haven't loaded, avoid layout jumping. Use skeletons.
  - Ensure the styling in the Top Nav remains clean and scales correctly if the number of categories increases.

### Project Structure Notes

- Use the latest App Router structure features.

### References

- Epics Listing: `_bmad-output/planning-artifacts/epics.md`
- Performance Reqs: NFR5

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 3 Pro)

### Debug Log References

- Handled horizontal overflow for dynamic tabs in `CategoryFilter` using `no-scrollbar` and `flex-nowrap`.

### Completion Notes List

- Updated `CategoryFilter` component to fetch categories from Convex.
- Ensured "All" category is preserved at the beginning of the list.
- Verified that block filtering still works as it uses the same `slug` (value) as the previous hardcoded values.

### File List

- `components/blocks/category-filter.tsx`
