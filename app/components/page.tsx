import type { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { BlocksBrowser } from "@/components/blocks/blocks-browser";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Components — D2 Studio",
  description:
    "Buttons, sliders, toggles, colour pickers and progress bars for React, TypeScript and Tailwind CSS. Install from the shadcn registry.",
};

// The standalone-control half of the catalogue, on its own route rather than as
// a filter on /blocks: a button and a pricing section are browsed with different
// questions in mind, and "buttons" deserves an address of its own.
export default function ComponentsPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <Suspense
        fallback={
          <div className="flex min-h-[400px] flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <BlocksBrowser scope="components" />
      </Suspense>

      <SiteFooter />
    </div>
  );
}
