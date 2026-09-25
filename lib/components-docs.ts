import { BLOCK_LIBRARY, SHELVED, type BlockDef } from "@/lib/blocks";

// The /components docs read the primitives in this order: the groups a reader
// reaches for first lead, and the sidebar, the overview and prev/next all walk
// the same list so "Next" always lands on the link below in the sidebar.
const GROUP_ORDER = [
  { slug: "forms", label: "Forms" },
  { slug: "actions", label: "Actions" },
  { slug: "overlays", label: "Overlays" },
  { slug: "navigation", label: "Navigation" },
  { slug: "data-display", label: "Data display" },
  { slug: "feedback", label: "Feedback" },
  { slug: "layout", label: "Layout" },
  { slug: "chat", label: "Chat" },
] as const;

export type ComponentLink = { name: string; title: string };
export type ComponentGroup = { slug: string; label: string; items: ComponentLink[] };

const PRIMITIVES = SHELVED.filter((b) => b.shelf === "components");

export const COMPONENT_GROUPS: ComponentGroup[] = GROUP_ORDER.map((g) => ({
  ...g,
  items: PRIMITIVES.filter((b) => b.categories[0] === g.slug)
    .map((b) => ({ name: b.name, title: b.title }))
    .sort((a, b) => a.title.localeCompare(b.title)),
})).filter((g) => g.items.length > 0);

/** Every primitive in reading order. */
export const COMPONENT_ORDER: ComponentLink[] = COMPONENT_GROUPS.flatMap((g) => g.items);

export const findComponent = (name: string): BlockDef | undefined =>
  PRIMITIVES.find((b) => b.name === name);

export const groupOf = (name: string): ComponentGroup | undefined =>
  COMPONENT_GROUPS.find((g) => g.items.some((i) => i.name === name));

export function neighbours(name: string) {
  const i = COMPONENT_ORDER.findIndex((c) => c.name === name);
  return {
    prev: i > 0 ? COMPONENT_ORDER[i - 1] : undefined,
    next: i >= 0 && i < COMPONENT_ORDER.length - 1 ? COMPONENT_ORDER[i + 1] : undefined,
  };
}

/**
 * The designed items built on a primitive: anything in the library that names
 * it as a registry dependency. This is the hook D2's use cases hang off — add a
 * block that depends on @d2/card and it shows up under Card with no wiring.
 */
export function designedWith(name: string): BlockDef[] {
  const url = `https://ui.d2studio.dev/r/${name}.json`;
  return BLOCK_LIBRARY.filter(
    (b) => b.shelf === "blocks" && b.registryDependencies?.includes(url),
  );
}
