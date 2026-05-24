import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { CosmoPlayground } from "@/components/cosmo/playground";
import { SiteFooter } from "@/components/site-footer";
import { CoffeeSupportCard } from "@/components/coffee-support-card";

export const metadata: Metadata = {
  title: "Cosmo Playground — Interactive particle motion playground",
  description:
    "Particle-based shape playground. Pick a source, tune count, size, and speed, and watch the live cosmos form on the canvas.",
};

export default function CosmoPage() {
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
            <CosmoPlayground />
          </div>
        </section>

        <CoffeeSupportCard
          pitch="Enjoying the Cosmo Playground? Encourage us with a coffee, your support helps us build more experiments like this."
          quote="Wherever there is a human being, there is an opportunity for kindness."
          author="Seneca"
          githubHref="https://github.com/godwin159"
        />
      </div>

      <SiteFooter />
    </div>
  );
}
