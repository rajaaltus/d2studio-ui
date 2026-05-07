"use client";

import * as React from "react";
import {
  Braces,
  Check,
  ChevronDown,
  Copy,
  FileCode2,
  ImageIcon,
  Loader2,
  Moon,
  Palette,
  RotateCcw,
  Share2,
  Shuffle,
  Sun,
  Upload,
  X,
} from "lucide-react";
import { PixelFireSpinner } from "@/components/icons/pixel-fire-spinner";
import { useTheme } from "@/components/theme-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type {
  SpinnerColor,
  SpinnerGradient,
  SpinnerShape,
} from "@/components/pixel-spinner";
import { PixelIcon, type PixelIconAnimation } from "./pixel-icon";
import { LucidePicker } from "./lucide-picker";
import {
  decodeShare,
  encodeShare,
  SHARE_VERSION,
  type ShareConfig,
} from "@/lib/pixel-animation-share";
import {
  ANIMATION_STYLES,
  generateFrames,
  isSmoothStyle,
  rasterizeSvgToMask,
  SAMPLE_SVGS,
  type AnimationStyleId,
  type FrameSet,
  type PixelMask,
  type SampleSvg,
} from "@/lib/pixel-animation";

/* ============================================================
 * Color presets and gradients (shared shape with the spinners
 * playground but kept local so the two tools can evolve apart).
 * ============================================================ */

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
];

type GradientDef = { id: string; label: string; from: string; to: string; glow: string };

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
  { id: "cosmos", label: "Cosmos", from: "#8e2de2", to: "#4a00e0", glow: "#8e2de2" },
];

/** Mood presets — one-click looks that bump animation + color + shape +
 * speed + glow together. They deliberately don't touch icon-shape inputs
 * (svg, gridSize, cellSize, gap) so the user's chosen icon and rendered
 * size stay put. */
type MoodPreset = {
  id: string;
  label: string;
  swatch: string;
  animationStyle: AnimationStyleId;
  colorMode: "preset" | "custom" | "gradient";
  gradient?: { id: string; from: string; to: string; glow: string };
  preset?: { id: string; builtin?: SpinnerColor };
  customColor?: string;
  shape: SpinnerShape;
  animation: PixelIconAnimation;
  speed: number;
  glow: number;
  baseOpacity: number;
};

const MOODS: MoodPreset[] = [
  {
    id: "aurora",
    label: "Aurora",
    swatch: "linear-gradient(135deg, #00f5a0, #00d9f5)",
    animationStyle: "ripple-out",
    colorMode: "gradient",
    gradient: { id: "aurora", from: "#00f5a0", to: "#00d9f5", glow: "#00d9f5" },
    shape: "circle",
    animation: "wavy",
    speed: 160,
    glow: 1.2,
    baseOpacity: 0.32,
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    swatch: "linear-gradient(135deg, #12c2e9, #f64f59)",
    animationStyle: "marquee",
    colorMode: "gradient",
    gradient: { id: "neon", from: "#12c2e9", to: "#f64f59", glow: "#c471ed" },
    shape: "square",
    animation: "pixels",
    speed: 90,
    glow: 1.5,
    baseOpacity: 0.22,
  },
  {
    id: "holographic",
    label: "Holographic",
    swatch: "linear-gradient(135deg, #b06ab3, #4568dc)",
    animationStyle: "particles",
    colorMode: "gradient",
    gradient: {
      id: "ultraviolet",
      from: "#b06ab3",
      to: "#4568dc",
      glow: "#7c5cff",
    },
    shape: "circle",
    animation: "wavy",
    speed: 130,
    glow: 1.3,
    baseOpacity: 0.32,
  },
  {
    id: "lava",
    label: "Lava Forge",
    swatch: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    animationStyle: "fire-rise",
    colorMode: "gradient",
    gradient: { id: "lava", from: "#ff416c", to: "#ff4b2b", glow: "#ff416c" },
    shape: "square",
    animation: "pixels",
    speed: 100,
    glow: 1.4,
    baseOpacity: 0.28,
  },
  {
    id: "arcade",
    label: "Retro Arcade",
    swatch: "linear-gradient(135deg, #84cc16, #facc15)",
    animationStyle: "scan-right",
    colorMode: "gradient",
    gradient: {
      id: "arcade",
      from: "#84cc16",
      to: "#facc15",
      glow: "#facc15",
    },
    shape: "square",
    animation: "pixels",
    speed: 80,
    glow: 1.0,
    baseOpacity: 0.2,
  },
  {
    id: "mono",
    label: "Mono Mist",
    swatch: "linear-gradient(135deg, #f8fafc, #94a3b8)",
    animationStyle: "twinkle",
    colorMode: "preset",
    preset: { id: "pearl" },
    shape: "square",
    animation: "wavy",
    speed: 220,
    glow: 0.6,
    baseOpacity: 0.18,
  },
];

/** Pixel-size presets — each preset bakes in a sensible cells-per-side count
 * for the target so smaller icons get a coarser grid (less rasterization
 * mush) and larger icons pick up more detail. The on-click handler also
 * recomputes cell size to land on (or very near) the target dimension given
 * the user's current gap. */
const PIXEL_SIZE_PRESETS: { px: number; grid: number }[] = [
  { px: 16, grid: 8 },
  { px: 24, grid: 12 },
  { px: 32, grid: 16 },
  { px: 48, grid: 16 },
  { px: 64, grid: 16 },
  { px: 96, grid: 24 },
  { px: 128, grid: 32 },
  { px: 192, grid: 24 },
  { px: 256, grid: 32 },
];

function cellSizeForTarget(
  targetPx: number,
  gridSize: number,
  gap: number
): number {
  const usable = targetPx - (gridSize - 1) * gap;
  return Math.max(1, Math.round(usable / gridSize));
}

function renderedIconSize(
  gridSize: number,
  cellSize: number,
  gap: number
): number {
  return gridSize * cellSize + (gridSize - 1) * gap;
}

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

const SHAPE_PREVIEW: Record<string, React.CSSProperties> = {
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

/* ============================================================
 * Spring (matches spinners playground for live slider easing)
 * ============================================================ */

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

/* ============================================================
 * Main playground
 * ============================================================ */

export function PixelAnimationPlayground() {
  const [sample, setSample] = React.useState<SampleSvg>(SAMPLE_SVGS[0]);
  const [svgName, setSvgName] = React.useState<string>(SAMPLE_SVGS[0].label);
  const [svgText, setSvgText] = React.useState<string>(SAMPLE_SVGS[0].svg);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [rasterizing, setRasterizing] = React.useState(false);
  const [mask, setMask] = React.useState<PixelMask | null>(null);

  const [animationStyle, setAnimationStyle] =
    React.useState<AnimationStyleId>("scan-down");
  const [colorMode, setColorMode] = React.useState<"preset" | "custom" | "gradient">(
    "gradient"
  );
  const [color, setColor] = React.useState<SpinnerColor>("blue");
  const [presetId, setPresetId] = React.useState("blue");
  const [customColor, setCustomColor] = React.useState("#7ab7ff");
  const [gradientId, setGradientId] = React.useState(GRADIENTS[0].id);
  const [gradientFrom, setGradientFrom] = React.useState(GRADIENTS[0].from);
  const [gradientTo, setGradientTo] = React.useState(GRADIENTS[0].to);
  const [gradientGlow, setGradientGlow] = React.useState(GRADIENTS[0].glow);

  const [gridSize, setGridSize] = React.useState(20);
  const [cellSize, setCellSize] = React.useState(14);
  const [gap, setGap] = React.useState(2);
  const [speed, setSpeed] = React.useState(140);
  const [glow, setGlow] = React.useState(1);
  const [baseOpacity, setBaseOpacity] = React.useState(0.32);
  const [threshold, setThreshold] = React.useState(96);
  const [shape, setShape] = React.useState<SpinnerShape>("square");
  const [animation, setAnimation] = React.useState<PixelIconAnimation>("wavy");
  const [strokeColor, setStrokeColor] = React.useState("#7ab7ff");
  const [particleDensity, setParticleDensity] = React.useState(1);
  // Elastic-pop modifier — when on, every cell that enters the peak set
  // runs a brief scale + brightness bounce via a CSS keyframe. Composes
  // with any preset (JS trail or CSS smooth).
  const [popEnabled, setPopEnabled] = React.useState(false);

  const [animationPickerOpen, setAnimationPickerOpen] = React.useState(false);
  // Animation popover tab — splits the dropdown into JS-trail vs CSS-smooth
  // groups. Auto-syncs to the current style so opening the popover always
  // starts on the right tab.
  const [animationTab, setAnimationTab] = React.useState<"js" | "css">("js");
  const [gradientPickerOpen, setGradientPickerOpen] = React.useState(false);
  const [samplePickerOpen, setSamplePickerOpen] = React.useState(false);

  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = React.useState(false);
  React.useEffect(() => setThemeMounted(true), []);
  const isDark = themeMounted && theme === "dark";

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Re-rasterize whenever the SVG, grid, or threshold changes.
  React.useEffect(() => {
    let cancelled = false;
    setRasterizing(true);
    setUploadError(null);
    rasterizeSvgToMask(svgText, {
      rows: gridSize,
      cols: gridSize,
      alphaThreshold: threshold,
      renderScale: 12,
    })
      .then((m) => {
        if (cancelled) return;
        setMask(m);
      })
      .catch((e) => {
        if (cancelled) return;
        setMask(null);
        setUploadError(
          e instanceof Error ? e.message : "Could not rasterize SVG"
        );
      })
      .finally(() => {
        if (!cancelled) setRasterizing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [svgText, gridSize, threshold]);

  const frameSet: FrameSet = React.useMemo(() => {
    if (!mask) {
      return { rows: gridSize, cols: gridSize, maskIndices: [], frames: [[]] };
    }
    // Ripples follow the cell shape: round cells get round rings, diamond
    // cells get diamond rings, everything else stays on the original square
    // (Chebyshev) rings.
    const rippleShape =
      shape === "circle"
        ? "circle"
        : shape === "diamond"
          ? "diamond"
          : "square";
    return generateFrames(mask, animationStyle, rippleShape);
  }, [mask, animationStyle, gridSize, shape]);

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
    colorMode === "preset" && activePreset?.builtin ? activePreset.builtin : color;

  const springCell = useSpring(cellSize);
  const springGap = useSpring(gap);
  const springGlow = useSpring(glow);

  const handleReset = () => {
    setSample(SAMPLE_SVGS[0]);
    setSvgName(SAMPLE_SVGS[0].label);
    setSvgText(SAMPLE_SVGS[0].svg);
    setAnimationStyle("scan-down");
    setColorMode("gradient");
    setColor("blue");
    setPresetId("blue");
    setCustomColor("#7ab7ff");
    setGradientId(GRADIENTS[0].id);
    setGradientFrom(GRADIENTS[0].from);
    setGradientTo(GRADIENTS[0].to);
    setGradientGlow(GRADIENTS[0].glow);
    setGridSize(20);
    setCellSize(14);
    setGap(2);
    setSpeed(140);
    setGlow(1);
    setBaseOpacity(0.32);
    setThreshold(96);
    setShape("square");
    setAnimation("wavy");
    setStrokeColor("#7ab7ff");
    setParticleDensity(1);
  };

  const handleRandom = () => {
    const next = SAMPLE_SVGS[Math.floor(Math.random() * SAMPLE_SVGS.length)];
    const styles = ANIMATION_STYLES;
    const nextStyle = styles[Math.floor(Math.random() * styles.length)];
    setSample(next);
    setSvgName(next.label);
    setSvgText(next.svg);
    setAnimationStyle(nextStyle.id);
    const g = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    setColorMode("gradient");
    setGradientId(g.id);
    setGradientFrom(g.from);
    setGradientTo(g.to);
    setGradientGlow(g.glow);
  };

  /** Apply a fully serialized ShareConfig — used both by the URL hydrate
   * pass on mount and (potentially) by future "Save preset" features.
   * Mirrors handleReset's surface area but driven from the config object. */
  const applyShareConfig = React.useCallback((cfg: ShareConfig) => {
    setSvgName(cfg.svgName);
    setSvgText(cfg.svgText);
    setAnimationStyle(cfg.anim);
    setAnimation(cfg.ease);
    setColorMode(cfg.cmode);
    if (cfg.preset) setPresetId(cfg.preset);
    if (cfg.color) setColor(cfg.color);
    if (cfg.ccolor) setCustomColor(cfg.ccolor);
    if (cfg.grad) {
      setGradientId(cfg.grad.id);
      setGradientFrom(cfg.grad.from);
      setGradientTo(cfg.grad.to);
      setGradientGlow(cfg.grad.glow);
    }
    setShape(cfg.shape);
    setGridSize(cfg.grid);
    setCellSize(cfg.cell);
    setGap(cfg.gap);
    setSpeed(cfg.speed);
    setGlow(cfg.glow);
    setBaseOpacity(cfg.base);
    setThreshold(cfg.thr);
    setStrokeColor(cfg.stroke);
    setParticleDensity(cfg.pdens);
  }, []);

  /** Apply a mood preset — only touches "look" settings, never the icon
   * shape inputs (svg, gridSize, cellSize, gap). Lets users one-click a
   * vibe and then keep tweaking. */
  const applyMood = React.useCallback((m: MoodPreset) => {
    setAnimationStyle(m.animationStyle);
    setColorMode(m.colorMode);
    if (m.gradient) {
      setGradientId(m.gradient.id);
      setGradientFrom(m.gradient.from);
      setGradientTo(m.gradient.to);
      setGradientGlow(m.gradient.glow);
    }
    if (m.preset) {
      setPresetId(m.preset.id);
      if (m.preset.builtin) setColor(m.preset.builtin);
    }
    if (m.customColor) setCustomColor(m.customColor);
    setShape(m.shape);
    setAnimation(m.animation);
    setSpeed(m.speed);
    setGlow(m.glow);
    setBaseOpacity(m.baseOpacity);
  }, []);

  // Hydrate from URL on mount. Runs once; later updates flow through the
  // sync effect below. We use a ref so the effect only ever fires once even
  // under StrictMode's double-invoke in dev.
  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === "undefined") return;
    const param = new URL(window.location.href).searchParams.get("c");
    if (!param) return;
    const cfg = decodeShare(param);
    if (cfg) applyShareConfig(cfg);
  }, [applyShareConfig]);

  /** Build the current ShareConfig from state. Memoized so the sync
   * effect's debounce doesn't re-run on unrelated renders. */
  const shareConfig = React.useMemo<ShareConfig>(
    () => ({
      v: SHARE_VERSION,
      svgName,
      svgText,
      anim: animationStyle,
      ease: animation,
      cmode: colorMode,
      preset: presetId,
      color,
      ccolor: customColor,
      grad: {
        id: gradientId,
        from: gradientFrom,
        to: gradientTo,
        glow: gradientGlow,
      },
      shape,
      grid: gridSize,
      cell: cellSize,
      gap,
      speed,
      glow,
      base: baseOpacity,
      thr: threshold,
      stroke: strokeColor,
      pdens: particleDensity,
    }),
    [
      svgName,
      svgText,
      animationStyle,
      animation,
      colorMode,
      presetId,
      color,
      customColor,
      gradientId,
      gradientFrom,
      gradientTo,
      gradientGlow,
      shape,
      gridSize,
      cellSize,
      gap,
      speed,
      glow,
      baseOpacity,
      threshold,
      strokeColor,
      particleDensity,
    ]
  );

  // Sync the encoded config to the URL whenever state settles. Debounced so
  // dragging a slider doesn't write history every frame. `replaceState`
  // avoids polluting the back stack.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setTimeout(() => {
      const encoded = encodeShare(shareConfig);
      const url = new URL(window.location.href);
      url.searchParams.set("c", encoded);
      window.history.replaceState(null, "", url.toString());
    }, 350);
    return () => clearTimeout(id);
  }, [shareConfig]);

  /** Copy the current page URL to the clipboard. URL is already kept in sync
   * by the effect above, so we just read window.location.href. */
  const [shareCopied, setShareCopied] = React.useState(false);
  const handleShare = React.useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      // Clipboard write failed — typically a non-secure context. Fall back
      // to a tiny prompt so the user can still grab the URL manually.
      window.prompt("Copy this share URL", window.location.href);
    }
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (
      !file.name.toLowerCase().endsWith(".svg") &&
      file.type !== "image/svg+xml"
    ) {
      setUploadError("Please upload an SVG file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setUploadError("SVG is over 1MB — please use a simpler icon.");
      return;
    }
    try {
      const text = await file.text();
      if (!/<svg[\s>]/i.test(text)) {
        setUploadError("That file doesn't look like an SVG.");
        return;
      }
      setUploadError(null);
      setSvgName(file.name.replace(/\.svg$/i, ""));
      setSvgText(text);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Could not read file");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  /* ---------- Snippets ---------- */

  const { htmlSnippet, cssSnippet } = React.useMemo(
    () =>
      buildStandaloneSnippet({
        frameSet,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
        baseOpacity,
        shape,
        iconName: svgName,
      }),
    [
      frameSet,
      activeColor,
      activeCustom,
      activeGradient,
      cellSize,
      gap,
      speed,
      glow,
      baseOpacity,
      shape,
      svgName,
    ]
  );

  const jsSnippet = React.useMemo(
    () =>
      buildJsSnippet({
        frameSet,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
        baseOpacity,
        shape,
        iconName: svgName,
      }),
    [
      frameSet,
      activeColor,
      activeCustom,
      activeGradient,
      cellSize,
      gap,
      speed,
      glow,
      baseOpacity,
      shape,
      svgName,
    ]
  );

  const promptSnippet = React.useMemo(
    () =>
      buildAiPrompt({
        iconName: svgName,
        frameSet,
        animationStyle,
        color: activeColor,
        customColor: activeCustom,
        gradient: activeGradient,
        cellSize,
        gap,
        speed,
        glow,
        baseOpacity,
        shape,
      }),
    [
      svgName,
      frameSet,
      animationStyle,
      activeColor,
      activeCustom,
      activeGradient,
      cellSize,
      gap,
      speed,
      glow,
      baseOpacity,
      shape,
    ]
  );

  const currentAnimationLabel =
    ANIMATION_STYLES.find((s) => s.id === animationStyle)?.label ?? animationStyle;

  return (
    <section className="grid gap-2.5 rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 lg:grid-cols-[1fr_320px_320px] lg:p-2.5">
      {/* Preview + code */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 backdrop-blur-sm lg:self-start">
        <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.24_5)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.85_0.18_80)]" />
            <span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.22_145)]" />
            <span className="ml-3 truncate font-mono text-xs text-[var(--ls-muted-foreground)]">
              {svgName}
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

        <div
          className="relative flex min-h-[280px] items-center justify-center p-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {rasterizing && !mask && (
            <div className="flex flex-col items-center gap-2 text-[var(--ls-muted-foreground)]">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs">Rasterizing…</span>
            </div>
          )}
          {mask && (
            <PixelIcon
              key={`${svgName}-${animationStyle}-${gridSize}`}
              rows={mask.rows}
              cols={mask.cols}
              maskIndices={frameSet.maskIndices}
              frames={frameSet.frames}
              color={activeColor}
              customColor={activeCustom}
              gradient={activeGradient}
              cellSize={springCell}
              gap={springGap}
              intervalOverride={speed}
              glow={springGlow}
              shape={shape}
              animation={animation}
              baseOpacity={baseOpacity}
              outlineEnabled={animationStyle === "twinkle"}
              outlineColor={strokeColor}
              particlesEnabled={animationStyle === "particles"}
              particleDensity={particleDensity}
              smoothMode={isSmoothStyle(animationStyle)}
              popEnabled={popEnabled}
            />
          )}
          {uploadError && (
            <div className="absolute bottom-3 left-3 right-3 rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs text-red-300">
              {uploadError}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--ls-border)]">
          <CodePanel
            label="AI Prompt"
            icon={<PixelFireSpinner />}
            code={promptSnippet}
            copyLabel="Copy Prompt"
            description="Paste into ChatGPT, Claude, or any AI to recreate this animated icon."
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
              description="Pair with the HTML to render the icon."
              hidePreview
              className="border-t border-[var(--ls-border)] md:border-l md:border-t-0"
            />
          </div>
          <CodePanel
            label="JavaScript"
            icon={<Braces size={14} className="text-[#f7df1e]" />}
            code={jsSnippet}
            copyLabel="Copy JS"
            description="Self-contained createPixelIcon(container) — drives the animation via Web Animations API. Returns a destroy() handle."
            hidePreview
            className="border-t border-[var(--ls-border)]"
          />
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
              onClick={handleShare}
              aria-label="Copy share link"
              title="Copy a shareable link to this configuration"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 py-1 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              {shareCopied ? (
                <>
                  <Check size={11} className="text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Share2 size={11} />
                  Share
                </>
              )}
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

        {/* SVG source */}
        <ControlGroup label="SVG Source">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 py-2 text-xs font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              <Upload size={12} />
              Upload SVG
            </button>
            <Popover open={samplePickerOpen} onOpenChange={setSamplePickerOpen}>
              <PopoverTrigger asChild>
                <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 text-xs font-medium text-[var(--ls-foreground)] hover:bg-[var(--ls-border)]/40">
                  <ImageIcon size={12} />
                  Library
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="luminous-spinners w-[min(380px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)]"
              >
                <LucidePicker
                  onSelect={(name, svg) => {
                    setSvgName(name);
                    setSvgText(svg);
                    setSamplePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <p className="mt-2 text-[10px] text-[var(--ls-muted-foreground)]">
            Drag &amp; drop an SVG, or pick from {""}
            <span className="text-[var(--ls-foreground)]">3,700+ Lucide icons</span>.
          </p>
        </ControlGroup>

        {/* Animation style */}
        <ControlGroup label="Animation">
          <Popover
            open={animationPickerOpen}
            onOpenChange={(o) => {
              setAnimationPickerOpen(o);
              // When opening, snap the tab to the group of the current style
              // so the user lands on the section that contains it.
              if (o) setAnimationTab(isSmoothStyle(animationStyle) ? "css" : "js");
            }}
          >
            <PopoverTrigger asChild>
              <button className="flex h-9 w-full items-center justify-between rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-3 font-mono text-xs text-[var(--ls-foreground)] outline-none transition-colors hover:bg-[var(--ls-border)]/50 focus-visible:border-white/40">
                <span>{currentAnimationLabel}</span>
                <ChevronDown size={14} className="opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="luminous-spinners w-[min(320px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-2 text-[var(--ls-foreground)]"
            >
              <div className="mb-2 inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
                {(
                  [
                    { id: "js", label: "JS Trail" },
                    { id: "css", label: "CSS Smooth" },
                  ] as const
                ).map((t) => {
                  const active = animationTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAnimationTab(t.id)}
                      className={
                        "flex-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors " +
                        (active
                          ? "bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                          : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
                      }
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {ANIMATION_STYLES.filter((s) =>
                  animationTab === "css"
                    ? isSmoothStyle(s.id)
                    : !isSmoothStyle(s.id)
                ).map((s) => {
                  const active = animationStyle === s.id;
                  // Strip the "Smooth · " prefix on the CSS tab — the tab
                  // already identifies the group, so labels stay clean.
                  const label = s.label.replace(/^Smooth · /, "");
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setAnimationStyle(s.id);
                        setAnimationPickerOpen(false);
                      }}
                      className={
                        "rounded-md px-2 py-1.5 text-left text-[11px] font-medium transition-colors " +
                        (active
                          ? "bg-[var(--ls-border)]/50 text-[var(--ls-foreground)]"
                          : "text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/30 hover:text-[var(--ls-foreground)]")
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {animationStyle === "particles" && (
            <div className="mt-3">
              <SliderControl
                label="Particle Density"
                value={particleDensity}
                min={0.25}
                max={2}
                step={0.25}
                unit="x"
                onChange={setParticleDensity}
                endLabels={["Sparse", "Dense"]}
              />
            </div>
          )}

          {animationStyle === "twinkle" && (
            <div className="mt-3 space-y-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                  Outline Stroke
                </p>
                <span className="text-[9px] text-[var(--ls-muted-foreground)]">
                  Twinkle only
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  className="relative h-7 w-7 shrink-0 cursor-pointer rounded-md border-2 border-white/40"
                  style={{ background: strokeColor }}
                >
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
                <input
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  spellCheck={false}
                  className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 py-1.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
                />
              </div>
              <p className="text-[10px] text-[var(--ls-muted-foreground)]">
                Drawn around every mask cell so the icon stays readable
                between twinkles.
              </p>
            </div>
          )}
        </ControlGroup>

        {/* Color */}
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
              <Popover open={gradientPickerOpen} onOpenChange={setGradientPickerOpen}>
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
                        {GRADIENTS.find((g) => g.id === gradientId)?.label ?? "Custom"}
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

        {/* Animation Style toggle */}
        <ControlGroup label="Easing">
          <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
            {(["pixels", "wavy"] as const).map((a) => {
              const active = animation === a;
              return (
                <button
                  key={a}
                  onClick={() => setAnimation(a)}
                  className={
                    "flex-1 rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors " +
                    (active
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

        {/* Shape */}
        <ControlGroup label="Cell Shape">
          <div className="grid grid-cols-8 gap-1 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-1">
            {SHAPES.map((s) => {
              const active = shape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  title={s.label}
                  aria-label={s.label}
                  className={
                    "flex aspect-square items-center justify-center rounded transition-colors " +
                    (active ? "bg-black/10 dark:bg-white/10" : "hover:bg-[var(--ls-border)]/40")
                  }
                >
                  <span
                    className={
                      "h-4 w-4 " +
                      (active ? "bg-[var(--ls-foreground)]" : "bg-[var(--ls-muted-foreground)]")
                    }
                    style={SHAPE_PREVIEW[s.id]}
                  />
                </button>
              );
            })}
          </div>
        </ControlGroup>

        {/* Resolution — picked in pixels, not cell counts. Each preset sets
         * gridSize + cellSize so the rendered icon lands on the chosen
         * dimension (gap is preserved so the actual size may drift by a
         * pixel or two when gap > 0). */}
        <ControlGroup label="Resolution">
          <div className="grid grid-cols-4 gap-1.5">
            {PIXEL_SIZE_PRESETS.map((p) => {
              const currentRendered = renderedIconSize(gridSize, cellSize, gap);
              const active = Math.abs(currentRendered - p.px) <= gridSize / 2;
              return (
                <button
                  key={p.px}
                  onClick={() => {
                    setGridSize(p.grid);
                    setCellSize(cellSizeForTarget(p.px, p.grid, gap));
                  }}
                  className={
                    "rounded-md border px-2 py-1.5 font-mono text-[11px] transition-colors " +
                    (active
                      ? "border-white/40 bg-[var(--ls-border)]/40 text-[var(--ls-foreground)]"
                      : "border-[var(--ls-border)] text-[var(--ls-muted-foreground)] hover:border-white/20 hover:text-[var(--ls-foreground)]")
                  }
                  title={`Render the icon at about ${p.px}×${p.px}px (${p.grid}×${p.grid} cells)`}
                >
                  {p.px}×{p.px}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--ls-muted-foreground)]">
            Currently rendering {renderedIconSize(gridSize, cellSize, gap)}px
            ({gridSize}×{gridSize} cells × {cellSize}px + {gap}px gap)
          </p>
        </ControlGroup>
      </aside>

      {/* Second control column — fine-tune sliders. Sits next to the first
       * aside on lg+ screens so the right-hand empty space (next to the
       * preview) gets put to work. */}
      <aside className="space-y-5 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-5 backdrop-blur-sm">
        {/* Mood — one-click looks. Bumps animation, color, shape, speed,
         * glow, and base opacity together. Doesn't touch the SVG or
         * sizing so the user's icon stays put. */}
        <ControlGroup label="Mood">
          <div className="grid grid-cols-3 gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => applyMood(m)}
                title={`Apply ${m.label}`}
                className="group flex flex-col gap-1 rounded-md border border-[var(--ls-border)] p-1.5 text-left transition-colors hover:border-white/40 hover:bg-[var(--ls-border)]/30"
              >
                <span
                  className="block h-3 w-full rounded-sm"
                  style={{
                    background: m.swatch,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                />
                <span className="text-[10px] font-medium leading-tight text-[var(--ls-foreground)]">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </ControlGroup>

        <SliderControl
          label="Cell size"
          value={cellSize}
          min={2}
          max={32}
          step={1}
          unit="px"
          onChange={setCellSize}
        />
        <SliderControl
          label="Gap"
          value={gap}
          min={0}
          max={8}
          step={1}
          unit="px"
          onChange={setGap}
        />
        <SliderControl
          label="Animation Speed"
          value={speed}
          min={30}
          max={1500}
          sliderMax={400}
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
          disabled={isSmoothStyle(animationStyle)}
          disabledHint="Glow is disabled for CSS Smooth presets — they render as flat dot-matrix LEDs."
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
              Bounce on peak
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--ls-muted-foreground)]/70">
              Elastic punch when each cell lights up.
            </p>
          </div>
          <Switch
            checked={popEnabled}
            onCheckedChange={setPopEnabled}
            aria-label="Toggle elastic pop on peak cells"
          />
        </div>
        <SliderControl
          label="Base Opacity"
          value={baseOpacity}
          min={0}
          max={1}
          step={0.02}
          unit=""
          onChange={setBaseOpacity}
          endLabels={["Hidden", "Solid"]}
        />
        <SliderControl
          label="Threshold"
          value={threshold}
          min={4}
          max={240}
          step={4}
          unit=""
          onChange={setThreshold}
          endLabels={["Detail", "Bold"]}
        />
      </aside>
    </section>
  );
}

/* ============================================================
 * Sub-components (Slider, ControlGroup, GradientStop, CodePanel)
 * ============================================================ */

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
  disabled,
  disabledHint,
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
  /** When true, the slider is grayed out and read-only. */
  disabled?: boolean;
  /** Optional tooltip shown on the wrapper when disabled. */
  disabledHint?: string;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => setDraft(String(value)), [value]);

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
    <div
      className={
        "space-y-2 transition-opacity " +
        (disabled ? "pointer-events-none opacity-40" : "")
      }
      title={disabled ? disabledHint : undefined}
      aria-disabled={disabled}
    >
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
              disabled={disabled}
              className="w-12 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-[var(--ls-muted-foreground)]">{unit}</span>
          </div>
        ) : (
          <span className="font-mono text-xs text-[var(--ls-foreground)]">
            {Number.isInteger(value) ? value : value.toFixed(2)}
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
        disabled={disabled}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ls-border)] accent-white disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
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

function CodePanel({
  label,
  code,
  className,
  icon,
  copyLabel,
  description,
  hidePreview,
}: {
  label: string;
  code: string;
  className?: string;
  icon?: React.ReactNode;
  copyLabel?: string;
  description?: string;
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
        <pre className="max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-[var(--ls-muted-foreground)]">
          {code}
        </pre>
      )}
    </div>
  );
}

/* ============================================================
 * Standalone HTML/CSS export
 * ============================================================ */

function buildCellTimeline(
  frameSet: FrameSet,
  baseOpacity: number
): {
  rows: number;
  cols: number;
  total: number;
  F: number;
  /** opacity per cell per frame (0..1) — only mask cells get non-zero values */
  grid: number[][];
} {
  const { rows, cols, frames, maskIndices } = frameSet;
  const F = Math.max(1, frames.length);
  const total = rows * cols;
  const trail = [1, 0.7, 0.45, 0.25];
  const grid: number[][] = Array.from({ length: total }, () => new Array(F).fill(0));
  const maskSet = new Set(maskIndices);

  // Start with the base opacity for every mask cell across every frame.
  for (const m of maskSet) {
    for (let f = 0; f < F; f++) grid[m][f] = baseOpacity;
  }

  // Apply trail-decayed peak boosts.
  for (let f = 0; f < F; f++) {
    for (let t = 0; t < trail.length; t++) {
      const src = (f - t + F) % F;
      const cells = frames[src] ?? [];
      for (const c of cells) {
        if (!maskSet.has(c)) continue;
        const v = trail[t];
        if (v > grid[c][f]) grid[c][f] = v;
      }
    }
  }
  return { rows, cols, total, F, grid };
}

function buildStandaloneSnippet(opts: {
  frameSet: FrameSet;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow: number;
  baseOpacity: number;
  shape: SpinnerShape;
  iconName: string;
}) {
  const {
    frameSet,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow,
    baseOpacity,
    shape,
    iconName,
  } = opts;

  const { grid, cols, rows, F, total } = buildCellTimeline(frameSet, baseOpacity);
  const duration = F * speed;
  const safeName = (iconName || "icon").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

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

  const maskSet = new Set(frameSet.maskIndices);

  let html = `<div class="pixel-icon pixel-icon--${safeName}">\n`;
  for (let i = 0; i < total; i++) {
    if (maskSet.has(i)) {
      html += `  <div class="px on px-${i}"></div>\n`;
    } else {
      html += `  <div class="px"></div>\n`;
    }
  }
  html += `</div>`;

  const step = 100 / F;
  let keyframes = "";
  const cellNameRules: string[] = [];
  for (let i = 0; i < total; i++) {
    if (!maskSet.has(i)) continue;
    const fo = grid[i];
    cellNameRules.push(`.pixel-icon--${safeName} .px-${i} { animation-name: pi-${safeName}-${i}; }`);
    let k = `@keyframes pi-${safeName}-${i} {\n`;
    for (let f = 0; f < F; f++) {
      const from = (f * step).toFixed(2);
      const to = Math.max(0, (f + 1) * step - 0.01).toFixed(2);
      k += `  ${from}%, ${to}% { opacity: ${fo[f].toFixed(3)}; }\n`;
    }
    k += `}\n`;
    keyframes += k;
  }

  const glow1 = Math.round(cellSize * 0.6 * glow);
  const glow2 = Math.round(cellSize * 1.6 * glow);
  const glow3 = Math.round(cellSize * 3.2 * glow);

  const radiusRule =
    shape === "circle"
      ? "border-radius: 50%;"
      : shape === "rounded"
        ? "border-radius: 22%;"
        : shape === "diamond"
          ? "clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);"
          : "border-radius: 0;";

  const css = `/* Pixel-animated icon — drop-in HTML + CSS, no JavaScript. */
.pixel-icon--${safeName} {
  display: inline-grid;
  grid-template-columns: repeat(${cols}, ${cellSize}px);
  grid-template-rows: repeat(${rows}, ${cellSize}px);
  gap: ${gap}px;
}
.pixel-icon--${safeName} .px {
  width: ${cellSize}px;
  height: ${cellSize}px;
  ${radiusRule}
  opacity: 0;
}
.pixel-icon--${safeName} .px.on {
  background: ${gradientCss};
  box-shadow:
    0 0 ${glow1}px ${glowColor},
    0 0 ${glow2}px ${glowColor}80,
    0 0 ${glow3}px ${glowColor}55;
  animation-duration: ${duration}ms;
  animation-iteration-count: infinite;
  animation-timing-function: steps(1, end);
}
${cellNameRules.join("\n")}

${keyframes}`;

  return { htmlSnippet: html, cssSnippet: css };
}

/* ============================================================
 * AI prompt builder
 * ============================================================ */

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

/* ============================================================
 * Standalone JavaScript export
 *
 * Generates a self-contained `createPixelIcon(container)` function that
 * builds the grid DOM and animates each lit cell via the Web Animations
 * API. More flexible than the static HTML+CSS combo: callers can mount
 * many instances, swap colors, or tear down with the returned `destroy`.
 * ============================================================ */

function buildJsSnippet(opts: {
  frameSet: FrameSet;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow: number;
  baseOpacity: number;
  shape: SpinnerShape;
  iconName: string;
}): string {
  const {
    frameSet,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow,
    baseOpacity,
    shape,
    iconName,
  } = opts;

  const { rows, cols, frames, maskIndices } = frameSet;
  const F = Math.max(1, frames.length);
  const total = rows * cols;
  const duration = F * speed;
  const safeName = (iconName || "icon").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

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

  const glow1 = Math.round(cellSize * 0.6 * glow);
  const glow2 = Math.round(cellSize * 1.6 * glow);
  const glow3 = Math.round(cellSize * 3.2 * glow);

  const radiusRule =
    shape === "circle"
      ? "borderRadius: '50%'"
      : shape === "rounded"
        ? "borderRadius: '22%'"
        : shape === "diamond"
          ? "clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'"
          : "borderRadius: '0'";

  // Per-cell opacity timeline — same model the HTML/CSS export uses.
  const { grid } = buildCellTimeline(frameSet, baseOpacity);

  // We embed the cell timelines as a flat array of arrays, only for mask
  // cells — keeps the snippet much smaller than dumping the full grid.
  const maskList = JSON.stringify(maskIndices);
  // grid is total rows × F; project just the mask rows into a parallel array.
  const maskTimelines = maskIndices.map((i) => grid[i]);
  const timelineList = JSON.stringify(
    maskTimelines.map((row) => row.map((v) => Number(v.toFixed(3))))
  );

  return `// Self-contained pixel-animated icon — paste into any project.
// Usage:
//   const destroy = createPixelIcon_${safeName}(document.querySelector('#mount'));
//   // …later:
//   destroy();

function createPixelIcon_${safeName}(container) {
  const ROWS = ${rows};
  const COLS = ${cols};
  const TOTAL = ${total};
  const CELL = ${cellSize};
  const GAP = ${gap};
  const DURATION_MS = ${duration};
  const FRAMES = ${F};
  const MASK = ${maskList};
  // One timeline per mask cell — opacity per frame (length = FRAMES).
  const TIMELINES = ${timelineList};

  container.innerHTML = '';
  Object.assign(container.style, {
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(' + COLS + ', ' + CELL + 'px)',
    gridTemplateRows: 'repeat(' + ROWS + ', ' + CELL + 'px)',
    gap: GAP + 'px',
    position: 'relative',
  });

  const maskSet = new Set(MASK);
  const maskOrder = new Map(MASK.map((idx, i) => [idx, i]));
  const cells = [];
  const animations = [];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      width: CELL + 'px',
      height: CELL + 'px',
      ${radiusRule},
    });

    if (maskSet.has(i)) {
      Object.assign(el.style, {
        background: '${gradientCss}',
        boxShadow: [
          '0 0 ${glow1}px ${glowColor}',
          '0 0 ${glow2}px ${glowColor}80',
          '0 0 ${glow3}px ${glowColor}55',
        ].join(', '),
      });

      const timeline = TIMELINES[maskOrder.get(i)];
      // One keyframe per animation frame so the wave steps crisply, plus
      // a final frame at offset 1 to close the loop without snapping.
      const keyframes = timeline.map((opacity, f) => ({
        opacity,
        offset: f / FRAMES,
      }));
      keyframes.push({ opacity: timeline[0], offset: 1 });

      const anim = el.animate(keyframes, {
        duration: DURATION_MS,
        iterations: Infinity,
        easing: 'steps(1, end)',
      });
      animations.push(anim);
    } else {
      el.style.opacity = '0';
    }

    container.appendChild(el);
    cells.push(el);
  }

  return function destroy() {
    animations.forEach((a) => a.cancel());
    container.innerHTML = '';
  };
}
`;
}

function buildAiPrompt(opts: {
  iconName: string;
  frameSet: FrameSet;
  animationStyle: AnimationStyleId;
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize: number;
  gap: number;
  speed: number;
  glow: number;
  baseOpacity: number;
  shape: SpinnerShape;
}): string {
  const {
    iconName,
    frameSet,
    animationStyle,
    color,
    customColor,
    gradient,
    cellSize,
    gap,
    speed,
    glow,
    baseOpacity,
    shape,
  } = opts;
  const { rows, cols, maskIndices, frames } = frameSet;
  const F = frames.length;
  const duration = F * speed;
  const total = rows * cols;
  const { line: colorLine, glowColor } = describeColor({ color, customColor, gradient });
  const styleLabel =
    ANIMATION_STYLES.find((s) => s.id === animationStyle)?.label ?? animationStyle;
  const frameLines = frames
    .map((f, i) => `  Frame ${i}: [${f.join(", ")}]`)
    .join("\n");
  const maskList =
    maskIndices.length <= 240
      ? `[${maskIndices.join(", ")}]`
      : `${maskIndices.length} cells (mask too long to inline — use the lit cells given in the frame data plus the base mask indices from your own rasterization)`;

  return `I want a CSS-only animated pixel icon ("${iconName}"). Generate clean, drop-in HTML and CSS for the following design:

ICON
- Grid: ${rows} rows × ${cols} columns (${total} cells, indexed 0–${total - 1} row-major, left-to-right top-to-bottom)
- Always-on "mask" cells (the icon shape): ${maskList}
- Cells outside the mask render as empty placeholders (transparent, no glow).

ANIMATION
- Style: ${styleLabel}
- Total frames: ${F}
- Frame duration: ${speed}ms (full loop ${duration}ms)
- Easing: ${shape === "circle" ? "smooth" : "stepped at frame boundaries"}, with a 4-step trail decay so the wavefront leaves a fading echo.

PEAK FRAMES (cell indices that hit peak brightness on each frame)
${frameLines}

BRIGHTNESS MODEL
- Mask cells render at base opacity ${baseOpacity.toFixed(2)} (so the whole icon is always faintly visible).
- A cell that is lit on frame F goes to opacity 1.0, then 0.7, 0.45, 0.25 over the next 3 frames — but never below the base opacity.
- Take the per-frame max(base, trail) as the cell's opacity for each frame.

CELLS
- Cell shape: ${shape}
- Cell size: ${cellSize}px × ${cellSize}px
- Gap: ${gap}px
- Color: ${colorLine}
- Glow: multi-layer box-shadow halo at ${glow}× intensity, color ${glowColor}
  • Inner: ~${Math.round(cellSize * 0.6 * glow)}px (full alpha)
  • Mid:   ~${Math.round(cellSize * 1.6 * glow)}px (~50% alpha)
  • Outer: ~${Math.round(cellSize * 3.2 * glow)}px (~33% alpha)

REQUIREMENTS
- Pure HTML + CSS only (no JavaScript, no images, no SVG)
- display: inline-grid with grid-template-columns: repeat(${cols}, ${cellSize}px)
- Each lit mask cell gets its own @keyframes rule with the per-frame opacities above
- Use animation-timing-function: steps(1, end) so opacity changes are crisp at frame boundaries
- Use linear-gradient(135deg, ...) for the cell fill
- Stack three box-shadow layers for the glow halo
- Loop infinitely
- Expose cell size, gap, color, and speed as CSS custom properties (--cell, --gap, --duration) so it's easy to customize

OUTPUT
Return one self-contained HTML snippet plus one CSS block I can paste directly into a project.`;
}
