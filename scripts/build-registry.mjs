#!/usr/bin/env node
// Rewrites registry.json from lib/blocks.ts and lib/spinner-patterns.ts.
//
//   pnpm registry:build      # this, then `shadcn build` into public/r
//
// Two things are derived rather than written by hand: an item's file list,
// walked off disk, and the spinner items, generated one per preset. Everything
// else is the entry in lib/blocks.ts.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI_DIR = "registry/default/ui";
const COMPONENT_DIR = "registry/default/components";
const REGISTRY_PATH = path.join(ROOT, "registry.json");
const AUTHOR = "D2 Studio";
const SPINNER_BASE_URL = "https://ui.d2studio.dev/r/pixel-spinner.json";

/**
 * Both data files are pure data, so compiling just them is enough to import
 * them from node. Their only imports are `import type`, which tsc erases.
 */
function loadData() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "d2-registry-"));
  try {
    execFileSync(
      "npx",
      ["tsc", "lib/blocks.ts", "lib/spinner-patterns.ts", "--outDir", tmp,
       "--target", "es2020", "--module", "es2020", "--moduleResolution", "bundler",
       "--skipLibCheck"],
      { cwd: ROOT, stdio: "pipe" },
    );
  } catch {
    // tsc exits nonzero because an `import type` path cannot resolve outside a
    // tsconfig, but it still emits. Only the emitted files matter.
  }
  const load = async (file) => {
    const js = path.join(tmp, file);
    if (!fs.existsSync(js)) throw new Error(`tsc emitted no ${file}`);
    return import(pathToFileURL(js).href);
  };
  return Promise.all([load("blocks.js"), load("spinner-patterns.js")]).then((m) => {
    fs.rmSync(tmp, { recursive: true, force: true });
    const published = m[0].PUBLISHED_SPINNERS;
    const byName = new Map(
      [...m[1].PREMIUM_LIBRARY, ...m[1].PRO_LIBRARY].map((d) => [d.name, d]),
    );
    return {
      blocks: m[0].BLOCK_LIBRARY,
      spinners: published.map((n) => {
        const def = byName.get(n);
        if (!def) throw new Error(`PUBLISHED_SPINNERS names "${n}", which no preset matches`);
        return def;
      }),
    };
  });
}

const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

/**
 * An item's files, read off disk rather than declared: `<name>.tsx` is the
 * entry, and anything in a `<name>/` beside it travels with it keeping its
 * directory, because the entry imports those children relatively.
 */
function filesOf(name) {
  const dir = exists(`${UI_DIR}/${name}.tsx`)
    ? UI_DIR
    : exists(`${COMPONENT_DIR}/${name}.tsx`)
      ? COMPONENT_DIR
      : null;
  if (!dir) throw new Error(`"${name}" has no ${UI_DIR}/${name}.tsx or ${COMPONENT_DIR}/${name}.tsx`);

  const kind = dir === UI_DIR ? "registry:ui" : "registry:component";
  const files = [{ path: `${dir}/${name}.tsx`, type: kind }];

  // A stylesheet sitting beside the entry installs next to it.
  if (exists(`${dir}/${name}.css`)) {
    files.push({
      path: `${dir}/${name}.css`,
      type: "registry:file",
      target: `components/${dir === UI_DIR ? "ui/" : ""}${name}.css`,
    });
  }

  const childDir = path.join(ROOT, dir, name);
  if (fs.existsSync(childDir)) {
    const children = fs
      .readdirSync(childDir, { recursive: true })
      .map((f) => String(f).split(path.sep).join("/"))
      .filter((f) => fs.statSync(path.join(childDir, f)).isFile() && !f.startsWith("."))
      .sort();
    for (const f of children) {
      files.push({
        path: `${dir}/${name}/${f}`,
        type: f.endsWith(".css") ? "registry:file" : "registry:component",
        target: `components/${name}/${f}`,
      });
    }
  }
  return { files, kind };
}

const pascal = (name) =>
  name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
const titleOf = (name) =>
  name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

function wrapperSource(def) {
  const comp = `Spinner${pascal(def.name)}`;
  // Only the patterns that need the eased step carry an animation prop, so the
  // rest of the wrappers stay one line.
  const anim = def.animation ? ` animation="${def.animation}"` : "";
  return `"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = ${JSON.stringify(def.pattern)};

type ${comp}Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function ${comp}({ color = "${def.color}", ...props }: ${comp}Props) {
  return <PixelSpinner pattern={pattern} color={color}${anim} {...props} />;
}
`;
}

// Derived rather than written per item: the grid, frame count and beat are the
// whole spec of a pixel spinner, and they stay true when a pattern is edited.
function describeSpinner(def) {
  const p = def.pattern;
  const rows = p.rows ?? p.size;
  const cols = p.cols ?? p.size;
  const beat = p.interval ?? 220;
  return `A ${rows}×${cols} pixel-grid loading spinner: ${p.frames.length} frames at ${beat}ms (${p.frames.length * beat}ms loop).`;
}

const { blocks, spinners } = await loadData();
const outDir = path.join(ROOT, COMPONENT_DIR);
fs.mkdirSync(outDir, { recursive: true });

// Drop wrappers for presets that no longer exist.
const expected = new Set(spinners.map((d) => `spinner-${d.name}.tsx`));
for (const f of fs.readdirSync(outDir)) {
  if (f.startsWith("spinner-") && !expected.has(f)) fs.rmSync(path.join(outDir, f));
}

const spinnerItems = spinners.map((def) => {
  const name = `spinner-${def.name}`;
  fs.writeFileSync(path.join(outDir, `${name}.tsx`), wrapperSource(def));
  return {
    name,
    type: "registry:component",
    title: `Spinner ${titleOf(def.name)}`,
    description: describeSpinner(def),
    author: AUTHOR,
    registryDependencies: [SPINNER_BASE_URL],
    files: [{ path: `${COMPONENT_DIR}/${name}.tsx`, type: "registry:component" }],
    categories: ["spinner"],
  };
});

const referenced = new Set();
const blockItems = blocks.map((b) => {
  const { files, kind } = filesOf(b.name);
  for (const f of files) referenced.add(f.path);
  return {
    name: b.name,
    type: kind,
    title: b.title,
    description: b.description,
    author: AUTHOR,
    ...(b.dependencies?.length ? { dependencies: b.dependencies } : {}),
    ...(b.registryDependencies?.length ? { registryDependencies: b.registryDependencies } : {}),
    ...(b.css ? { css: b.css } : {}),
    ...(b.cssVars ? { cssVars: b.cssVars } : {}),
    files,
    categories: b.categories,
  };
});

for (const item of spinnerItems) referenced.add(item.files[0].path);

// Sources on disk that no item ships. Not an error — a block can be staged
// before it is published — but it is the one thing a disk walk cannot notice
// on its own, so it is said out loud.
const orphans = [];
for (const dir of [UI_DIR, COMPONENT_DIR]) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;
    const rel = `${dir}/${entry.name}`;
    if (!referenced.has(rel)) orphans.push(rel);
  }
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
registry.items = [...blockItems, ...spinnerItems];
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");

console.log(`registry.json: ${blockItems.length} blocks + ${spinnerItems.length} spinners`);
if (orphans.length) {
  console.log(`\nnot published (on disk, no entry in lib/blocks.ts):`);
  for (const o of orphans) console.log(`  - ${o}`);
}
