import { Component } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { ShelfTypes } from "@/components/blocks/shelf-types";
import { ComponentsNav } from "@/components/docs/components-nav";
import { ComponentsMobileNav } from "@/components/docs/components-mobile-nav";
import { COMPONENT_GROUPS, COMPONENT_ORDER } from "@/lib/components-docs";
import { proItemsFor } from "@/lib/catalog";

// /components reads as documentation, not a gallery: a rail of every primitive
// and a page per component. The frame is the /blocks browser's — same
// max-w-7xl bordered column, same 256px rail pinned under the header, same
// Types block at its top — so moving between the two shelves only changes what
// is inside the frame.
export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const pro = proItemsFor("components", "components-docs", COMPONENT_ORDER.map((c) => c.name)).map(
    (p) => ({ name: p.name, title: p.title, href: p.href }),
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col border-x border-b">
        <ComponentsMobileNav groups={COMPONENT_GROUPS} pro={pro} />
        <div className="flex w-full flex-1">
          <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
            <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto overscroll-contain">
              <div className="flex items-center justify-between border-b px-4 py-3.5">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Component className="size-4" />
                  Components
                </span>
                <span className="inline-flex h-7 items-center font-mono text-xs tabular-nums text-muted-foreground">
                  {COMPONENT_ORDER.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-5 p-4">
                <ShelfTypes active="components" />
                <div className="border-t border-dashed border-border" aria-hidden />
                <ComponentsNav groups={COMPONENT_GROUPS} pro={pro} autoFocusSearch />
              </div>
            </div>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
