#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const blocks = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/blocks.json"), "utf8"),
);
const categories = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/categories.json"), "utf8"),
);

const prod = process.argv.includes("--prod");
const argsJson = JSON.stringify({ blocks, categories });

console.log(`seeding ${prod ? "prod" : "dev"} deployment`);
console.log(`  blocks:     ${blocks.length}`);
console.log(`  categories: ${categories.length}`);

const runArgs = ["convex", "run", "seed:seedContent", argsJson];
if (prod) runArgs.push("--prod");

const result = spawnSync("npx", runArgs, { stdio: "inherit", cwd: ROOT });
process.exit(result.status ?? 1);
