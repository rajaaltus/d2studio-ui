import type { CSSProperties } from "react";
import { BmcTvButton } from "@/components/icons/bmc-tv-button";
import { GithubTvButton } from "@/components/icons/github-tv-button";

type CoffeeSupportCardProps = {
  pitch: string;
  emphasis?: string;
  quote: string;
  author: string;
  bmcHref?: string;
  githubHref?: string;
};

export function CoffeeSupportCard({
  pitch,
  emphasis = "Your support truly makes a difference.",
  quote,
  author,
  bmcHref = "https://buymeacoffee.com/godwindev",
  githubHref,
}: CoffeeSupportCardProps) {
  const gridCols = githubHref
    ? "sm:grid-cols-[3fr_1fr_1fr]"
    : "sm:grid-cols-[3fr_2fr]";

  const patternStyle: CSSProperties = {
    backgroundImage:
      "radial-gradient(ellipse farthest-corner at 7px 7px, var(--pattern-fg), var(--pattern-fg) 50%, transparent 50%)",
    backgroundSize: "7px 7px",
    backgroundRepeat: "repeat",
    backgroundAttachment: "fixed",
  };

  const chipShellClass =
    "relative rounded-xl p-2 ring-1 ring-inset ring-black/[0.06] dark:ring-white/5 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-800/90 dark:via-neutral-900 dark:to-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.06),0_8px_22px_-10px_rgba(15,23,42,0.22)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.6),0_6px_18px_-8px_rgba(0,0,0,0.6)]";

  const chipPin = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1 size-1 rounded-full bg-black/15 dark:bg-white/15"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1 size-1 rounded-full bg-black/15 dark:bg-white/15"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 bottom-1 size-1 rounded-full bg-black/15 dark:bg-white/15"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 bottom-1 size-1 rounded-full bg-black/15 dark:bg-white/15"
      />
    </>
  );

  const chipLabelClass =
    "relative rounded-md px-5 py-1.5 text-xs font-medium tracking-wide ring-1 ring-inset bg-gradient-to-b from-white to-neutral-50 text-neutral-700 ring-black/[0.06] dark:from-neutral-800/90 dark:to-neutral-950 dark:text-muted-foreground dark:font-normal dark:tracking-normal dark:ring-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_-2px_rgba(15,23,42,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_-2px_rgba(0,0,0,0.5)]";

  const labelBolts = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-black/20 shadow-[inset_0_-0.5px_0_rgba(255,255,255,0.7),0_0.5px_0_rgba(0,0,0,0.15)] dark:bg-white/20 dark:shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.4),0_0.5px_0_rgba(255,255,255,0.06)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-black/20 shadow-[inset_0_-0.5px_0_rgba(255,255,255,0.7),0_0.5px_0_rgba(0,0,0,0.15)] dark:bg-white/20 dark:shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.4),0_0.5px_0_rgba(255,255,255,0.06)]"
      />
    </>
  );

  return (
    <section className="w-full max-w-6xl border-x border-t mx-auto [--pattern-fg:var(--color-black)]/10 dark:[--pattern-fg:var(--color-white)]/10">
      <div
        className={`grid grid-cols-1 divide-y ${gridCols} sm:divide-x sm:divide-y-0`}
      >
        <div className="flex items-center justify-center px-4 py-10 lg:px-8">
          <div className="max-w-md text-center">
            <p className="text-sm text-muted-foreground">
              {pitch}
              {emphasis && (
                <span className="block mt-1 text-foreground/80">
                  {emphasis}
                </span>
              )}
            </p>
            <blockquote
              className="mt-5 pt-4 text-xs italic text-muted-foreground/80"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 3px, transparent 3px)",
                backgroundSize: "7px 1px",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "top",
              }}
            >
              &ldquo;{quote}&rdquo;
              <footer className="mt-2 not-italic text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                — {author}
              </footer>
            </blockquote>
          </div>
        </div>
        {githubHref && (
          <div
            className="flex flex-col items-center justify-center gap-3 px-8 py-10"
            style={patternStyle}
          >
            <div className={chipShellClass}>
              {chipPin}
              <GithubTvButton href={githubHref} />
            </div>
            <span className={chipLabelClass}>
              {labelBolts}
              Github
            </span>
          </div>
        )}
        <div
          className="flex flex-col items-center justify-center gap-3 px-8 py-10"
          style={patternStyle}
        >
          <div className={chipShellClass}>
            {chipPin}
            <BmcTvButton href={bmcHref} />
          </div>
          <span className={chipLabelClass}>
            {labelBolts}
            buy me a coffee
          </span>
        </div>
      </div>
    </section>
  );
}
