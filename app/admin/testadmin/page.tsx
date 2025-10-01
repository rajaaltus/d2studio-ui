import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import BlocksList from "./blocks-list";

export default async function TestPageAdmin() {
  const blocksData = await preloadQuery(api.blocks.listBlocks, { limit: 10 });

  return (
    <div>
      <BlocksList blocksData={blocksData} />
    </div>
  );
}
