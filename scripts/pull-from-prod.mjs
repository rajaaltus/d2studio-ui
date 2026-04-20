#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PROD_URL =
  process.env.CONVEX_PROD_URL || "https://perceptive-starling-525.convex.cloud";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const SKIP_SEED = args.has("--no-seed");

const stripBlock = (b) => ({
  name: b.name,
  type: b.type,
  title: b.title,
  description: b.description,
  author: b.author,
  version: b.version,
  categories: b.categories,
  ...(b.registryDependencies
    ? { registryDependencies: b.registryDependencies }
    : {}),
  ...(b.tags ? { tags: b.tags } : {}),
  ...(b.blockType !== undefined ? { blockType: b.blockType } : {}),
  ...(b.previewImage ? { previewImage: b.previewImage } : {}),
  ...(b.figmaUrl ? { figmaUrl: b.figmaUrl } : {}),
  ...(b.codeStatus ? { codeStatus: b.codeStatus } : {}),
  ...(b.codeUrl ? { codeUrl: b.codeUrl } : {}),
  isActive: b.isActive,
});

const stripCategory = (c) => ({
  name: c.name,
  slug: c.slug,
  sortOrder: c.sortOrder,
});

const client = new ConvexHttpClient(PROD_URL);

console.log(`pulling from ${PROD_URL}`);

const [blocksRaw, categoriesRaw] = await Promise.all([
  client.query(api.blocks.listBlocks, { limit: 1000 }),
  client.query(api.categories.get, {}),
]);

const blocks = blocksRaw.map(stripBlock);
const categories = categoriesRaw
  .map(stripCategory)
  .sort((a, b) => a.sortOrder - b.sortOrder);

console.log(`  blocks:     ${blocks.length}`);
console.log(`  categories: ${categories.length}`);

if (DRY_RUN) {
  console.log("--dry-run: not writing files or seeding.");
  console.log(JSON.stringify({ blocks, categories }, null, 2));
  process.exit(0);
}

fs.writeFileSync(
  path.join(ROOT, "content/blocks.json"),
  JSON.stringify(blocks, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(ROOT, "content/categories.json"),
  JSON.stringify(categories, null, 2) + "\n",
);
console.log("wrote content/blocks.json and content/categories.json");

if (SKIP_SEED) {
  console.log("--no-seed: skipping local seed. Run `pnpm seed` manually.");
  process.exit(0);
}

console.log("\nseeding local dev...");
const result = spawnSync("pnpm", ["seed"], { stdio: "inherit", cwd: ROOT });
process.exit(result.status ?? 1);
