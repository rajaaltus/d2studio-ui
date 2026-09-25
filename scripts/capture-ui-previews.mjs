// Card art for the /components shelf: one screenshot per primitive, taken off
// this site's own /preview/<name>?type=example route and written to
// public/ui/<name>.jpg.
//
//   pnpm dev                     # in another terminal; shots come off :4500
//   pnpm ui:previews             # only what is missing
//   pnpm ui:previews --force     # re-shoot everything
//   pnpm ui:previews dialog      # re-shoot named items
//
// Same approach as capture-pro-previews.mjs: playwright-core driving the
// installed Chrome, one reused page.

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

import { BLOCK_LIBRARY } from "../lib/blocks.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/ui");
const ORIGIN = process.env.UI_ORIGIN ?? "http://localhost:4500";

// 16:9 to match the card's box. Most demos are one small control, and at a
// desktop frame a lone button is a speck on the card, so they are shot in a
// tight frame. The ones laid out like a page or a panel get the wide one.
const FRAMES = {
  tight: { viewport: { width: 440, height: 248 }, scale: 3 },
  default: { viewport: { width: 640, height: 360 }, scale: 2 },
  wide: { viewport: { width: 960, height: 540 }, scale: 2 },
};
// One control and nothing around it: a button in a 640px frame is a speck on
// a 220px card, so these are framed close.
const TIGHT = new Set([
  "avatar", "badge", "button", "input", "input-otp", "kbd", "label", "native-select",
  "progress", "radio-group", "separator", "skeleton", "slider", "spinner", "switch",
  "textarea", "toggle", "toggle-group", "tooltip",
]);
const WIDE = new Set([
  "accordion", "alert", "alert-dialog", "aspect-ratio", "calendar", "card", "carousel", "chart",
  "command", "context-menu", "dialog", "drawer", "dropdown-menu", "empty", "field", "form",
  "message-scroller", "resizable", "sheet", "sidebar", "table", "tabs",
  // Small triggers whose open surface drops below them.
  "combobox", "popover", "select",
]);

// A closed overlay is a lone button, which says nothing about the component.
// These are opened before the shot, the way someone browsing would see them.
const OPEN = {
  click: ["dialog", "alert-dialog", "sheet", "drawer", "popover", "dropdown-menu", "combobox", "select", "sonner"],
  // Focused, so the empty slots draw their ring rather than vanishing on dark.
  focus: ["input-otp"],
  hover: ["tooltip", "hover-card"],
  context: ["context-menu"],
};

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const targets = BLOCK_LIBRARY.filter((b) => b.shelf === "components")
  .filter((b) => only.length === 0 || only.includes(b.name))
  .filter((b) => force || only.length > 0 || !existsSync(join(OUT, `${b.name}.jpg`)));

if (targets.length === 0) {
  console.log("nothing to capture — every component already has card art");
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
console.log(`capturing ${targets.length} previews from ${ORIGIN}`);

const browser = await chromium.launch({ channel: "chrome" });
// A page per frame, since the scale factor is fixed per context. The tight
// frame gets a higher factor so every card comes out about the same width.
const pages = {};
for (const [key, f] of Object.entries(FRAMES)) {
  const context = await browser.newContext({
    viewport: f.viewport,
    deviceScaleFactor: f.scale,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  pages[key] = await context.newPage();
}

const failed = [];
for (const { name } of targets) {
  try {
    const page = pages[WIDE.has(name) ? "wide" : TIGHT.has(name) ? "tight" : "default"];
    await page.goto(`${ORIGIN}/preview/${name}?type=example&theme=dark`, {
      waitUntil: "networkidle",
    });
    // Next's dev indicator sits in the corner of every frame otherwise.
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.waitForTimeout(600);

    const trigger = page.locator("button, [role=combobox]").first();
    if (OPEN.click.includes(name)) await trigger.click();
    if (OPEN.hover.includes(name)) {
      await page.locator(`[data-slot=${name}-trigger]`).first().hover();
      // hover-card opens after Radix's 700ms delay.
      await page.waitForTimeout(900);
    }
    if (OPEN.focus.includes(name)) await page.locator("input").first().focus();
    if (OPEN.context.includes(name)) {
      await page.locator("div.border-dashed, [data-slot=context-menu-trigger]").first().click({ button: "right" });
    }
    await page.waitForTimeout(500);

    await page.screenshot({ path: join(OUT, `${name}.jpg`), type: "jpeg", quality: 82 });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed.push(name);
    console.log(`  ✗ ${name}: ${err.message.split("\n")[0]}`);
  }
}

await browser.close();
if (failed.length) {
  console.log(`\n${failed.length} failed: ${failed.join(", ")}`);
  process.exit(1);
}
