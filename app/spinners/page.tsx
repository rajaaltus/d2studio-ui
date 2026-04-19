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
            <h1 className="bg-gradient-to-r from-[oklch(0.55_0.22_220)] via-[oklch(0.55_0.22_65)] to-[oklch(0.55_0.24_5)] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-[oklch(0.85_0.16_220)] dark:via-[oklch(0.78_0.18_65)] dark:to-[oklch(0.72_0.24_5)]">
              Pixel Glow Spinners
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--ls-muted-foreground)] sm:text-base">
              Tune color, size, spacing, and speed. Preview live, then copy the
              snippet.
            </p>
          </header>

          <div className="pb-16">
            <SpinnerPlayground />
          </div>
        </section>
      </div>
    </div>
  );
}
