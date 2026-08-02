import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { SpinnerPlayground } from "@/components/spinners/playground";
import { SiteFooter } from "@/components/site-footer";
import { CoffeeSupportCard } from "@/components/coffee-support-card";

export const metadata: Metadata = {
  title: "Pixel Glow Spinners",
  description:
    "A gallery of vibrant pixel-grid loading spinners with glow, gradients and shimmer effects.",
};

export default function SpinnersPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <div className="luminous-spinners bg-background">
        <section className="w-full max-w-7xl border-x border-[var(--ls-border)] mx-auto px-4 lg:px-8">
          <header className="py-10 lg:py-14 text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--ls-muted-foreground)]">
              Loading Library
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Pixel Glow Spinners
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--ls-muted-foreground)] sm:text-base">
              Tune color, size, spacing, and speed. Preview live, then copy the
              snippet.
            </p>
          </header>

          <div className="pb-10">
            <SpinnerPlayground />
          </div>
        </section>

        <CoffeeSupportCard
          pitch="Enjoying the Pixel Glow Spinners? Encourage us with a coffee — your support helps us build more experiments like this."
          quote="No one has ever become poor by giving."
          author="Anne Frank"
        />
      </div>

      <SiteFooter />
    </div>
  );
}
