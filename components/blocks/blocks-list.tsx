"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlockCard } from "./block-card";

interface BlocksListProps {
  blockType?: string;
}

export function BlocksList({ blockType }: BlocksListProps) {
  const blocks = useQuery(
    api.blocks.listBlocks,
    blockType && blockType !== "all"
      ? { blockType, limit: 100 }
      : { limit: 100 },
  );

  if (blocks === undefined) {
    return (
      <div className="grid gap-6 px-4 md:grid-cols-2 md:px-6 lg:px-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-lg border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-muted/50 p-12 text-center">
        <p className="mb-2 text-lg font-semibold">No blocks found</p>
        <p className="text-sm text-muted-foreground">
          {blockType && blockType !== "all"
            ? `No blocks found in the "${blockType}" category.`
            : "No blocks available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 px-4 md:grid-cols-2 md:px-6 lg:px-8">
      {blocks.map((block) => (
        <BlockCard key={block._id} block={block} />
      ))}
    </div>
  );
}

