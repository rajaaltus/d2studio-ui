import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { CosmaPlayground } from "@/components/cosma/playground";
import { SiteFooter } from "@/components/site-footer";
import { GithubTvButton } from "@/components/icons/github-tv-button";
import { BmcTvButton } from "@/components/icons/bmc-tv-button";

export const metadata: Metadata = {
  title: "Cosmo Playground — Interactive particle motion playground",
  description:
    "Particle-based shape playground. Pick a source, tune count, size, and speed, and watch the live cosmos form on the canvas.",
};

export default function CosmaPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <div className="luminous-spinners bg-background">
        <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-8">
          <header className="py-10 lg:py-14 text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Motion Library
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Cosmo Playground
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Tune count, size, and speed. Live preview on the canvas.
            </p>
          </header>

          <div className="pb-10">
            <CosmaPlayground />
          </div>
        </section>

        <section className="w-full max-w-6xl border-x border-t mx-auto">
          <div className="grid grid-cols-1 divide-y sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-center px-4 py-10 sm:col-span-3 lg:px-8">
              <div className="max-w-md text-center">
                <p className="text-sm text-muted-foreground">
                  Enjoying the Cosmo Playground? Encourage us with a coffee — your
                  support helps us build more experiments like this.
                  <span className="block mt-1 text-foreground/80">
                    Your support truly makes a difference.
                  </span>
                </p>
                <blockquote className="mt-5 border-t border-border/40 pt-4 text-xs italic text-muted-foreground/80">
                  &ldquo;Wherever there is a human being, there is an opportunity
                  for kindness.&rdquo;
                  <footer className="mt-2 not-italic text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                    — Seneca
                  </footer>
                </blockquote>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-10">
              <GithubTvButton href="https://github.com/godwin159" />
              <span className="text-xs text-muted-foreground">Github</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-10">
              <BmcTvButton href="https://buymeacoffee.com/godwindev" />
              <span className="text-xs text-muted-foreground">
                buy me a coffee
              </span>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
