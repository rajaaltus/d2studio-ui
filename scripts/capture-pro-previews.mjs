// Card art for the pro catalogue: one screenshot per item, taken off the live
// pro site's own unchromed preview route and written to public/pro/<name>.jpg.
//
//   pnpm pro:previews            # only what is missing
//   pnpm pro:previews --force    # re-shoot everything
//   pnpm pro:previews bento-05   # re-shoot named items
//
// playwright-core, not playwright: it ships no browsers and drives the Chrome
// already installed on the machine (`channel: "chrome"`), so this stays a dev
// script with a 5MB dependency rather than a 150MB one.
//
// Why screenshots and not iframes of the same URL: twelve cards a page would be
// twelve full app boots. The still is what the card costs; the link out is
// where the real thing plays.

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

import { PRO_CATALOG } from "../lib/pro-catalog.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/pro");
const ORIGIN = process.env.PRO_ORIGIN ?? "https://pro.d2studio.dev";

// A page section is shot at a desktop width because that is the layout it was
// drawn for. An illustration is one card, so the same frame would leave it
// swimming in empty space — a tighter viewport is what fills the thumbnail.
const VIEWPORT = { width: 1440, height: 900 };
const ILLUSTRATION_VIEWPORT = { width: 1100, height: 720 };

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const targets = PRO_CATALOG.filter((i) => only.length === 0 || only.includes(i.name)).filter(
  (i) => force || only.length > 0 || !existsSync(join(OUT, `${i.name}.jpg`)),
);

if (targets.length === 0) {
  console.log("nothing to capture — every item already has card art");
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
console.log(`capturing ${targets.length} previews from ${ORIGIN}`);

const browser = await chromium.launch({ channel: "chrome" });
// One context, one page, reused: a fresh browser per item was most of the eight
// seconds the first version spent on each one.
const context = await browser.newContext({
  viewport: VIEWPORT,
  // 1440 CSS px at 1x is already ~2.4x the width a card draws at, so a retina
  // factor would only triple the bytes in git for pixels no card ever shows.
  deviceScaleFactor: 1,
  // The pro site is dark by default and its blocks are drawn for it. Asking for
  // light would only fight next-themes and shoot half of them mid-swap.
  colorScheme: "dark",
});
const page = await context.newPage();

let done = 0;
let failed = [];

// Where the content actually is, expanded to the 16:9 the card draws at and
// clamped back inside the viewport. Measured as the union of every element that
// paints something and is not itself a full-page wrapper — the preview route's
// own markup is one centring grid around a component whose real bounds are
// wherever its shadows and glows end, which no single selector knows.
async function frameContent(page, viewport, { expandToWide }) {
  const box = await page.evaluate(() => {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const el of document.body.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;
      // A wrapper spanning the viewport tells us nothing about where the
      // content sits, and including it would frame the whole page again. Either
      // axis is enough to disqualify one: the centring grid these pages wrap
      // every item in is full-width and only as tall as its child, so a rule
      // that wanted both axes let it through and framed the page anyway.
      if (rect.width >= innerWidth * 0.95 || rect.height >= innerHeight * 0.95) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.opacity === "0") continue;
      l = Math.min(l, rect.left);
      t = Math.min(t, rect.top);
      r = Math.max(r, rect.right);
      b = Math.max(b, rect.bottom);
    }
    return Number.isFinite(l) ? { l, t, r, b } : null;
  });

  if (!box) return undefined;

  // Two framings, because the cards show them two different ways. A component
  // is drawn `object-cover` in a 16:9 box, so its shot is expanded to 16:9 here
  // and fills the card exactly. An illustration is drawn `object-contain`, so
  // the same expansion would only pad the art with black and shrink it inside
  // the card — it gets a tight crop instead and fills as much of the box as its
  // own proportions allow.
  const pad = expandToWide ? 56 : 24;
  let width = Math.min(viewport.width, box.r - box.l + pad * 2);
  let height = Math.min(viewport.height, box.b - box.t + pad * 2);
  if (expandToWide) {
    if (width / height < 16 / 9) width = Math.min(viewport.width, height * (16 / 9));
    else height = Math.min(viewport.height, width * (9 / 16));
  }

  const cx = (box.l + box.r) / 2;
  const cy = (box.t + box.b) / 2;
  return {
    x: Math.max(0, Math.min(viewport.width - width, cx - width / 2)),
    y: Math.max(0, Math.min(viewport.height - height, cy - height / 2)),
    width,
    height,
  };
}

for (const item of targets) {
  const isIllustration = item.group === "illustrations";
  // Everything that is a whole page section: shot at the width it was drawn for.
  const isSection = item.group === "marketing" || item.group === "templates";
  await page.setViewportSize(isIllustration ? ILLUSTRATION_VIEWPORT : VIEWPORT);

  try {
    await page.goto(`${ORIGIN}/preview/${item.name}`, {
      waitUntil: "networkidle",
      timeout: 45_000,
    });

    // A scroll-driven block sits behind 30vh of deliberate runway, so the top of
    // its own preview page is empty by design. Scrolling to the middle of the
    // document lands on the block for those and is a no-op for everything else,
    // which is exactly as tall as the viewport — no need to know which is which.
    await page.evaluate(() => {
      const slack = document.documentElement.scrollHeight - window.innerHeight;
      if (slack > 0) window.scrollTo({ top: slack / 2, behavior: "instant" });
    });

    // Enough for a scroll-driven effect to reach its lit state and for anything
    // that plays on mount to finish. Fonts are already in by networkidle.
    await page.waitForTimeout(2200);

    // A page section fills the frame it was drawn for, so it is shot whole. A
    // button or a slider is a few hundred pixels alone on a black screen, and
    // shot whole it reads as an empty card — so the small items are framed on
    // their own content instead.
    const clip = isSection
      ? undefined
      : await frameContent(page, isIllustration ? ILLUSTRATION_VIEWPORT : VIEWPORT, {
          expandToWide: !isIllustration,
        });

    await page.screenshot({
      path: join(OUT, `${item.name}.jpg`),
      type: "jpeg",
      quality: 80,
      animations: "disabled",
      clip,
    });

    done++;
    process.stdout.write(`\r${done}/${targets.length} ${item.name}`.padEnd(70));
  } catch (err) {
    failed.push([item.name, err.message.split("\n")[0]]);
  }
}

await browser.close();

console.log(`\ncaptured ${done}/${targets.length} into public/pro`);
if (failed.length) {
  console.log(`\n${failed.length} failed:`);
  for (const [name, msg] of failed) console.log(`  ${name}: ${msg}`);
  process.exitCode = 1;
}
