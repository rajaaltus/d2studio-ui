#!/usr/bin/env node
// Pulls shadcn/ui's new-york-v4 primitives into registry/default, so @d2 ships
// a full set of base components that D2's designed use cases are built on.
//
//   pnpm shadcn:sync                 # write only the items not on disk yet
//   pnpm shadcn:sync button card     # write just these, overwriting
//   pnpm shadcn:sync --all --force   # overwrite everything (loses D2 edits)
//
// A source on disk is D2's to change, so nothing is overwritten unless it is
// named or --force is passed. The catalogue entry in lib/blocks.ts is not
// written: new items are printed as entries to paste, because the description
// and categories are editorial, not something upstream supplies.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ui.shadcn.com/r/styles/new-york-v4";
const D2 = "https://ui.d2studio.dev/r";

/**
 * Items D2 keeps on an older upstream on purpose. resizable: shadcn moved to
 * react-resizable-panels v4, whose API the site's own preview frame does not
 * use yet, and the registry source typechecks against the installed package.
 */
const HELD = new Map([["resizable", "held on react-resizable-panels v3"]]);

const args = process.argv.slice(2);
const force = args.includes("--force");
const named = args.filter((a) => !a.startsWith("--"));

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
};

/**
 * Upstream imports `cn` from the `cn` package and its siblings from
 * `@/registry/new-york-v4/...`. D2 keeps `@/lib/utils`, which every shadcn
 * project already has, and points siblings at its own tree: the CLI rewrites
 * any `@/registry/<style>/ui` import to the consumer's ui alias on install.
 */
const localise = (src) =>
  src
    .replace(/from "cn"/g, 'from "@/lib/utils"')
    .replace(/@\/registry\/new-york-v4\//g, "@/registry/default/");

const index = await get(`${BASE}/registry.json`);
const upstream = index.items
  .filter((i) => i.type === "registry:ui" || i.type === "registry:hook")
  .map((i) => i.name);

const unknown = named.filter((n) => !upstream.includes(n));
if (unknown.length) throw new Error(`not in shadcn new-york-v4: ${unknown.join(", ")}`);

const targets = named.length ? named : upstream;
const blocks = fs.readFileSync(path.join(ROOT, "lib/blocks.ts"), "utf8");
const written = [];
const skipped = [];
const uncatalogued = [];

for (const name of targets) {
  if (HELD.has(name) && !named.includes(name)) {
    skipped.push(`${name} (${HELD.get(name)})`);
    continue;
  }
  const item = await get(`${BASE}/${name}.json`);
  for (const file of item.files) {
    const rel = file.path.replace(/^registry\/new-york-v4\//, "registry/default/");
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs) && !force && !named.includes(name)) {
      skipped.push(name);
      continue;
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, localise(file.content));
    written.push(rel);
  }
  if (!blocks.includes(`name: "${name}",`)) uncatalogued.push(item);
}

console.log(`written: ${written.length}`);
for (const w of written) console.log(`  + ${w}`);
if (skipped.length) console.log(`\nkept (already on disk; name it or pass --force): ${skipped.join(", ")}`);

if (uncatalogued.length) {
  console.log(`\nnot in lib/blocks.ts yet — add an entry for each:\n`);
  for (const item of uncatalogued) {
    const deps = (item.dependencies ?? []).filter((d) => d !== "cn");
    const reg = (item.registryDependencies ?? []).map((d) => `${D2}/${d}.json`);
    console.log(`  {
    name: "${item.name}",
    title: "${item.name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ")}",
    description: "TODO",
    categories: ["ui"],${deps.length ? `\n    dependencies: ${JSON.stringify(deps)},` : ""}${reg.length ? `\n    registryDependencies: ${JSON.stringify(reg)},` : ""}
  },`);
  }
}
