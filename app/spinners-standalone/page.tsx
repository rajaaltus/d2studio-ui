"use client";

import * as React from "react";
import {
  SHAPE_STYLE,
  type SpinnerColor,
  type SpinnerGradient,
  type SpinnerPattern,
  type SpinnerShape,
} from "@/components/pixel-spinner";
import { BatteryFull, ChevronDown, Search, Wifi } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/ui/code-block";
import { cn, copyText } from "@/lib/utils";
import { PREMIUM_LIBRARY, PRO_LIBRARY } from "@/lib/spinner-patterns";
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
  // Three of the hand-drawn Pro patterns ship free, so they sit with the
  // presets rather than in the Pro set.
  "pro-27": "Bounce",
  "pro-28": "Pulse",
  "pro-29": "Hourglass",
  "pro-30": "Spark",
  "pro-31": "Strobe",
  "pro-32": "Tumble",
  "pro-33": "Splash",
  "pro-34": "Aperture",
  "pro-35": "Piston",
  "pro-38": "Pinwheel",
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
// The free Pro patterns, by their lib name.
const FREE_PRO = new Set([
  "pro-27",
  "pro-28",
  "pro-29",
  "pro-30",
  "pro-31",
  "pro-32",
  "pro-33",
  "pro-34",
  "pro-35",
  "pro-38",
]);
const SHOWN = [
  ...PREMIUM_LIBRARY.filter((s) => !HIDDEN.has(s.name)),
  ...PRO_LIBRARY.filter((s) => FREE_PRO.has(s.name)),
];

// Every preset and every Pro pattern ships as its own registry item; the
// install line for one is built by installLine() further down, off the item
// name. The engine on its own is what a pattern with no item falls back to.
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

// The Pro patterns live in lib/spinner-patterns.ts so the gallery, the docs
// and the registry generator all read the same frames. Everything the gallery
// adds on top of the raw pattern is here: a stable id for the localStorage
// merge below, and the display name.
// Pro-1 and Pro-5 keep the ids they were first saved under, so a locally
// edited copy still overrides the built-in one.
const PRO_ID: Record<string, string> = { "pro-1": "ms47kaog", "pro-5": "ms4pro5b" };

// Sampled off the D2 app icon (public/icon-dark.png) along its own top-left to
// bottom-right diagonal, with the blue end given the longer run.
const LOGO_GRADIENT =
  "linear-gradient(100deg, #F4D6EC 0%, #EEB9D9 14%, #DB97B9 30%, #AB6AB1 46%, #6271A7 66%, #4379A1 100%)";

// Display names for the Pro set. The registry item stays spinner-pro-N — this
// is the label only, keyed by the saved name so a user-saved pattern of their
// own falls through to its own name.
const PRO_FANCY: Record<string, string> = {
  "Pro-1": "Overture",
  "Pro-2": "Slant",
  "Pro-3": "Bellows",
  "Pro-4": "Comet",
  "Pro-5": "Flood",
  "Pro-6": "Breath",
  "Pro-7": "Relay",
  "Pro-8": "Sweep",
  "Pro-9": "Orbit",
  "Pro-10": "Trickle",
  "Pro-11": "Pulse",
  "Pro-12": "Spill",
  "Pro-13": "Shuffle",
  "Pro-14": "Clasp",
  "Pro-15": "Sway",
  "Pro-16": "Skip",
  "Pro-17": "Bloom",
  "Pro-18": "Turbine",
  "Pro-19": "Shuttle",
  "Pro-20": "Fork",
  "Pro-21": "Pincer",
  "Pro-22": "Weave",
  "Pro-23": "Buoy",
  "Pro-24": "Ascent",
  "Pro-25": "Barber",
  "Pro-26": "Convoy",
  "Pro-36": "Beacon",
  "Pro-37": "Kaleido",
};

const BUILTIN_SAVED: SavedPattern[] = PRO_LIBRARY.filter(
  (d) => !FREE_PRO.has(d.name),
).map((d) => ({
  id: PRO_ID[d.name] ?? `ms4${d.name.replace("-", "")}`,
  name: d.name.replace("pro-", "Pro-"),
  rows: d.pattern.rows ?? d.pattern.size ?? 4,
  cols: d.pattern.cols ?? d.pattern.size ?? 4,
  frames: d.pattern.frames,
  createdAt: 0,
  prefs: {
    ...BASE_PREFS,
    speed: d.pattern.interval ?? 220,
    ...(d.animation ? { animation: d.animation } : null),
  },
}));

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

// Gallery speed against each pattern's saved timing: 1 is the library's own
// speed, 0.75 would be 25% faster. Kept as the one knob so the page can be
// retimed without touching lib/spinner-patterns.ts, which every other page
// reads. The docs specs go through it too, so the numbers on a card match
// what the card is actually running.
const SPEEDUP = 1;
const quick = (ms: number | undefined) => Math.round((ms ?? 220) * SPEEDUP);

// Every spinner on this page is CSS only. PixelSpinner keeps one setInterval
// per instance and re-renders its whole grid on each tick; at gallery scale
// that is ~150 unsynchronised React renders a second, which is what made
// scrolling stutter. The frames are known upfront, so the loop is expressible
// as one @keyframes track per cell: no timers, no re-renders, and opacity is
// the only animated property, so it stays off the main thread.

// A cell's opacity across the whole loop, trail included: the freshest frame it
// appears in wins, the same pass PixelSpinner runs per tick.
function cellTrack(frames: number[][], cell: number): number[] {
  return frames.map((_, f) => {
    for (let t = 0; t < TRAIL.length; t++) {
      const src = frames[(f - t + frames.length) % frames.length] ?? [];
      if (src.includes(cell)) return TRAIL[t];
    }
    return 0;
  });
}

// The track is its own name, so the many cells that share one — patterns are
// symmetric, and a 4×4 grid rarely holds more than a handful of distinct
// tracks — collapse onto a single @keyframes rule.
const trackName = (track: number[]) =>
  `ls-t${track.map((v) => Math.round(v * 100)).join("-")}`;

// Linear between stops: at these durations the ramp is the fade the CSS
// transition used to draw, so the eased look survives losing the transition.
const trackRule = (track: number[]) =>
  `@keyframes ${trackName(track)}{` +
  track
    .map((v, i) => `${((i * 100) / track.length).toFixed(3)}%{opacity:${v}}`)
    .join("") +
  `100%{opacity:${track[0]}}}`;

// Two layers per cell: the dim plate holds still, the lit one on top is the
// only thing that animates. Splitting them is what keeps the animation to
// opacity — colour and glow are static, set once by the .cell.on classes.
function CssSpinner({
  pattern,
  paint,
  cellSize,
  gap,
  shape,
  duration,
}: {
  pattern: SpinnerPattern;
  paint: Paint;
  cellSize: number;
  gap: number;
  shape: SpinnerShape;
  duration: number;
}) {
  const cols = pattern.cols ?? pattern.size ?? 3;
  const rows = pattern.rows ?? pattern.size ?? 3;
  const tracks = Array.from({ length: rows * cols }, (_, i) =>
    cellTrack(pattern.frames, i),
  );
  const lit = tracks.filter((t) => t.some(Boolean));
  const rules = [
    ...new Map(lit.map((t) => [trackName(t), trackRule(t)])).values(),
  ].join("");

  const variant = paint.gradient || paint.token ? "c-custom" : `c-${paint.color}`;
  const vars = paint.gradient
    ? {
        "--cell-gradient": `linear-gradient(135deg, ${paint.gradient.from}, ${paint.gradient.to})`,
        "--cell-glow": paint.gradient.glow,
      }
    : paint.token
      ? { "--cell-color": paint.token }
      : {};
  const shapeStyle = SHAPE_STYLE[shape];

  return (
    <div
      className="spinner-grid grid effect-light anim-pixels"
      style={
        {
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: `${gap}px`,
          "--glow": "0",
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {/* display:none by UA rule, so it is not a grid item. */}
      <style>{rules}</style>
      {tracks.map((track, i) => (
        <div
          key={i}
          className={cn("cell", `shape-${shape}`)}
          style={{ width: cellSize, height: cellSize, ...shapeStyle }}
        >
          {track.some(Boolean) && (
            <div
              className={cn("cell on", variant, `shape-${shape}`)}
              style={
                {
                  position: "absolute",
                  inset: 0,
                  width: cellSize,
                  height: cellSize,
                  opacity: 0,
                  animation: `${trackName(track)} ${duration}ms linear infinite`,
                  ...shapeStyle,
                  ...vars,
                } as React.CSSProperties
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

// One loop is every frame at the quickened step.
const loopMs = (pattern: SpinnerPattern, interval: number) =>
  interval * pattern.frames.length;

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
  show,
}: {
  size: number;
  setSize: (s: number) => void;
  shape: SpinnerShape;
  setShape: (s: SpinnerShape) => void;
  paintId: string;
  setPaintId: (id: string) => void;
  show: boolean;
}) {
  return (
    // Floating dock: fixed so it stays reachable while the gallery scrolls, and
    // w-fit so it only ever covers as much as the controls need. It belongs to
    // the gallery, so it drops in only once the gallery is under it — over the
    // hero it would sit on top of the desktop mock with nothing to control.
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 top-5 z-20 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 px-5 py-2.5 shadow-lg shadow-black/10 dark:shadow-black/50 backdrop-blur",
        "transition duration-300 ease-out motion-reduce:transition-none",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-4 opacity-0",
      )}
    >
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
    <CssSpinner
      pattern={pattern}
      paint={paint}
      // Cell size always comes off the standard 4-wide grid, never this
      // pattern's own width: sizing per pattern makes a 5-col draw render 2px
      // cells next to a 4-col draw's 3px ones, and the gallery reads uneven.
      // A wider grid overflows the `size` square into the cell's padding.
      {...metrics(size, STANDARD_COLS)}
      shape={shape}
      duration={loopMs(pattern, quick(p?.speed))}
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

// Editor chrome: window title, two tabs, the pane buttons on the right. Pure
// decoration — nothing here is interactive, so it is all plain markup.
function WindowChrome() {
  return (
    <div className="text-[12px] text-black/45 dark:text-white/45">
      <div className="flex h-8 items-center justify-center border-b border-black/10 dark:border-white/10">
        d2studio-ui
      </div>
      <div className="flex items-stretch border-b border-black/10 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-2 border-r border-black/10 dark:border-white/10 px-3 py-2">
          <span className="size-1.5 shrink-0 rounded-full bg-current" />
          <span className="truncate">D2 Studio | Modern Component Library</span>
        </div>
        {/* Active tab: lit ink and a lifted plate, the way the focused editor
            tab reads against the rest of the strip. */}
        <div className="flex items-center gap-2 border-r border-black/10 dark:border-white/10 bg-black/[0.04] px-3 py-2 text-black/75 dark:bg-white/[0.06] dark:text-white/75">
          <span style={{ color: "var(--ls-paint-orange)" }}>✳</span>
          Claude Code
          <span className="opacity-40">✕</span>
        </div>
        <div className="ml-auto flex items-center gap-3 px-3 opacity-70">
          <span>▤</span>
          <span>⋯</span>
        </div>
      </div>
    </div>
  );
}

// The desktop the window sits on. The scrim over the photo is what makes the
// menu bar and the window's own chrome legible against a bright misty sky.
const WALLPAPER =
  "linear-gradient(180deg, oklch(0 0 0 / 0.62), oklch(0 0 0 / 0.38) 35%, oklch(0 0 0 / 0.66))," +
  "url(/Forest.jpg) center/cover no-repeat";

// macOS menu bar. Static chrome — nothing here is interactive, so it is all
// plain markup, and the clock is a fixed time like the rest of the mock.
const MENUS = ["File", "Edit", "View", "Window", "Help"];

function MenuBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-4 bg-black/25 px-4 text-[12px] text-white/85 backdrop-blur-md">
      <span className="font-semibold">D2 Agent</span>
      {MENUS.map((m) => (
        <span key={m} className="hidden text-white/70 sm:inline">
          {m}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-3 text-white/70">
        <BatteryFull className="size-4" />
        <Wifi className="size-3.5" />
        <Search className="size-3.5" />
        <span className="tabular-nums">Thu 10:48 PM</span>
      </span>
    </div>
  );
}

// The hero window is chrome, not a demo surface — it wears the CLI's own
// orange square whatever the gallery dock below is set to.
const HERO_PAINT = paintFor("orange");
const HERO_SHAPE: SpinnerShape = "square";

function Terminal({ saved }: { saved: SavedPattern[] }) {
  const { state, slots, current } = useShuffle(saved);
  const { head, entries } = useLog();
  if (!saved.length || !current) return null;
  const word = wordFor(current.name);

  return (
    // The editor window the CLI actually runs in: titlebar, tab strip, the
    // agent pane, statusline. Fixed width rather than w-fit — a window keeps
    // its shape whatever the longest log line happens to be.
    <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black font-mono text-[13px] leading-6 shadow-2xl shadow-black/60">
      <WindowChrome />

      {/* Every glyph in here is the same dim neutral ink: the pending line
          below is the only moving thing on screen, so the eye goes to it. */}
      <div className="luminous-spinners space-y-3 px-5 py-4">
        {/* Rules only, edge to edge: side borders and corners would read as a
            panel floating inside the terminal. -mx-5 cancels the card's
            padding so the lines run the full width, the way a terminal's own
            separators do. */}
        <div className="-mx-5 border-y border-black/15 dark:border-white/15 px-5 py-2">
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

      {/* div, not p: the spinner renders a div and cannot sit inside one. The
          word swaps on the same beat as the pattern and shimmers in place. */}
      <div className="flex items-center gap-2 py-1 text-black/80 dark:text-white/80">
        <div className="t-icon-swap" data-state={state}>
          {slots.map((s) => (
            <div key={s.key} className="t-icon" data-icon={s.key}>
              <SavedSpinner
                saved={s.pattern}
                size={TERMINAL_SIZE}
                shape={HERO_SHAPE}
                paint={HERO_PAINT}
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
      <div className="-mx-5 flex items-center gap-2 border-y border-black/15 dark:border-white/15 px-5 py-2">
        <span className="text-black/35 dark:text-white/35">&gt;</span>
        <span className="t-caret inline-block h-[15px] w-[7px] bg-black/60 dark:bg-white/60" />
        </div>
      </div>
    </div>
  );
}

// Both card states share one box height, so swapping the spinner for the
// terminal never resizes the cell.
const PREVIEW_H = 132;

// ── Per-spinner docs ────────────────────────────────────────────────────────
// Everything a visitor needs to put one spinner in their own app: the install
// line, a usage snippet and the frame data. Derived from the pattern, never
// written per item, so it cannot drift from what the registry ships.

type Spec = { rows: number; cols: number; frames: number[][]; interval: number };
type SpinnerDocs = { name: string; item: string | null; spec: Spec };

// Everything that ships as its own registry item. A pattern the visitor saved
// in their own browser is not in here, and installs the engine instead.
const REGISTRY_ITEMS = new Set(
  [...PREMIUM_LIBRARY, ...PRO_LIBRARY].map((d) => `spinner-${d.name}`),
);
const itemFor = (registryName: string) => {
  const item = `spinner-${registryName.toLowerCase()}`;
  return REGISTRY_ITEMS.has(item) ? item : null;
};

const pascal = (s: string) =>
  s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

const installLine = (item: string | null) =>
  item ? `npx shadcn@latest add @d2/${item}` : BASE_COMMAND;

const summary = ({ rows, cols, frames, interval }: Spec) =>
  `${rows}×${cols} grid · ${frames.length} frames · ${interval}ms step · ${frames.length * interval}ms loop`;

function usageSnippet({ item, spec }: SpinnerDocs) {
  if (item) {
    const comp = pascal(item);
    return `import { ${comp} } from "@/components/${item}";

export function Pending() {
  return <${comp} cellSize={4} gap={2} />;
}`;
  }
  // No registry item: install the engine and hand it these frames.
  return `import { PixelSpinner } from "@/components/ui/pixel-spinner";

const pattern = {
  rows: ${spec.rows},
  cols: ${spec.cols},
  interval: ${spec.interval},
  frames: ${JSON.stringify(spec.frames)},
};

export function Pending() {
  return <PixelSpinner pattern={pattern} cellSize={4} gap={2} />;
}`;
}

// Frames are the whole pattern, so they get their own block rather than being
// buried in the usage snippet: one row per frame, the way they were drawn.
const framesSnippet = (spec: Spec) =>
  `frames: [\n${spec.frames.map((f) => `  [${f.join(", ")}],`).join("\n")}\n]`;

function DocsDialog({
  docs,
  shape,
  paint,
  children,
}: {
  docs: SpinnerDocs;
  shape: SpinnerShape;
  paint: Paint;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono">{docs.name}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {summary(docs.spec)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* The pattern itself, at reading scale — the blocks below describe
              it, this is it running. */}
          {/* The dialog portals out of the gallery, so the cell styles have to
              come along with it. Shape and paint follow the toolbar; only the
              scale is the dialog's own, since cell sizes are card-sized. */}
          <div className="dark luminous-spinners flex items-center justify-center py-[72px]">
            <CssSpinner
              pattern={docs.spec}
              paint={paint}
              shape={shape}
              cellSize={7}
              gap={3}
              duration={loopMs(docs.spec, docs.spec.interval)}
            />
          </div>

          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              CLI
            </h3>
            <CodeBlock code={installLine(docs.item)} language="bash" />
            {!docs.item && (
              <p className="text-xs text-muted-foreground">
                This pattern is saved in your browser, not published, so it
                installs the engine and brings its own frames.
              </p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Usage
            </h3>
            <CodeBlock code={usageSnippet(docs)} />
          </section>

          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pattern
            </h3>
            <CodeBlock code={framesSnippet(docs.spec)} language="ts" />
            <p className="text-xs text-muted-foreground">
              Cells are indexed row-major from 0. Each frame lists the cells
              that light on that step; a lit cell then fades over the next three
              steps, which is what draws the trail.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page-level docs ────────────────────────────────────────────────────────
// The three things a visitor needs before any single spinner: what this is, how
// to draw one, and how to install the engine by hand if they would rather not
// run the CLI. Per-spinner docs live in the dialog on each card.

const ENGINE_USAGE = `import { PixelSpinner } from "@/components/ui/pixel-spinner";

// Cells are indexed row-major from 0. Each frame lists the cells that light on
// that step, and a lit cell fades over the next three. That is the trail.
const pattern = {
  rows: 4,
  cols: 4,
  interval: 130,
  frames: [
    [1, 5, 6, 7, 8, 9, 10, 14],
    [2, 4, 5, 6, 9, 10, 11, 13],
    [0, 3, 5, 6, 9, 10, 12, 15],
  ],
};

export function Pending() {
  return <PixelSpinner pattern={pattern} cellSize={4} gap={2} />;
}`;

const MANUAL_STEPS = [
  "Copy registry/default/ui/pixel-spinner.tsx into components/ui/.",
  "Copy registry/default/ui/pixel-spinner.css next to it — the component imports it directly.",
  "Render <PixelSpinner pattern={…} /> with the frames of whichever spinner you want.",
];

function Docs() {
  return (
    <section
      id="docs"
      className="dark mx-auto w-full max-w-3xl space-y-12 px-8 py-20"
    >
      <div className="space-y-4">
        <h2
          id="introduction"
          className="text-xs uppercase tracking-[0.3em] text-white/40"
        >
          Introduction
        </h2>
        <p className="text-2xl text-white">
          Pixel-grid loaders for every app.
        </p>
        <p className="text-sm leading-6 text-white/50">
          {REGISTRY_ITEMS.size} spinners, built with React, TypeScript, Tailwind
          CSS and shadcn. Every one is the same engine driven by a different
          frame table: a grid of cells, a list of which cells light on each
          step, and a four-step fade that turns the steps into a trail. Install
          one from the CLI, or install the engine and draw your own.
        </p>
        <CodeBlock code={BASE_COMMAND} language="bash" />
        <p className="text-sm text-white/40">
          Every card below carries its own install line. Open one to see it.
        </p>
      </div>

      <div className="space-y-4">
        <h2
          id="usage"
          className="text-xs uppercase tracking-[0.3em] text-white/40"
        >
          Usage
        </h2>
        <CodeBlock code={ENGINE_USAGE} />
      </div>

      <div className="space-y-4">
        <h2
          id="manual-setup"
          className="text-xs uppercase tracking-[0.3em] text-white/40"
        >
          Manual setup
        </h2>
        <ol className="space-y-3 text-sm leading-6 text-white/50">
          {MANUAL_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="shrink-0 font-mono text-white/30">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Cell({
  name,
  command,
  prompt,
  word,
  size,
  shape,
  paint,
  tag,
  log,
  docs,
  children,
}: {
  name: string;
  command: string;
  prompt: string;
  word: string;
  size: number;
  shape: SpinnerShape;
  paint: Paint;
  tag?: "pro" | "free";
  log: (typeof LOG)[number];
  docs: SpinnerDocs;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-300 ease-out hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
      {/* Two faces in one slot, cross-fading on hover via the transitions.dev
          icon-swap rules in globals.css. The whole slot is the dialog trigger,
          so on touch — where there is no hover — a tap opens the docs instead
          of leaving the swap stranded half-way. */}
      <DocsDialog docs={docs} shape={shape} paint={paint}>
        <button
          type="button"
          aria-label={`${name} documentation`}
          className="t-swap-hover w-full cursor-pointer text-left"
          style={{ height: PREVIEW_H }}
        >
          {/* Resting face: the spinner and its word, centred. */}
          <span
            className="t-swap-face flex items-center justify-center"
            data-face="rest"
            // Small spinners need less breathing room before the label.
            style={{ gap: size <= 16 ? 8 : 12 }}
          >
            {/* content-box so the padding sits outside the size square rather
                than eating into it. */}
            <span
              className="inline-flex items-center justify-center"
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
          </span>

          {/* Hover face: where the spinner actually lands — a finished tool
              call, the pending line, the parked prompt. Same markup as the hero
              window's statusline at cell scale, so the tail is the short
              "(esc · 12.4k)"; the full one does not fit 5 up. */}
          <span
            className="t-swap-face flex flex-col justify-center px-[18px] font-mono text-[11.2px] leading-[20px]"
            data-face="hover"
          >
            <span className="truncate text-black/50 dark:text-white/50">
              <span className="text-black/30 dark:text-white/30">⏺</span>{" "}
              {log.call}
            </span>
            <span className="truncate pl-3 text-black/30 dark:text-white/30">
              ⎿ {log.result}
            </span>

            <span className="flex items-center gap-1.5 py-0.5 text-black/80 dark:text-white/80">
              <span
                className="inline-flex shrink-0 items-center justify-center"
                style={{ width: size, height: size }}
              >
                {children}
              </span>
              <span className="truncate">
                <span className="t-shimmer">{word}</span>
                <span className="text-black/35 dark:text-white/35">
                  {" "}
                  (esc · 12.4k)
                </span>
              </span>
            </span>

            {/* The negative margin cancels the card padding so the rules run
                edge to edge, the way a terminal's own separators do. The caret
                is held still: the spinner is the only thing that should move
                in a cell. */}
            <span className="-mx-[18px] mt-[7px] flex items-center gap-1.5 border-y border-black/15 dark:border-white/15 px-[18px] py-[7px]">
              <span className="text-black/35 dark:text-white/35">&gt;</span>
              <span className="inline-block h-[12px] w-[6px] bg-black/60 dark:bg-white/60" />
            </span>
          </span>
        </button>
      </DocsDialog>

      <div className="flex items-center gap-2 border-t border-black/[0.06] dark:border-white/[0.06] px-[13px] py-[7px]">
        <p className="truncate font-mono text-[12px] text-black/50 dark:text-white/50">
          {name}
        </p>
        {tag && (
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.08em]",
              // Same pill either way; only the paint changes — free is the one
              // green on the page, pro takes the brand gradient on the label.
              tag === "pro" ? "bg-white/[0.07]" : "bg-emerald-500/15 text-emerald-400",
            )}
          >
            {tag === "pro" ? (
              <span
                className="bg-clip-text text-transparent"
                // The logo mark's own stops (public/d2-dark.svg, paint2), laid
                // out linearly so all five read across three letters — the
                // token's dark-mode value is a radial that would show green
                // centre and nothing else at this size.
                style={{ backgroundImage: LOGO_GRADIENT }}
              >
                pro
              </span>
            ) : (
              tag
            )}
          </span>
        )}
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
  // The gallery opens in the middle of the three: the frames read clearly at
  // 16, with 12 a click away for the terminal-line view.
  const [size, setSize] = React.useState<number>(16);
  const [shape, setShape] = React.useState<SpinnerShape>("square");
  // Orange to start, matching the hero window the visitor just scrolled past.
  const [paintId, setPaintId] = React.useState("orange");
  const paint = paintFor(paintId);

  // The control dock rides the gallery, not the page. rootMargin crops the
  // viewport to a band at the top, so the dock arrives when the gallery has
  // actually reached the top of the screen rather than the moment its first
  // pixel appears at the bottom.
  const gallery = React.useRef<HTMLElement>(null);
  const [atGallery, setAtGallery] = React.useState(false);
  React.useEffect(() => {
    const el = gallery.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setAtGallery(e.isIntersecting),
      { rootMargin: "0px 0px -85% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      {/* Hero: the window on a macOS desktop, which is where these spinners
          actually get seen. pt-7 clears the menu bar. */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-8 pt-7"
        style={{ background: WALLPAPER }}
      >
        <MenuBar />
        <Terminal saved={saved} />
        {/* A plain anchor: html already carries motion-safe:scroll-smooth, so
            the scroll and its reduced-motion opt-out come for free. */}
        <a
          href="#docs"
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[12px] text-white/60 transition hover:border-white/30 hover:text-white"
        >
          Explore spinners
          <ChevronDown className="size-3.5" />
        </a>
      </section>

      <Docs />

      {/* .dark pins the gallery; .luminous-spinners scopes every .cell /
          .spinner-grid rule in globals.css. Terminal carries its own copy of
          the scope so it follows the real theme. pt-28 clears the floating
          control dock. */}
      <section
        id="gallery"
        ref={gallery}
        className="dark luminous-spinners px-8 pb-16 pt-28"
      >
        <h2 className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
          Saved ({saved.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {saved.map((s, i) => {
            // Labels are the fancy names; the registry item still comes off the
            // saved name, so "Shuffle" ships as @d2/spinner-pro-13. A pattern
            // the visitor saved themselves has neither, and itemFor returns
            // null for it.
            const label = PRO_FANCY[s.name] ?? s.name;
            const docs: SpinnerDocs = {
              name: label,
              item: itemFor(s.name),
              spec: {
                rows: s.prefs?.gridRows || s.rows,
                cols: s.prefs?.gridCols || s.cols,
                frames: s.frames,
                interval: quick(s.prefs?.speed),
              },
            };
            return (
              <Cell
                key={s.id}
                name={label}
                command={installLine(docs.item)}
                log={LOG[i % LOG.length]}
                word={wordFor(s.name)}
                prompt={specPrompt({
                  name: label,
                  word: wordFor(s.name),
                  command: installLine(docs.item),
                  ...docs.spec,
                  size,
                  shape,
                  paint,
                })}
                size={size}
                shape={shape}
                paint={paint}
                tag={PRO_FANCY[s.name] ? "pro" : undefined}
                docs={docs}
              >
                <SavedSpinner
                  saved={s}
                  size={size}
                  shape={shape}
                  paint={paint}
                />
              </Cell>
            );
          })}
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
          {SHOWN.map((s, i) => {
            // Presets are titled by their fancy name but keep the pattern name
            // as their registry item, so docs read off the pattern, not the
            // label.
            const docs: SpinnerDocs = {
              name: FANCY[s.name] ?? s.name,
              item: itemFor(s.name),
              spec: {
                rows: s.pattern.rows ?? s.pattern.size ?? 3,
                cols: s.pattern.cols ?? s.pattern.size ?? 3,
                frames: s.pattern.frames,
                interval: quick(s.pattern.interval),
              },
            };
            return (
              <Cell
                key={s.name}
                name={docs.name}
                command={installLine(docs.item)}
                log={LOG[i % LOG.length]}
                word={wordFor(s.name)}
                prompt={specPrompt({
                  name: docs.name,
                  word: wordFor(s.name),
                  command: installLine(docs.item),
                  ...docs.spec,
                  size,
                  shape,
                  paint,
                })}
                size={size}
                shape={shape}
                paint={paint}
                tag="free"
                docs={docs}
              >
                <CssSpinner
                  pattern={s.pattern}
                  paint={paint}
                  {...metrics(size, STANDARD_COLS)}
                  shape={shape}
                  duration={loopMs(s.pattern, quick(s.pattern.interval))}
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
          show={atGallery}
        />
      </section>
    </main>
  );
}
