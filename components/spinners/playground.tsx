"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Atom,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileCode2,
  Moon,
  Palette,
  RotateCcw,
  Shuffle,
  Sun,
  X,
} from "lucide-react";
import { PixelFireSpinner } from "@/components/icons/pixel-fire-spinner";
import { useTheme } from "@/components/theme-provider";
import {
  PixelSpinner,
  type SpinnerAnimation,
  type SpinnerColor,
  type SpinnerGradient,
  type SpinnerPattern,
  type SpinnerShape,
} from "@/components/pixel-spinner";
import { SPINNER_LIBRARY } from "@/lib/spinner-patterns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESET_COLOR_CSS: Record<
  SpinnerColor,
  { from: string; to: string; glow: string }
> = {
  crimson: {
    from: "oklch(0.85 0.18 145)",
    to: "oklch(0.65 0.24 140)",
    glow: "oklch(0.75 0.22 145)",
  },
  hotpink: {
    from: "oklch(0.85 0.2 350)",
    to: "oklch(0.65 0.25 10)",
    glow: "oklch(0.72 0.24 5)",
  },
  violet: {
    from: "oklch(0.85 0.18 320)",
    to: "oklch(0.6 0.25 285)",
    glow: "oklch(0.7 0.22 305)",
  },
  blue: {
    from: "oklch(0.85 0.16 240)",
    to: "oklch(0.55 0.24 265)",
    glow: "oklch(0.7 0.2 255)",
  },
};

const PRESET_COLOR_RGB: Record<
  SpinnerColor,
  { from: [number, number, number]; to: [number, number, number]; glow: [number, number, number] }
> = {
  crimson: { from: [146, 224, 146], to: [76, 196, 76], glow: [112, 216, 112] },
  hotpink: { from: [255, 145, 170], to: [240, 70, 90], glow: [255, 70, 120] },
  violet: { from: [220, 160, 240], to: [150, 80, 230], glow: [190, 110, 240] },
  blue: { from: [150, 190, 255], to: [70, 110, 220], glow: [100, 150, 240] },
};

type ColorPreset = {
  id: string;
  label: string;
  swatch: string;
  builtin?: SpinnerColor;
  hex?: string;
};

const PRESETS: ColorPreset[] = [
  { id: "green", label: "Green", builtin: "crimson", swatch: "oklch(0.75 0.22 145)" },
  { id: "hotpink", label: "Hot Pink", builtin: "hotpink", swatch: "oklch(0.72 0.24 5)" },
  { id: "violet", label: "Violet", builtin: "violet", swatch: "oklch(0.7 0.22 305)" },
  { id: "blue", label: "Blue", builtin: "blue", swatch: "oklch(0.7 0.2 255)" },
  { id: "cyan", label: "Cyan", hex: "#22d3ee", swatch: "#22d3ee" },
  { id: "amber", label: "Amber", hex: "#f59e0b", swatch: "#f59e0b" },
  { id: "lime", label: "Lime", hex: "#84cc16", swatch: "#84cc16" },
  { id: "rose", label: "Rose", hex: "#f43f5e", swatch: "#f43f5e" },
  { id: "indigo", label: "Indigo", hex: "#6366f1", swatch: "#6366f1" },
  { id: "teal", label: "Teal", hex: "#14b8a6", swatch: "#14b8a6" },
  { id: "yellow", label: "Yellow", hex: "#facc15", swatch: "#facc15" },
  { id: "pearl", label: "Pearl", hex: "#f8fafc", swatch: "#f8fafc" },
];

type GradientDef = {
  id: string;
  label: string;
  from: string;
  to: string;
  glow: string;
};

const GRID_OPTIONS: { rows: number; cols: number }[] = [
  { rows: 3, cols: 3 },
  { rows: 4, cols: 4 },
  { rows: 5, cols: 5 },
  { rows: 6, cols: 6 },
  { rows: 7, cols: 7 },
  { rows: 8, cols: 8 },
  { rows: 2, cols: 3 },
  { rows: 2, cols: 4 },
  { rows: 2, cols: 5 },
  { rows: 2, cols: 6 },
  { rows: 3, cols: 2 },
  { rows: 4, cols: 2 },
];

const SHAPES: { id: SpinnerShape; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "circle", label: "Circle" },
  { id: "diamond", label: "Diamond" },
  { id: "triangle", label: "Triangle" },
  { id: "lines", label: "Lines" },
  { id: "line-2", label: "Line 2" },
  { id: "line-3", label: "Line 3" },
];

type Direction = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const ALL_DIRECTIONS: Direction[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
const CARDINALS: Direction[] = ["n", "e", "s", "w"];

// Patterns where rotation/flip produces no visible change (radial / 4-fold
// symmetric / inherently rotational) — direction picker is hidden.
const NON_DIRECTIONAL_PATTERNS = new Set<string>([
  "ripple-out",
  "ripple-in",
  "corners-y",
  "corners-only",
  "checkerboard",
  "plus-hollow",
  "frame-sync",
  "billboard-tiles",
  "neon-ring",
  "wink-k",
  "spiral-ccw",
  "ring-4-cw",
  "vortex-in",
  "clock-rg",
  "transmit-pulse",
  "zigzag-zl",
]);

// Patterns where the diagonal directions also produce a meaningful result.
// Default for directional patterns is cardinals only (N/S/E/W).
const DIAGONAL_FRIENDLY_PATTERNS = new Set<string>([
  "sparse-3",
]);

// Per-pattern direction overrides (takes precedence over the categories above).
const CUSTOM_DIRECTIONS: Record<string, Direction[]> = {
  "tide-roll": ["n", "e"],
  "line-v-mid": ["n", "e"],
  "sparse-3": ["ne", "se", "sw", "nw"],
};

// The direction each pattern is authored to display in. The picker highlights
// this by default and rotation is computed relative to it (so selecting the
// natural direction = no transform).
const NATURAL_DIRECTION: Record<string, Direction> = {
  "fire-rise": "n",
  "bubbles-up": "n",
  "rain-4": "s",
  "stars-fall": "s",
  "rows-alt": "s",
  "sparse-3": "se",
  "tide-roll": "e",
  "line-v-mid": "n",
};

const CARDINAL_ANGLE: Record<Direction, number | undefined> = {
  e: 0,
  s: 90,
  w: 180,
  n: 270,
  ne: undefined,
  se: undefined,
  sw: undefined,
  nw: undefined,
};

// Map (natural, selected) → the direction we pass to rotatePattern, where
// rotatePattern treats "e" as identity. For cardinal pairs we subtract angles;
// for diagonal pairs we treat "natural diagonal" as identity ("e") and map
// the other 3 diagonals to flips/180°.
function effectiveRotation(natural: Direction, selected: Direction): Direction {
  if (natural === selected) return "e";
  const naturalAngle = CARDINAL_ANGLE[natural];
  const selectedAngle = CARDINAL_ANGLE[selected];
  if (naturalAngle !== undefined && selectedAngle !== undefined) {
    const delta = (selectedAngle - naturalAngle + 360) % 360;
    if (delta === 0) return "e";
    if (delta === 90) return "s";
    if (delta === 180) return "w";
    return "n";
  }
  // Diagonal cases: pretend natural diagonal is "se" (transpose-like) so the
  // existing diagonal flips approximate sensible mirror operations.
  const diagonalDelta: Record<string, Direction> = {
    "ne→se": "nw",
    "ne→sw": "w",
    "ne→nw": "se",
    "se→ne": "nw",
    "se→sw": "se",
    "se→nw": "w",
    "sw→ne": "w",
    "sw→se": "se",
    "sw→nw": "nw",
    "nw→ne": "se",
    "nw→se": "w",
    "nw→sw": "nw",
  };
  return diagonalDelta[`${natural}→${selected}`] ?? selected;
}

function getNaturalDirection(name: string): Direction {
  return NATURAL_DIRECTION[name] ?? "e";
}

function getSupportedDirections(name: string): Direction[] {
  if (CUSTOM_DIRECTIONS[name]) return CUSTOM_DIRECTIONS[name];
  if (NON_DIRECTIONAL_PATTERNS.has(name)) return [];
  if (DIAGONAL_FRIENDLY_PATTERNS.has(name)) return ALL_DIRECTIONS;
  return CARDINALS;
}

const SHAPE_PREVIEW: Record<SpinnerShape, React.CSSProperties> = {
  square: {},
  rounded: { borderRadius: "22%" },
  circle: { borderRadius: "50%" },
  diamond: { clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" },
  triangle: { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" },
  lines: {
    backgroundColor: "transparent",
    backgroundImage:
      "repeating-linear-gradient(to bottom, var(--ls-foreground) 0 1px, transparent 1px 3px)",
  },
  "line-2": {
    backgroundColor: "transparent",
    backgroundImage:
      "repeating-linear-gradient(to bottom, var(--ls-foreground) 0 1px, transparent 1px 2px)",
  },
  "line-3": {
    backgroundColor: "transparent",
    backgroundImage:
      "repeating-linear-gradient(to bottom, var(--ls-foreground) 0 20%, transparent 20% 25%)",
  },
};

const GRADIENTS: GradientDef[] = [
  { id: "sunset", label: "Sunset", from: "#ff9966", to: "#ff5e62", glow: "#ff5e62" },
  { id: "aurora", label: "Aurora", from: "#00f5a0", to: "#00d9f5", glow: "#00d9f5" },
  { id: "ultraviolet", label: "Ultraviolet", from: "#b06ab3", to: "#4568dc", glow: "#7c5cff" },
  { id: "peach", label: "Peach", from: "#f6d365", to: "#fda085", glow: "#fda085" },
  { id: "lava", label: "Lava", from: "#ff416c", to: "#ff4b2b", glow: "#ff416c" },
  { id: "mint", label: "Mint", from: "#43e97b", to: "#38f9d7", glow: "#38f9d7" },
  { id: "ocean", label: "Ocean", from: "#2193b0", to: "#6dd5ed", glow: "#6dd5ed" },
  { id: "neon", label: "Neon", from: "#12c2e9", to: "#f64f59", glow: "#c471ed" },
  { id: "candy", label: "Candy", from: "#ff6a88", to: "#ff99ac", glow: "#ff6a88" },
  { id: "electric", label: "Electric", from: "#4facfe", to: "#00f2fe", glow: "#00f2fe" },
  { id: "dawn", label: "Dawn", from: "#fbc2eb", to: "#a6c1ee", glow: "#a6c1ee" },
  { id: "forest", label: "Forest", from: "#134e5e", to: "#33ff5c", glow: "#33ff5c" },
  { id: "royal", label: "Royal", from: "#fc466b", to: "#3f5efb", glow: "#8b5cf6" },
  { id: "bubblegum", label: "Bubblegum", from: "#ff9a9e", to: "#fad0c4", glow: "#ff9a9e" },
  { id: "cosmos", label: "Cosmos", from: "#8e2de2", to: "#4a00e0", glow: "#8e2de2" },
];

function useSpring(target: number, stiffness = 170, damping = 22) {
  const [value, setValue] = React.useState(target);
  const ref = React.useRef({ pos: target, vel: 0 });
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const tick = () => {
      const s = ref.current;
      const dt = 1 / 60;
      const force = (target - s.pos) * stiffness - s.vel * damping;
      s.vel += force * dt;
      s.pos += s.vel * dt;
      if (Math.abs(target - s.pos) < 0.01 && Math.abs(s.vel) < 0.05) {
        s.pos = target;
        s.vel = 0;
        setValue(target);
        rafRef.current = null;
        return;
      }
      setValue(s.pos);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, stiffness, damping]);

  return value;
}

export function SpinnerPlayground() {
  const [patternName, setPatternName] = React.useState("rain-4");
  const [colorMode, setColorMode] = React.useState<
    "preset" | "custom" | "gradient"
  >("gradient");
  const [color, setColor] = React.useState<SpinnerColor>("blue");
  const [presetId, setPresetId] = React.useState("blue");
  const [customColor, setCustomColor] = React.useState("#7ab7ff");
  const [gradientId, setGradientId] = React.useState(GRADIENTS[0].id);
  const [gradientFrom, setGradientFrom] = React.useState(GRADIENTS[0].from);
  const [gradientTo, setGradientTo] = React.useState(GRADIENTS[0].to);
  const [gradientGlow, setGradientGlow] = React.useState(GRADIENTS[0].glow);
  const [cellSize, setCellSize] = React.useState(6);
  const [gap, setGap] = React.useState(3);
  const [speed, setSpeed] = React.useState(200);
  const [glow, setGlow] = React.useState(1);
  const [gridRows, setGridRows] = React.useState(0);
  const [gridCols, setGridCols] = React.useState(0);
  const [shape, setShape] = React.useState<SpinnerShape>("square");
  const [animation, setAnimation] = React.useState<SpinnerAnimation>("wavy");
  const [direction, setDirection] = React.useState<Direction>("e");
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [patternQuery, setPatternQuery] = React.useState("");
  const [gradientPickerOpen, setGradientPickerOpen] = React.useState(false);
  const [gridPickerOpen, setGridPickerOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = React.useState(false);
  React.useEffect(() => setThemeMounted(true), []);
  const isDark = themeMounted && theme === "dark";

  const pattern = React.useMemo(
    () =>
      SPINNER_LIBRARY.find((s) => s.name === patternName) ?? SPINNER_LIBRARY[0],
    [patternName]
  );

  const springCell = useSpring(cellSize);
  const springGap = useSpring(gap);
  const springGlow = useSpring(glow);

  const supportedDirections = React.useMemo(
    () => getSupportedDirections(pattern.name),
    [pattern.name]
  );
  const naturalDirection = React.useMemo(
    () => getNaturalDirection(pattern.name),
    [pattern.name]
  );

  const prevPatternName = React.useRef(pattern.name);
  React.useEffect(() => {
    const patternChanged = prevPatternName.current !== pattern.name;
    prevPatternName.current = pattern.name;
    if (supportedDirections.length === 0) {
      if (direction !== "e") setDirection("e");
      return;
    }
    if (patternChanged) {
      const target = supportedDirections.includes(naturalDirection)
        ? naturalDirection
        : supportedDirections[0];
      if (direction !== target) setDirection(target);
      return;
    }
    if (!supportedDirections.includes(direction)) {
      setDirection(
        supportedDirections.includes(naturalDirection)
          ? naturalDirection
          : supportedDirections[0]
      );
    }
  }, [supportedDirections, naturalDirection, direction, pattern.name]);

  const rotatedPatternData = React.useMemo(
    () =>
      rotatePattern(
        pattern.pattern,
        effectiveRotation(naturalDirection, direction)
      ),
    [pattern, naturalDirection, direction]
  );
  const patternRows =
    rotatedPatternData.rows ?? rotatedPatternData.size ?? 3;
  const patternCols =
    rotatedPatternData.cols ?? rotatedPatternData.size ?? 3;
  const effectiveRows = gridRows || patternRows;
  const effectiveCols = gridCols || patternCols;
  const scaledPattern = React.useMemo(
    () => scalePattern(rotatedPatternData, effectiveRows, effectiveCols),
    [rotatedPatternData, effectiveRows, effectiveCols]
  );

  const activePreset = PRESETS.find((p) => p.id === presetId);
  const activeGradient: SpinnerGradient | undefined =
    colorMode === "gradient"
      ? { from: gradientFrom, to: gradientTo, glow: gradientGlow }
      : undefined;
  const activeCustom =
    colorMode === "custom"
      ? customColor
      : colorMode === "preset" && activePreset?.hex
        ? activePreset.hex
        : undefined;
  const activeColor: SpinnerColor =
    colorMode === "preset" && activePreset?.builtin
      ? activePreset.builtin
      : color;

  const handleRandom = () => {
    const p = SPINNER_LIBRARY[Math.floor(Math.random() * SPINNER_LIBRARY.length)];
    setPatternName(p.name);
  };

  const handleReset = () => {
    setPatternName("rain-4");
    setColorMode("gradient");
    setColor("blue");
    setPresetId("blue");
    setCustomColor("#7ab7ff");
    setGradientId(GRADIENTS[0].id);
    setGradientFrom(GRADIENTS[0].from);
    setGradientTo(GRADIENTS[0].to);
    setGradientGlow(GRADIENTS[0].glow);
    setCellSize(6);
    setGap(3);
    setSpeed(200);
    setGlow(1);
    setGridRows(0);
    setGridCols(0);
    setShape("square");
    setAnimation("wavy");
    setDirection("e");
  };

  const colorLine =
    colorMode === "gradient"
      ? `\n  gradient={{ from: "${gradientFrom}", to: "${gradientTo}", glow: "${gradientGlow}" }}`
      : activeCustom
        ? `\n  customColor="${activeCustom}"`
        : "";

  const reactSnippet = `<PixelSpinner
  pattern={SPINNER_LIBRARY.find(s => s.name === "${pattern.name}")!.pattern}
  color="${activeColor}"${colorLine}
  cellSize={${cellSize}}
  gap={${gap}}
  intervalOverride={${speed}}
  glow={${glow}}
  shape="${shape}"
/>`;

  const { htmlSnippet, cssSnippet } = React.useMemo(
    () =>
      buildStandaloneSnippet({
        pattern: scaledPattern,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
      }),
    [scaledPattern, activeColor, activeCustom, activeGradient, cellSize, gap, speed, glow]
  );

  const promptSnippet = React.useMemo(
    () =>
      buildAiPrompt({
        patternName: pattern.name,
        pattern: scaledPattern,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
        shape,
        animation,
      }),
    [
      pattern.name,
      scaledPattern,
      activeColor,
      activeCustom,
      activeGradient,
      cellSize,
      gap,
      speed,
      glow,
      shape,
      animation,
    ]
  );

  return (
    <section className="grid gap-2.5 rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 lg:grid-cols-[1fr_360px] lg:p-2.5">
      {/* Preview */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 backdrop-blur-sm lg:self-start">
        <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.24_5)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.18_80)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.22_145)]" />
            <span className="ml-3 font-mono text-xs text-[var(--ls-muted-foreground)]">
              {pattern.name}
            </span>
          </div>
          <button
            onClick={handleRandom}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]"
          >
            <Shuffle size={12} className="text-[#f59e0b]" />
            Random
          </button>
        </div>

        <div className="flex min-h-[180px] items-center justify-center p-6">
          <PixelSpinner
            key={`${pattern.name}-${direction}-${speed}-${effectiveRows}x${effectiveCols}`}
            pattern={scaledPattern}
            color={activeColor}
            customColor={activeCustom}
            gradient={activeGradient}
            cellSize={springCell}
            gap={springGap}
            intervalOverride={speed}
            glow={springGlow}
            shape={shape}
            animation={animation}
          />
        </div>

        <div className="border-t border-[var(--ls-border)]">
          <CodePanel
            label="AI Prompt"
            icon={<PixelFireSpinner />}
            code={promptSnippet}
            copyLabel="Copy Prompt"
            description="Paste into ChatGPT, Claude, or any AI to recreate this spinner."
            hidePreview
          />
          <div className="grid grid-cols-1 border-t border-[var(--ls-border)] md:grid-cols-2">
            <CodePanel
              label="HTML"
              icon={<FileCode2 size={14} className="text-[#e34c26]" />}
              code={htmlSnippet}
              copyLabel="Copy HTML"
              description="Drop the markup straight into any page."
              hidePreview
            />
            <CodePanel
              label="CSS"
              icon={<Palette size={14} className="text-[#BF83FB]" />}
              code={cssSnippet}
              copyLabel="Copy CSS"
              description="Pair with the HTML to render the spinner."
              hidePreview
              className="border-t border-[var(--ls-border)] md:border-l md:border-t-0"
            />
          </div>
          {/* React panel temporarily hidden — re-enable when React snippet is ready.
          <CodePanel
            label="React"
            icon={<Atom size={14} className="text-[#61dafb]" />}
            code={reactSnippet}
            className="border-t border-[var(--ls-border)] md:border-l md:border-t-0"
          />
          */}
        </div>

      </div>

      {/* Controls */}
      <aside className="space-y-5 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
            Controls
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              {isDark ? <Sun size={11} /> : <Moon size={11} />}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 py-1 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        </div>

        <ControlGroup label="Pattern">
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 font-mono text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <PixelSpinner
                      pattern={pattern.pattern}
                      color={activeColor}
                      customColor={activeCustom}
                      gradient={activeGradient}
                      cellSize={3}
                      gap={1}
                    />
                  </span>
                  {pattern.name}
                </span>
                <ChevronDown size={14} className="opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="luminous-spinners w-[min(560px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-0 text-[var(--ls-foreground)]"
            >
              <div className="border-b border-[var(--ls-border)] p-2">
                <div className="relative">
                  <input
                    value={patternQuery}
                    onChange={(e) => setPatternQuery(e.target.value)}
                    placeholder="Search patterns…"
                    autoFocus
                    className="h-8 w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 pr-8 font-mono text-xs text-[var(--ls-foreground)] placeholder:text-[var(--ls-muted-foreground)] outline-none focus:border-white/40"
                  />
                  {patternQuery && (
                    <button
                      type="button"
                      onClick={() => setPatternQuery("")}
                      aria-label="Clear search"
                      className="absolute right-1.5 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[min(60vh,380px)] overflow-y-auto p-3">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
                  {SPINNER_LIBRARY.filter((s) =>
                    s.name.toLowerCase().includes(patternQuery.toLowerCase())
                  ).map((s) => {
                    const active = s.name === pattern.name;
                    return (
                      <button
                        key={s.name}
                        onClick={() => {
                          setPatternName(s.name);
                          setPickerOpen(false);
                        }}
                        className={
                          "group flex flex-col items-center justify-center rounded-lg border p-2 transition-colors " +
                          (active
                            ? "border-white/40 bg-[var(--ls-border)]/40"
                            : "border-[var(--ls-border)] bg-[var(--ls-card)]/60 hover:bg-[var(--ls-border)]/30")
                        }
                      >
                        <div className="flex h-10 items-center justify-center">
                          <PixelSpinner
                            pattern={s.pattern}
                            color={s.color}
                            cellSize={s.pattern.size === 4 ? 5 : 6}
                            gap={1}
                          />
                        </div>
                        <p className="mt-1.5 truncate font-mono text-[9px] text-[var(--ls-muted-foreground)]">
                          {s.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ControlGroup>

        <ControlGroup label="Color">
          <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
            {(["gradient", "preset", "custom"] as const).map((m) => {
              const active = colorMode === m;
              return (
                <button
                  key={m}
                  onClick={() => setColorMode(m)}
                  className={
                    "flex-1 rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors " +
                    (active
                      ? "bg-black/10 text-[var(--ls-foreground)] dark:bg-white/10"
                      : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>

          {colorMode === "preset" && (
            <div className="mt-3 grid grid-cols-6 gap-2">
              {PRESETS.map((p) => {
                const active = presetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPresetId(p.id);
                      if (p.builtin) setColor(p.builtin);
                    }}
                    aria-label={p.label}
                    title={p.label}
                    className={
                      "h-8 w-8 rounded-md transition-transform " +
                      (active
                        ? "scale-110 ring-2 ring-[var(--ls-foreground)] ring-offset-2 ring-offset-[var(--ls-card)]"
                        : "opacity-80 hover:opacity-100")
                    }
                    style={{ background: p.swatch }}
                  />
                );
              })}
            </div>
          )}

          {colorMode === "custom" && (
            <div className="mt-3 flex items-center gap-2">
              <label
                className="relative h-8 w-8 shrink-0 cursor-pointer rounded-full border-2 border-white/60"
                style={{ background: customColor }}
              >
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
              <input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                spellCheck={false}
                className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
              />
            </div>
          )}

          {colorMode === "gradient" && (
            <div className="mt-3 space-y-3">
              <Popover
                open={gradientPickerOpen}
                onOpenChange={setGradientPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-4 w-6 rounded"
                        style={{
                          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                        }}
                      />
                      <span className="font-mono">
                        {GRADIENTS.find((g) => g.id === gradientId)?.label ??
                          "Custom"}
                      </span>
                    </span>
                    <ChevronDown size={14} className="opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="luminous-spinners w-[min(360px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
                >
                  <div className="grid max-h-[360px] grid-cols-3 gap-2 overflow-y-auto">
                    {GRADIENTS.map((g) => {
                      const active = gradientId === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            setGradientId(g.id);
                            setGradientFrom(g.from);
                            setGradientTo(g.to);
                            setGradientGlow(g.glow);
                            setGradientPickerOpen(false);
                          }}
                          className={
                            "group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors " +
                            (active
                              ? "border-white/40"
                              : "border-[var(--ls-border)] hover:border-white/20")
                          }
                        >
                          <span
                            className="block h-6 w-full rounded-md"
                            style={{
                              background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                              boxShadow: `0 0 12px ${g.glow}80`,
                            }}
                          />
                          <span className="text-[10px] text-[var(--ls-muted-foreground)]">
                            {g.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="grid grid-cols-3 gap-2">
                <GradientStop
                  label="From"
                  value={gradientFrom}
                  onChange={(v) => {
                    setGradientFrom(v);
                    setGradientId("");
                  }}
                />
                <GradientStop
                  label="To"
                  value={gradientTo}
                  onChange={(v) => {
                    setGradientTo(v);
                    setGradientId("");
                  }}
                />
                <GradientStop
                  label="Glow"
                  value={gradientGlow}
                  onChange={(v) => {
                    setGradientGlow(v);
                    setGradientId("");
                  }}
                />
              </div>
            </div>
          )}
        </ControlGroup>

        <ControlGroup label="Animation Style">
          <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
            {(["pixels", "wavy"] as const).map((a) => {
              const active = animation === a;
              const disabled = a === "pixels" && shape === "lines";
              return (
                <button
                  key={a}
                  onClick={() => {
                    if (disabled) return;
                    setAnimation(a);
                  }}
                  disabled={disabled}
                  className={
                    "flex-1 rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors " +
                    (disabled
                      ? "cursor-not-allowed text-[var(--ls-muted-foreground)]/40"
                      : active
                        ? "bg-black/10 text-[var(--ls-foreground)] dark:bg-white/10"
                        : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
                  }
                >
                  {a}
                </button>
              );
            })}
          </div>
        </ControlGroup>

        {supportedDirections.length > 0 && (
          <ControlGroup label="Direction">
            <DirectionPad
              value={direction}
              supported={supportedDirections}
              onChange={setDirection}
            />
          </ControlGroup>
        )}


        <ControlGroup label="Shape">
          <div className="grid grid-cols-8 gap-1 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-1">
            {SHAPES.map((s) => {
              const active = shape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setShape(s.id);
                    if (s.id === "lines") setAnimation("wavy");
                  }}
                  title={s.label}
                  aria-label={s.label}
                  className={
                    "flex aspect-square items-center justify-center rounded transition-colors " +
                    (active
                      ? "bg-black/10 dark:bg-white/10"
                      : "hover:bg-[var(--ls-border)]/40")
                  }
                >
                  <span
                    className={
                      "h-4 w-4 " +
                      (active
                        ? "bg-[var(--ls-foreground)]"
                        : "bg-[var(--ls-muted-foreground)]")
                    }
                    style={SHAPE_PREVIEW[s.id] as any} 
                  />
                </button>
              );
            })}
          </div>
        </ControlGroup>

        <ControlGroup label="Grid">
          <Popover open={gridPickerOpen} onOpenChange={setGridPickerOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 font-mono text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                <span>
                  {effectiveRows}×{effectiveCols}
                </span>
                <ChevronDown size={14} className="opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="luminous-spinners w-[min(300px,calc(100vw-2rem))] space-y-3 border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
            >
              <div className="grid grid-cols-4 gap-1.5">
                {GRID_OPTIONS.map((g) => {
                  const active =
                    effectiveRows === g.rows && effectiveCols === g.cols;
                  return (
                    <button
                      key={`${g.rows}-${g.cols}`}
                      onClick={() => {
                        setGridRows(g.rows);
                        setGridCols(g.cols);
                        setGridPickerOpen(false);
                      }}
                      className={
                        "rounded-md border px-2 py-1.5 font-mono text-[11px] transition-colors " +
                        (active
                          ? "border-white/40 bg-[var(--ls-border)]/40 text-[var(--ls-foreground)]"
                          : "border-[var(--ls-border)] text-[var(--ls-muted-foreground)] hover:border-white/20 hover:text-[var(--ls-foreground)]")
                      }
                    >
                      {g.rows}×{g.cols}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 border-t border-[var(--ls-border)] pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                  Custom
                </p>
                <div className="flex items-center gap-2">
                  <GridNumberInput
                    label="Rows"
                    value={effectiveRows}
                    onChange={(v) => setGridRows(v)}
                  />
                  <span className="text-[var(--ls-muted-foreground)]">×</span>
                  <GridNumberInput
                    label="Cols"
                    value={effectiveCols}
                    onChange={(v) => setGridCols(v)}
                  />
                  <button
                    onClick={() => setGridPickerOpen(false)}
                    className="ml-auto rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ControlGroup>
        <SliderControl
          label="Cell size"
          value={cellSize}
          min={1}
          max={48}
          step={1}
          unit="px"
          onChange={setCellSize}
        />
        <SliderControl
          label="Gap"
          value={gap}
          min={0}
          max={12}
          step={1}
          unit="px"
          onChange={setGap}
        />
        <SliderControl
          label="Animation Speed"
          value={speed}
          min={30}
          max={2000}
          sliderMax={250}
          step={10}
          unit="ms"
          onChange={setSpeed}
          endLabels={["Fast", "Slow"]}
          editable
        />
        <SliderControl
          label="Glow"
          value={glow}
          min={0}
          max={5}
          step={0.25}
          unit="x"
          onChange={setGlow}
        />

        <div className="pt-2">
          <button
            onClick={async () => {
              if (exporting) return;
              setExporting(true);
              try {
                await exportGif({
                  pattern: scaledPattern,
                  color,
                  customColor: activeCustom,
                  gradient: activeGradient,
                  cellSize,
                  gap,
                  speed,
                  glow,
                  filename: pattern.name,
                  theme: isDark ? "dark" : "light",
                });
              } catch (e) {
                console.error(e);
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ls-foreground)]/20 bg-[var(--ls-foreground)]/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-foreground)]/10 disabled:opacity-60"
          >
            <Download size={13} />
            {exporting ? "Encoding…" : "Export GIF"}
          </button>
        </div>
      </aside>
    </section>
  );
}

function CodePanel({
  label,
  code,
  className,
  icon,
  trailingIcon,
  copyLabel,
  description,
  wrap,
  hidePreview,
}: {
  label: string;
  code: string;
  className?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  copyLabel?: string;
  description?: string;
  wrap?: boolean;
  hidePreview?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      className={
        "flex min-w-0 flex-col bg-[var(--ls-code-bg)]/60 p-4 " + (className ?? "")
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--ls-foreground)]">
            {icon}
            {label}
            {trailingIcon}
          </span>
          {description && (
            <p className="mt-1 text-[11px] text-[var(--ls-muted-foreground)]">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : copyLabel ?? "Copy"}
        </button>
      </div>
      {!hidePreview && (
        <pre
          className={
            "max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-[var(--ls-muted-foreground)] " +
            (wrap ? "whitespace-pre-wrap break-words" : "")
          }
        >
          {code}
        </pre>
      )}
    </div>
  );
}

function GridNumberInput({
  label,
  value,
  onChange,
  min = 1,
  max = 24,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, Math.round(n)));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
  };
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className="w-12 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-1 text-center font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  );
}

function GradientStop({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] uppercase tracking-wider text-[var(--ls-muted-foreground)]">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <label
          className="relative h-6 w-6 shrink-0 cursor-pointer rounded-md border border-white/30"
          style={{ background: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-1 font-mono text-[10px] text-[var(--ls-foreground)] outline-none focus:border-white/40"
        />
      </div>
    </div>
  );
}

function DirectionPad({
  value,
  supported,
  onChange,
}: {
  value: Direction;
  supported: Direction[];
  onChange: (d: Direction) => void;
}) {
  const cells: { id: Direction; icon: React.ReactNode; label: string }[] = [
    { id: "n", icon: <ArrowUp size={14} />, label: "Up" },
    { id: "ne", icon: <ArrowUpRight size={14} />, label: "Up-right" },
    { id: "e", icon: <ArrowRight size={14} />, label: "Right" },
    { id: "se", icon: <ArrowDownRight size={14} />, label: "Down-right" },
    { id: "s", icon: <ArrowDown size={14} />, label: "Down" },
    { id: "sw", icon: <ArrowDownLeft size={14} />, label: "Down-left" },
    { id: "w", icon: <ArrowLeft size={14} />, label: "Left" },
    { id: "nw", icon: <ArrowUpLeft size={14} />, label: "Up-left" },
  ];
  const supportedSet = new Set(supported);
  return (
    <div className="flex flex-wrap gap-1">
      {cells
        .filter((c) => supportedSet.has(c.id))
        .map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              aria-label={c.label}
              title={c.label}
              className={
                "flex h-7 w-7 items-center justify-center rounded-md border transition-colors " +
                (active
                  ? "border-white/40 bg-[var(--ls-border)]/50 text-[var(--ls-foreground)]"
                  : "border-[var(--ls-border)] bg-[var(--ls-card)]/60 text-[var(--ls-muted-foreground)] hover:border-white/20 hover:text-[var(--ls-foreground)]")
              }
            >
              {c.icon}
            </button>
          );
        })}
    </div>
  );
}

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  endLabels,
  editable,
  sliderMax,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  endLabels?: [string, string];
  editable?: boolean;
  sliderMax?: number;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
          {label}
        </p>
        {editable ? (
          <div className="flex items-center gap-0.5 rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)] focus-within:border-white/40">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="w-12 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-[var(--ls-muted-foreground)]">{unit}</span>
          </div>
        ) : (
          <span className="font-mono text-xs text-[var(--ls-foreground)]">
            {value}
            {unit}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={sliderMax ?? max}
        step={step}
        value={Math.min(sliderMax ?? max, value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ls-border)] accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
      />
      {endLabels && (
        <div className="flex justify-between text-[10px] text-[var(--ls-muted-foreground)]">
          <span>{endLabels[0]}</span>
          <span>{endLabels[1]}</span>
        </div>
      )}
    </div>
  );
}

/* ============ Pattern scaling ============ */

function rotatePattern(p: SpinnerPattern, direction: Direction): SpinnerPattern {
  if (direction === "e") return p;
  const rows = p.rows ?? p.size ?? 3;
  const cols = p.cols ?? p.size ?? 3;
  let newRows = rows;
  let newCols = cols;
  let mapIdx: (r: number, c: number) => number;
  switch (direction) {
    case "s":
      // 90° CW
      newRows = cols;
      newCols = rows;
      mapIdx = (r, c) => c * newCols + (rows - 1 - r);
      break;
    case "w":
      // 180°
      mapIdx = (r, c) => (rows - 1 - r) * cols + (cols - 1 - c);
      break;
    case "n":
      // 90° CCW
      newRows = cols;
      newCols = rows;
      mapIdx = (r, c) => (cols - 1 - c) * newCols + r;
      break;
    case "ne":
      // horizontal flip (mirror across vertical axis)
      mapIdx = (r, c) => r * cols + (cols - 1 - c);
      break;
    case "nw":
      // vertical flip (mirror across horizontal axis)
      mapIdx = (r, c) => (rows - 1 - r) * cols + c;
      break;
    case "se":
      // transpose (flip across main diagonal)
      newRows = cols;
      newCols = rows;
      mapIdx = (r, c) => c * newCols + r;
      break;
    case "sw":
      // anti-transpose (flip across anti-diagonal)
      newRows = cols;
      newCols = rows;
      mapIdx = (r, c) => (cols - 1 - c) * newCols + (rows - 1 - r);
      break;
    default:
      return p;
  }
  const newFrames = p.frames.map((frame) =>
    frame.map((idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      return mapIdx(r, c);
    })
  );
  return { ...p, rows: newRows, cols: newCols, size: undefined, frames: newFrames };
}

function scalePattern(
  p: SpinnerPattern,
  targetRows: number,
  targetCols: number
): SpinnerPattern {
  const srcRows = p.rows ?? p.size ?? 3;
  const srcCols = p.cols ?? p.size ?? 3;
  if (targetRows === srcRows && targetCols === srcCols) return p;
  const newFrames = p.frames.map((frame) => {
    const srcSet = new Set(frame);
    const cells: number[] = [];
    for (let r = 0; r < targetRows; r++) {
      for (let c = 0; c < targetCols; c++) {
        const sr = Math.floor((r * srcRows) / targetRows);
        const sc = Math.floor((c * srcCols) / targetCols);
        if (srcSet.has(sr * srcCols + sc)) {
          cells.push(r * targetCols + c);
        }
      }
    }
    return cells;
  });
  return { ...p, rows: targetRows, cols: targetCols, size: undefined, frames: newFrames };
}

/* ============ Standalone HTML + CSS snippet ============ */

function buildCellOpacityGrid(pattern: SpinnerPattern) {
  const cols = pattern.cols ?? pattern.size ?? 3;
  const rows = pattern.rows ?? pattern.size ?? 3;
  const F = pattern.frames.length;
  const total = rows * cols;
  const trail = [1, 0.5, 0.25, 0.15];
  const grid: number[][] = Array.from({ length: total }, () =>
    new Array(F).fill(0)
  );
  for (let f = 0; f < F; f++) {
    for (let t = 0; t < trail.length; t++) {
      const src = (f - t + F) % F;
      const cells = pattern.frames[src] ?? [];
      for (const c of cells) {
        if (grid[c][f] === 0) grid[c][f] = trail[t];
      }
    }
  }
  return { grid, rows, cols, F, total };
}

function buildStandaloneSnippet(opts: {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow?: number;
}) {
  const {
    pattern,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow = 1,
  } = opts;
  const { grid, cols, F, total } = buildCellOpacityGrid(pattern);
  const duration = F * speed;

  let gradientCss: string;
  let glowColor: string;
  if (gradient) {
    gradientCss = `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
    glowColor = gradient.glow;
  } else if (customColor) {
    gradientCss = `linear-gradient(135deg, color-mix(in oklab, ${customColor} 80%, white), color-mix(in oklab, ${customColor} 85%, black))`;
    glowColor = customColor;
  } else {
    const p = PRESET_COLOR_CSS[color];
    gradientCss = `linear-gradient(135deg, ${p.from}, ${p.to})`;
    glowColor = p.glow;
  }

  let html = `<div class="pixel-spinner">\n`;
  for (let i = 0; i < total; i++) {
    html += `  <div class="cell cell-${i}"></div>\n`;
  }
  html += `</div>`;

  const step = 100 / F;
  let keyframes = "";
  const cellNameRules: string[] = [];
  for (let i = 0; i < total; i++) {
    const fo = grid[i];
    if (fo.every((o) => o === 0)) continue;
    cellNameRules.push(`.pixel-spinner .cell-${i} { animation-name: ps-${i}; }`);
    let k = `@keyframes ps-${i} {\n`;
    for (let f = 0; f < F; f++) {
      const from = (f * step).toFixed(2);
      const to = Math.max(0, (f + 1) * step - 0.01).toFixed(2);
      k += `  ${from}%, ${to}% { opacity: ${fo[f]}; }\n`;
    }
    k += `}\n`;
    keyframes += k;
  }

  const glow1 = Math.round(cellSize * 0.6 * glow);
  const glow2 = Math.round(cellSize * 1.6 * glow);
  const glow3 = Math.round(cellSize * 3.2 * glow);

  const css = `.pixel-spinner {
  display: inline-grid;
  grid-template-columns: repeat(${cols}, ${cellSize}px);
  gap: ${gap}px;
}
.pixel-spinner .cell {
  width: ${cellSize}px;
  height: ${cellSize}px;
  background: ${gradientCss};
  box-shadow:
    0 0 ${glow1}px ${glowColor},
    0 0 ${glow2}px ${glowColor}80,
    0 0 ${glow3}px ${glowColor}55;
  opacity: 0;
  animation-duration: ${duration}ms;
  animation-iteration-count: infinite;
  animation-timing-function: steps(1, end);
}
${cellNameRules.join("\n")}

${keyframes}`;

  return { htmlSnippet: html, cssSnippet: css };
}

/* ============ AI prompt builder ============ */

function describeShape(shape: SpinnerShape): string {
  switch (shape) {
    case "square":
      return "sharp square";
    case "rounded":
      return "rounded square (border-radius ~22%)";
    case "circle":
      return "circle (border-radius 50%)";
    case "diamond":
      return "diamond (clip-path rotated square)";
    case "triangle":
      return "triangle (clip-path triangle)";
    case "lines":
      return "thin horizontal scan-lines";
    case "line-2":
      return "tight horizontal line pattern";
    case "line-3":
      return "wide horizontal line pattern";
    default:
      return shape;
  }
}

function describeColor(opts: {
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
}): { line: string; glowColor: string } {
  if (opts.gradient) {
    return {
      line: `Diagonal linear gradient (135deg) from ${opts.gradient.from} to ${opts.gradient.to}`,
      glowColor: opts.gradient.glow,
    };
  }
  if (opts.customColor) {
    return {
      line: `Solid ${opts.customColor} (with a subtle 135deg gradient: lightened → darkened tint)`,
      glowColor: opts.customColor,
    };
  }
  const presetMap: Record<SpinnerColor, { from: string; to: string; glow: string }> = {
    crimson: { from: "soft green", to: "deep green", glow: "green" },
    hotpink: { from: "soft pink", to: "deep red", glow: "hot pink" },
    violet: { from: "soft violet", to: "deep purple", glow: "violet" },
    blue: { from: "soft blue", to: "deep blue", glow: "blue" },
  };
  const p = presetMap[opts.color];
  return {
    line: `Diagonal linear gradient (135deg) from ${p.from} to ${p.to}`,
    glowColor: p.glow,
  };
}

function buildAiPrompt(opts: {
  patternName: string;
  pattern: SpinnerPattern;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow: number;
  shape: SpinnerShape;
  animation: SpinnerAnimation;
}): string {
  const {
    patternName,
    pattern,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow,
    shape,
    animation,
  } = opts;

  const rows = pattern.rows ?? pattern.size ?? 3;
  const cols = pattern.cols ?? pattern.size ?? 3;
  const F = pattern.frames.length;
  const total = rows * cols;
  const duration = F * speed;
  const { line: colorLine, glowColor } = describeColor({ color, customColor, gradient });
  const frameLines = pattern.frames
    .map((f, i) => `  Frame ${i}: [${f.join(", ")}]`)
    .join("\n");

  return `I want a CSS-only loading spinner. Please generate clean, drop-in HTML and CSS for the following design:

PATTERN
- Name: "${patternName}"
- Grid: ${rows} rows × ${cols} columns (${total} cells, indexed 0–${total - 1} in row-major order, left-to-right, top-to-bottom)
- Total animation frames: ${F}
- Frame duration: ${speed}ms (full loop ${duration}ms)
- Animation style: ${animation === "wavy" ? "wavy / smooth easing between frames" : "discrete pixel stepping"}

CELLS
- Cell shape: ${describeShape(shape)}
- Cell size: ${cellSize}px × ${cellSize}px
- Gap between cells: ${gap}px
- Color: ${colorLine}
- Glow: multi-layer box-shadow halo at ${glow}× intensity, color ${glowColor}
  • Inner: ~${Math.round(cellSize * 0.6 * glow)}px radius (full alpha)
  • Mid:   ~${Math.round(cellSize * 1.6 * glow)}px radius (~50% alpha)
  • Outer: ~${Math.round(cellSize * 3.2 * glow)}px radius (~33% alpha)

MOTION TRAIL
Each cell, when activated on a frame, fades out over the next 3 frames so there is a 4-step opacity trail:
  step 0 (active): 1.0
  step 1: 0.5
  step 2: 0.25
  step 3: 0.15

FRAME DATA (cell indices that activate at the start of each frame)
${frameLines}

REQUIREMENTS
- Pure HTML + CSS only (no JavaScript, no images, no SVG)
- Use display: inline-grid with grid-template-columns: repeat(${cols}, ${cellSize}px)
- Each lit cell gets its own @keyframes rule
- Use animation-timing-function: steps(1, end) so opacity changes are crisp at frame boundaries
- Use linear-gradient(135deg, ...) for the cell fill
- Stack three box-shadow layers for the glow halo
- Loop infinitely (animation-iteration-count: infinite)
- Expose cell size, gap, color, and speed as CSS custom properties (e.g., --cell, --gap, --duration) so it's easy to customize

OUTPUT
Return one self-contained HTML snippet and one CSS block that I can paste directly into a project. Add a one-line usage comment at the top of the CSS.`;
}

/* ============ GIF export ============ */

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m.split("").map((c) => c + c).join("")
      : m.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function parseColorToRgb(c: string): [number, number, number] {
  if (c.startsWith("#")) return hexToRgb(c);
  if (typeof document !== "undefined") {
    const el = document.createElement("span");
    el.style.color = c;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = computed.match(/\d+(\.\d+)?/g);
    if (m && m.length >= 3) {
      return [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])];
    }
  }
  return [255, 255, 255];
}

async function exportGif(opts: {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow?: number;
  filename: string;
  transparentBg?: boolean;
  theme?: "light" | "dark";
}) {
  const {
    pattern,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow = 1,
    filename,
    transparentBg,
    theme = "dark",
  } = opts;
  const isLight = theme === "light";
  const bgColor = isLight ? "#ffffff" : "#141824";
  const emptyCellFill = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)";
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  const cols = pattern.cols ?? pattern.size ?? 3;
  const rows = pattern.rows ?? pattern.size ?? 3;
  const F = pattern.frames.length;
  const { grid } = buildCellOpacityGrid(pattern);

  const padding = Math.max(16, Math.round(cellSize * 2));
  const innerW = cols * cellSize + (cols - 1) * gap;
  const innerH = rows * cellSize + (rows - 1) * gap;
  const W = innerW + padding * 2;
  const H = innerH + padding * 2;

  let fromRgb: [number, number, number];
  let toRgb: [number, number, number];
  let glowRgb: [number, number, number];
  if (gradient) {
    fromRgb = parseColorToRgb(gradient.from);
    toRgb = parseColorToRgb(gradient.to);
    glowRgb = parseColorToRgb(gradient.glow);
  } else if (customColor) {
    const base = parseColorToRgb(customColor);
    fromRgb = base.map((v) => Math.min(255, Math.round(v * 0.8 + 255 * 0.2))) as [number, number, number];
    toRgb = base.map((v) => Math.round(v * 0.85)) as [number, number, number];
    glowRgb = base;
  } else {
    const p = PRESET_COLOR_RGB[color];
    fromRgb = p.from;
    toRgb = p.to;
    glowRgb = p.glow;
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no ctx");

  const encoder = GIFEncoder();

  for (let f = 0; f < F; f++) {
    if (transparentBg) {
      ctx.clearRect(0, 0, W, H);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
    }

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const idx = cy * cols + cx;
        const op = grid[idx][f];
        const x = padding + cx * (cellSize + gap);
        const y = padding + cy * (cellSize + gap);

        if (op > 0) {
          // Glow layers — scale radius and alpha by the glow slider so
          // exports respect the user's chosen glow intensity (0 = none).
          if (glow > 0) {
            for (const [baseRadius, baseAlpha] of [
              [cellSize * 0.8, 0.6],
              [cellSize * 1.8, 0.35],
              [cellSize * 3.2, 0.18],
            ] as const) {
              const radius = baseRadius * glow;
              const alpha = Math.min(1, baseAlpha * glow);
              const g = ctx.createRadialGradient(
                x + cellSize / 2,
                y + cellSize / 2,
                0,
                x + cellSize / 2,
                y + cellSize / 2,
                radius
              );
              g.addColorStop(
                0,
                `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, ${alpha * op})`
              );
              g.addColorStop(1, `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, 0)`);
              ctx.fillStyle = g;
              ctx.fillRect(
                x - radius,
                y - radius,
                cellSize + radius * 2,
                cellSize + radius * 2
              );
            }
          }

          // Cell fill (linear gradient)
          const lg = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
          lg.addColorStop(
            0,
            `rgba(${fromRgb[0]}, ${fromRgb[1]}, ${fromRgb[2]}, ${op})`
          );
          lg.addColorStop(
            1,
            `rgba(${toRgb[0]}, ${toRgb[1]}, ${toRgb[2]}, ${op})`
          );
          ctx.fillStyle = lg;
          ctx.fillRect(x, y, cellSize, cellSize);
        } else if (!transparentBg) {
          ctx.fillStyle = emptyCellFill;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    const imageData = ctx.getImageData(0, 0, W, H);
    if (transparentBg) {
      const palette = quantize(imageData.data, 256, {
        format: "rgba4444",
      });
      const index = applyPalette(imageData.data, palette, "rgba4444");
      encoder.writeFrame(index, W, H, {
        palette,
        delay: speed,
        transparent: true,
        transparentIndex: 0,
      });
    } else {
      const palette = quantize(imageData.data, 256);
      const index = applyPalette(imageData.data, palette);
      encoder.writeFrame(index, W, H, { palette, delay: speed });
    }
  }

  encoder.finish();
  const bytes = encoder.bytes();
  const buf = new Uint8Array(bytes.length);
  buf.set(bytes);
  const blob = new Blob([buf.buffer], { type: "image/gif" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.gif`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
