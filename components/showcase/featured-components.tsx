"use client";

import * as React from "react";
import { ComponentWithCode } from "@/components/showcase/component-with-code";
import { BLOCK_LIBRARY, type BlockDef } from "@/lib/blocks";

// Ordered by the `featured` rank in lib/blocks.ts. Nothing carries one today,
// so the section draws nothing until an entry claims a slot.
const FEATURED: BlockDef[] = BLOCK_LIBRARY.filter((b) => b.featured != null).sort(
  (a, b) => (a.featured ?? 0) - (b.featured ?? 0),
);

type LoadState =
  | { status: "loading" }
  | { status: "ready"; Component: React.ComponentType }
  | { status: "missing" };

const componentCache = new Map<string, LoadState>();

function FeaturedBlockItem({ block }: { block: BlockDef }) {
  const cached = componentCache.get(block.name);
  const [state, setState] = React.useState<LoadState>(
    cached ?? { status: "loading" },
  );

  React.useEffect(() => {
    if (cached && cached.status !== "loading") return;

    let cancelled = false;
    import(`@/registry/default/components/${block.name}`)
      .then((mod) => {
        const Component = mod?.default as React.ComponentType | undefined;
        const next: LoadState = Component
          ? { status: "ready", Component }
          : { status: "missing" };
        componentCache.set(block.name, next);
        if (!cancelled) setState(next);
      })
      .catch(() => {
        const next: LoadState = { status: "missing" };
        componentCache.set(block.name, next);
        if (!cancelled) setState(next);
      });

    return () => {
      cancelled = true;
    };
  }, [block.name, cached]);

  if (state.status === "missing") return null;

  if (state.status === "loading") {
    return (
      <div className="screen-line-after flex min-h-[500px] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 screen-line-after">
      <div className="w-full rounded-xl border m-0 bg-background overflow-hidden">
        <ComponentWithCode
          componentName={block.name}
          component={state.Component}
        />
      </div>
    </div>
  );
}

export function FeaturedComponents() {
  if (FEATURED.length === 0) return null;

  return (
    <section className="w-full">
      <div className="border-x mx-auto">
        <div className="space-y-16 mx-auto">
          {FEATURED.map((block) => (
            <FeaturedBlockItem key={block.name} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
