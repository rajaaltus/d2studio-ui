"use client";

import * as React from "react";
import { PixelSpinner } from "@/components/pixel-spinner";
import { PRO_SPINNERS } from "@/lib/pro-spinners";
import { PRO_LINK_PROPS, proShelfHref } from "@/lib/pro";
import { ProCta } from "@/components/blocks/pro-grid";

// A spinner is the one thing in the pro catalogue this site can show for real
// rather than as a screenshot: the patterns are frame tables, and the engine
// that plays them already lives here. So these are the actual spinners, running.
//
// Twelve of eighty-seven, and the cap is the point: every instance is its own
// setInterval re-rendering a grid, which is exactly why pro's own gallery
// compiles its wall to keyframes instead. Twelve is a shelf; the whole library
// is a click away, where it is built to carry that many.
const SHELF_SIZE = 12;

// Spread across the hand-drawn set rather than taking the first twelve, which
// are the twelve that happen to be at the top of the file.
const SHELF = (() => {
  const drawn = PRO_SPINNERS.filter((s) => s.shelf === "pro");
  const step = Math.max(1, Math.floor(drawn.length / SHELF_SIZE));
  return Array.from({ length: SHELF_SIZE }, (_, i) => drawn[i * step]).filter(Boolean);
})();

export function ProSpinnerShelf() {
  const href = proShelfHref("/spinners", "spinners");

  return (
    <section className="w-full max-w-7xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
      <div className="flex flex-col gap-8 border-t border-[var(--ls-border)] py-12 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">
              D2 Pro
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {PRO_SPINNERS.length} more spinners
            </h2>
            <p className="max-w-xl text-sm text-[var(--ls-muted-foreground)]">
              Hand-drawn frame tables rather than generated ones — the set the
              playground above cannot reach. Twelve of them are running here.
            </p>
          </div>
          <ProCta href={href}>See the whole shelf</ProCta>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SHELF.map((spinner) => (
            <li key={spinner.name}>
              <a
                href={href}
                {...PRO_LINK_PROPS}
                aria-label={`${spinner.name} on D2 Pro`}
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-card,transparent)] transition-[border-color,transform] duration-200 ease-out hover:border-foreground/25 active:scale-[0.98]"
              >
                <PixelSpinner
                  pattern={{
                    size: spinner.pattern.size ?? undefined,
                    rows: spinner.pattern.rows ?? undefined,
                    cols: spinner.pattern.cols ?? undefined,
                    interval: spinner.pattern.interval ?? undefined,
                    frames: spinner.pattern.frames,
                  }}
                  color={spinner.color}
                  animation={spinner.animation ?? undefined}
                  cellSize={10}
                  gap={2}
                />
                <span className="text-[11px] tabular-nums text-[var(--ls-muted-foreground)] transition-colors duration-150 group-hover:text-foreground">
                  {spinner.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
