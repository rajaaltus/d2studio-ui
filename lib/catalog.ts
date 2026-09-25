import { SHELVED, type BlockDef } from "@/lib/blocks";
import { PRO_CATALOG, type ProGroup, type ProItem } from "@/lib/pro-catalog";
import { proHref } from "@/lib/pro";

// Two catalogues browse as one shelf. A free block is an entry this site
// publishes itself; a pro item is a line in a generated mirror of another
// site's library.
// They differ in almost every field, so rather than teach the card and the
// filters about both, both are flattened to this once, at the edge.
export type CatalogItem = {
  /** Registry item name, unique across both catalogues. */
  name: string;
  title: string;
  /** One line under the title — the category, or an item's own summary. */
  subtitle: string;
  description: string;
  /** Slugs the category filter matches against. */
  categories: string[];
  tier: "free" | "pro";
  status: "available" | "coming_soon";
  image: string;
  /**
   * How the art sits in the card's 16:9 box. A screenshot of a page section or
   * a component is shot to that shape and fills it; an illustration is shot
   * tight to its own proportions and is shown whole rather than cropped.
   */
  fit: "cover" | "contain";
  /** Free items open in place; pro items open on pro.d2studio.dev. */
  href: string;
  external: boolean;
  /** Words the search box looks through. */
  keywords: string;
};

export const fromBlock = (b: BlockDef): CatalogItem => ({
  name: b.name,
  title: b.title,
  subtitle: b.categories[0] ?? "",
  description: b.description,
  categories: b.categories,
  tier: "free",
  status: b.status === "coming_soon" ? "coming_soon" : "available",
  image: b.image || "/placeholder.svg",
  fit: "cover",
  href: `/${b.shelf ?? "blocks"}/${b.name}`,
  external: false,
  keywords: [b.title, b.description, ...b.categories].join(" "),
});

/** The free items one shelf draws, in library order. */
export const freeItemsFor = (shelf: "blocks"): CatalogItem[] =>
  SHELVED.filter((b) => b.shelf === shelf).map(fromBlock);

export const fromProItem = (item: ProItem, source: string): CatalogItem => ({
  name: item.name,
  title: item.title,
  subtitle: item.categoryLabel,
  description: item.summary,
  categories: [item.category],
  tier: item.tier,
  // Everything mirrored here is already shipping on pro; nothing in the pro
  // library is a placeholder, so there is no coming-soon state to carry.
  status: "available",
  image: `/pro/${item.name}.jpg`,
  fit: item.group === "illustrations" ? "contain" : "cover",
  href: proHref(item, source),
  external: true,
  keywords: [item.title, item.summary, item.categoryLabel, ...item.dependencies].join(" "),
});

/**
 * The pro items for one shelf, minus anything this site already carries itself.
 *
 * The overlap is real — a handful of names (bento-04, bento-05,
 * notification-bento) exist in both catalogues, free here and paid there. The
 * free row wins: showing the same block twice, once with a Pro badge, would
 * read as a downgrade of something the visitor can already install. Resolved
 * against this site's own library rather than baked into the generated mirror,
 * so a block added or removed here settles it without a re-sync.
 */
export function proItemsFor(
  group: ProGroup | ProGroup[],
  source: string,
  owned: Iterable<string> = [],
): CatalogItem[] {
  const groups = Array.isArray(group) ? group : [group];
  const mine = new Set(owned);
  return PRO_CATALOG.filter((i) => groups.includes(i.group) && !mine.has(i.name)).map((i) =>
    fromProItem(i, source),
  );
}
