import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { SpinnerPlayground } from "@/components/spinners/playground";

export const metadata: Metadata = {
  title: "Pixel Glow Spinners",
  description:
    "A gallery of vibrant pixel-grid loading spinners with glow, gradients and shimmer effects.",
};

export default function SpinnersPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />

      <div className="luminous-spinners bg-background">
        <section className="w-full max-w-6xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
          <header className="py-10 lg:py-14 text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">
              Loading Library
            </p>
            <h1 className="animate-title-gradient bg-gradient-to-r from-[oklch(0.55_0.25_260)] via-[oklch(0.55_0.28_320)] to-[oklch(0.62_0.22_40)] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-[oklch(0.78_0.22_260)] dark:via-[oklch(0.72_0.25_320)] dark:to-[oklch(0.82_0.2_45)]">
              Pixel Glow Spinners
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--ls-muted-foreground)] sm:text-base">
              Tune color, size, spacing, and speed. Preview live, then copy the
              snippet.
            </p>
          </header>

          <div className="space-y-4 pb-10">
            <SpinnerPlayground />

            <a
              href="https://buymeacoffee.com/godwindev"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)] px-5 py-4 transition-colors hover:bg-[var(--ls-border)]/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffdd00] text-xl">
                  ☕
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--ls-foreground)]">
                    Enjoying this tool?
                  </p>
                  <p className="text-xs text-[var(--ls-muted-foreground)]">
                    Buy me a coffee — it keeps the builds shipping.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ffdd00] px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-transform group-hover:-translate-y-0.5">
                Buy me a coffee →
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
