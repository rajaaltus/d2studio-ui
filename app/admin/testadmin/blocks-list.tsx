"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function BlocksList({
  blocksData,
}: {
  blocksData: Preloaded<typeof api.blocks.listBlocks>;
}) {
  const blocks = usePreloadedQuery(blocksData);

  if (!blocks || blocks.length === 0) {
    return <div>No Blocks yet...</div>;
  }

  return (
    <>
      <p>Found {blocks.length} blocks (reactive Server data)</p>
      <ul>
        {blocks.map((block) => (
          <li key={block._id}>
            {block.name} - {block.title}
          </li>
        ))}
      </ul>
    </>
  );
}
