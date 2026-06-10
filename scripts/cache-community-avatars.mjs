#!/usr/bin/env node
/**
 * Maintenance script: cache X and Threads avatars into public/community-avatars/.
 * Run after adding new engagers in lib/community-data.ts.
 *
 *   node scripts/cache-community-avatars.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = path.join(ROOT, "lib/community-data.ts");
const X_DIR = path.join(ROOT, "public/community-avatars");
const THREADS_DIR = path.join(ROOT, "public/community-avatars/threads");

const src = fs.readFileSync(DATA_FILE, "utf8");

const xHandles = [...src.matchAll(/xAvatar\("([^"]+)"\)/g)].map((m) => m[1]);
const threadsSlugs = [...src.matchAll(/threadsAvatar\("([^"]+)"\)/g)].map(
  (m) => m[1],
);

if (xHandles.length === 0 && threadsSlugs.length === 0) {
  console.error("No xAvatar() or threadsAvatar() entries found");
  process.exit(1);
}

fs.mkdirSync(X_DIR, { recursive: true });
fs.mkdirSync(THREADS_DIR, { recursive: true });

const MIN_BYTES = 10_000;

async function download({ platform, id, outDir }) {
  const url = `https://unavatar.io/${platform}/${id}`;
  const out = path.join(outDir, `${id}.jpg`);
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.log(`FAIL  ${platform}/${id}  HTTP ${res.status}`);
      return;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_BYTES) {
      console.log(
        `SKIP  ${platform}/${id}  placeholder (${buf.length} bytes)`,
      );
      return;
    }
    fs.writeFileSync(out, buf);
    console.log(`OK    ${platform}/${id}  ${buf.length} bytes`);
  } catch (err) {
    console.log(`ERR   ${platform}/${id}  ${err.message}`);
  }
}

console.log(`Caching ${xHandles.length} X avatars`);
for (const handle of xHandles) {
  if (fs.existsSync(path.join(X_DIR, `${handle}.jpg`))) {
    console.log(`SKIP  x/${handle}  already cached`);
    continue;
  }
  await download({ platform: "x", id: handle, outDir: X_DIR });
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\nCaching ${threadsSlugs.length} Threads avatars`);
for (const slug of threadsSlugs) {
  if (fs.existsSync(path.join(THREADS_DIR, `${slug}.jpg`))) {
    console.log(`SKIP  threads/${slug}  already cached`);
    continue;
  }
  await download({ platform: "threads", id: slug, outDir: THREADS_DIR });
  await new Promise((r) => setTimeout(r, 300));
}
