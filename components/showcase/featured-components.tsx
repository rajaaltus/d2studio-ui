"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ComponentWithCode } from "@/components/showcase/component-with-code";
import type { Doc } from "@/convex/_generated/dataModel";

type FeaturedBlock = Doc<"blocks">;

type LoadState =
  | { status: "loading" }
  | { status: "ready"; Component: React.ComponentType }
  | { status: "missing" };

const componentCache = new Map<string, LoadState>();

function FeaturedBlockItem({ block }: { block: FeaturedBlock }) {
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
      <div className="w-full">
        <ComponentWithCode
          componentName={block.name}
          component={state.Component}
        />
      </div>
    </div>
  );
}

export function FeaturedComponents() {
  const blocks = useQuery(api.blocks.listFeaturedBlocks, {});

  if (blocks === undefined || blocks.length === 0) return null;

  return (
    <section className="w-full">
      <div className="border-x mx-auto">
        <div className="space-y-16 mx-auto">
          {blocks.map((block) => (
            <FeaturedBlockItem key={block._id} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
