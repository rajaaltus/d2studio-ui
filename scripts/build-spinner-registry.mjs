#!/usr/bin/env node
// Generates one registry item per spinner preset in lib/spinner-patterns.ts.
// Each item is a thin wrapper around the @d2/pixel-spinner base component.
//
//   node scripts/build-spinner-registry.mjs
//   pnpm registry:build      # to regenerate public/r/*.json afterwards
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "registry/default/components");
const REGISTRY_PATH = path.join(ROOT, "registry.json");
const BASE_ITEM = "pixel-spinner";
const BASE_URL = "https://d2studio.dev/r/pixel-spinner.json";

// spinner-patterns.ts is pure data, so compiling just that file is enough to
// import it from node. Its only import is `import type`, which tsc erases.
function loadLibrary() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "spinner-registry-"));
  try {
    execFileSync(
      "npx",
      ["tsc", "lib/spinner-patterns.ts", "--outDir", tmp, "--target", "es2020",
       "--module", "es2020", "--moduleResolution", "bundler", "--skipLibCheck"],
      { cwd: ROOT, stdio: "pipe" }
    );
  } catch {
    // tsc exits nonzero because the `import type` path can't resolve outside a
    // tsconfig, but it still emits. Only the emitted file matters.
  }
  const js = path.join(tmp, "spinner-patterns.js");
  if (!fs.existsSync(js)) throw new Error("tsc emitted nothing");
  return import(pathToFileURL(js).href).then((m) => {
    fs.rmSync(tmp, { recursive: true, force: true });
    // Only the curated premium set ships as installable registry items.
    return m.PREMIUM_LIBRARY;
  });
}

const pascal = (name) =>
  name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
const title = (name) =>
  name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

function wrapperSource(def) {
  const comp = `Spinner${pascal(def.name)}`;
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
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
`;
}

const library = await loadLibrary();
fs.mkdirSync(OUT_DIR, { recursive: true });

// Drop wrappers for presets that no longer exist.
const expected = new Set(library.map((d) => `spinner-${d.name}.tsx`));
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.startsWith("spinner-") && !expected.has(f)) {
    fs.rmSync(path.join(OUT_DIR, f));
  }
}

const items = library.map((def) => {
  const name = `spinner-${def.name}`;
  fs.writeFileSync(path.join(OUT_DIR, `${name}.tsx`), wrapperSource(def));
  return {
    name,
    type: "registry:component",
    title: `Spinner ${title(def.name)}`,
    description: `A ${def.name} pixel-grid loading spinner.`,
    author: "D2 Studio",
    registryDependencies: [BASE_URL],
    files: [
      { path: `registry/default/components/${name}.tsx`, type: "registry:component" },
    ],
    categories: ["spinner"],
  };
});

const baseItem = {
  name: BASE_ITEM,
  type: "registry:ui",
  title: "Pixel Spinner",
  description: "The pixel-grid spinner engine every spinner preset builds on.",
  author: "D2 Studio",
  files: [
    { path: "registry/default/ui/pixel-spinner.tsx", type: "registry:ui" },
    {
      path: "registry/default/ui/pixel-spinner.css",
      type: "registry:file",
      target: "components/ui/pixel-spinner.css",
    },
  ],
  categories: ["spinner"],
};

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
const others = registry.items.filter(
  (i) => i.name !== BASE_ITEM && !i.name.startsWith("spinner-")
);
registry.items = [...others, baseItem, ...items];
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");

console.log(`wrote ${items.length} spinner items + ${BASE_ITEM} to registry.json`);
