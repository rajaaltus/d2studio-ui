import type { ProItem } from "@/lib/pro-catalog";

export const PRO_ORIGIN = "https://pro.d2studio.dev";

// Every pro item on this site is a link off it, so the address is derived once
// here rather than written at each of the five surfaces that draw one. The
// shapes come from pro's own routes: a block and a component are both reachable
// at /blocks/<category>/<name>, an illustration browses as a wall and has no
// leaf of its own, and a spinner is one entry on a single shelf.
export function proHref(
  item: Pick<ProItem, "name" | "group" | "category">,
  source = "showcase",
): string {
  const path =
    item.group === "illustrations"
      ? `/illustrations/${item.category}`
      : `/blocks/${item.category}/${item.name}`;

  return withCampaign(`${PRO_ORIGIN}${path}`, source, item.name);
}

/** A shelf on pro rather than one item — /spinners, /illustrations, /blocks. */
export const proShelfHref = (path: string, source: string) =>
  withCampaign(`${PRO_ORIGIN}${path}`, source);

// Where a click came from, so the free site's contribution to pro is legible in
// analytics rather than showing up as a wall of direct traffic.
function withCampaign(url: string, source: string, content?: string) {
  const params = new URLSearchParams({
    utm_source: "ui.d2studio.dev",
    utm_medium: source,
    utm_campaign: "pro-showcase",
  });
  if (content) params.set("utm_content", content);
  return `${url}?${params}`;
}

// One place for the two attributes an outbound link must carry: `noopener`
// because the new tab would otherwise get a handle on this one, and `noreferrer`
// is deliberately *not* set — the referrer is how pro sees this site sending it.
export const PRO_LINK_PROPS = {
  target: "_blank",
  rel: "noopener",
} as const;
