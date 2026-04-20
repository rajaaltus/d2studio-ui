#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = path.join(ROOT, "registry.json");
const REGISTRY_DIRS = [
  "registry/default/ui",
  "registry/default/components",
  "registry/default/hooks",
  "registry/default/lib",
];

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const QUIET = args.has("--quiet");

const log = (...m) => {
  if (!QUIET) console.log(...m);
};

const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
const registry = JSON.parse(raw);

const kept = [];
const dropped = [];
const referenced = new Set();

for (const item of registry.items ?? []) {
  const missing = [];
  for (const f of item.files ?? []) {
    const abs = path.join(ROOT, f.path);
    if (fs.existsSync(abs)) {
      referenced.add(path.relative(ROOT, abs));
    } else {
      missing.push(f.path);
    }
  }
  if (missing.length) {
    dropped.push({ name: item.name, missing });
  } else {
    kept.push(item);
  }
}

const orphans = [];
for (const dir of REGISTRY_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const rel = path.join(dir, entry.name);
    if (!referenced.has(rel)) orphans.push(rel);
  }
}

log(`registry items: ${registry.items.length} total`);
log(`  kept:    ${kept.length}`);
log(`  dropped: ${dropped.length}`);
for (const d of dropped) log(`    - ${d.name} (missing: ${d.missing.join(", ")})`);

if (orphans.length) {
  log(`\norphan files (on disk, not in registry.json):`);
  for (const o of orphans) log(`  - ${o}`);
}

if (dropped.length === 0) {
  log("\nregistry.json in sync.");
  process.exit(0);
}

if (DRY_RUN) {
  log("\n--dry-run: no changes written.");
  process.exit(1);
}

const next = { ...registry, items: kept };
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(next, null, 2) + "\n");
log(`\nwrote ${REGISTRY_PATH} (${dropped.length} item(s) removed).`);
