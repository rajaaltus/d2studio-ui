import type { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { BlocksBrowser } from "@/components/blocks/blocks-browser";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Blocks — D2 Studio",
  description:
    "Page sections for React, TypeScript and Tailwind CSS — bentos, heroes, CTAs, pricing and testimonials. Free and Pro, installable from the shadcn registry.",
};

export default function BlocksPage() {
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
        <BlocksBrowser scope="blocks" />
      </Suspense>

      <SiteFooter />
    </div>
  );
}
