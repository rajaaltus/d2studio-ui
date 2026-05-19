import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { CosmaPlayground } from "@/components/cosma/playground";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Cosma Playground",
  description:
    "Particle-based shape playground. Pick a source, tune count, size, and speed, and watch the live cosmos form on the canvas.",
};

export default function CosmaPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <div className="bg-background">
        <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-8">
          <header className="py-10 lg:py-14 text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Particle Studio
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                Cosma Playground
              </h1>
              <span className="relative inline-flex h-[22px] items-center overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="relative z-10">New</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shimmer_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </span>
            </div>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Tune count, size, and speed. Live preview on the canvas.
            </p>
          </header>

          <div className="pb-10">
            <CosmaPlayground />
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
