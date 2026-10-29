"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { BrandIcons } from "./brand-showcase/brand-icons";

// A logo wall that rotates rather than scrolls. A marquee asks the eye to track
// a moving target; this holds one page of six still long enough to read, then
// crossfades the next in — so every logo gets the same three seconds instead of
// the same two inches of travel.
//
// No rules between the cells: the marks sit on the page's own ground, so the
// only thing bounding a logo is the space around it.

export type Brand = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /* Wordmarks are drawn to different heights at the same optical weight, so the
     size is per logo rather than one class on the grid. */
  className?: string;
};

const DEFAULT_BRANDS: Brand[] = [
  { name: "TailwindCSS", icon: BrandIcons.tailwind },
  { name: "Shadcn/UI", icon: BrandIcons.shadcn },
  { name: "Uiverse", icon: BrandIcons.uiverse },
  { name: "Framer Motion", icon: BrandIcons.framerMotion },
  { name: "Magic UI", icon: BrandIcons.magic },
  { name: "React", icon: BrandIcons.react },
  { name: "Next.js", icon: BrandIcons.nextjs, className: "h-6" },
  { name: "Vercel", icon: BrandIcons.vercel, className: "h-3.5" },
  { name: "Supabase", icon: BrandIcons.supabase },
  { name: "Origin UI", icon: BrandIcons.origin },
  { name: "Three.js", icon: BrandIcons.threejs },
  { name: "Convex", icon: BrandIcons.convex },
];

const SET_SIZE = 6;

export default function BrandShowcase({
  brands = DEFAULT_BRANDS,
  eyebrow = "Greatly inspired from",
  /* ms a page is held. Under prefers-reduced-motion the rotation stops
     entirely — a wall that repaints itself is the whole animation. */
  interval = 3200,
  className = "",
}: {
  brands?: Brand[];
  eyebrow?: string;
  interval?: number;
  className?: string;
}) {
  // Every page is full, wrapping back to the start rather than leaving a short
  // last row: the grid has six columns whatever it is given, and a set of two
  // would leave four empty cells.
  const sets = React.useMemo(() => {
    if (!brands.length) return [];
    const pages = Math.ceil(brands.length / SET_SIZE);
    return Array.from({ length: pages }, (_, page) =>
      Array.from(
        { length: SET_SIZE },
        (_, i) => brands[(page * SET_SIZE + i) % brands.length],
      ),
    );
  }, [brands]);

  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (sets.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setActive((s) => (s + 1) % sets.length),
      interval,
    );
    return () => clearInterval(id);
  }, [sets.length, interval]);

  return (
    <section className={cn("bg-background w-full", className)}>
      {eyebrow && (
        <div className="bg-muted flex h-10 items-center justify-center">
          <h2 className="text-muted-foreground text-sm">{eyebrow}</h2>
        </div>
      )}

      {/* All pages stay mounted and stacked: the incoming one has to be laid
          out to fade in, and the section's height is whichever page is tallest
          rather than a number written here. */}
      <div className="relative min-h-[12rem] w-full lg:min-h-[7.5rem]">
        {sets.map((set, page) => {
          const isActive = page === active;
          return (
            <div
              key={page}
              aria-hidden={!isActive}
              className={cn(
                // One flex row from `lg`, a grid below it.
                //
                // The desktop row is flex with justify-between rather than six
                // equal columns: equal cells space the gaps between mark
                // centres, which is only even spacing if every wordmark is the
                // same width, and they are not, so the wall read as drifting
                // once the rules stopped covering for it. A gap spaces the
                // marks themselves, and justify-between fills the measure
                // rather than clustering them in the middle of a full-bleed
                // section.
                //
                // `lg` rather than `md`, because the single line only fits from
                // there. Six wordmarks at their own widths plus five gaps come
                // to about 900px, and the items are `shrink-0`, so on a tablet
                // the row ran past both edges and `overflow-hidden` cropped the
                // first and last marks in half.
                //
                // Below that it is a grid, not a wrapped flex row. Wrapping
                // centres each line on its own, so a line of two 112px marks
                // and a line of one 60px mark share no edge and the block reads
                // ragged; the grid gives every mark the same cell and the
                // columns line up down the rows. `place-content-center` keeps
                // the rows a gap apart: the reserved height is 12rem and both
                // flex and grid otherwise stretch their lines across all of it.
                // The measure is held narrow so the six break 3 and 3 rather
                // than 5 and a stranded 1.
                "absolute inset-0 mx-auto grid max-w-xl grid-cols-2 place-content-center place-items-center gap-x-12 gap-y-8 overflow-hidden px-6 transition-[opacity,scale,filter] ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-3 lg:flex lg:max-w-5xl lg:flex-nowrap lg:justify-between",
                // Asymmetric, and the whole reason the swap reads as one
                // wall changing rather than two walls stacked: at a shared
                // 1000ms both sets sat half-lit over each other for half a
                // second, which is the double exposure a crossfade is supposed
                // to hide. The outgoing set leaves in 300ms and the incoming
                // one arrives over 500 behind a 200ms delay, so the ghost is
                // gone before the new marks are legible. The blur is what
                // covers the handover itself.
                isActive
                  ? "scale-100 opacity-100 blur-0 delay-200 duration-500"
                  : "pointer-events-none scale-[0.985] opacity-0 blur-[2px] duration-300",
                "motion-reduce:transition-none",
              )}
            >
              {set.map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  // No plate fill on hover any more: with no rules to bound it,
                  // an accent rectangle behind one mark draws the cell the
                  // section just stopped drawing. The mark itself answers.
                  className="group relative flex shrink-0 items-center justify-center"
                >
                  <brand.icon
                    aria-label={brand.name}
                    className={cn(
                      // brightness-200 rather than invert: these are
                      // currentColor wordmarks whose few coloured marks would
                      // come back wrong from a channel flip.
                      // `duration-200` on its own did nothing: with no
                      // transition property named, the hover scale snapped.
                      // Named rather than bare `transition`, and `scale`
                      // rather than `transform`, which is the property
                      // Tailwind actually writes. Gated behind a real hover
                      // pointer so a tap on a phone cannot leave one mark
                      // shrunk with no leave event to put it back.
                      "mx-auto h-5 w-auto max-w-[7rem] transition-[scale] duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:group-hover:scale-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:brightness-200",
                      brand.className,
                    )}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
