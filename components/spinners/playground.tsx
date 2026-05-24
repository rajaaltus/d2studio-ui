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
  Bolt,
  Check,
  Braces,
  ChevronDown,
  Code,
  Cog,
  Copy,
  Download,
  Eraser,
  Eye,
  EyeOff,
  ImageIcon,
  Paintbrush,
  Loader2,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  PackagePlus,
  Pause,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Shuffle,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring as useMotionSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { PixelFireSpinner } from "@/components/icons/pixel-fire-spinner";
import { PixelControlsSpinner } from "@/components/icons/pixel-controls-spinner";
import { useTheme } from "@/components/theme-provider";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import {
  PixelSpinner,
  type SpinnerAnimation,
  type SpinnerColor,
  type SpinnerGradient,
  type SpinnerPattern,
  type SpinnerShape,
} from "@/components/pixel-spinner";
import { SPINNER_LIBRARY, type SpinnerDef } from "@/lib/spinner-patterns";

const CUSTOM_PATTERN_NAME = "custom";
const CUSTOM_EDITOR_SIZE = 3;
const SAVED_PATTERNS_STORAGE_KEY = "pixel-spinner:saved-patterns:v1";
const RECENTLY_VIEWED_STORAGE_KEY = "pixel-spinner:recently-viewed:v1";
const CUSTOM_COLORS_STORAGE_KEY = "pixel-spinner:custom-colors:v1";
const CUSTOM_COLOR_SLOTS = 10;
const RECENTLY_VIEWED_MAX = 5;
const SAVED_PATTERN_PREFIX = "saved:";

const DEFAULT_CUSTOM_FRAMES: number[][] = [
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [3, 4, 5],
];

type SavedPrefs = {
  colorMode: "preset" | "custom" | "gradient";
  color: SpinnerColor;
  presetId: string;
  customColor: string;
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
  gradientGlow: string;
  cellSize: number;
  gap: number;
  speed: number;
  glow: number;
  gridRows: number;
  gridCols: number;
  shape: SpinnerShape;
  animation: SpinnerAnimation;
  popOnPeak: boolean;
  popStrength: number;
  popDuration: number;
  direction: Direction;
};

type SavedPattern = {
  id: string;
  name: string;
  rows: number;
  cols: number;
  frames: number[][];
  createdAt: number;
  prefs?: SavedPrefs;
};

function cloneFrames(frames: number[][]): number[][] {
  return frames.map((f) => [...f]);
}

function loadEditorStateFromPattern(
  name: string,
  saved: SavedPattern[]
): { frames: number[][]; rows: number; cols: number } {
  if (name === CUSTOM_PATTERN_NAME) {
    return {
      frames: cloneFrames(DEFAULT_CUSTOM_FRAMES),
      rows: CUSTOM_EDITOR_SIZE,
      cols: CUSTOM_EDITOR_SIZE,
    };
  }
  if (name.startsWith(SAVED_PATTERN_PREFIX)) {
    const sp = saved.find((s) => `${SAVED_PATTERN_PREFIX}${s.id}` === name);
    if (sp) {
      return { frames: cloneFrames(sp.frames), rows: sp.rows, cols: sp.cols };
    }
  }
  const def = SPINNER_LIBRARY.find((s) => s.name === name);
  if (def) {
    return {
      frames: cloneFrames(def.pattern.frames),
      rows: def.pattern.rows ?? def.pattern.size ?? CUSTOM_EDITOR_SIZE,
      cols: def.pattern.cols ?? def.pattern.size ?? CUSTOM_EDITOR_SIZE,
    };
  }
  return {
    frames: cloneFrames(DEFAULT_CUSTOM_FRAMES),
    rows: CUSTOM_EDITOR_SIZE,
    cols: CUSTOM_EDITOR_SIZE,
  };
}
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { exportSpinnerToGif } from "@/lib/spinner-gif-export";

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
  { id: "fuchsia", label: "Fuchsia", hex: "#e879f9", swatch: "#e879f9" },
  { id: "orange", label: "Orange", hex: "#f97316", swatch: "#f97316" },
  { id: "emerald", label: "Emerald", hex: "#10b981", swatch: "#10b981" },
  { id: "sky", label: "Sky", hex: "#38bdf8", swatch: "#38bdf8" },
  { id: "coral", label: "Coral", hex: "#fb7185", swatch: "#fb7185" },
  { id: "mint", label: "Mint", hex: "#5eead4", swatch: "#5eead4" },
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
  CUSTOM_PATTERN_NAME,
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

const DEFAULT_GRADIENT =
  GRADIENTS.find((g) => g.id === "electric") ?? GRADIENTS[0];

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
  const [gradientId, setGradientId] = React.useState(DEFAULT_GRADIENT.id);
  const [gradientFrom, setGradientFrom] = React.useState(DEFAULT_GRADIENT.from);
  const [gradientTo, setGradientTo] = React.useState(DEFAULT_GRADIENT.to);
  const [gradientGlow, setGradientGlow] = React.useState(DEFAULT_GRADIENT.glow);
  const [cellSize, setCellSize] = React.useState(6);
  const [gap, setGap] = React.useState(3);
  const [speed, setSpeed] = React.useState(200);
  const [glow, setGlow] = React.useState(0.25);
  const [gridRows, setGridRows] = React.useState(0);
  const [gridCols, setGridCols] = React.useState(0);
  const [shape, setShape] = React.useState<SpinnerShape>("square");
  const [animation, setAnimation] = React.useState<SpinnerAnimation>("wavy");
  const [popOnPeak, setPopOnPeak] = React.useState(false);
  const [popStrength, setPopStrength] = React.useState(1);
  const [popDuration, setPopDuration] = React.useState(480);
  const [direction, setDirection] = React.useState<Direction>("e");
  const [canvasBg, setCanvasBg] = React.useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [patternQuery, setPatternQuery] = React.useState("");
  const [gradientPickerOpen, setGradientPickerOpen] = React.useState(false);
  const [gridPickerOpen, setGridPickerOpen] = React.useState(false);
  const initialEditor = React.useMemo(
    () => loadEditorStateFromPattern("rain-4", []),
    []
  );
  const [customFrames, setCustomFrames] = React.useState<number[][]>(
    initialEditor.frames
  );
  const [customRows, setCustomRows] = React.useState(initialEditor.rows);
  const [customCols, setCustomCols] = React.useState(initialEditor.cols);
  const [customEditorPaused, setCustomEditorPaused] = React.useState(false);
  const [customCurrentFrame, setCustomCurrentFrame] = React.useState(0);
  const [deleteCandidate, setDeleteCandidate] = React.useState<
    { id: string; name: string; active: boolean } | null
  >(null);

  type HistorySnapshot = {
    patternName: string;
    colorMode: "preset" | "custom" | "gradient";
    color: SpinnerColor;
    presetId: string;
    customColor: string;
    gradientId: string;
    gradientFrom: string;
    gradientTo: string;
    gradientGlow: string;
    cellSize: number;
    gap: number;
    speed: number;
    glow: number;
    gridRows: number;
    gridCols: number;
    shape: SpinnerShape;
    animation: SpinnerAnimation;
    popOnPeak: boolean;
    popStrength: number;
    popDuration: number;
    direction: Direction;
    canvasBg: string | null;
    customFrames: number[][];
    customRows: number;
    customCols: number;
  };

  const currentHistorySnapshot: HistorySnapshot = {
    patternName,
    colorMode,
    color,
    presetId,
    customColor,
    gradientId,
    gradientFrom,
    gradientTo,
    gradientGlow,
    cellSize,
    gap,
    speed,
    glow,
    gridRows,
    gridCols,
    shape,
    animation,
    popOnPeak,
    popStrength,
    popDuration,
    direction,
    canvasBg,
    customFrames,
    customRows,
    customCols,
  };

  const HISTORY_LIMIT = 50;
  const [history, setHistory] = React.useState<{
    stack: HistorySnapshot[];
    index: number;
  }>(() => ({ stack: [currentHistorySnapshot], index: 0 }));
  const skipHistoryRef = React.useRef(false);

  React.useEffect(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    setHistory((h) => {
      const last = h.stack[h.index];
      if (JSON.stringify(last) === JSON.stringify(currentHistorySnapshot)) return h;
      const truncated = h.stack.slice(0, h.index + 1);
      truncated.push(currentHistorySnapshot);
      if (truncated.length > HISTORY_LIMIT) truncated.shift();
      return { stack: truncated, index: truncated.length - 1 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    patternName,
    colorMode,
    color,
    presetId,
    customColor,
    gradientId,
    gradientFrom,
    gradientTo,
    gradientGlow,
    cellSize,
    gap,
    speed,
    glow,
    gridRows,
    gridCols,
    shape,
    animation,
    popOnPeak,
    popStrength,
    popDuration,
    direction,
    canvasBg,
    customFrames,
    customRows,
    customCols,
  ]);

  const restoreHistorySnapshot = React.useCallback((s: HistorySnapshot) => {
    skipHistoryRef.current = true;
    setPatternName(s.patternName);
    setColorMode(s.colorMode);
    setColor(s.color);
    setPresetId(s.presetId);
    setCustomColor(s.customColor);
    setGradientId(s.gradientId);
    setGradientFrom(s.gradientFrom);
    setGradientTo(s.gradientTo);
    setGradientGlow(s.gradientGlow);
    setCellSize(s.cellSize);
    setGap(s.gap);
    setSpeed(s.speed);
    setGlow(s.glow);
    setGridRows(s.gridRows);
    setGridCols(s.gridCols);
    setShape(s.shape);
    setAnimation(s.animation);
    setPopOnPeak(s.popOnPeak);
    setPopStrength(s.popStrength);
    setPopDuration(s.popDuration);
    setDirection(s.direction);
    setCanvasBg(s.canvasBg);
    setCustomFrames(s.customFrames);
    setCustomRows(s.customRows);
    setCustomCols(s.customCols);
  }, []);

  const canUndo = history.index > 0;
  const canRedo = history.index < history.stack.length - 1;

  const undoEdit = React.useCallback(() => {
    setHistory((h) => {
      if (h.index <= 0) return h;
      const newIndex = h.index - 1;
      restoreHistorySnapshot(h.stack[newIndex]);
      return { ...h, index: newIndex };
    });
  }, [restoreHistorySnapshot]);

  const redoEdit = React.useCallback(() => {
    setHistory((h) => {
      if (h.index >= h.stack.length - 1) return h;
      const newIndex = h.index + 1;
      restoreHistorySnapshot(h.stack[newIndex]);
      return { ...h, index: newIndex };
    });
  }, [restoreHistorySnapshot]);

  const [savedPatterns, setSavedPatterns] = React.useState<SavedPattern[]>([]);
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_PATTERNS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedPatterns(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);
  const persistSavedPatterns = React.useCallback((next: SavedPattern[]) => {
    setSavedPatterns(next);
    try {
      window.localStorage.setItem(
        SAVED_PATTERNS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      /* ignore */
    }
  }, []);

  const [customColorSlots, setCustomColorSlots] = React.useState<(string | null)[]>(
    () => Array(CUSTOM_COLOR_SLOTS).fill(null)
  );
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CUSTOM_COLORS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = Array(CUSTOM_COLOR_SLOTS)
            .fill(null)
            .map((_, i) => (typeof parsed[i] === "string" ? parsed[i] : null));
          setCustomColorSlots(normalized);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);
  const persistCustomColorSlots = React.useCallback((next: (string | null)[]) => {
    setCustomColorSlots(next);
    try {
      window.localStorage.setItem(CUSTOM_COLORS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const [recentlyViewed, setRecentlyViewed] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
          setRecentlyViewed(
            parsed
              .filter((s): s is string => typeof s === "string")
              .slice(0, RECENTLY_VIEWED_MAX)
          );
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);
  const persistRecentlyViewed = React.useCallback((next: string[]) => {
    setRecentlyViewed(next);
    try {
      window.localStorage.setItem(
        RECENTLY_VIEWED_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      /* ignore */
    }
  }, []);

  const addCustomRow = React.useCallback(() => {
    setCustomRows((r) => r + 1);
  }, []);

  const removeCustomRow = React.useCallback(() => {
    if (customRows <= 1) return;
    const newRows = customRows - 1;
    const maxIdx = newRows * customCols;
    setCustomFrames((prev) =>
      prev.map((frame) => frame.filter((idx) => idx < maxIdx))
    );
    setCustomRows(newRows);
  }, [customRows, customCols]);

  const addCustomCol = React.useCallback(() => {
    const oldCols = customCols;
    const newCols = oldCols + 1;
    setCustomFrames((prev) =>
      prev.map((frame) =>
        frame.map((idx) => {
          const r = Math.floor(idx / oldCols);
          const c = idx % oldCols;
          return r * newCols + c;
        })
      )
    );
    setCustomCols(newCols);
  }, [customCols]);

  const removeCustomCol = React.useCallback(() => {
    if (customCols <= 1) return;
    const oldCols = customCols;
    const newCols = oldCols - 1;
    setCustomFrames((prev) =>
      prev.map((frame) => {
        const remapped: number[] = [];
        for (const idx of frame) {
          const r = Math.floor(idx / oldCols);
          const c = idx % oldCols;
          if (c >= newCols) continue;
          remapped.push(r * newCols + c);
        }
        return remapped.sort((a, b) => a - b);
      })
    );
    setCustomCols(newCols);
  }, [customCols]);

  const editingSavedId = React.useMemo(() => {
    if (!patternName.startsWith(SAVED_PATTERN_PREFIX)) return null;
    const sp = savedPatterns.find(
      (s) => `${SAVED_PATTERN_PREFIX}${s.id}` === patternName
    );
    return sp?.id ?? null;
  }, [patternName, savedPatterns]);

  const buildPrefs = React.useCallback(
    (): SavedPrefs => ({
      colorMode,
      color,
      presetId,
      customColor,
      gradientId,
      gradientFrom,
      gradientTo,
      gradientGlow,
      cellSize,
      gap,
      speed,
      glow,
      gridRows,
      gridCols,
      shape,
      animation,
      popOnPeak,
      popStrength,
      popDuration,
      direction,
    }),
    [
      colorMode,
      color,
      presetId,
      customColor,
      gradientId,
      gradientFrom,
      gradientTo,
      gradientGlow,
      cellSize,
      gap,
      speed,
      glow,
      gridRows,
      gridCols,
      shape,
      animation,
      popOnPeak,
      popStrength,
      popDuration,
      direction,
    ]
  );

  const handleUpdateSavedPattern = React.useCallback(() => {
    if (!editingSavedId) return;
    const prefs = buildPrefs();
    const updated = savedPatterns.map((s) =>
      s.id === editingSavedId
        ? {
            ...s,
            rows: customRows,
            cols: customCols,
            frames: cloneFrames(customFrames),
            createdAt: Date.now(),
            prefs,
          }
        : s
    );
    persistSavedPatterns(updated);
  }, [
    editingSavedId,
    savedPatterns,
    customFrames,
    customRows,
    customCols,
    persistSavedPatterns,
    buildPrefs,
  ]);

  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [saveDialogName, setSaveDialogName] = React.useState("");
  const [saveDialogError, setSaveDialogError] = React.useState<string | null>(
    null
  );

  const computeDefaultSaveName = React.useCallback(() => {
    let baseName: string;
    if (patternName.startsWith(SAVED_PATTERN_PREFIX)) {
      const sp = savedPatterns.find(
        (s) => `${SAVED_PATTERN_PREFIX}${s.id}` === patternName
      );
      baseName = sp ? sp.name : `pattern-${savedPatterns.length + 1}`;
    } else if (patternName === CUSTOM_PATTERN_NAME) {
      baseName = `pattern-${savedPatterns.length + 1}`;
    } else {
      baseName = patternName;
    }
    const usedNames = new Set(savedPatterns.map((s) => s.name));
    let defaultName = editingSavedId ? `${baseName} copy` : baseName;
    let i = 2;
    while (usedNames.has(defaultName)) {
      defaultName = `${baseName} copy ${i++}`;
    }
    return defaultName;
  }, [patternName, savedPatterns, editingSavedId]);

  const openSaveDialog = React.useCallback(() => {
    setSaveDialogName(computeDefaultSaveName());
    setSaveDialogError(null);
    setSaveDialogOpen(true);
  }, [computeDefaultSaveName]);

  const commitSaveAsNew = React.useCallback(() => {
    const trimmed = saveDialogName.trim();
    if (!trimmed) {
      setSaveDialogError("Name can't be empty.");
      return;
    }
    if (savedPatterns.some((s) => s.name === trimmed)) {
      setSaveDialogError(`A saved pattern named "${trimmed}" already exists.`);
      return;
    }
    const prefs = buildPrefs();
    const id = Date.now().toString(36);
    const next: SavedPattern[] = [
      ...savedPatterns,
      {
        id,
        name: trimmed,
        rows: customRows,
        cols: customCols,
        frames: cloneFrames(customFrames),
        createdAt: Date.now(),
        prefs,
      },
    ];
    persistSavedPatterns(next);
    setPatternName(`${SAVED_PATTERN_PREFIX}${id}`);
    setSaveDialogOpen(false);
  }, [
    saveDialogName,
    savedPatterns,
    customFrames,
    customRows,
    customCols,
    persistSavedPatterns,
    buildPrefs,
  ]);

  const handleDeleteSavedPattern = React.useCallback(
    (id: string) => {
      persistSavedPatterns(savedPatterns.filter((s) => s.id !== id));
    },
    [savedPatterns, persistSavedPatterns]
  );

  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportSize, setExportSize] = React.useState<
    32 | 64 | 256 | 512 | 1024 | 2048
  >(512);
  const [exportBackground, setExportBackground] = React.useState<
    "transparent" | "dark" | "light"
  >("transparent");
  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  // Skips the next direction-reset pass when a saved pattern restores its
  // own direction. Declared above the sync block so it's available there.
  const suppressDirectionResetRef = React.useRef(false);

  // Sync editor state when the selected pattern changes (React's
  // "adjusting state on prop change" pattern — runs in render, no flash).
  const [prevPatternNameSync, setPrevPatternNameSync] =
    React.useState(patternName);
  if (prevPatternNameSync !== patternName) {
    setPrevPatternNameSync(patternName);
    const loaded = loadEditorStateFromPattern(patternName, savedPatterns);
    setCustomFrames(loaded.frames);
    setCustomRows(loaded.rows);
    setCustomCols(loaded.cols);
    setCustomCurrentFrame(0);
    if (patternName.startsWith(SAVED_PATTERN_PREFIX)) {
      const sp = savedPatterns.find(
        (s) => `${SAVED_PATTERN_PREFIX}${s.id}` === patternName
      );
      if (sp?.prefs) {
        const p = sp.prefs;
        setColorMode(p.colorMode);
        setColor(p.color);
        setPresetId(p.presetId);
        setCustomColor(p.customColor);
        setGradientId(p.gradientId);
        setGradientFrom(p.gradientFrom);
        setGradientTo(p.gradientTo);
        setGradientGlow(p.gradientGlow);
        setCellSize(p.cellSize);
        setGap(p.gap);
        setSpeed(p.speed);
        setGlow(p.glow);
        setGridRows(p.gridRows);
        setGridCols(p.gridCols);
        setShape(p.shape);
        setAnimation(p.animation);
        setPopOnPeak(p.popOnPeak);
        setPopStrength(p.popStrength);
        setPopDuration(p.popDuration);
        setDirection(p.direction);
        suppressDirectionResetRef.current = true;
      }
    }
  }

  const prevPatternRef = React.useRef(patternName);
  React.useEffect(() => {
    const previous = prevPatternRef.current;
    if (previous !== patternName && previous !== CUSTOM_PATTERN_NAME) {
      setRecentlyViewed((prev) => {
        const next = [previous, ...prev.filter((n) => n !== previous)].slice(
          0,
          RECENTLY_VIEWED_MAX
        );
        try {
          window.localStorage.setItem(
            RECENTLY_VIEWED_STORAGE_KEY,
            JSON.stringify(next)
          );
        } catch {
          /* ignore */
        }
        return next;
      });
    }
    prevPatternRef.current = patternName;
  }, [patternName]);

  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = React.useState(false);
  React.useEffect(() => setThemeMounted(true), []);
  const isDark = themeMounted && theme === "dark";
  const themeCanvasBg = isDark ? "#0c0c0c" : "#ffffff";
  const resolvedCanvasBg = canvasBg ?? themeCanvasBg;

  const pattern = React.useMemo<SpinnerDef>(() => {
    const safeFrames = customFrames.length > 0 ? customFrames : [[]];
    let displayName = patternName;
    let baseColor: SpinnerColor = "violet";
    if (patternName.startsWith(SAVED_PATTERN_PREFIX)) {
      const sp = savedPatterns.find(
        (s) => `${SAVED_PATTERN_PREFIX}${s.id}` === patternName
      );
      if (sp) displayName = sp.name;
    } else if (patternName !== CUSTOM_PATTERN_NAME) {
      const def = SPINNER_LIBRARY.find((s) => s.name === patternName);
      if (def) baseColor = def.color;
    }
    return {
      name: displayName,
      color: baseColor,
      pattern: {
        rows: customRows,
        cols: customCols,
        interval: speed,
        frames: safeFrames,
      },
    };
  }, [patternName, customFrames, customRows, customCols, speed, savedPatterns]);

  const springCell = useSpring(cellSize);
  const springGap = useSpring(gap);
  const springGlow = useSpring(glow);

  React.useEffect(() => {
    setCustomCurrentFrame((f) =>
      customFrames.length > 0 ? f % customFrames.length : 0
    );
  }, [customFrames.length]);

  React.useEffect(() => {
    if (customEditorPaused) return;
    if (customFrames.length === 0) return;
    const id = setInterval(() => {
      setCustomCurrentFrame((f) => (f + 1) % customFrames.length);
    }, speed);
    return () => clearInterval(id);
  }, [customEditorPaused, customFrames.length, speed]);

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
    if (suppressDirectionResetRef.current) {
      suppressDirectionResetRef.current = false;
      return;
    }
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

  const [copiedSnippet, setCopiedSnippet] = React.useState<string | null>(null);
  const copyResetRef = React.useRef<number | null>(null);
  const handleCopySnippet = React.useCallback(
    async (kind: string, code: string) => {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        return;
      }
      setCopiedSnippet(kind);
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopiedSnippet(null), 1500);
    },
    []
  );
  React.useEffect(
    () => () => {
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    },
    []
  );

  const handleExportGif = React.useCallback(async () => {
    setExporting(true);
    setExportError(null);
    try {
      const preset = PRESET_COLOR_CSS[activeColor];
      const fromColor = activeGradient?.from
        ?? activeCustom
        ?? preset?.from
        ?? "#a78bfa";
      const toColor = activeGradient?.to
        ?? activeCustom
        ?? preset?.to
        ?? "#a78bfa";

      const blob = await exportSpinnerToGif({
        rows: pattern.pattern.rows ?? pattern.pattern.size ?? 3,
        cols: pattern.pattern.cols ?? pattern.pattern.size ?? 3,
        frames: pattern.pattern.frames,
        interval: pattern.pattern.interval ?? speed,
        cellSize,
        gap,
        fromColor,
        toColor,
        shape,
        size: exportSize,
        background: exportBackground,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = (pattern.name || "spinner")
        .replace(/^saved:/, "")
        .replace(/[^a-z0-9_-]+/gi, "-")
        .toLowerCase() || "spinner";
      a.href = url;
      a.download = `${safeName}-${exportSize}.gif`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportOpen(false);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : "Failed to export GIF."
      );
    } finally {
      setExporting(false);
    }
  }, [
    activeColor,
    activeCustom,
    activeGradient,
    pattern,
    speed,
    cellSize,
    gap,
    shape,
    exportSize,
    exportBackground,
  ]);

  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);
  const handleReset = () => {
    setPatternName("rain-4");
    const loaded = loadEditorStateFromPattern("rain-4", savedPatterns);
    setCustomFrames(loaded.frames);
    setCustomRows(loaded.rows);
    setCustomCols(loaded.cols);
    setCustomCurrentFrame(0);
    setColorMode("gradient");
    setColor("blue");
    setPresetId("blue");
    setCustomColor("#7ab7ff");
    setGradientId(DEFAULT_GRADIENT.id);
    setGradientFrom(DEFAULT_GRADIENT.from);
    setGradientTo(DEFAULT_GRADIENT.to);
    setGradientGlow(DEFAULT_GRADIENT.glow);
    setCellSize(6);
    setGap(3);
    setSpeed(200);
    setGlow(0.25);
    setGridRows(0);
    setGridCols(0);
    setShape("square");
    setAnimation("wavy");
    setPopOnPeak(false);
    setPopStrength(1);
    setPopDuration(480);
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
        pop: popOnPeak,
        popStrength,
        popDuration,
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
      popOnPeak,
      popStrength,
      popDuration,
    ]
  );

  const { htmlSnippet, cssSnippet, jsSnippet } = React.useMemo(() => {
    const { htmlSnippet: html, cssSnippet: css } = buildStandaloneSnippet({
      pattern: scaledPattern,
      color: activeColor,
      customColor: activeCustom,
      gradient: activeGradient,
      cellSize,
      gap,
      speed,
      glow,
      pop: popOnPeak,
      popStrength,
      popDuration,
    });
    const js = `(() => {
  const css = ${JSON.stringify(css)};
  const html = ${JSON.stringify(html)};
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  document.body.appendChild(wrapper.firstElementChild);
})();`;
    return { htmlSnippet: html, cssSnippet: css, jsSnippet: js };
  }, [
    scaledPattern,
    activeColor,
    activeCustom,
    activeGradient,
    cellSize,
    gap,
    speed,
    glow,
    popOnPeak,
    popStrength,
    popDuration,
  ]);

  return (
    <div className="space-y-4">
    <details className="group rounded-xl border border-[var(--ls-border)] bg-[var(--ls-card)]/60 text-[11px] text-[var(--ls-muted-foreground)] sm:hidden [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2">
        <Monitor size={13} className="shrink-0 text-[var(--ls-foreground)]" />
        <span className="flex-1 leading-snug">
          For the best experience, open this on a desktop — some controls are hidden on mobile.
        </span>
        <ChevronDown
          size={13}
          className="shrink-0 text-[var(--ls-muted-foreground)] transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="space-y-3 border-t border-[var(--ls-border)] px-3 pb-3 pt-3">
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
            Preview header
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <Shuffle size={11} className="mt-[3px] shrink-0 text-[#f59e0b]" />
              <span><span className="text-[var(--ls-foreground)]">Random</span> — shuffle to a different pattern</span>
            </li>
            <li className="flex items-start gap-2">
              <Code size={11} className="mt-[3px] shrink-0 text-[#e34c26]" />
              <span><span className="text-[var(--ls-foreground)]">HTML</span> — copy the markup snippet</span>
            </li>
            <li className="flex items-start gap-2">
              <Paintbrush size={11} className="mt-[3px] shrink-0 text-[#2965f1]" />
              <span><span className="text-[var(--ls-foreground)]">CSS</span> — copy the keyframes + styles</span>
            </li>
            <li className="flex items-start gap-2">
              <Braces size={11} className="mt-[3px] shrink-0 text-[#f7df1e]" />
              <span><span className="text-[var(--ls-foreground)]">JS</span> — copy the runtime snippet</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
            Pattern editor
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <Sparkles size={11} className="mt-[3px] shrink-0 text-[var(--ls-foreground)]" />
              <span><span className="text-[var(--ls-foreground)]">Custom frame editor</span> — draw, resize and animate your own pixel grid</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
            Pattern actions
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <Undo2 size={11} className="mt-[3px] shrink-0 text-[var(--ls-foreground)]" />
              <span><span className="text-[var(--ls-foreground)]">Undo / Redo</span> — step through edit history</span>
            </li>
            <li className="flex items-start gap-2">
              <RotateCcw size={11} className="mt-[3px] shrink-0 text-[var(--ls-foreground)]" />
              <span><span className="text-[var(--ls-foreground)]">Reset</span> — restore every control to its default</span>
            </li>
            <li className="flex items-start gap-2">
              <Save size={11} className="mt-[3px] shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span><span className="text-[var(--ls-foreground)]">Save as new / Update</span> — persist your edits as a pattern</span>
            </li>
            <li className="flex items-start gap-2">
              <Download size={11} className="mt-[3px] shrink-0 text-sky-500 dark:text-sky-400" />
              <span><span className="text-[var(--ls-foreground)]">Export GIF</span> — render the spinner as an animated GIF</span>
            </li>
          </ul>
        </div>
      </div>
    </details>
    <section className="rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 lg:p-2.5">
      {/* Preview */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.24_5)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.18_80)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.22_145)]" />
            <span className="ml-3 font-mono text-xs text-[var(--ls-muted-foreground)]">
              {pattern.name}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <button
              onClick={handleRandom}
              className="hidden h-7 items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)] sm:inline-flex"
            >
              <Shuffle size={12} className="text-[#f59e0b]" />
              Random
            </button>
            <SnippetButton
              icon={<Code size={12} className="text-[#e34c26]" />}
              label="HTML"
              copied={copiedSnippet === "html"}
              onClick={() => handleCopySnippet("html", htmlSnippet)}
              title="Copy HTML"
              className="hidden sm:inline-flex"
            />
            <SnippetButton
              icon={<Paintbrush size={12} className="text-[#2965f1]" />}
              label="CSS"
              copied={copiedSnippet === "css"}
              onClick={() => handleCopySnippet("css", cssSnippet)}
              title="Copy CSS"
              className="hidden sm:inline-flex"
            />
            <SnippetButton
              icon={<Braces size={12} className="text-[#f7df1e]" />}
              label="JS"
              copied={copiedSnippet === "js"}
              onClick={() => handleCopySnippet("js", jsSnippet)}
              title="Copy JS"
              className="hidden sm:inline-flex"
            />
            <button
              type="button"
              onClick={() => handleCopySnippet("ai", promptSnippet)}
              title="Copy the AI prompt that recreates this spinner"
              className="group inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/60"
            >
              <PixelFireSpinner />
              <span className="font-semibold uppercase tracking-[0.15em]">AI Prompt</span>
              <span
                className={
                  "ml-1 inline-flex w-[3.75rem] items-center justify-center gap-1 border-l border-[var(--ls-border)] pl-1.5 text-[10px] transition-colors " +
                  (copiedSnippet === "ai"
                    ? "text-[var(--ls-foreground)]"
                    : "text-[var(--ls-foreground)] group-hover:text-orange-500 dark:group-hover:text-orange-400")
                }
              >
                {copiedSnippet === "ai" ? (
                  <Check size={11} className="text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Copy size={11} />
                )}
                {copiedSnippet === "ai" ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        <div
          className="flex min-h-[180px] items-center justify-center p-6"
          style={{ backgroundColor: resolvedCanvasBg }}
        >
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
            pop={popOnPeak}
            popStrength={popStrength}
            popDuration={popDuration}
          />
        </div>

      </div>
    </section>

    <div className="hidden sm:block">
      <CustomFrameEditor
        frames={customFrames}
        setFrames={setCustomFrames}
        rows={customRows}
        cols={customCols}
        onAddRow={addCustomRow}
        onRemoveRow={removeCustomRow}
        onAddCol={addCustomCol}
        onRemoveCol={removeCustomCol}
        currentFrame={customCurrentFrame}
        paused={customEditorPaused}
        onTogglePaused={() => setCustomEditorPaused((p) => !p)}
        patternLabel={pattern.name}
        accent={
          activeGradient?.glow ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.glow ??
          "#a78bfa"
        }
        accentFrom={
          activeGradient?.from ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.from ??
          "#a78bfa"
        }
        accentTo={
          activeGradient?.to ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.to ??
          "#a78bfa"
        }
        onReset={() => {
          const loaded = loadEditorStateFromPattern(patternName, savedPatterns);
          setCustomFrames(loaded.frames);
          setCustomRows(loaded.rows);
          setCustomCols(loaded.cols);
          setCustomCurrentFrame(0);
        }}
        onClear={() => {
          setCustomFrames([[]]);
          setCustomCurrentFrame(0);
        }}
      />
    </div>

    {/* Controls — landscape layout below the preview */}
    <section className="rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-foreground)]/[0.06]">
            <Cog size={16} className="text-[var(--ls-muted-foreground)]" />
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
            Controls
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:contents">
          <button
            onClick={undoEdit}
            disabled={!canUndo}
            aria-label="Undo"
            title="Undo"
            className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
          >
            <Undo2 size={11} />
          </button>
          <button
            onClick={redoEdit}
            disabled={!canRedo}
            aria-label="Redo"
            title="Redo"
            className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
          >
            <Redo2 size={11} />
          </button>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
          >
            {isDark ? <Sun size={11} /> : <Moon size={11} />}
          </button>
          <div className="hidden sm:contents">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 py-1 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            title="Reset all controls to defaults"
          >
            <RotateCcw size={11} />
            Reset
          </button>
          {editingSavedId && (
            <button
              onClick={handleUpdateSavedPattern}
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
              title="Save changes back to this pattern"
            >
              <Save size={11} />
              Update
            </button>
          )}
          <Popover
            open={saveDialogOpen}
            onOpenChange={(open) => {
              if (open) openSaveDialog();
              else setSaveDialogOpen(false);
            }}
          >
            <PopoverTrigger asChild>
              <button
                className={
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors " +
                  (editingSavedId
                    ? "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40"
                    : "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300")
                }
                title="Save current edits as a brand-new pattern"
              >
                <Save size={11} />
                Save as new
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="luminous-spinners w-[280px] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                Save as new pattern
              </p>
              <input
                value={saveDialogName}
                onChange={(e) => {
                  setSaveDialogName(e.target.value);
                  setSaveDialogError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitSaveAsNew();
                  }
                }}
                autoFocus
                spellCheck={false}
                placeholder="Pattern name"
                className="h-8 w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-emerald-400/60"
              />
              {saveDialogError && (
                <p className="mt-1.5 text-[10px] text-rose-400">
                  {saveDialogError}
                </p>
              )}
              <div className="mt-3 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setSaveDialogOpen(false)}
                  className="rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={commitSaveAsNew}
                  className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300"
                >
                  Save
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={exportOpen} onOpenChange={setExportOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/50 bg-sky-500/10 px-2 py-1 text-[11px] font-medium text-sky-700 transition-colors hover:bg-sky-500/20 dark:border-sky-400/40 dark:text-sky-300"
                title="Export this spinner as an animated GIF"
              >
                <Download size={11} />
                Export GIF
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="luminous-spinners w-[300px] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                Export GIF
              </p>
              <p className="mb-3 text-[10px] text-[var(--ls-muted-foreground)]">
                Square output, spinner stays the same relative size at every
                resolution — drop straight into a post.
              </p>
              <div className="mb-3">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--ls-muted-foreground)]">
                  Resolution
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {([32, 64, 256, 512, 1024, 2048] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setExportSize(sz)}
                      className={
                        "rounded-md border px-1 py-1.5 text-[11px] font-medium tabular-nums transition-colors " +
                        (exportSize === sz
                          ? "border-sky-400/60 bg-sky-500/15 text-sky-200"
                          : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40")
                      }
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--ls-muted-foreground)]">
                  Background
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: "transparent", label: "None" },
                      { id: "dark", label: "Dark" },
                      { id: "light", label: "Light" },
                    ] as const
                  ).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setExportBackground(b.id)}
                      className={
                        "rounded-md border px-2 py-1.5 text-[11px] font-medium transition-colors " +
                        (exportBackground === b.id
                          ? "border-sky-400/60 bg-sky-500/15 text-sky-200"
                          : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40")
                      }
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              {exportError && (
                <p className="mb-2 text-[10px] text-rose-400">{exportError}</p>
              )}
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setExportOpen(false)}
                  className="rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleExportGif()}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/40 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting ? (
                    <>
                      <Loader2 size={11} className="animate-spin" />
                      Encoding…
                    </>
                  ) : (
                    <>
                      <ImageIcon size={11} />
                      Download
                    </>
                  )}
                </button>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </div>
      </div>

      <div className="gap-x-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-5 [&>*]:break-inside-avoid">
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
              <div className="max-h-[min(60vh,380px)] overflow-y-auto p-3 space-y-4">
                {savedPatterns.filter((s) =>
                  s.name.toLowerCase().includes(patternQuery.toLowerCase())
                ).length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                      Saved
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
                      {savedPatterns
                        .filter((s) =>
                          s.name
                            .toLowerCase()
                            .includes(patternQuery.toLowerCase())
                        )
                        .map((s) => {
                          const id = `${SAVED_PATTERN_PREFIX}${s.id}`;
                          const active = patternName === id;
                          return (
                            <div key={id} className="relative">
                              <button
                                onClick={() => {
                                  setPatternName(id);
                                  setPickerOpen(false);
                                }}
                                className={
                                  "group flex w-full flex-col items-center justify-center rounded-lg border p-2 transition-colors " +
                                  (active
                                    ? "border-emerald-400/60 bg-emerald-500/10"
                                    : "border-[var(--ls-border)] bg-[var(--ls-card)]/60 hover:border-emerald-400/40 hover:bg-emerald-500/5")
                                }
                              >
                                <div className="flex h-10 items-center justify-center">
                                  <PixelSpinner
                                    pattern={{
                                      rows: s.rows,
                                      cols: s.cols,
                                      interval: 200,
                                      frames: s.frames,
                                    }}
                                    color="violet"
                                    cellSize={Math.max(s.rows, s.cols) >= 5 ? 4 : 6}
                                    gap={1}
                                  />
                                </div>
                                <p className="mt-1.5 truncate font-mono text-[9px] text-[var(--ls-muted-foreground)]">
                                  {s.name}
                                </p>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteCandidate({
                                    id: s.id,
                                    name: s.name,
                                    active,
                                  });
                                }}
                                className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--ls-border)] bg-[var(--ls-card)] text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                                title={`Delete ${s.name}`}
                                aria-label={`Delete ${s.name}`}
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                    Library
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
                    {CUSTOM_PATTERN_NAME.includes(patternQuery.toLowerCase()) && (
                      <button
                        key="__custom"
                        onClick={() => {
                          setPatternName(CUSTOM_PATTERN_NAME);
                          setPickerOpen(false);
                        }}
                        className={
                          "group flex flex-col items-center justify-center rounded-lg border p-2 transition-colors " +
                          (patternName === CUSTOM_PATTERN_NAME
                            ? "border-emerald-400/60 bg-emerald-500/10"
                            : "border-dashed border-[var(--ls-border)] bg-[var(--ls-card)]/60 hover:border-emerald-400/40 hover:bg-emerald-500/5")
                        }
                      >
                        <div className="flex h-10 items-center justify-center">
                          <PackagePlus size={18} className="text-emerald-400" />
                        </div>
                        <p className="mt-1.5 truncate font-mono text-[9px] text-[var(--ls-muted-foreground)]">
                          custom
                        </p>
                      </button>
                    )}
                    {SPINNER_LIBRARY.filter((s) =>
                      s.name.toLowerCase().includes(patternQuery.toLowerCase())
                    ).map((s) => {
                      const active = s.name === patternName;
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

          <div className="min-h-[148px]">
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
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center gap-2">
                <ColorPickerPopover
                  value={customColor}
                  onChange={(v) => setCustomColor(v)}
                  trigger={
                    <button
                      type="button"
                      aria-label="Pick custom color"
                      className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white/60 transition-transform hover:scale-105"
                      style={{ background: customColor }}
                    />
                  }
                />
                <input
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  spellCheck={false}
                  className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {customColorSlots.map((slot, i) =>
                  slot ? (
                    <div key={i} className="group/slot relative">
                      <button
                        type="button"
                        onClick={() => setCustomColor(slot)}
                        title={`Load ${slot}`}
                        aria-label={`Load saved color ${slot}`}
                        className="h-9 w-9 rounded-full border border-white/20 transition-transform hover:scale-105"
                        style={{ background: slot }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...customColorSlots];
                          next[i] = null;
                          persistCustomColorSlots(next);
                        }}
                        title="Remove"
                        aria-label="Remove saved color"
                        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:text-rose-400 group-hover/slot:flex"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const next = [...customColorSlots];
                        next[i] = customColor;
                        persistCustomColorSlots(next);
                      }}
                      title="Save current color"
                      aria-label="Save current color"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-[var(--ls-border)] text-[var(--ls-muted-foreground)] transition-colors hover:border-white/40 hover:text-[var(--ls-foreground)]"
                    >
                      <Plus size={14} />
                    </button>
                  )
                )}
              </div>
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
          </div>
        </ControlGroup>

        <ControlGroup label="Canvas">
          <div className="flex items-center gap-2">
            <ColorPickerPopover
              value={resolvedCanvasBg}
              onChange={(v) => setCanvasBg(v)}
              trigger={
                <button
                  type="button"
                  aria-label="Pick canvas color"
                  title="Pick canvas color"
                  className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-white/15 shadow-inner ring-1 ring-black/30 transition-transform hover:scale-105"
                  style={{ background: resolvedCanvasBg }}
                />
              }
            />
            <span className="min-w-0 flex-1 truncate font-mono text-xs uppercase text-[var(--ls-foreground)]">
              {canvasBg === null ? "Auto" : resolvedCanvasBg}
            </span>
            <button
              type="button"
              onClick={() => setCanvasBg(null)}
              disabled={canvasBg === null}
              title="Follow theme"
              className="h-9 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
            >
              Auto
            </button>
          </div>
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

        <ControlGroup label="Bounce on peak">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span
                className={
                  "font-mono text-xs " +
                  (popOnPeak
                    ? "text-emerald-300"
                    : "text-[var(--ls-muted-foreground)]")
                }
              >
                {popOnPeak ? "On" : "Off"}
              </span>
              <div className="ps-toggle">
                <input
                  id="bounce-on-peak-toggle"
                  type="checkbox"
                  checked={popOnPeak}
                  onChange={(e) => setPopOnPeak(e.target.checked)}
                />
                <label htmlFor="bounce-on-peak-toggle" aria-label="Toggle bounce on peak">
                  <i />
                </label>
              </div>
            </div>
            <div
              aria-disabled={!popOnPeak}
              className={
                "space-y-2 transition-opacity " +
                (popOnPeak ? "" : "pointer-events-none opacity-40 select-none")
              }
            >
              <SliderControl
                label="Strength"
                value={popStrength}
                min={0}
                max={2}
                step={0.05}
                unit="x"
                onChange={setPopStrength}
              />
              <SliderControl
                label="Duration"
                value={popDuration}
                min={120}
                max={1200}
                step={20}
                unit="ms"
                onChange={setPopDuration}
              />
            </div>
          </div>
        </ControlGroup>

        {supportedDirections.length > 0 && (
          <div className="lg:break-before-column">
          <ControlGroup label="Direction">
            <DirectionPad
              value={direction}
              supported={supportedDirections}
              onChange={setDirection}
            />
          </ControlGroup>
          </div>
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
            <div className="mt-1.5 grid grid-cols-4 gap-1">
              {[8, 16, 32, 64].map((n) => {
                const active = effectiveRows === n && effectiveCols === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setGridRows(n);
                      setGridCols(n);
                    }}
                    className={
                      "rounded-md border px-1 py-1 font-mono text-[10px] tabular-nums transition-colors " +
                      (active
                        ? "border-white/40 bg-[var(--ls-border)]/50 text-[var(--ls-foreground)]"
                        : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:border-white/20 hover:text-[var(--ls-foreground)]")
                    }
                    title={`Set grid to ${n}×${n}`}
                  >
                    {n}×{n}
                  </button>
                );
              })}
            </div>
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
        <div className="space-y-2.5 break-inside-avoid">
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
            levelTint
          />
        </div>
      </div>

      <RecentlyViewedStrip
        names={recentlyViewed.filter((n) => n !== patternName)}
        savedPatterns={savedPatterns}
        accent={
          activeGradient?.glow ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.glow ??
          "#a78bfa"
        }
        accentFrom={
          activeGradient?.from ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.from ??
          "#a78bfa"
        }
        accentTo={
          activeGradient?.to ??
          activeCustom ??
          PRESET_COLOR_CSS[activeColor]?.to ??
          "#a78bfa"
        }
        onLoad={(n) => setPatternName(n)}
        onEditCopy={(frames, rows, cols) => {
          setCustomFrames(cloneFrames(frames));
          setCustomRows(rows);
          setCustomCols(cols);
          setPatternName(CUSTOM_PATTERN_NAME);
          setCustomCurrentFrame(0);
        }}
        onRemove={(n) =>
          persistRecentlyViewed(recentlyViewed.filter((x) => x !== n))
        }
      />
    </section>

    <ConfirmSheet
      open={deleteCandidate !== null}
      title={
        deleteCandidate
          ? `Delete saved pattern "${deleteCandidate.name}"?`
          : ""
      }
      description="This can't be undone — the pattern will be removed from your saved library."
      confirmLabel="Delete"
      onCancel={() => setDeleteCandidate(null)}
      onConfirm={() => {
        if (!deleteCandidate) return;
        if (deleteCandidate.active) setPatternName("rain-4");
        handleDeleteSavedPattern(deleteCandidate.id);
        setDeleteCandidate(null);
      }}
    />

    <ConfirmSheet
      open={resetConfirmOpen}
      title="Reset all controls?"
      description="Pattern, colors, sizing, animation, and effect settings will return to their defaults. Saved patterns aren't affected."
      confirmLabel="Reset"
      onCancel={() => setResetConfirmOpen(false)}
      onConfirm={() => {
        handleReset();
        setResetConfirmOpen(false);
      }}
    />
    </div>
  );
}

function DimensionStepper({
  label,
  value,
  onIncrement,
  onDecrement,
  canDecrement,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canDecrement: boolean;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)]">
      <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        className="flex h-7 w-7 items-center justify-center border-l border-[var(--ls-border)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50 disabled:cursor-not-allowed disabled:opacity-40"
        title={`Remove ${label.toLowerCase().replace(/s$/, "")}`}
      >
        <Minus size={12} />
      </button>
      <span className="flex h-7 min-w-[1.75rem] items-center justify-center font-mono text-xs text-[var(--ls-foreground)]">
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="flex h-7 w-7 items-center justify-center border-l border-[var(--ls-border)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
        title={`Add ${label.toLowerCase().replace(/s$/, "")}`}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function CustomFrameEditor({
  frames,
  setFrames,
  rows,
  cols,
  onAddRow,
  onRemoveRow,
  onAddCol,
  onRemoveCol,
  currentFrame,
  paused,
  onTogglePaused,
  patternLabel,
  accent,
  accentFrom,
  accentTo,
  onReset,
  onClear,
}: {
  frames: number[][];
  setFrames: React.Dispatch<React.SetStateAction<number[][]>>;
  rows: number;
  cols: number;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddCol: () => void;
  onRemoveCol: () => void;
  currentFrame: number;
  paused: boolean;
  onTogglePaused: () => void;
  patternLabel: string;
  accent: string;
  accentFrom: string;
  accentTo: string;
  onReset: () => void;
  onClear: () => void;
}) {
  const total = rows * cols;
  const addFrame = () => setFrames((prev) => [...prev, []]);
  const duplicateFrame = (i: number) =>
    setFrames((prev) => [
      ...prev.slice(0, i + 1),
      [...(prev[i] ?? [])],
      ...prev.slice(i + 1),
    ]);
  const deleteFrame = (i: number) =>
    setFrames((prev) =>
      prev.length <= 1 ? [[]] : prev.filter((_, idx) => idx !== i)
    );
  const toggleCell = (frameIdx: number, cellIdx: number) =>
    setFrames((prev) => {
      const next = prev.map((f) => [...f]);
      const set = new Set(next[frameIdx] ?? []);
      if (set.has(cellIdx)) set.delete(cellIdx);
      else set.add(cellIdx);
      next[frameIdx] = Array.from(set).sort((a, b) => a - b);
      return next;
    });
  const moveFrame = (from: number, to: number) => {
    if (from === to || to < 0) return;
    setFrames((prev) => {
      if (from >= prev.length || to > prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to > from ? to - 1 : to, 0, item);
      return next;
    });
  };
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [hidden, setHidden] = React.useState(true);

  return (
    <section className="rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-3 lg:p-4">
      <header
        className={
          "flex flex-wrap items-center justify-between gap-2 px-1 " +
          (hidden ? "pb-0" : "pb-3")
        }
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-foreground)]/[0.06]">
            <Bolt size={16} className="text-[var(--ls-muted-foreground)]" />
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ls-foreground)]">
            Animation Editor
          </h2>
          <span className="font-mono text-[11px] text-[var(--ls-muted-foreground)]">
            {patternLabel} · Frame{" "}
            {Math.min(currentFrame + 1, frames.length)} of {frames.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {!hidden && (
            <>
              <DimensionStepper
                label="Rows"
                value={rows}
                onIncrement={onAddRow}
                onDecrement={onRemoveRow}
                canDecrement={rows > 1}
              />
              <DimensionStepper
                label="Cols"
                value={cols}
                onIncrement={onAddCol}
                onDecrement={onRemoveCol}
                canDecrement={cols > 1}
              />
              <button
                onClick={onTogglePaused}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
                {paused ? "Play" : "Pause"}
              </button>
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
                title="Clear all frames"
              >
                <Eraser size={12} />
                Clear
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
                title="Revert to original"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </>
          )}
          <button
            onClick={() => setHidden((h) => !h)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
            title={hidden ? "Show editor" : "Hide editor"}
            aria-expanded={!hidden}
          >
            {hidden ? <Eye size={12} /> : <EyeOff size={12} />}
            {hidden ? "Show" : "Hide"}
          </button>
        </div>
      </header>

      {!hidden && (
        <>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
        {frames.map((cells, fi) => {
          const isPlaying = fi === currentFrame % Math.max(frames.length, 1);
          const isDragging = dragIndex === fi;
          const showDropBefore =
            dragIndex !== null &&
            dragOverIndex === fi &&
            dragIndex !== fi &&
            dragIndex !== fi - 1;
          return (
            <div key={fi} className="relative flex items-stretch">
              {showDropBefore && (
                <div className="pointer-events-none absolute -left-2 top-3 bottom-7 w-0.5 rounded bg-emerald-400" />
              )}
              <div
                draggable
                onDragStart={(e) => {
                  setDragIndex(fi);
                  e.dataTransfer.effectAllowed = "move";
                  try {
                    e.dataTransfer.setData("text/plain", String(fi));
                  } catch {
                    /* ignore unsupported envs */
                  }
                }}
                onDragEnter={(e) => {
                  if (dragIndex === null) return;
                  e.preventDefault();
                  setDragOverIndex(fi);
                }}
                onDragOver={(e) => {
                  if (dragIndex === null) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIndex !== fi) setDragOverIndex(fi);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex === null) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const after = e.clientX > rect.left + rect.width / 2;
                  moveFrame(dragIndex, after ? fi + 1 : fi);
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={
                  "flex shrink-0 cursor-grab flex-col items-center gap-1.5 rounded-md transition-opacity active:cursor-grabbing " +
                  (isDragging ? "opacity-40" : "opacity-100")
                }
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--ls-muted-foreground)]">
                  Frame {fi + 1}
                </span>
                <div
                  className={
                    "rounded-md p-1 transition-colors " +
                    (isPlaying
                      ? "bg-emerald-500/10 ring-2 ring-emerald-400/70"
                      : "ring-1 ring-[var(--ls-border)]")
                  }
                >
                  <FrameMiniGrid
                    rows={rows}
                    cols={cols}
                    cells={cells}
                    total={total}
                    accentFrom={accentFrom}
                    accentTo={accentTo}
                    accentGlow={accent}
                    onToggleCell={(c) => toggleCell(fi, c)}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateFrame(fi)}
                    className="inline-flex h-6 items-center gap-0.5 rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 text-[10px] font-medium text-[var(--ls-muted-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]"
                    title="Duplicate frame"
                  >
                    <Copy size={10} />
                  </button>
                  <button
                    onClick={() => deleteFrame(fi)}
                    className="inline-flex h-6 items-center gap-0.5 rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 text-[10px] font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                    title="Delete frame"
                  >
                    <Trash2 size={10} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={addFrame}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 self-stretch rounded-md border border-dashed border-[var(--ls-border)] px-4 text-[var(--ls-muted-foreground)] transition-colors hover:border-emerald-400/60 hover:text-emerald-400"
          title="Add a new frame"
        >
          <Plus size={18} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Add Frame
          </span>
        </button>
      </div>

      <p className="mt-2 px-1 text-[11px] text-[var(--ls-muted-foreground)]">
        Click cells to toggle them on/off. Frames play left-to-right, looping
        forever. The currently-playing frame has the emerald outline.
      </p>
        </>
      )}
    </section>
  );
}

function FrameMiniGrid({
  rows,
  cols,
  cells,
  total,
  accentFrom,
  accentTo,
  accentGlow,
  onToggleCell,
}: {
  rows: number;
  cols: number;
  cells: number[];
  total: number;
  accentFrom: string;
  accentTo: string;
  accentGlow: string;
  onToggleCell: (cellIdx: number) => void;
}) {
  const lit = new Set(cells);
  const maxDim = Math.max(rows, cols);
  const cell = maxDim >= 8 ? 12 : maxDim >= 6 ? 14 : maxDim >= 4 ? 16 : 18;
  return (
    <div
      className="grid select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        gap: 2,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = lit.has(i);
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleCell(i);
            }}
            className="rounded-sm transition-transform active:scale-95"
            style={{
              width: cell,
              height: cell,
              background: on
                ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
                : "color-mix(in oklab, var(--ls-foreground) 8%, transparent)",
              boxShadow: on
                ? `0 0 6px ${accentGlow}, 0 0 12px ${accentGlow}66`
                : "none",
            }}
            aria-label={`Toggle cell ${i}`}
          />
        );
      })}
    </div>
  );
}

function RecentlyViewedStrip({
  names,
  savedPatterns,
  accent,
  accentFrom,
  accentTo,
  onLoad,
  onEditCopy,
  onRemove,
}: {
  names: string[];
  savedPatterns: SavedPattern[];
  accent: string;
  accentFrom: string;
  accentTo: string;
  onLoad: (name: string) => void;
  onEditCopy: (frames: number[][], rows: number, cols: number) => void;
  onRemove: (name: string) => void;
}) {
  const resolved = names
    .map((name) => {
      if (name.startsWith(SAVED_PATTERN_PREFIX)) {
        const sp = savedPatterns.find(
          (s) => `${SAVED_PATTERN_PREFIX}${s.id}` === name
        );
        if (!sp) return null;
        return {
          name,
          label: sp.name,
          frames: sp.frames,
          rows: sp.rows,
          cols: sp.cols,
        };
      }
      const def = SPINNER_LIBRARY.find((s) => s.name === name);
      if (!def) return null;
      return {
        name,
        label: def.name,
        frames: def.pattern.frames,
        rows: def.pattern.rows ?? def.pattern.size ?? CUSTOM_EDITOR_SIZE,
        cols: def.pattern.cols ?? def.pattern.size ?? CUSTOM_EDITOR_SIZE,
      };
    })
    .filter(
      (
        x
      ): x is {
        name: string;
        label: string;
        frames: number[][];
        rows: number;
        cols: number;
      } => x !== null
    );

  return (
    <div className="mt-5 border-t border-[var(--ls-border)] pt-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
        Recently Viewed
      </p>
      {resolved.length === 0 ? (
        <p className="text-[11px] text-[var(--ls-muted-foreground)]">
          Switch patterns to build your history.
        </p>
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          {resolved.map((item) => (
            <RecentlyViewedTile
              key={item.name}
              label={item.label}
              frames={item.frames}
              rows={item.rows}
              cols={item.cols}
              accent={accent}
              accentFrom={accentFrom}
              accentTo={accentTo}
              onLoad={() => onLoad(item.name)}
              onEditCopy={() =>
                onEditCopy(item.frames, item.rows, item.cols)
              }
              onRemove={() => onRemove(item.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecentlyViewedTile({
  label,
  frames,
  rows,
  cols,
  accent,
  accentFrom,
  accentTo,
  onLoad,
  onEditCopy,
  onRemove,
}: {
  label: string;
  frames: number[][];
  rows: number;
  cols: number;
  accent: string;
  accentFrom: string;
  accentTo: string;
  onLoad: () => void;
  onEditCopy: () => void;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const first = frames[0] ?? [];
  const lit = new Set(first);
  const GAP = 2;
  const SIZE = 64;
  const maxDim = Math.max(rows, cols, 1);
  const cell = Math.max(2, Math.floor((SIZE - GAP * (maxDim - 1)) / maxDim));
  const gridW = cell * cols + GAP * (cols - 1);
  const gridH = cell * rows + GAP * (rows - 1);
  return (
    <div className="group relative flex w-16 flex-col items-center gap-1">
      <button
        type="button"
        onClick={onLoad}
        title={`Load ${label}`}
        className="relative flex h-16 w-16 items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] transition-colors hover:border-emerald-400/60"
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
            gridTemplateRows: `repeat(${rows}, ${cell}px)`,
            gap: GAP,
            width: gridW,
            height: gridH,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const on = lit.has(i);
            return (
              <span
                key={i}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: Math.max(1, Math.floor(cell / 4)),
                  background: on
                    ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
                    : "color-mix(in oklab, var(--ls-foreground) 8%, transparent)",
                  boxShadow: on ? `0 0 4px ${accent}AA` : "none",
                }}
              />
            );
          })}
        </div>
      </button>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Open menu"
            className="absolute right-0.5 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--ls-border)] bg-[var(--ls-card)]/90 text-[var(--ls-muted-foreground)] opacity-0 transition-opacity hover:text-[var(--ls-foreground)] focus-visible:opacity-100 group-hover:opacity-100"
          >
            <MoreHorizontal size={12} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={4}
          className="luminous-spinners w-[160px] border-[var(--ls-border)] bg-[var(--ls-card)] p-1 text-[var(--ls-foreground)]"
        >
          <button
            type="button"
            onClick={() => {
              onEditCopy();
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40"
          >
            <Copy size={12} />
            Edit copy
          </button>
          <button
            type="button"
            onClick={() => {
              onRemove();
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </PopoverContent>
      </Popover>
      <span
        className="max-w-[64px] truncate text-[10px] text-[var(--ls-muted-foreground)]"
        title={label}
      >
        {label}
      </span>
    </div>
  );
}

function SnippetButton({
  icon,
  label,
  copied,
  onClick,
  title,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  copied: boolean;
  onClick: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={
        "group h-7 items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/60 " +
        (className ?? "inline-flex")
      }
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : icon}
      <span>{label}</span>
    </button>
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
  center,
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
  center?: boolean;
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
      <div
        className={
          (hidePreview ? "" : "mb-3 ") +
          "flex items-center gap-3 " +
          (center ? "justify-center" : "justify-between")
        }
      >
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
        <ColorPickerPopover
          value={value}
          onChange={onChange}
          trigger={
            <button
              type="button"
              aria-label={`${label} color`}
              className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded-md border border-white/30 transition-transform hover:scale-105"
              style={{ background: value }}
            />
          }
        />
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
    <div className="group/control space-y-2 rounded-lg border border-[var(--ls-border)] bg-gradient-to-b from-black/[0.04] to-black/[0.015] p-3 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_1px_2px_0_rgba(0,0,0,0.06)] backdrop-blur-sm transition-colors hover:border-[var(--ls-border)] dark:border-[var(--ls-border)]/70 dark:from-white/[0.05] dark:to-white/[0.015] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_1px_2px_0_rgba(0,0,0,0.25)]">
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
  levelTint,
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
  levelTint?: boolean;
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

  const sMax = sliderMax ?? max;
  const sMin = min;
  const filled = Math.max(0, Math.min(100, ((Math.min(sMax, value) - sMin) / (sMax - sMin || 1)) * 100));

  const fillColor = levelTint
    ? filled < 34
      ? "oklch(0.72 0.2 145)"
      : filled < 67
        ? "oklch(0.78 0.17 80)"
        : "oklch(0.66 0.27 5)"
    : "var(--ls-foreground)";
  const thumbShadow = levelTint
    ? `0 0 0 2px ${fillColor}33, 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)`
    : undefined;

  const filledMV = useMotionValue(filled);
  React.useEffect(() => {
    filledMV.set(filled);
  }, [filled, filledMV]);
  const springFilled = useMotionSpring(filledMV, {
    stiffness: 210,
    damping: 18,
    mass: 0.7,
  });
  const rawVel = useVelocity(filledMV);
  const smoothVel = useMotionSpring(rawVel, {
    stiffness: 220,
    damping: 22,
    mass: 0.5,
  });

  const fillWidth = useTransform(springFilled, (v) =>
    `${Math.max(0, Math.min(100, v))}%`
  );
  const haloOpacity = useTransform(smoothVel, (v) =>
    Math.min(Math.abs(v) / 160, 1) * 0.33
  );
  const haloScaleY = useTransform(smoothVel, (v) =>
    1 + Math.min(Math.abs(v) / 220, 1) * 1.08
  );
  const meniscusOpacity = useTransform(smoothVel, (v) =>
    Math.min(Math.abs(v) / 240, 1) * 0.85
  );
  const meniscusScaleX = useTransform(smoothVel, (v) =>
    1 + Math.min(Math.abs(v) / 180, 1) * 1.6
  );
  const meniscusScaleY = useTransform(smoothVel, (v) =>
    1 - Math.min(Math.abs(v) / 260, 1) * 0.35
  );

  return (
    <div className="space-y-2 rounded-lg border border-[var(--ls-border)] bg-gradient-to-b from-black/[0.04] to-black/[0.015] p-3 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_1px_2px_0_rgba(0,0,0,0.06)] transition-colors hover:border-[var(--ls-border)] dark:border-[var(--ls-border)]/70 dark:from-white/[0.05] dark:to-white/[0.015] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_1px_2px_0_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
          {label}
        </p>
        {editable ? (
          <div className="flex items-center gap-0.5 rounded border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs tabular-nums text-[var(--ls-foreground)] focus-within:border-white/40">
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
          <span className="font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
            {value}
            {unit}
          </span>
        )}
      </div>
      {levelTint ? (
        <div className="relative h-4 w-full">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-0 h-2.5 -translate-y-1/2 rounded-full"
            style={{
              width: fillWidth,
              backgroundColor: fillColor,
              filter: "blur(7px)",
              opacity: haloOpacity,
              scaleY: haloScaleY,
              transformOrigin: "50% 50%",
              transition: "background-color 180ms ease-out",
            }}
          />
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-[var(--ls-border)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: fillWidth,
                backgroundColor: fillColor,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18)",
                transition: "background-color 180ms ease-out",
              }}
            />
          </div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: fillWidth,
              backgroundColor: fillColor,
              opacity: meniscusOpacity,
              scaleX: meniscusScaleX,
              scaleY: meniscusScaleY,
              filter: "blur(0.5px)",
              transformOrigin: "50% 50%",
              transition: "background-color 180ms ease-out",
            }}
          />
          <input
            type="range"
            min={min}
            max={sliderMax ?? max}
            step={step}
            value={Math.min(sliderMax ?? max, value)}
            onChange={(e) => onChange(Number(e.target.value))}
            style={
              thumbShadow
                ? ({ ["--lvl-thumb-shadow" as string]: thumbShadow } as React.CSSProperties)
                : undefined
            }
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/10 [&::-webkit-slider-thumb]:shadow-[var(--lvl-thumb-shadow)] [&::-webkit-slider-thumb]:transition-[transform,box-shadow] [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
          />
        </div>
      ) : (
        <input
          type="range"
          min={min}
          max={sliderMax ?? max}
          step={step}
          value={Math.min(sliderMax ?? max, value)}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--ls-foreground) 0%, var(--ls-foreground) ${filled}%, var(--ls-border) ${filled}%, var(--ls-border) 100%)`,
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/10 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
        />
      )}
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
  pop?: boolean;
  popStrength?: number;
  popDuration?: number;
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
    pop = false,
    popStrength = 1,
    popDuration = 480,
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
  // Bounce keyframe stops as fraction of bounce window (matches the .peak
  // keyframe in globals.css). Strength scales the amplitude.
  const popFracOfTotal =
    (Math.min(popDuration, speed) / Math.max(duration, 1)) * 100;
  const r3 = (n: number) => n.toFixed(3);
  const popStops: { p: number; transform: string; filter?: string }[] = [
    { p: 0, transform: "scale(1)", filter: "brightness(1) saturate(1)" },
    {
      p: 0.22,
      transform: `scale(${r3(1 - 0.3 * popStrength)})`,
      filter: `brightness(${r3(1 + 0.35 * popStrength)}) saturate(${r3(1 + 0.25 * popStrength)})`,
    },
    {
      p: 0.48,
      transform: `scale(${r3(1 + 0.18 * popStrength)})`,
      filter: `brightness(${r3(1 + 0.2 * popStrength)}) saturate(${r3(1 + 0.15 * popStrength)})`,
    },
    {
      p: 0.72,
      transform: `scale(${r3(1 - 0.04 * popStrength)})`,
    },
    { p: 1, transform: "scale(1)", filter: "brightness(1) saturate(1)" },
  ];

  for (let i = 0; i < total; i++) {
    const fo = grid[i];
    if (fo.every((o) => o === 0)) continue;
    let k = `@keyframes ps-${i} {\n`;
    for (let f = 0; f < F; f++) {
      const from = (f * step).toFixed(2);
      const to = Math.max(0, (f + 1) * step - 0.01).toFixed(2);
      k += `  ${from}%, ${to}% { opacity: ${fo[f]}; }\n`;
    }
    k += `}\n`;
    keyframes += k;

    if (pop) {
      const peakFrames: number[] = [];
      for (let f = 0; f < F; f++) if (fo[f] === 1) peakFrames.push(f);
      if (peakFrames.length > 0) {
        const stops: { pct: number; props: string }[] = [
          { pct: 0, props: "transform: scale(1); filter: brightness(1) saturate(1);" },
        ];
        for (const f of peakFrames) {
          const startPct = f * step;
          for (const s of popStops) {
            const pct = startPct + s.p * popFracOfTotal;
            if (pct > 100) break;
            const filterPart = s.filter ? ` filter: ${s.filter};` : "";
            stops.push({
              pct,
              props: `transform: ${s.transform};${filterPart}`,
            });
          }
        }
        stops.push({
          pct: 100,
          props: "transform: scale(1); filter: brightness(1) saturate(1);",
        });
        // Sort + dedupe by 2-decimal pct so consecutive peaks don't collide.
        stops.sort((a, b) => a.pct - b.pct);
        const seen = new Set<string>();
        const unique = stops.filter((s) => {
          const key = s.pct.toFixed(2);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        let pk = `@keyframes ps-${i}-pop {\n`;
        for (const s of unique) {
          pk += `  ${s.pct.toFixed(2)}% { ${s.props} }\n`;
        }
        pk += `}\n`;
        keyframes += pk;
        cellNameRules.push(
          `.pixel-spinner .cell-${i} { animation-name: ps-${i}, ps-${i}-pop; animation-timing-function: steps(1, end), linear; }`
        );
        continue;
      }
    }
    cellNameRules.push(`.pixel-spinner .cell-${i} { animation-name: ps-${i}; }`);
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
  pop: boolean;
  popStrength: number;
  popDuration: number;
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
    pop,
    popStrength,
    popDuration,
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

  const glowBase = [8, 22, 44, 72];
  const glowAlphas = [0.95, 0.75, 0.55, 0.35];
  const glowLayers = glowBase
    .map((px, i) => {
      const blur = +(px * glow).toFixed(2);
      return `  • Layer ${i + 1}: ${blur}px blur, color ${glowColor} at ${Math.round(
        glowAlphas[i] * 100
      )}% alpha`;
    })
    .join("\n");

  const popSection = pop
    ? `

PEAK POP (cells at peak opacity 1.0)
Each cell at the moment it first lights up plays a one-shot pop:
- Duration: ${popDuration}ms with cubic-bezier(0.34, 1.56, 0.64, 1) easing
- Strength multiplier: ${popStrength}× (applied to the deltas below)
- Keyframes:
  •   0%: scale(1), brightness(1), saturate(1)
  •  22%: scale(${(1 - 0.3 * popStrength).toFixed(3)}), brightness(${(1 + 0.35 * popStrength).toFixed(3)}), saturate(${(1 + 0.25 * popStrength).toFixed(3)})
  •  48%: scale(${(1 + 0.18 * popStrength).toFixed(3)}), brightness(${(1 + 0.2 * popStrength).toFixed(3)}), saturate(${(1 + 0.15 * popStrength).toFixed(3)})
  •  72%: scale(${(1 - 0.04 * popStrength).toFixed(3)})
  • 100%: scale(1), brightness(1), saturate(1)
The pop only fires on the activation frame, not on the trailing fade frames.`
    : "";

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
- Glow: 4-layer box-shadow halo at ${glow}× intensity (multiply the base blur radii by this scalar). All four shadows are centered (0 0 blur 0 color), color ${glowColor} with decreasing alpha:
${glowLayers}

MOTION TRAIL
Each cell, when activated on a frame, fades out over the next 3 frames so there is a 4-step opacity trail:
  step 0 (active): 1.0
  step 1: 0.5
  step 2: 0.25
  step 3: 0.15${popSection}

FRAME DATA (cell indices that activate at the start of each frame)
${frameLines}

REQUIREMENTS
- Pure HTML + CSS only (no JavaScript, no images, no SVG)
- Use display: inline-grid with grid-template-columns: repeat(${cols}, ${cellSize}px)
- Each lit cell gets its own @keyframes rule
- Use animation-timing-function: ${animation === "wavy" ? "an easing curve such as cubic-bezier(0.4, 0, 0.2, 1) so opacity transitions feel smooth" : "steps(1, end) so opacity changes are crisp at frame boundaries"}
- Use linear-gradient(135deg, ...) for the cell fill
- Stack four box-shadow layers for the glow halo (largest blur listed last so it sits beneath)
- Loop infinitely (animation-iteration-count: infinite)${pop ? "\n- Add a separate one-shot pop keyframe that runs only on the activation frame of each cell" : ""}
- Expose cell size, gap, color, glow scalar, and speed as CSS custom properties (e.g., --cell, --gap, --duration, --glow) so it's easy to customize

OUTPUT
Return one self-contained HTML snippet and one CSS block that I can paste directly into a project. Add a one-line usage comment at the top of the CSS.`;
}

