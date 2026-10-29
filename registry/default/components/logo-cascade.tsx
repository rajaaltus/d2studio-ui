"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { BrandIcons } from "./brand-showcase/brand-icons";

// brand-showcase's rolling wall with the blur put back.
//
// The frame never moves and only the marks do: each cell is a window over a
// column holding every mark that cell will ever show, and a page change
// translates the column by exactly one cell height. That is transitions.dev's
// text-states-swap geometry, old mark leaving upward and new mark arriving from
// below, written as one transform on one element, so it needs no reflow and no
// timer per cell and it retargets mid-flight if the interval fires again before
// a roll has settled.
//
// The blur is per mark rather than per page, which is the whole difference from
// the sharp version. A mark that is not the active one is soft and clear; the
// arriving one sharpens as it lands and the leaving one dissolves as it goes.
// Two crisp wordmarks passing through one window read as two objects; blurred,
// they read as one thing changing. That is worth having even though the marks
// are physically travelling and do not strictly need bridging.
//
// It costs no state and no keyframe. Every mark already knows whether it is the
// active one, so the blur is a plain A-to-B transition on the same curve and
// the same per-cell delay as the roll — interruptible, and nothing to keep in
// sync with the transform.
//
// The stagger is what makes it read as a wall repainting rather than a slide
// changing: 45ms per cell, so the change crosses the row as a wave. Six cells
// turning at once is a cut.
//
// The cells are drawn by the gap: one `bg-border` grid with a 1px gutter and a
// filled cell in every slot, so the rules between logos are the background
// showing through rather than twelve borders that would double up where they
// meet.

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

/* ms between neighbouring cells. Short enough that the last cell lands well
   inside the hold, long enough to read as a wave rather than a cut. */
const STAGGER = 45;

/* One cell height, so the row is a fixed frame the columns travel through. */
const CELL = "7.5rem";

/* The roll and the blur share this, so a mark cannot land before it is sharp.
   ease-in-out rather than ease-out: the marks move across their window rather
   than enter or leave the screen. */
const TRAVEL = "duration-[420ms] ease-[cubic-bezier(0.77,0,0.175,1)]";

export default function LogoCascade({
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
  // Sliced by cell rather than by page: a cell owns the marks it will show over
  // time, which is what lets each one be its own window. Every page is still
  // full, wrapping back to the start rather than leaving a short last row —
  // the grid has six columns whatever it is given, and a set of two would draw
  // four empty cells of border.
  const columns = React.useMemo(() => {
    if (!brands.length) return [];
    const pages = Math.ceil(brands.length / SET_SIZE);
    return Array.from({ length: SET_SIZE }, (_, cell) =>
      Array.from(
        { length: pages },
        (_, page) => brands[(page * SET_SIZE + cell) % brands.length],
      ),
    );
  }, [brands]);

  const pages = columns[0]?.length ?? 0;
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (pages <= 1) return;
    // Read once here rather than guarded in CSS: the roll is a timer as much as
    // a transition, and a stopped transition on a running timer would still
    // change the logo, just as a hard cut.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((s) => (s + 1) % pages), interval);
    return () => clearInterval(id);
  }, [pages, interval]);

  return (
    <section className={cn("w-full", className)}>
      {eyebrow && (
        <div className="bg-background flex h-10 items-center justify-center border-x border-t">
          <h2 className="text-muted-foreground text-sm">{eyebrow}</h2>
        </div>
      )}

      {/* One grid, drawn once. The rules are the frame the marks roll through,
          so nothing about the wall's geometry is animated. */}
      <div className="bg-border grid w-full grid-cols-3 gap-px border md:grid-cols-6">
        {columns.map((column, cell) => {
          const delay = `${cell * STAGGER}ms`;
          return (
            <div
              key={cell}
              style={{ height: CELL }}
              className="group bg-background relative overflow-hidden transition-[background-color] duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:hover:bg-accent"
            >
              {/* auto-rows-[100%] makes every mark exactly one cell tall, so a
                  page is one whole-cell translate rather than a measured pixel
                  offset that would have to be recomputed on resize. */}
              <div
                style={{
                  transform: `translateY(-${active * 100}%)`,
                  transitionDelay: delay,
                }}
                className={cn(
                  "grid h-full auto-rows-[100%] transition-transform will-change-transform motion-reduce:transition-none",
                  TRAVEL,
                )}
              >
                {column.map((brand, page) => {
                  const isActive = page === active;
                  return (
                    <div
                      key={`${brand.name}-${page}`}
                      aria-hidden={!isActive}
                      style={{ transitionDelay: delay }}
                      className={cn(
                        "flex items-center justify-center transition-[opacity,filter] motion-reduce:transition-none",
                        TRAVEL,
                        isActive
                          ? "opacity-100 blur-0"
                          : "opacity-0 blur-[2px]",
                      )}
                    >
                      <brand.icon
                        aria-label={brand.name}
                        className={cn(
                          // brightness-200 rather than invert: these are
                          // currentColor wordmarks whose few coloured marks
                          // would come back wrong from a channel flip.
                          "mx-auto h-5 w-auto max-w-[7rem] transition-[scale] duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:group-hover:scale-95 motion-reduce:group-hover:scale-100 dark:brightness-200",
                          brand.className,
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
