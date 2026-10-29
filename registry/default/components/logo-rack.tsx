import { cn } from "@/lib/utils";

import { BrandIcons } from "./brand-showcase/brand-icons";

// The rack out of hero-04, standing on its own: a label over marks sitting
// still in ruled cells. A copy rather than an import, for the same reason
// logo-dock is one — a section that had to pull in a whole hero to draw eight
// logos would install the plane, the nav and the copy with it.
//
// The point of a rack over a rail is that nothing moves: the cells are the
// same shape a rack of machines comes in, and a row that travels says "there
// are many of us" where a row that sits says "these are the ones we run".
//
// Every rule is the gap showing through rather than a border on a cell: one
// `gap-px` over a filled parent, so a cell that wraps to a new line cannot
// double a rule up with its neighbour's, and the hairline stays exactly one
// pixel at any column count.
const LOGOS = [
  BrandIcons.vercel,
  BrandIcons.nextjs,
  BrandIcons.react,
  BrandIcons.supabase,
  BrandIcons.convex,
  BrandIcons.tailwind,
  BrandIcons.shadcn,
  BrandIcons.threejs,
];

export default function LogoRack({
  label = "Deploys straight from the stack you already run",
  className = "",
}: {
  /** The line over the rack. Omitted draws none. */
  label?: string;
  className?: string;
}) {
  return (
    <section className={cn("bg-background w-full px-6 py-16", className)}>
      <div className="mx-auto w-full max-w-6xl">
        {label ? (
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
            {label}
          </p>
        ) : null}

        <div className="bg-border/60 border-border/60 mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4 lg:grid-cols-8">
          {LOGOS.map((Logo, i) => (
            <div
              key={i}
              className="bg-background text-muted-foreground flex h-16 items-center justify-center transition-[color,background-color] duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:hover:bg-muted/40 [@media(hover:hover)]:hover:text-foreground [&_svg]:max-h-6 [&_svg]:w-auto"
            >
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
