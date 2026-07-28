"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerGradient,
  type SpinnerShape,
} from "@/components/pixel-spinner";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, copyText } from "@/lib/utils";
import { PREMIUM_LIBRARY } from "@/lib/spinner-patterns";
import {
  GRADIENTS,
  PRESETS,
  SAVED_PATTERNS_STORAGE_KEY,
  effectiveRotation,
  rotatePattern,
  scalePattern,
  type SavedPattern,
  type SavedPrefs,
} from "@/components/spinners/playground";

const SIZES = [12, 16, 20] as const;
const SHAPES: { id: SpinnerShape; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "diamond", label: "Diamond" },
];
// Gallery shows four paints only; the full set lives on /spinners.
const STANDARD_IDS = ["pearl", "blue", "orange", "green"];
// Every paint here is a --ls-paint-* token from globals.css, so the swatch and
// the spinner read the same value and CSS owns the palette.
const PAINT_TOKENS: Record<string, string> = {
  pearl: "var(--ls-paint-white)",
  blue: "var(--ls-paint-blue)",
  orange: "var(--ls-paint-orange)",
  green: "var(--ls-paint-green)",
};
const STANDARD_PRESETS = STANDARD_IDS.map((id) => {
  const p = PRESETS.find((x) => x.id === id)!;
  const token = PAINT_TOKENS[id];
  return { ...p, token, swatch: token };
});
const STANDARD_GRADIENT_IDS = ["mint", "neon", "dawn", "bubblegum"];
// Same four gradients as the shared list, stops restated in oklch.
const GRADIENT_OVERRIDES: Record<
  string,
  { from: string; to: string; glow: string }
> = {
  mint: {
    from: "oklch(0.826 0.203 150.13)",
    to: "oklch(0.883 0.154 177.227)",
    glow: "oklch(0.883 0.154 177.227)",
  },
  neon: {
    from: "oklch(0.753 0.135 219.538)",
    to: "oklch(0.662 0.203 21.38)",
    glow: "oklch(0.689 0.191 313.351)",
  },
  dawn: {
    from: "oklch(0.877 0.084 336.717)",
    to: "oklch(0.806 0.071 260.559)",
    glow: "oklch(0.806 0.071 260.559)",
  },
  bubblegum: {
    from: "oklch(0.791 0.121 17.626)",
    to: "oklch(0.89 0.05 36.497)",
    glow: "oklch(0.791 0.121 17.626)",
  },
};
const STANDARD_GRADIENTS = STANDARD_GRADIENT_IDS.map((id) => ({
  ...GRADIENTS.find((g) => g.id === id)!,
  ...GRADIENT_OVERRIDES[id],
}));
const DEFAULT_CELL = 14;
const DEFAULT_GAP = 4.64;
// Cells keep one 14:4.64 cell-to-gap ratio at every size, so the spacing reads
// the same whether the spinner is 8 or 24px, and a pattern of any grid width
// ends up exactly `size` pixels across.
const GAP_RATIO = DEFAULT_GAP / DEFAULT_CELL;

// Saved patterns are all authored on a 4-wide grid, so that is what sets their
// cell size regardless of how many columns a given draw uses.
const STANDARD_COLS = 4;

// Whole pixels only: fractional tracks snap to the device grid one at a time,
// which leaves a single seam in the middle wider than the rest. Gap gives way
// before cell size, so the grid stays as close to `size` as it can.
function metrics(size: number, cols: number) {
  let cellSize = Math.max(
    1,
    Math.round(size / (cols + (cols - 1) * GAP_RATIO)),
  );
  let gap = Math.max(1, Math.round(cellSize * GAP_RATIO));
  while (cellSize * cols + gap * (cols - 1) > size) {
    if (gap > 1) gap -= 1;
    else if (cellSize > 1) cellSize -= 1;
    else break;
  }
  return { cellSize, gap };
}

// One paint for the whole gallery: a PRESETS id, or "grad:<GRADIENTS id>".
type Paint = {
  color: SpinnerColor;
  token?: string;
  gradient?: SpinnerGradient;
};

function paintFor(id: string): Paint {
  if (id.startsWith("grad:")) {
    const gid = id.slice(5);
    return {
      color: "blue",
      // STANDARD_GRADIENTS first so the oklch stops apply.
      gradient:
        STANDARD_GRADIENTS.find((g) => g.id === gid) ??
        GRADIENTS.find((g) => g.id === gid),
    };
  }
  const p = STANDARD_PRESETS.find((x) => x.id === id);
  return { color: p?.builtin ?? "blue", token: p?.token };
}

// Display names only — the pattern id stays the registry/install name.
const FANCY: Record<string, string> = {
  "ring-4-cw": "Halo",
  "dual-ring-5": "Binary",
  "vortex-in": "Vortex",
  "col-wave-5": "Cascade",
  "rain-4": "Drizzle",
  "tide-roll": "Tide",
  "billboard-tiles": "Mosaic",
};
// The label beside each spinner. The trailing dots are part of the word, the
// way an agent CLI prints them, so they vary on purpose.
const WORDS = [
  "Billowing..",
  "Accomplishing..",
  "Channelling...",
  "Tinkering.",
  "Boogieing..",
  "Levitating.",
  "Elucidating..",
];
// Hashed off the name so a given pattern always draws the same word, in the
// gallery and in the terminal alike.
const wordFor = (name: string) =>
  WORDS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % WORDS.length];

// Hidden from this gallery; all still ship in the registry.
const HIDDEN = new Set(["swell-roll", "ripple-out", "spiral-in-5"]);
const SHOWN = PREMIUM_LIBRARY.filter((s) => !HIDDEN.has(s.name));

// Presets each ship as their own registry item; saved patterns exist only in
// this browser, so they install the base engine and supply their own frames.
const PRESET_COMMAND = (name: string) =>
  `npx shadcn@latest add @d2/spinner-${name}`;
const BASE_COMMAND = "npx shadcn@latest add @d2/pixel-spinner";

// Imported patterns only bring their frames and timing across; size, spacing
// and paint come from this gallery, so every saved spinner reads the same.
const BASE_PREFS: SavedPrefs = {
  colorMode: "custom",
  color: "blue",
  presetId: "blue",
  customColor: "oklch(0.833 0 0)",
  gradientId: "peach",
  gradientFrom: "oklch(0.876 0.134 91.783)",
  gradientTo: "oklch(0.793 0.118 36.953)",
  gradientGlow: "oklch(0.793 0.118 36.953)",
  cellSize: 4,
  gap: 2,
  speed: 130,
  glow: 0,
  // 0 keeps each pattern's own grid; STANDARD_COLS sets the cell size.
  gridRows: 0,
  gridCols: 0,
  shape: "rounded",
  animation: "pixels",
  popOnPeak: false,
  popStrength: 0.8,
  popDuration: 480,
  direction: "e",
};

// Exported from the pixel-spinner-latest playground so it ships with the page
// instead of living only in one browser's localStorage.
const BUILTIN_SAVED: SavedPattern[] = [
  {
    id: "ms47kaog",
    name: "Pro-1",
    rows: 4,
    cols: 4,
    frames: [
      [8],
      [4, 8],
      [0, 4, 8, 12],
      [0, 4, 5, 8, 9, 12],
      [0, 4, 5, 6, 8, 9, 10, 12],
      [0, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15],
      [5, 6, 9, 10],
      [0, 3, 5, 6, 9, 10, 12, 15],
      [0, 3, 5, 6, 9, 10, 12, 15],
      [2, 4, 5, 6, 9, 10, 11, 13],
      [1, 5, 6, 7, 8, 9, 10, 14],
      [0, 3, 5, 6, 9, 10, 12, 15],
    ],
    createdAt: 1785216236306,
    prefs: BASE_PREFS,
  },
  {
    id: "ms4pro2",
    name: "Pro-2",
    rows: 4,
    cols: 4,
    // Diagonal pairs stepping bottom-right to top-left across the grid.
    frames: [
      [13, 14],
      [9, 10, 12, 15],
      [1, 2],
      [0, 3, 5, 6],
    ],
    createdAt: 1785228500000,
    prefs: { ...BASE_PREFS, speed: 120 },
  },
  {
    id: "ms4pro3",
    name: "Pro-3",
    rows: 4,
    cols: 2,
    frames: [
      [0, 2, 4, 6],
      [0, 2, 3, 4, 5, 6],
      [1, 3, 5, 7],
      [1, 2, 3, 4, 5, 7],
    ],
    createdAt: 1785226400000,
    prefs: { ...BASE_PREFS, speed: 110, gridRows: 0, gridCols: 0 },
  },
  {
    id: "ms4pro4",
    name: "Pro-4",
    rows: 4,
    cols: 2,
    // One cell walks the ring clockwise; the 4-step trail turns it into a
    // comet orbiting the grid, the way Claude's terminal star rotates.
    frames: [[0], [1], [3], [5], [7], [6], [4], [2]],
    createdAt: 1785226900000,
    prefs: { ...BASE_PREFS, speed: 100, gridRows: 0, gridCols: 0 },
  },
  {
    id: "ms4pro5b",
    name: "Pro-5",
    rows: 4,
    cols: 4,
    // A diagonal walk down to the corner, then the grid floods back up it.
    frames: [
      [0],
      [1, 4],
      [5],
      [6, 9, 10],
      [15],
      [11, 14, 15],
      [7, 10, 11, 13, 14, 15],
      [3, 6, 7, 9, 10, 11, 12, 13, 14, 15],
      [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    ],
    createdAt: 1785229400000,
    prefs: { ...BASE_PREFS, speed: 110 },
  },
  {
    id: "ms4pro6",
    name: "Pro-6",
    rows: 4,
    cols: 2,
    // Breathes out from the middle rows and back in.
    frames: [
      [2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 6, 7],
      [2, 3, 4, 5],
    ],
    createdAt: 1785226900002,
    prefs: { ...BASE_PREFS, speed: 130, gridRows: 0, gridCols: 0 },
  },
  {
    id: "ms4pro7",
    name: "Pro-7",
    rows: 4,
    cols: 4,
    // A 2x2 block climbs the diagonal to the top-left, pauses, then a second
    // block sweeps up from the bottom and settles in the middle.
    frames: [
      [15],
      [10, 11, 14, 15],
      [5, 6, 9, 10],
      [0, 1, 4, 5],
      [0],
      [],
      [8, 9, 12, 13],
      [5, 6, 8, 9, 10, 12, 13],
      [2, 3, 5, 6, 7, 9, 10],
      [],
      [5, 6, 9, 10],
    ],
    createdAt: 1785226900003,
    prefs: { ...BASE_PREFS, speed: 160 },
  },
  {
    id: "ms4pro8",
    name: "Pro-8",
    rows: 4,
    cols: 2,
    // A scan line bouncing down and back up.
    frames: [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [4, 5],
      [2, 3],
    ],
    createdAt: 1785226900004,
    prefs: { ...BASE_PREFS, speed: 120, gridRows: 0, gridCols: 0 },
  },
  {
    id: "ms4pro10",
    name: "Pro-10",
    rows: 4,
    cols: 2,
    // One cell per frame: with a 4-step trail, two per frame would keep all
    // eight lit at once and the grid would read as a solid block. A single
    // drop falls down one column, then the other, so the loop stays unbroken.
    frames: [[0], [2], [4], [6], [1], [3], [5], [7]],
    createdAt: 1785227900001,
    // "wavy" swaps the hard pixel step for the eased 320ms cell transition, so
    // cells glide between frames instead of snapping.
    prefs: {
      ...BASE_PREFS,
      speed: 110,
      gridRows: 0,
      gridCols: 0,
      animation: "wavy",
    },
  },
  {
    id: "ms4pro11",
    name: "Pro-11",
    rows: 4,
    cols: 2,
    // Heartbeat: two quick beats, then empty frames let the trail decay so the
    // rest is real silence rather than more motion.
    frames: [
      [2, 3, 4, 5],
      [0, 1, 6, 7],
      [],
      [2, 3, 4, 5],
      [0, 1, 6, 7],
      [],
      [],
      [],
    ],
    createdAt: 1785227900002,
    prefs: { ...BASE_PREFS, speed: 110, gridRows: 0, gridCols: 0 },
  },
];

function readSavedPatterns(): SavedPattern[] {
  let stored: SavedPattern[] = [];
  try {
    const raw = window.localStorage.getItem(SAVED_PATTERNS_STORAGE_KEY);
    stored = raw ? (JSON.parse(raw) as SavedPattern[]) : [];
  } catch {
    stored = [];
  }
  // A locally saved copy of the same id wins over the baked-in one.
  const ids = new Set(stored.map((s) => s.id));
  return [...BUILTIN_SAVED.filter((s) => !ids.has(s.id)), ...stored];
}

// The trail and glow layer counts are fixed by PixelSpinner and globals.css.
const TRAIL = [1, 0.5, 0.25, 0.15];

// Everything an agent needs to rebuild this exact spinner in CSS, matching what
// the gallery is rendering right now.
function specPrompt({
  name,
  word,
  command,
  rows,
  cols,
  frames,
  interval,
  size,
  shape,
  paint,
}: {
  name: string;
  word: string;
  command: string;
  rows: number;
  cols: number;
  frames: number[][];
  interval: number;
  size: number;
  shape: SpinnerShape;
  paint: Paint;
}) {
  const { cellSize, gap } = metrics(size, STANDARD_COLS);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const fill = paint.gradient
    ? `linear-gradient(135deg, ${paint.gradient.from}, ${paint.gradient.to}), glow ${paint.gradient.glow}`
    : `solid ${paint.token ?? "oklch(0.833 0 0)"}`;
  const radius =
    shape === "circle" ? "50%" : shape === "square" ? "0" : "clip-path";

  return `I want a CSS-only loading spinner. Please generate clean, drop-in HTML and CSS for the following design:

PATTERN
- Name: "${name}"
- Label beside the spinner: "${word}"
- Grid: ${rows} rows x ${cols} columns (${rows * cols} cells, indexed 0-${
    rows * cols - 1
  } in row-major order, left-to-right, top-to-bottom)
- Total animation frames: ${frames.length}
- Frame duration: ${interval}ms (full loop ${interval * frames.length}ms)
- Animation style: discrete pixel stepping

CELLS
- Cell shape: ${shape}${
    shape === "square" || shape === "circle"
      ? ` (border-radius ${radius})`
      : ` (${radius}: ${
          shape === "diamond"
            ? "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
            : "see shape spec"
        })`
  }
- Cell size: ${r2(cellSize)}px x ${r2(cellSize)}px
- Gap between cells: ${r2(gap)}px (cell-to-gap ratio ${r2(
    GAP_RATIO * 100,
  )}%, so the whole grid measures ${size}px across)
- Fill: ${fill}
- Cell fill is mixed in oklab: lightened 80% toward white for the top stop, 85% toward black for the bottom stop, along 135deg
- Glow: 4-layer centered box-shadow halo at 0x intensity, so no bloom is drawn. Layers would carry 95%, 75%, 55%, and 35% alpha of the cell color

MOTION TRAIL
Each cell, when activated on a frame, fades out over the next ${
    TRAIL.length - 1
  } frames so there is a ${TRAIL.length}-step opacity trail:
${TRAIL.map((o, i) => `  step ${i}${i === 0 ? " (active)" : ""}: ${o}`).join(
  "\n",
)}

UNLIT CELLS
- Radial gradient at 35% 30% from oklch(0 0 0 / 0.08) to transparent, with a 1px oklch(0 0 0 / 0.08) inset stroke

FRAME DATA (cell indices that activate at the start of each frame)
${frames.map((f, i) => `  Frame ${i}: [${f.join(", ")}]`).join("\n")}

REQUIREMENTS
- Pure HTML + CSS only (no JavaScript, no images)
- Use display: inline-grid with grid-template-columns: repeat(${cols}, var(--cell))
- Each lit cell gets its own @keyframes rule
- Use animation-timing-function: steps(1, end) so opacity changes are crisp at frame boundaries
- Loop infinitely (animation-iteration-count: infinite)
- Expose cell size, gap, color, glow scalar, and speed as CSS custom properties (--cell, --gap, --duration, --glow) so it is easy to customize
- Colors must be oklch, and the paint should come from a token, for example var(--ls-paint-white)
- Respect prefers-reduced-motion by holding a single frame

OUTPUT
Return one self-contained HTML snippet and one CSS block that I can paste directly into a project. Add a one-line usage comment at the top of the CSS.

REFERENCE
This spinner ships in the D2 registry: ${command}`;
}

function Swatch({
  active,
  background,
  label,
  onClick,
}: {
  active: boolean;
  background: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{ background }}
      className={cn(
        "size-5 rounded-full ring-offset-2 ring-offset-white dark:ring-offset-black transition",
        active
          ? "ring-2 ring-black dark:ring-white"
          : "opacity-60 hover:opacity-100",
      )}
    />
  );
}

function Panel({
  size,
  setSize,
  shape,
  setShape,
  paintId,
  setPaintId,
}: {
  size: number;
  setSize: (s: number) => void;
  shape: SpinnerShape;
  setShape: (s: SpinnerShape) => void;
  paintId: string;
  setPaintId: (id: string) => void;
}) {
  return (
    // Floating dock: fixed so it stays reachable while the gallery scrolls, and
    // w-fit so it only ever covers as much as the controls need.
    <div className="fixed inset-x-0 top-5 z-20 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 px-5 py-2.5 shadow-lg shadow-black/10 dark:shadow-black/50 backdrop-blur">
      <div className="flex items-center gap-1">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px] transition",
              size === s
                ? "bg-black/15 dark:bg-white/15 text-black dark:text-white"
                : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShape(s.id)}
            aria-pressed={shape === s.id}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px] transition",
              shape === s.id
                ? "bg-black/15 dark:bg-white/15 text-black dark:text-white"
                : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STANDARD_PRESETS.map((p) => (
          <Swatch
            key={p.id}
            active={paintId === p.id}
            background={p.swatch}
            label={p.label}
            onClick={() => setPaintId(p.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STANDARD_GRADIENTS.map((g) => (
          <Swatch
            key={g.id}
            active={paintId === `grad:${g.id}`}
            background={`linear-gradient(135deg, ${g.from}, ${g.to})`}
            label={g.label}
            onClick={() => setPaintId(`grad:${g.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function SavedSpinner({
  saved,
  size,
  shape,
  paint,
}: {
  saved: SavedPattern;
  size: number;
  shape: SpinnerShape;
  paint: Paint;
}) {
  const p = saved.prefs;
  const rotated = rotatePattern(
    { rows: saved.rows, cols: saved.cols, frames: saved.frames },
    // Saved patterns have no natural direction, so "e" is the identity.
    effectiveRotation("e", p?.direction ?? "e"),
  );
  const rows = p?.gridRows || rotated.rows || saved.rows;
  const cols = p?.gridCols || rotated.cols || saved.cols;
  const pattern = scalePattern(rotated, rows, cols);

  return (
    <PixelSpinner
      pattern={pattern}
      {...paint}
      // Cell size always comes off the standard 4-wide grid, never this
      // pattern's own width: sizing per pattern makes a 5-col draw render 2px
      // cells next to a 4-col draw's 3px ones, and the gallery reads uneven.
      // A wider grid overflows the `size` square into the cell's padding.
      {...metrics(size, STANDARD_COLS)}
      intervalOverride={p?.speed}
      glow={0}
      shape={shape}
      animation={p?.animation}
      pop={p?.popOnPeak}
      popStrength={p?.popStrength}
      popDuration={p?.popDuration}
    />
  );
}

// Where these spinners actually land: an agent CLI mid-task. Static output,
// the only moving part is the spinner on the pending line.
// Fixed at 12px: this is a line of terminal output, not a gallery swatch, so
// it stays inline-text sized whatever the gallery size selector says.
const TERMINAL_SIZE = 12;

// The D2 badge glyph lifted out of /public/d2-*.svg: one path, no badge plate,
// no gradient, so it takes whatever paint the spinner is wearing.
const D2_PATH =
  "M9.86 22V7.8H13.52C14.8533 7.8 15.9867 8.07333 16.92 8.62C17.8667 9.16667 18.5933 9.97333 19.1 11.04C19.6067 12.0933 19.86 13.38 19.86 14.9C19.86 16.42 19.6067 17.7067 19.1 18.76C18.5933 19.8133 17.8667 20.62 16.92 21.18C15.9867 21.7267 14.8533 22 13.52 22H9.86ZM12.72 19.44H13.54C14.6467 19.44 15.4867 19.0667 16.06 18.32C16.6467 17.56 16.94 16.42 16.94 14.9C16.94 13.3933 16.6467 12.26 16.06 11.5C15.4867 10.74 14.6467 10.36 13.54 10.36H12.72V19.44ZM20.5722 22C20.5722 20.8533 20.7189 19.8467 21.0122 18.98C21.3189 18.1 21.8455 17.3 22.5922 16.58C23.3522 15.86 24.3855 15.16 25.6922 14.48C26.1855 14.2267 26.5922 13.98 26.9122 13.74C27.2322 13.5 27.4722 13.2333 27.6322 12.94C27.7922 12.6467 27.8722 12.2867 27.8722 11.86C27.8722 11.4733 27.7989 11.1467 27.6522 10.88C27.5055 10.6 27.2922 10.3867 27.0122 10.24C26.7322 10.08 26.3789 10 25.9522 10C25.2322 10 24.6855 10.2067 24.3122 10.62C23.9522 11.02 23.7055 11.6 23.5722 12.36L20.6322 12.18C20.7789 10.7267 21.2989 9.58 22.1922 8.74C23.0989 7.9 24.3655 7.48 25.9922 7.48C27.0589 7.48 27.9455 7.66 28.6522 8.02C29.3722 8.36667 29.9122 8.85333 30.2722 9.48C30.6322 10.1067 30.8122 10.8467 30.8122 11.7C30.8122 12.46 30.6922 13.1133 30.4522 13.66C30.2122 14.2067 29.8189 14.7067 29.2722 15.16C28.7255 15.6133 27.9789 16.1 27.0322 16.62C26.2722 17.0333 25.6589 17.4133 25.1922 17.76C24.7389 18.0933 24.4055 18.4 24.1922 18.68C23.9789 18.9467 23.8589 19.2 23.8322 19.44H30.8122V22H20.5722Z";
// Tight bounds of that path, so the mark sits on the text line like a glyph.
const D2_BOX = { x: 9.86, y: 7.48, w: 20.95, h: 14.84 };

// Fixed orange, the CLI's own accent: the welcome card is chrome, so it holds
// still while the swatch dock repaints the spinners.
function D2Mark({ size = 13 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="D2 Studio"
      height={size}
      width={(size * D2_BOX.w) / D2_BOX.h}
      viewBox={`${D2_BOX.x} ${D2_BOX.y} ${D2_BOX.w} ${D2_BOX.h}`}
      className="inline-block shrink-0 align-[-0.12em]"
    >
      <path d={D2_PATH} fill="var(--ls-paint-orange)" />
    </svg>
  );
}

// The showcase shuffles through everything the gallery ships — saved patterns
// and presets alike — so each one gets seen in place. Both slots stay mounted
// and cross-fade via the transitions.dev icon-swap rules in globals.css.
const SHUFFLE_MS = 6000;

// Presets restated as SavedPattern so the shuffle has one code path. Frames and
// timing are the preset's own; everything else comes from BASE_PREFS.
const PRESETS_AS_SAVED: SavedPattern[] = SHOWN.map((s) => ({
  id: `preset-${s.name}`,
  name: s.name,
  rows: s.pattern.rows ?? s.pattern.size ?? 3,
  cols: s.pattern.cols ?? s.pattern.size ?? 3,
  frames: s.pattern.frames,
  createdAt: 0,
  prefs: { ...BASE_PREFS, speed: s.pattern.interval ?? 220 },
}));

// One timer drives both the spinner swap and the word beside it, so the label
// scrambles on the same beat the pattern changes.
function useShuffle(saved: SavedPattern[]) {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStep((n) => n + 1), SHUFFLE_MS);
    return () => clearInterval(t);
  }, []);

  const all = [...saved, ...PRESETS_AS_SAVED];
  const at = (n: number) => all[(n + all.length) % all.length];
  return {
    state: step % 2 === 0 ? "a" : "b",
    current: all.length ? at(step) : null,
    // Slot "a" holds the even steps, "b" the odd ones, so the outgoing pattern
    // is still mounted to fade out while the incoming one fades in.
    slots: all.length
      ? [
          { key: "a", pattern: at(step % 2 === 0 ? step : step - 1) },
          { key: "b", pattern: at(step % 2 === 1 ? step : step - 1) },
        ]
      : [],
  };
}

// Fake tool traffic, so the mock reads as an agent mid-task instead of a
// screenshot. Lines scroll through this pool forever.
const LOG = [
  { call: "Read(registry.json)", result: "Read 47 items" },
  { call: 'Grep(pattern: "spinner-")', result: "Found 12 files" },
  { call: "Read(lib/spinner-patterns.ts)", result: "Read 612 lines" },
  { call: "Bash(pnpm registry:build)", result: "Built 47 items in 1.2s" },
  { call: 'Glob("app/**/spinner*.tsx")', result: "Found 5 files" },
  { call: "Edit(registry.json)", result: "Updated 3 additions" },
  { call: "Read(components/pixel-spinner.tsx)", result: "Read 214 lines" },
  { call: "Bash(pnpm lint)", result: "No ESLint warnings" },
];
// A fixed window of lines: the card scrolls its own log rather than growing,
// so nothing outside it ever moves.
const LOG_LINES = 4;
const LOG_MS = 2400;
// Each entry is exactly two leading-6 lines (48px) plus the 12px stack gap, so
// one row of scroll is a known constant instead of something to measure.
const LOG_ENTRY = 48;
const LOG_GAP = 12;
const LOG_ROW = LOG_ENTRY + LOG_GAP;
// The window shows LOG_LINES; the list holds one more so the outgoing entry is
// still mounted to slide out through the top.
const LOG_WINDOW = LOG_LINES * LOG_ENTRY + (LOG_LINES - 1) * LOG_GAP;

function useLog() {
  const [head, setHead] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setHead((n) => n + 1), LOG_MS);
    return () => clearInterval(t);
  }, []);
  const at = (n: number) => LOG[((n % LOG.length) + LOG.length) % LOG.length];
  return {
    head,
    // Starts one behind the window: entry 0 is the one leaving.
    entries: Array.from({ length: LOG_LINES + 1 }, (_, i) => ({
      ...at(head - 1 + i),
      key: head - 1 + i,
    })),
  };
}

// transitions.dev texts-reveal: the two lines rise out of a blur, result held
// back by one stagger step. Only the newest entry plays it — the rest mount
// already settled, since they are not arriving, they are being scrolled.
function LogEntry({
  call,
  result,
  fresh,
}: {
  call: string;
  result: string;
  fresh: boolean;
}) {
  const [shown, setShown] = React.useState(!fresh);
  React.useEffect(() => {
    if (!fresh) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [fresh]);

  return (
    <div
      className={cn("t-stagger", shown && "is-shown")}
      style={{ height: LOG_ENTRY }}
    >
      <p className="t-stagger-line t-stagger-line--1 text-black/60 dark:text-white/60">
        <span className="text-black/40 dark:text-white/40">⏺</span> {call}
      </p>
      <p className="t-stagger-line t-stagger-line--2 pl-4 text-black/30 dark:text-white/30">
        ⎿ {result}
      </p>
    </div>
  );
}

function Terminal({
  saved,
  shape,
  paint,
}: {
  saved: SavedPattern[];
  shape: SpinnerShape;
  paint: Paint;
}) {
  const { state, slots, current } = useShuffle(saved);
  const { head, entries } = useLog();
  if (!saved.length || !current) return null;
  const word = wordFor(current.name);

  return (
    // No window chrome — this is the agent CLI itself, drawn the way it looks
    // in a terminal. w-fit keeps it as wide as its longest line.
    <div className="luminous-spinners mx-auto w-fit max-w-full space-y-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black px-5 py-4 font-mono text-[13px] leading-6">
      {/* Every glyph in here is the same dim neutral ink: the pending line
          below is the only moving thing on screen, so the eye goes to it. */}
      <div className="space-y-3">
        <div className="rounded-md border border-black/15 dark:border-white/15 px-3 py-2">
          <p className="flex items-center gap-2 text-black/70 dark:text-white/70">
            <D2Mark />
            Welcome to the D2 agent
          </p>
          <p className="mt-1 text-black/30 dark:text-white/30">
            /help for help, /status for setup
          </p>
          <p className="text-black/30 dark:text-white/30">
            cwd: ~/projects/d2studio-ui
          </p>
        </div>

        <p className="text-black/70 dark:text-white/70">
          <span className="text-black/25 dark:text-white/25">&gt; </span>
          audit the spinner registry and flag anything unused
        </p>

        <div
          className="t-log"
          style={
            {
              height: LOG_WINDOW,
              "--log-row": `${LOG_ROW}px`,
            } as React.CSSProperties
          }
        >
          {/* Keyed by head so the slide restarts on every tick. */}
          <div key={head} className="t-log-list space-y-3">
            {entries.map((l, i) => (
              <LogEntry
                key={l.key}
                call={l.call}
                result={l.result}
                fresh={i === entries.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* div, not p: the spinner renders a div and cannot sit inside one. The
          word swaps on the same beat as the pattern and shimmers in place. */}
      <div className="flex items-center gap-2 py-1 text-black/80 dark:text-white/80">
        <div className="t-icon-swap" data-state={state}>
          {slots.map((s) => (
            <div key={s.key} className="t-icon" data-icon={s.key}>
              <SavedSpinner
                saved={s.pattern}
                size={TERMINAL_SIZE}
                shape={shape}
                paint={paint}
              />
            </div>
          ))}
        </div>
        <span>
          {/* Slot as wide as the longest word, so swapping "Tinkering." for
              "Accomplishing.." never pushes the tail sideways. */}
          <span className="t-shimmer inline-block min-w-[15ch]">{word}</span>
          <span className="text-black/35 dark:text-white/35">
            {" "}
            (esc to interrupt · 12.4k tokens)
          </span>
        </span>
      </div>

      {/* The empty prompt the CLI parks under a running task: chevron, blinking
          block caret, nothing typed. */}
      <div className="flex items-center gap-2 rounded-md border border-black/15 dark:border-white/15 px-3 py-2">
        <span className="text-black/35 dark:text-white/35">&gt;</span>
        <span className="t-caret inline-block h-[15px] w-[7px] bg-black/60 dark:bg-white/60" />
      </div>
    </div>
  );
}

function Cell({
  name,
  command,
  prompt,
  word,
  size,
  children,
}: {
  name: string;
  command: string;
  prompt: string;
  word: string;
  size: number;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] transition-colors hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
      <div
        className="flex items-center justify-center"
        // Small spinners need less breathing room before the label.
        style={{ height: 132, gap: size <= 16 ? 8 : 12 }}
      >
        {/* Every spinner sits centred in the same `size` square with the same
            gutter on all four sides, at 8, 16 and 24 alike.
            Hovering just this box magnifies it: cells are solid-colour divs,
            so a transform scales them without going soft, and the hit area is
            the spinner itself rather than the whole card. */}
        <span
          className="inline-flex items-center justify-center transition-transform duration-300 ease-out hover:scale-[1.8]"
          // content-box so the padding sits outside the size square rather
          // than eating into it.
          style={{
            boxSizing: "content-box",
            width: size,
            height: size,
            padding: size / 4,
          }}
        >
          {children}
        </span>
        <span className="font-mono text-[14px] text-black/50 dark:text-white/50">
          {word}
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-black/[0.06] dark:border-white/[0.06] px-3 py-1.5">
        <p className="truncate font-mono text-[11px] text-black/50 dark:text-white/50">
          {name}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Copy options for ${name}`}
            className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1 font-mono text-[11px] text-black/50 dark:text-white/50 opacity-0 transition hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            Copy as
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-32 font-mono text-[11px]"
          >
            <DropdownMenuItem onSelect={() => copyText(prompt)}>
              Prompt
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => copyText(command)}>
              npx
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function SpinnersStandalonePage() {
  const [saved, setSaved] = React.useState<SavedPattern[]>([]);
  const [size, setSize] = React.useState<number>(16);
  const [shape, setShape] = React.useState<SpinnerShape>("square");
  // Orange to start: the hero terminal wears the gallery's paint now, and this
  // is the accent the CLI mock was drawn around.
  const [paintId, setPaintId] = React.useState("orange");
  const paint = paintFor(paintId);

  // Re-read on mount, on writes from the /spinners tab, and on refocus
  // (the storage event does not fire in the tab that wrote it).
  React.useEffect(() => {
    const sync = () => setSaved(readSavedPatterns());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return (
    // The gallery is dark only — the theme toggle is here to show the terminal
    // mock on light and on dark, not to repaint the whole page.
    <main className="bg-black text-white">
      {/* Hero: the terminal alone, centred, with nothing else competing. */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-10 px-8">
        <Terminal saved={saved} shape={shape} paint={paint} />
        {/* A plain anchor: html already carries motion-safe:scroll-smooth, so
            the scroll and its reduced-motion opt-out come for free. */}
        <a
          href="#gallery"
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[12px] text-white/60 transition hover:border-white/30 hover:text-white"
        >
          Explore more
          <ChevronDown className="size-3.5" />
        </a>
      </section>

      {/* .dark pins the gallery; .luminous-spinners scopes every .cell /
          .spinner-grid rule in globals.css. Terminal carries its own copy of
          the scope so it follows the real theme. pt-28 clears the floating
          control dock. */}
      <section id="gallery" className="dark luminous-spinners px-8 pb-16 pt-28">
        <h2 className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
          Saved ({saved.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {saved.map((s) => (
            <Cell
              key={s.id}
              name={s.name}
              command={BASE_COMMAND}
              word={wordFor(s.name)}
              prompt={specPrompt({
                name: s.name,
                word: wordFor(s.name),
                command: BASE_COMMAND,
                rows: s.prefs?.gridRows || s.rows,
                cols: s.prefs?.gridCols || s.cols,
                frames: s.frames,
                interval: s.prefs?.speed ?? 220,
                size,
                shape,
                paint,
              })}
              size={size}
            >
              <SavedSpinner saved={s} size={size} shape={shape} paint={paint} />
            </Cell>
          ))}
          {saved.length === 0 && (
            <p className="col-span-full text-sm text-black/40 dark:text-white/40">
              Nothing saved yet — save a pattern on /spinners and it shows up
              here.
            </p>
          )}
        </div>

        <h2 className="mt-12 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
          Presets ({SHOWN.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SHOWN.map((s) => {
            const cols = s.pattern.cols ?? s.pattern.size ?? 3;
            const rows = s.pattern.rows ?? s.pattern.size ?? 3;
            return (
              <Cell
                key={s.name}
                name={FANCY[s.name] ?? s.name}
                command={PRESET_COMMAND(s.name)}
                word={wordFor(s.name)}
                prompt={specPrompt({
                  name: FANCY[s.name] ?? s.name,
                  word: wordFor(s.name),
                  command: PRESET_COMMAND(s.name),
                  rows,
                  cols,
                  frames: s.pattern.frames,
                  interval: s.pattern.interval ?? 220,
                  size,
                  shape,
                  paint,
                })}
                size={size}
              >
                <PixelSpinner
                  pattern={s.pattern}
                  {...paint}
                  {...metrics(size, STANDARD_COLS)}
                  glow={0}
                  shape={shape}
                />
              </Cell>
            );
          })}
        </div>

        <Panel
          size={size}
          setSize={setSize}
          shape={shape}
          setShape={setShape}
          paintId={paintId}
          setPaintId={setPaintId}
        />
      </section>
    </main>
  );
}
