"use client";

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Anchor,
  Award,
  Bell,
  Bird,
  Bookmark,
  Bug,
  Camera,
  Cat,
  Check,
  ChevronDown,
  Cloud,
  CloudRain,
  Coffee,
  Cog,
  Compass,
  Copy,
  Crown,
  Disc,
  Dog,
  Eye,
  Fish,
  Flame,
  Flower,
  Gamepad2,
  Ghost,
  Gift,
  Glasses,
  Hand,
  Headphones,
  IceCream,
  ImageIcon,
  Key,
  Leaf,
  Lightbulb,
  Lock,
  Mic,
  Monitor,
  Moon,
  Music,
  Paperclip,
  Pause,
  Pizza,
  Play,
  Plus,
  Rabbit,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Search,
  Shapes,
  Skull,
  Smile,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Trophy,
  Type,
  Undo2,
  Upload,
  Wind,
  Wine,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { ColorPickerPopover } from "@/components/ui/color-picker-popover";
import { PixelFireSpinner } from "@/components/icons/pixel-fire-spinner";
import { PixelControlsSpinner } from "@/components/icons/pixel-controls-spinner";

type SourceType = "shape" | "text" | "svg" | "image";
type ColorMode = "preset" | "custom" | "gradient";
type TextFont = "sans" | "serif" | "mono" | "display" | "rounded";

type LucideShape = { id: string; label: string; Icon: LucideIcon };

const LUCIDE_SHAPES: LucideShape[] = [
  { id: "star", label: "Star", Icon: Star },
  { id: "sparkles", label: "Sparkles", Icon: Sparkles },
  { id: "zap", label: "Zap", Icon: Zap },
  { id: "flame", label: "Flame", Icon: Flame },
  { id: "moon", label: "Moon", Icon: Moon },
  { id: "sun", label: "Sun", Icon: Sun },
  { id: "cloud", label: "Cloud", Icon: Cloud },
  { id: "cloud-rain", label: "Cloud rain", Icon: CloudRain },
  { id: "snowflake", label: "Snowflake", Icon: Snowflake },
  { id: "wind", label: "Wind", Icon: Wind },
  { id: "leaf", label: "Leaf", Icon: Leaf },
  { id: "flower", label: "Flower", Icon: Flower },
  { id: "music", label: "Music", Icon: Music },
  { id: "headphones", label: "Headphones", Icon: Headphones },
  { id: "mic", label: "Mic", Icon: Mic },
  { id: "disc", label: "Disc", Icon: Disc },
  { id: "bell", label: "Bell", Icon: Bell },
  { id: "camera", label: "Camera", Icon: Camera },
  { id: "smile", label: "Smile", Icon: Smile },
  { id: "ghost", label: "Ghost", Icon: Ghost },
  { id: "skull", label: "Skull", Icon: Skull },
  { id: "cat", label: "Cat", Icon: Cat },
  { id: "dog", label: "Dog", Icon: Dog },
  { id: "bird", label: "Bird", Icon: Bird },
  { id: "fish", label: "Fish", Icon: Fish },
  { id: "bug", label: "Bug", Icon: Bug },
  { id: "rabbit", label: "Rabbit", Icon: Rabbit },
  { id: "rocket", label: "Rocket", Icon: Rocket },
  { id: "anchor", label: "Anchor", Icon: Anchor },
  { id: "compass", label: "Compass", Icon: Compass },
  { id: "lightbulb", label: "Lightbulb", Icon: Lightbulb },
  { id: "key", label: "Key", Icon: Key },
  { id: "lock", label: "Lock", Icon: Lock },
  { id: "eye", label: "Eye", Icon: Eye },
  { id: "hand", label: "Hand", Icon: Hand },
  { id: "glasses", label: "Glasses", Icon: Glasses },
  { id: "crown", label: "Crown", Icon: Crown },
  { id: "trophy", label: "Trophy", Icon: Trophy },
  { id: "award", label: "Award", Icon: Award },
  { id: "gift", label: "Gift", Icon: Gift },
  { id: "bookmark", label: "Bookmark", Icon: Bookmark },
  { id: "gamepad", label: "Gamepad", Icon: Gamepad2 },
  { id: "coffee", label: "Coffee", Icon: Coffee },
  { id: "wine", label: "Wine", Icon: Wine },
  { id: "pizza", label: "Pizza", Icon: Pizza },
  { id: "ice-cream", label: "Ice cream", Icon: IceCream },
];

const SHAPES_BY_ID: Record<string, LucideShape> = Object.fromEntries(
  LUCIDE_SHAPES.map((s) => [s.id, s])
);

const FAVORITE_SHAPES: LucideShape[] = LUCIDE_SHAPES.slice(0, 4);
const FAVORITE_SHAPE_IDS = FAVORITE_SHAPES.map((s) => s.id);

type ShapeId = string;

function shapeSvgString(id: ShapeId): string {
  const shape = SHAPES_BY_ID[id] ?? FAVORITE_SHAPES[0];
  return renderToStaticMarkup(
    React.createElement(shape.Icon, {
      width: 200,
      height: 200,
      strokeWidth: 2,
      stroke: "#000",
      fill: "none",
    })
  );
}

function shapeLabel(id: ShapeId): string {
  return SHAPES_BY_ID[id]?.label ?? id;
}

const TEXT_FONTS: { id: TextFont; label: string; weight: string; family: string }[] = [
  { id: "sans", label: "Sans", weight: "900", family: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' },
  { id: "serif", label: "Serif", weight: "700", family: 'ui-serif, Georgia, Cambria, "Times New Roman", serif' },
  { id: "mono", label: "Mono", weight: "700", family: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' },
  { id: "display", label: "Display", weight: "900", family: 'Impact, "Arial Black", "Helvetica Neue", sans-serif' },
  { id: "rounded", label: "Rounded", weight: "800", family: 'ui-rounded, "SF Pro Rounded", "Helvetica Neue", system-ui, sans-serif' },
];

type ColorPreset = { id: string; label: string; hex: string };
type GradientPreset = { id: string; label: string; from: string; to: string };

const COLOR_PRESETS: ColorPreset[] = [
  { id: "violet", label: "Violet", hex: "#a78bfa" },
  { id: "hotpink", label: "Hot Pink", hex: "#ec4899" },
  { id: "crimson", label: "Crimson", hex: "#f43f5e" },
  { id: "amber", label: "Amber", hex: "#f59e0b" },
  { id: "lime", label: "Lime", hex: "#84cc16" },
  { id: "cyan", label: "Cyan", hex: "#22d3ee" },
  { id: "indigo", label: "Indigo", hex: "#6366f1" },
  { id: "rose", label: "Rose", hex: "#fb7185" },
  { id: "teal", label: "Teal", hex: "#14b8a6" },
  { id: "yellow", label: "Yellow", hex: "#facc15" },
  { id: "mint", label: "Mint", hex: "#34d399" },
  { id: "pearl", label: "Pearl", hex: "#f8fafc" },
];

const GRADIENT_PRESETS: GradientPreset[] = [
  { id: "ultraviolet", label: "Ultraviolet", from: "#7c3aed", to: "#ec4899" },
  { id: "sunset", label: "Sunset", from: "#ff9966", to: "#ff5e62" },
  { id: "aurora", label: "Aurora", from: "#00f5a0", to: "#00d9f5" },
  { id: "lava", label: "Lava", from: "#ff416c", to: "#ff4b2b" },
  { id: "mint", label: "Mint", from: "#43e97b", to: "#38f9d7" },
  { id: "ocean", label: "Ocean", from: "#2193b0", to: "#6dd5ed" },
  { id: "neon", label: "Neon", from: "#12c2e9", to: "#f64f59" },
  { id: "cosmos", label: "Cosmos", from: "#8e2de2", to: "#4a00e0" },
  { id: "royal", label: "Royal", from: "#fc466b", to: "#3f5efb" },
  { id: "peach", label: "Peach", from: "#f6d365", to: "#fda085" },
  { id: "candy", label: "Candy", from: "#ff6a88", to: "#ff99ac" },
  { id: "electric", label: "Electric", from: "#4facfe", to: "#00f2fe" },
];

type Settings = {
  count: number;
  size: number;
  speed: number;
  drift: number;
  colorMode: ColorMode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  source: SourceType;
  sourceText: string;
  sourceShape: ShapeId;
  sourceDataUrl: string | null;
  sourceLabel: string;
  textFont: TextFont;
  textScale: number;
  iconScale: number;
  svgScale: number;
  imageScale: number;
  mouseRadius: number;
  mouseForce: number;
  mouseMode: MouseMode;
  glow: boolean;
  glowStrength: number;
  twinkle: boolean;
  twinkleSpeed: number;
  hueCycle: boolean;
  hueSpeed: number;
  trails: boolean;
  trailFade: number;
  constellation: boolean;
  constellationDist: number;
  velocityBoost: boolean;
  useImageColors: boolean;
  canvasBg: string | null;
  gradientAngle: number;
  gradientMidStops: string[];
};

type MouseMode = "repel" | "attract" | "circle";

const DEFAULT_SETTINGS: Settings = {
  count: 4000,
  size: 0.8,
  speed: 0.75,
  drift: 0.2,
  colorMode: "gradient",
  color: "#a78bfa",
  gradientFrom: "#00f5a0",
  gradientTo: "#00d9f5",
  source: "shape",
  sourceText: "Hello",
  sourceShape: "flame",
  sourceDataUrl: null,
  sourceLabel: "Flame",
  textFont: "sans",
  textScale: 1,
  iconScale: 0.7,
  svgScale: 0.9,
  imageScale: 0.9,
  mouseRadius: 63,
  mouseForce: 30,
  mouseMode: "repel",
  glow: false,
  glowStrength: 0.55,
  twinkle: false,
  twinkleSpeed: 1,
  hueCycle: false,
  hueSpeed: 0.15,
  trails: false,
  trailFade: 0.12,
  constellation: false,
  constellationDist: 60,
  velocityBoost: false,
  useImageColors: false,
  canvasBg: null,
  gradientAngle: 135,
  gradientMidStops: [],
};

const MAX_GRADIENT_MID_STOPS = 2;

function getGradientStops(s: Settings): string[] {
  const mids = Array.isArray(s.gradientMidStops) ? s.gradientMidStops : [];
  return [s.gradientFrom, ...mids, s.gradientTo];
}

function gradientCssString(s: Settings): string {
  return getGradientStops(s).join(", ");
}

const FAST_RENDER_THRESHOLD = 6000;

const PARTICLE_PRESETS_STORAGE_KEY = "particle-playground:saved-presets:v1";
const PARTICLE_CUSTOM_GRADIENTS_STORAGE_KEY = "particle-playground:custom-gradients:v1";
const PARTICLE_CUSTOM_COLORS_STORAGE_KEY = "particle-playground:custom-colors:v1";
const MAX_CUSTOM_COLORS = 5;

function gradientAngleToCoords(angle: number, w: number, h: number) {
  const rad = (angle * Math.PI) / 180;
  const r = Math.hypot(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const dx = Math.sin(rad) * r;
  const dy = -Math.cos(rad) * r;
  return { x0: cx - dx, y0: cy - dy, x1: cx + dx, y1: cy + dy };
}

type SavedPreset = {
  id: string;
  name: string;
  settings: Settings;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  seed: number;
  restAngle: number;
  restR01: number;
  cr: number;
  cg: number;
  cb: number;
  hasColor: boolean;
};

type ImageBuffer = {
  imageData: ImageData;
  data: Uint8ClampedArray;
  w: number;
  h: number;
};

export function CosmaPlayground() {
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [playing, setPlaying] = React.useState(true);
  const [sampling, setSampling] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = React.useState(false);
  React.useEffect(() => setThemeMounted(true), []);
  const isDark = themeMounted && theme === "dark";
  const themeCanvasBg = isDark ? "#0c0c0c" : "#fcfcfc";
  const resolvedCanvasBg = settings.canvasBg ?? themeCanvasBg;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const settingsRef = React.useRef(settings);
  const playingRef = React.useRef(playing);
  const sizeRef = React.useRef({ width: 0, height: 0, dpr: 1 });
  const resampleTokenRef = React.useRef(0);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });
  const imageBufferRef = React.useRef<ImageBuffer | null>(null);
  const canvasBgRef = React.useRef(resolvedCanvasBg);

  React.useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  React.useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  React.useEffect(() => {
    canvasBgRef.current = resolvedCanvasBg;
  }, [resolvedCanvasBg]);

  const ensureParticles = React.useCallback((count: number) => {
    const list = particlesRef.current;
    const { width, height } = sizeRef.current;
    if (list.length < count) {
      for (let i = list.length; i < count; i++) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          tx: width / 2,
          ty: height / 2,
          seed: Math.random() * 1000,
          restAngle: Math.random() * Math.PI * 2,
          restR01: Math.sqrt(Math.random()),
          cr: 0,
          cg: 0,
          cb: 0,
          hasColor: false,
        });
      }
    } else if (list.length > count) {
      list.length = count;
    }
  }, []);

  const resample = React.useCallback(async () => {
    const { width, height } = sizeRef.current;
    if (width === 0 || height === 0) return;
    const s = settingsRef.current;
    const token = ++resampleTokenRef.current;
    setSampling(true);
    try {
      const targets = await sampleTargets(s, width, height);
      if (token !== resampleTokenRef.current) return;
      ensureParticles(s.count);
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const t = targets[i % targets.length];
        particles[i].tx = t.x;
        particles[i].ty = t.y;
        if (t.r !== undefined && t.g !== undefined && t.b !== undefined) {
          particles[i].cr = t.r;
          particles[i].cg = t.g;
          particles[i].cb = t.b;
          particles[i].hasColor = true;
        } else {
          particles[i].hasColor = false;
        }
      }
    } finally {
      if (token === resampleTokenRef.current) setSampling(false);
    }
  }, [ensureParticles]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
      imageBufferRef.current = null;
      void resample();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    const render = (now: number) => {
      const { width, height, dpr } = sizeRef.current;
      const s = settingsRef.current;

      const isPlaying = playingRef.current;
      const stiffness = 0.02 * Math.max(0.05, s.speed);
      const damping = 0.86;
      const drift = s.drift;
      const t = now * 0.001;

      const mouse = mouseRef.current;
      const mouseActive = mouse.active && s.mouseForce > 0 && s.mouseRadius > 0;
      const mRad = s.mouseRadius;
      const mRad2 = mRad * mRad;
      const mode = s.mouseMode;
      const useCircle = mouseActive && mode === "circle";
      const useImpulse = mouseActive && (mode === "repel" || mode === "attract");
      const impulseSign = mode === "attract" ? -1 : 1;
      const depositR = mRad * 0.7;
      const magnetK = 0.04 * Math.max(0.2, s.mouseForce / 30);
      const magnetDamp = 0.78;

      const particles = particlesRef.current;
      const effectsOn =
        s.glow || s.twinkle || s.hueCycle || s.trails || s.constellation || s.velocityBoost;
      const useFast = !effectsOn && particles.length > FAST_RENDER_THRESHOLD;

      if (isPlaying) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          let captured = false;
          if (useCircle) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            if (mdx * mdx + mdy * mdy < mRad2) captured = true;
          }

          let targetX: number;
          let targetY: number;
          let k: number;
          let d: number;
          if (captured) {
            const r = depositR * p.restR01;
            targetX = mouse.x + Math.cos(p.restAngle) * r;
            targetY = mouse.y + Math.sin(p.restAngle) * r;
            k = magnetK;
            d = magnetDamp;
          } else {
            targetX = p.tx;
            targetY = p.ty;
            k = stiffness;
            d = damping;
          }

          const dx = targetX - p.x;
          const dy = targetY - p.y;
          p.vx = (p.vx + dx * k) * d;
          p.vy = (p.vy + dy * k) * d;

          if (useImpulse) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const md2 = mdx * mdx + mdy * mdy;
            if (md2 < mRad2 && md2 > 0.01) {
              const md = Math.sqrt(md2);
              const falloff = 1 - md / mRad;
              const push = (falloff * falloff * s.mouseForce * impulseSign) / md;
              p.vx += mdx * push;
              p.vy += mdy * push;
            }
          }

          p.x += p.vx;
          p.y += p.vy;
          if (!captured && drift > 0) {
            const sdx = p.tx - p.x;
            const sdy = p.ty - p.y;
            if (sdx * sdx + sdy * sdy < 4) {
              p.x += Math.sin(t * 2 + p.seed) * drift * 0.5;
              p.y += Math.cos(t * 1.7 + p.seed * 0.7) * drift * 0.5;
            }
          }
        }
      }

      if (useFast) {
        renderImageData(ctx, canvas, particles, s, width, dpr, imageBufferRef);
      } else {
        renderArcs(ctx, particles, s, width, height, now, canvasBgRef.current);
      }

      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, [resample]);

  React.useEffect(() => {
    void resample();
  }, [
    resample,
    settings.source,
    settings.sourceShape,
    settings.sourceText,
    settings.sourceDataUrl,
    settings.count,
    settings.textFont,
    settings.textScale,
    settings.iconScale,
    settings.svgScale,
    settings.imageScale,
    settings.useImageColors,
  ]);

  const reset = () => setSettings(DEFAULT_SETTINGS);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);

  const HISTORY_LIMIT = 50;
  const [history, setHistory] = React.useState<{ stack: Settings[]; index: number }>(
    () => ({ stack: [DEFAULT_SETTINGS], index: 0 })
  );
  const skipHistoryRef = React.useRef(false);

  React.useEffect(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    setHistory((h) => {
      if (h.stack[h.index] === settings) return h;
      const truncated = h.stack.slice(0, h.index + 1);
      truncated.push(settings);
      if (truncated.length > HISTORY_LIMIT) truncated.shift();
      return { stack: truncated, index: truncated.length - 1 };
    });
  }, [settings]);

  const canUndo = history.index > 0;
  const canRedo = history.index < history.stack.length - 1;

  const undo = React.useCallback(() => {
    setHistory((h) => {
      if (h.index <= 0) return h;
      const newIndex = h.index - 1;
      skipHistoryRef.current = true;
      setSettings(h.stack[newIndex]);
      return { ...h, index: newIndex };
    });
  }, []);

  const redo = React.useCallback(() => {
    setHistory((h) => {
      if (h.index >= h.stack.length - 1) return h;
      const newIndex = h.index + 1;
      skipHistoryRef.current = true;
      setSettings(h.stack[newIndex]);
      return { ...h, index: newIndex };
    });
  }, []);

  const [savedPresets, setSavedPresets] = React.useState<SavedPreset[]>([]);
  const [customGradients, setCustomGradients] = React.useState<GradientPreset[]>([]);
  const [customColors, setCustomColors] = React.useState<string[]>([]);
  const [presetsOpen, setPresetsOpen] = React.useState(false);
  const [gradientPresetsOpen, setGradientPresetsOpen] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [saveDialogName, setSaveDialogName] = React.useState("");
  const [saveDialogError, setSaveDialogError] = React.useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = React.useState<
    { id: string; name: string } | null
  >(null);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PARTICLE_PRESETS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setSavedPresets(parsed as SavedPreset[]);
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PARTICLE_CUSTOM_GRADIENTS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setCustomGradients(parsed as GradientPreset[]);
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PARTICLE_CUSTOM_COLORS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCustomColors(
          parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_CUSTOM_COLORS)
        );
      }
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  const persistCustomColors = React.useCallback((next: string[]) => {
    setCustomColors(next);
    try {
      window.localStorage.setItem(
        PARTICLE_CUSTOM_COLORS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const persistPresets = React.useCallback((next: SavedPreset[]) => {
    setSavedPresets(next);
    try {
      window.localStorage.setItem(
        PARTICLE_PRESETS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const persistCustomGradients = React.useCallback((next: GradientPreset[]) => {
    setCustomGradients(next);
    try {
      window.localStorage.setItem(
        PARTICLE_CUSTOM_GRADIENTS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const handleAddCustomGradient = React.useCallback(() => {
    const exists = [...GRADIENT_PRESETS, ...customGradients].some(
      (g) =>
        g.from.toLowerCase() === settings.gradientFrom.toLowerCase() &&
        g.to.toLowerCase() === settings.gradientTo.toLowerCase()
    );
    if (exists) return;
    const used = new Set(customGradients.map((g) => g.id));
    let i = customGradients.length + 1;
    let id = `custom-${i}`;
    while (used.has(id)) {
      i += 1;
      id = `custom-${i}`;
    }
    const preset: GradientPreset = {
      id,
      label: `Custom ${i}`,
      from: settings.gradientFrom,
      to: settings.gradientTo,
    };
    persistCustomGradients([...customGradients, preset]);
  }, [customGradients, settings.gradientFrom, settings.gradientTo, persistCustomGradients]);

  const handleDeleteCustomGradient = React.useCallback(
    (id: string) => {
      persistCustomGradients(customGradients.filter((g) => g.id !== id));
    },
    [customGradients, persistCustomGradients]
  );

  const openSaveDialog = React.useCallback(() => {
    const used = new Set(savedPresets.map((p) => p.name));
    const base = `preset-${savedPresets.length + 1}`;
    let candidate = base;
    let i = 2;
    while (used.has(candidate)) candidate = `${base}-${i++}`;
    setSaveDialogName(candidate);
    setSaveDialogError(null);
    setSaveDialogOpen(true);
  }, [savedPresets]);

  const commitSavePreset = React.useCallback(() => {
    const trimmed = saveDialogName.trim();
    if (!trimmed) {
      setSaveDialogError("Name can't be empty.");
      return;
    }
    if (savedPresets.some((p) => p.name === trimmed)) {
      setSaveDialogError(`A preset named "${trimmed}" already exists.`);
      return;
    }
    const preset: SavedPreset = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      settings,
    };
    persistPresets([...savedPresets, preset]);
    setSaveDialogOpen(false);
  }, [saveDialogName, savedPresets, settings, persistPresets]);

  const handleLoadPreset = React.useCallback((p: SavedPreset) => {
    setSettings({ ...DEFAULT_SETTINGS, ...p.settings });
    setPresetsOpen(false);
  }, []);

  const handleDeletePreset = React.useCallback(
    (id: string) => {
      persistPresets(savedPresets.filter((p) => p.id !== id));
    },
    [savedPresets, persistPresets]
  );

  const onSourceTypeChange = (type: SourceType) => {
    setSettings((s) => {
      if (type === "shape") return { ...s, source: type, sourceLabel: shapeLabel(s.sourceShape) };
      if (type === "text") return { ...s, source: type, sourceLabel: s.sourceText || "Text" };
      if (type === "svg")
        return { ...s, source: type, sourceLabel: s.sourceDataUrl ? s.sourceLabel : "Upload SVG" };
      return { ...s, source: type, sourceLabel: s.sourceDataUrl ? s.sourceLabel : "Upload image" };
    });
  };

  const onFileSelected = async (file: File | null, kind: "svg" | "image") => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setSettings((s) => {
      const useImageColors = kind === "image" ? true : s.useImageColors;
      return {
        ...s,
        source: kind,
        sourceDataUrl: dataUrl,
        sourceLabel: file.name,
        useImageColors,
        // Original image colors override the gradient — leave that tool.
        colorMode:
          useImageColors && s.colorMode === "gradient" ? "preset" : s.colorMode,
      };
    });
  };

  const aiPromptSnippet = React.useMemo(() => buildAiPrompt(settings), [settings]);

  const [promptCopied, setPromptCopied] = React.useState(false);
  const copyAiPrompt = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(aiPromptSnippet);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }, [aiPromptSnippet]);

  const activeGradientPreset = React.useMemo(() => {
    const from = settings.gradientFrom.toLowerCase();
    const to = settings.gradientTo.toLowerCase();
    return (
      [...GRADIENT_PRESETS, ...customGradients].find(
        (g) => g.from.toLowerCase() === from && g.to.toLowerCase() === to
      ) ?? null
    );
  }, [settings.gradientFrom, settings.gradientTo, customGradients]);

  const gradientAlreadySaved = React.useMemo(() => {
    const from = settings.gradientFrom.toLowerCase();
    const to = settings.gradientTo.toLowerCase();
    return [...GRADIENT_PRESETS, ...customGradients].some(
      (g) => g.from.toLowerCase() === from && g.to.toLowerCase() === to
    );
  }, [customGradients, settings.gradientFrom, settings.gradientTo]);

  // When an image is uploaded with "Original colors" on, the image's own
  // pixel colors override any color mode, so the Gradient tool is disabled.
  const imageColorsActive =
    settings.source === "image" && !!settings.sourceDataUrl && settings.useImageColors;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-card)]/60 px-3 py-2 text-[11px] text-[var(--ls-muted-foreground)] sm:hidden">
        <Monitor size={13} className="shrink-0 text-[var(--ls-foreground)]" />
        <span>For the best experience, open this on a desktop — some controls are hidden on mobile.</span>
      </div>
      <section className="rounded-3xl border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 lg:p-2.5">
        <div
          className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--ls-border)] backdrop-blur-sm"
          style={{ backgroundColor: resolvedCanvasBg }}
        >
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={copyAiPrompt}
              title="Copy the AI prompt that recreates this effect"
              className="group inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/50"
            >
              <PixelFireSpinner />
              <span className="font-semibold uppercase tracking-[0.15em]">AI Prompt</span>
              <span
                className={
                  "ml-1 inline-flex items-center gap-1 border-l border-[var(--ls-border)] pl-1.5 text-[10px] transition-colors " +
                  (promptCopied
                    ? "text-[var(--ls-foreground)]"
                    : "text-[var(--ls-foreground)] group-hover:text-orange-500 dark:group-hover:text-orange-400")
                }
              >
                {promptCopied ? (
                  <Check size={11} className="text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Copy size={11} />
                )}
                {promptCopied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="h-[420px] w-full lg:h-[560px]"
            style={{ display: "block" }}
          />
        </div>
      </section>

      {(settings.source === "image" || settings.source === "svg") && settings.sourceDataUrl && (
        <section>
          <AttachSourceTip kind={settings.source} fileName={settings.sourceLabel} />
        </section>
      )}

      <section className="rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-5 backdrop-blur-sm lg:p-6">
        <div className="mb-5 flex items-center justify-between">
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
            {sampling && (
              <span className="rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)]/90 px-2 py-0.5 text-[10px] font-medium text-[var(--ls-muted-foreground)]">
                Sampling…
              </span>
            )}
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause" : "Play"}
              title={playing ? "Pause" : "Play"}
              className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
              title="Undo"
              className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
              title="Redo"
              className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
            >
              <Redo2 size={13} />
            </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
                setSettings((s) => ({ ...s, canvasBg: null }));
              }}
              aria-label="Toggle theme"
              className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <div className="hidden sm:contents">
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              aria-label="Reset"
              title="Reset to defaults"
              className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
            >
              <RotateCcw size={13} />
            </button>
            <Popover open={presetsOpen} onOpenChange={setPresetsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2 py-1 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40"
                  title="Load a saved preset"
                >
                  <Bookmark size={11} />
                  Presets
                  {savedPresets.length > 0 && (
                    <span className="rounded-sm bg-[var(--ls-border)]/60 px-1 text-[9px] tabular-nums text-[var(--ls-muted-foreground)]">
                      {savedPresets.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="luminous-spinners w-[280px] border-[var(--ls-border)] bg-[var(--ls-card)] p-2 text-[var(--ls-foreground)] shadow-xl"
              >
                <p className="mb-2 px-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                  Saved presets
                </p>
                {savedPresets.length === 0 ? (
                  <p className="px-1.5 py-3 text-[11px] text-[var(--ls-muted-foreground)]">
                    No presets yet. Tune the controls and tap{" "}
                    <span className="font-medium text-[var(--ls-foreground)]">Save</span>{" "}
                    to keep this look.
                  </p>
                ) : (
                  <div className="max-h-[260px] space-y-0.5 overflow-y-auto">
                    {savedPresets.map((p) => (
                      <div
                        key={p.id}
                        className="group flex items-center gap-1 rounded-md hover:bg-[var(--ls-border)]/30"
                      >
                        <button
                          type="button"
                          onClick={() => handleLoadPreset(p)}
                          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-[var(--ls-foreground)]"
                          title={`Load ${p.name}`}
                        >
                          <Bookmark
                            size={10}
                            className="shrink-0 text-[var(--ls-muted-foreground)]"
                          />
                          <span className="truncate font-mono">{p.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteCandidate({ id: p.id, name: p.name });
                          }}
                          aria-label={`Delete ${p.name}`}
                          title={`Delete ${p.name}`}
                          className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded text-[var(--ls-muted-foreground)] opacity-0 transition-opacity hover:bg-rose-500/15 hover:text-rose-300 group-hover:opacity-100"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Popover
              open={saveDialogOpen}
              onOpenChange={(open) => {
                if (open) openSaveDialog();
                else setSaveDialogOpen(false);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300"
                  title="Save the current settings as a preset"
                >
                  <Save size={11} />
                  Save
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="luminous-spinners w-[280px] border-[var(--ls-border)] bg-[var(--ls-card)] p-3 text-[var(--ls-foreground)] shadow-xl"
              >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                  Save current as preset
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
                      commitSavePreset();
                    }
                  }}
                  autoFocus
                  spellCheck={false}
                  placeholder="Preset name"
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
                    onClick={commitSavePreset}
                    className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300"
                  >
                    Save
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3 xl:items-start">
          {/* Column 1: Color + Particles */}
          <div className="space-y-4">
          <div className="space-y-4">
          <SectionHeading
            title="Color"
            subtitle="Pick a preset, a custom hex, or a gradient."
          />
          <div className="space-y-3">
            <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
              <SegmentTab
                active={settings.colorMode === "preset"}
                onClick={() => setSettings((s) => ({ ...s, colorMode: "preset" }))}
                label="Preset"
              />
              <SegmentTab
                active={settings.colorMode === "custom"}
                onClick={() => setSettings((s) => ({ ...s, colorMode: "custom" }))}
                label="Custom"
              />
              <SegmentTab
                active={settings.colorMode === "gradient"}
                onClick={() => setSettings((s) => ({ ...s, colorMode: "gradient" }))}
                label="Gradient"
                disabled={imageColorsActive}
                title={
                  imageColorsActive
                    ? "Disabled — the image's original colors are in use"
                    : undefined
                }
              />
            </div>

            <div className="min-h-[100px]">
            {settings.colorMode === "preset" && (
              <div className="grid grid-cols-6 gap-1.5">
                {COLOR_PRESETS.map((p) => {
                  const active = settings.color.toLowerCase() === p.hex.toLowerCase();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, color: p.hex }))}
                      title={p.label}
                      aria-label={p.label}
                      className={
                        "relative h-8 w-full rounded-md border transition-transform hover:scale-105 " +
                        (active
                          ? "border-white/70 ring-2 ring-white/30 ring-offset-1 ring-offset-[var(--ls-card)]"
                          : "border-white/10")
                      }
                      style={{ backgroundColor: p.hex }}
                    />
                  );
                })}
              </div>
            )}

            {settings.colorMode === "custom" && (
              <div className="space-y-1.5">
                <SwatchRow
                  label="Fill"
                  value={settings.color}
                  onChange={(v) => setSettings((s) => ({ ...s, color: v }))}
                />
                {customColors.map((c, i) => (
                  <SwatchRow
                    key={`saved-${i}`}
                    label="Saved"
                    value={c}
                    onChange={(v) => {
                      const next = [...customColors];
                      next[i] = v;
                      persistCustomColors(next);
                    }}
                    onRemove={() =>
                      persistCustomColors(customColors.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
                {customColors.length < MAX_CUSTOM_COLORS && (
                  <button
                    type="button"
                    onClick={() => {
                      if (customColors.includes(settings.color)) return;
                      persistCustomColors([...customColors, settings.color]);
                    }}
                    disabled={customColors.includes(settings.color)}
                    title={
                      customColors.includes(settings.color)
                        ? "This color is already saved"
                        : "Save current Fill as a custom color"
                    }
                    aria-label="Add custom color"
                    className="flex h-[44px] w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--ls-border)] bg-[var(--ls-card)]/40 text-[11px] font-medium text-[var(--ls-muted-foreground)] transition-colors hover:border-white/40 hover:bg-[var(--ls-border)]/30 hover:text-[var(--ls-foreground)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]/40"
                  >
                    <Plus size={13} />
                    Add color
                  </button>
                )}
              </div>
            )}

            {settings.colorMode === "gradient" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Popover
                    open={gradientPresetsOpen}
                    onOpenChange={setGradientPresetsOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex flex-1 items-center gap-2 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-1.5 text-left transition-colors hover:bg-[var(--ls-border)]/40"
                        title="Pick a gradient preset"
                      >
                        <span
                          className="h-6 flex-1 rounded-sm border border-white/10"
                          style={{
                            background: `linear-gradient(${settings.gradientAngle}deg, ${gradientCssString(settings)})`,
                          }}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--ls-muted-foreground)]">
                          {activeGradientPreset?.label ?? "Custom"}
                        </span>
                        <ChevronDown
                          size={12}
                          className="shrink-0 text-[var(--ls-muted-foreground)]"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      sideOffset={6}
                      className="luminous-spinners w-[280px] border-[var(--ls-border)] bg-[var(--ls-card)] p-2 text-[var(--ls-foreground)] shadow-xl"
                    >
                      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                        Gradient presets
                      </p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {GRADIENT_PRESETS.map((g) => {
                          const active =
                            settings.gradientFrom.toLowerCase() === g.from.toLowerCase() &&
                            settings.gradientTo.toLowerCase() === g.to.toLowerCase();
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setSettings((s) => ({
                                  ...s,
                                  gradientFrom: g.from,
                                  gradientTo: g.to,
                                }));
                                setGradientPresetsOpen(false);
                              }}
                              title={g.label}
                              aria-label={g.label}
                              className={
                                "h-8 w-full rounded-md border transition-transform hover:scale-105 " +
                                (active
                                  ? "border-white/70 ring-2 ring-white/30 ring-offset-1 ring-offset-[var(--ls-card)]"
                                  : "border-white/10")
                              }
                              style={{
                                background: `linear-gradient(${settings.gradientAngle}deg, ${g.from}, ${g.to})`,
                              }}
                            />
                          );
                        })}
                      </div>
                      {customGradients.length > 0 && (
                        <>
                          <p className="mb-2 mt-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ls-muted-foreground)]">
                            Your gradients
                          </p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {customGradients.map((g) => {
                              const active =
                                settings.gradientFrom.toLowerCase() === g.from.toLowerCase() &&
                                settings.gradientTo.toLowerCase() === g.to.toLowerCase();
                              return (
                                <div key={g.id} className="group relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSettings((s) => ({
                                        ...s,
                                        gradientFrom: g.from,
                                        gradientTo: g.to,
                                      }));
                                      setGradientPresetsOpen(false);
                                    }}
                                    title={g.label}
                                    aria-label={g.label}
                                    className={
                                      "h-8 w-full rounded-md border transition-transform hover:scale-105 " +
                                      (active
                                        ? "border-white/70 ring-2 ring-white/30 ring-offset-1 ring-offset-[var(--ls-card)]"
                                        : "border-white/10")
                                    }
                                    style={{
                                      background: `linear-gradient(${settings.gradientAngle}deg, ${g.from}, ${g.to})`,
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCustomGradient(g.id);
                                    }}
                                    aria-label={`Delete ${g.label}`}
                                    title="Delete"
                                    className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] opacity-0 transition-opacity hover:bg-rose-500/20 hover:text-rose-300 group-hover:opacity-100"
                                  >
                                    <X size={8} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={handleAddCustomGradient}
                        disabled={gradientAlreadySaved}
                        title={
                          gradientAlreadySaved
                            ? "This gradient is already saved"
                            : "Save current From / To as a custom gradient"
                        }
                        className="mt-2.5 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--ls-border)] bg-[var(--ls-card)] text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
                      >
                        <Plus size={12} />
                        Save current as custom
                      </button>
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-1.5">
                    <AngleDial
                      value={settings.gradientAngle}
                      onChange={(v) => setSettings((s) => ({ ...s, gradientAngle: v }))}
                    />
                    <span className="min-w-[2.5rem] text-right font-mono text-[11px] tabular-nums text-[var(--ls-muted-foreground)]">
                      {settings.gradientAngle}°
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(() => {
                    const stops = getGradientStops(settings);
                    const handleSwap = (a: number, b: number) => {
                      if (a === b) return;
                      const next = [...stops];
                      [next[a], next[b]] = [next[b], next[a]];
                      setSettings((s) => ({
                        ...s,
                        gradientFrom: next[0],
                        gradientMidStops: next.slice(1, -1),
                        gradientTo: next[next.length - 1],
                      }));
                    };
                    const cards: React.ReactNode[] = [];
                    cards.push(
                      <SwatchRow
                        key="from"
                        label="From"
                        value={settings.gradientFrom}
                        onChange={(v) => setSettings((s) => ({ ...s, gradientFrom: v }))}
                        dragIndex={0}
                        onDragStartStop={() => {}}
                        onDropStop={(target) => handleSwap(0, target)}
                      />
                    );
                    for (let idx = 0; idx < MAX_GRADIENT_MID_STOPS; idx++) {
                      const value = settings.gradientMidStops[idx];
                      const stopIndex = idx + 1;
                      if (value !== undefined) {
                        cards.push(
                          <SwatchRow
                            key={`mid-${idx}`}
                            label="—"
                            value={value}
                            onChange={(v) =>
                              setSettings((s) => {
                                const next = [...s.gradientMidStops];
                                next[idx] = v;
                                return { ...s, gradientMidStops: next };
                              })
                            }
                            onRemove={() =>
                              setSettings((s) => ({
                                ...s,
                                gradientMidStops: s.gradientMidStops.filter((_, i) => i !== idx),
                              }))
                            }
                            dragIndex={stopIndex}
                            onDragStartStop={() => {}}
                            onDropStop={(target) => handleSwap(stopIndex, target)}
                          />
                        );
                      } else {
                        const nextStopExists = settings.gradientMidStops[idx - 1] !== undefined;
                        const enabled = idx === 0 || nextStopExists;
                        cards.push(
                          <button
                            key={`mid-${idx}`}
                            type="button"
                            disabled={!enabled}
                            onClick={() => {
                              const mid = blendHex(
                                settings.gradientFrom,
                                settings.gradientTo,
                                0.5
                              );
                              setSettings((s) => ({
                                ...s,
                                gradientMidStops: [...s.gradientMidStops, mid].slice(
                                  0,
                                  MAX_GRADIENT_MID_STOPS
                                ),
                              }));
                            }}
                            title={
                              enabled
                                ? "Add an intermediate gradient stop"
                                : "Add the previous stop first"
                            }
                            aria-label="Add gradient stop"
                            className="flex h-full min-h-[44px] w-full items-center justify-center rounded-md border border-dashed border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] transition-colors hover:border-white/40 hover:bg-[var(--ls-border)]/30 hover:text-[var(--ls-foreground)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[var(--ls-card)]"
                          >
                            <Plus size={14} />
                          </button>
                        );
                      }
                    }
                    const toIndex = stops.length - 1;
                    cards.push(
                      <SwatchRow
                        key="to"
                        label="To"
                        value={settings.gradientTo}
                        onChange={(v) => setSettings((s) => ({ ...s, gradientTo: v }))}
                        dragIndex={toIndex}
                        onDragStartStop={() => {}}
                        onDropStop={(target) => handleSwap(toIndex, target)}
                      />
                    );
                    return cards;
                  })()}
                </div>
              </div>
            )}
            </div>
          </div>
          </div>

          <div className="space-y-4">
          <SectionHeading title="Canvas" subtitle="Background color behind the particles." />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SwatchRow
                label="Background"
                value={resolvedCanvasBg}
                onChange={(v) => setSettings((s) => ({ ...s, canvasBg: v }))}
              />
            </div>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, canvasBg: null }))}
              disabled={settings.canvasBg === null}
              title="Follow theme"
              className="h-9 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 text-[11px] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--ls-card)]"
            >
              Auto
            </button>
          </div>

          <SectionHeading title="Particles" subtitle="Density and motion." />
          <TickSlider
            label="Particles"
            value={settings.count}
            min={200}
            max={50000}
            step={100}
            editable
            onChange={(v) => setSettings((s) => ({ ...s, count: v }))}
          />
          <TickSlider
            label="Size"
            value={settings.size}
            min={0.5}
            max={6}
            step={0.1}
            unit="px"
            onChange={(v) => setSettings((s) => ({ ...s, size: v }))}
          />
          <TickSlider
            label="Speed"
            value={settings.speed}
            min={0.2}
            max={3}
            step={0.05}
            onChange={(v) => setSettings((s) => ({ ...s, speed: v }))}
          />
          <TickSlider
            label="Drift"
            value={settings.drift}
            min={0}
            max={3}
            step={0.05}
            onChange={(v) => setSettings((s) => ({ ...s, drift: v }))}
          />
          </div>

          </div>

          {/* Column 2: Source + Mouse */}
          <div className="space-y-4">
          <div className="space-y-4">
          <SectionHeading title="Source" subtitle="Particles form the shape you pick." />
          <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
            <SourceTab
              active={settings.source === "shape"}
              onClick={() => onSourceTypeChange("shape")}
              icon={<Shapes className="h-3.5 w-3.5" />}
              label="Shape"
            />
            <SourceTab
              active={settings.source === "text"}
              onClick={() => onSourceTypeChange("text")}
              icon={<Type className="h-3.5 w-3.5" />}
              label="Text"
            />
            <SourceTab
              active={settings.source === "svg"}
              onClick={() => onSourceTypeChange("svg")}
              icon={<Upload className="h-3.5 w-3.5" />}
              label="SVG"
            />
            <SourceTab
              active={settings.source === "image"}
              onClick={() => onSourceTypeChange("image")}
              icon={<ImageIcon className="h-3.5 w-3.5" />}
              label="Image"
            />
          </div>

          {settings.source === "shape" && (
            <ShapePicker
              activeId={settings.sourceShape}
              onPick={(id, label) =>
                setSettings((s) => ({ ...s, sourceShape: id, sourceLabel: label }))
              }
              scale={settings.iconScale}
              onScale={(v) => setSettings((s) => ({ ...s, iconScale: v }))}
            />
          )}

          {settings.source === "text" && (
            <div className="space-y-2.5">
              <input
                type="text"
                value={settings.sourceText}
                maxLength={20}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    sourceText: e.target.value,
                    sourceLabel: e.target.value || "Text",
                  }))
                }
                placeholder="Type something…"
                className="h-9 w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-2.5 font-mono text-xs text-[var(--ls-foreground)] outline-none focus:border-white/40"
              />
              <div className="grid grid-cols-5 gap-1">
                {TEXT_FONTS.map((f) => {
                  const active = settings.textFont === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, textFont: f.id }))}
                      title={f.label}
                      aria-label={f.label}
                      className={
                        "h-9 rounded-md border text-[11px] transition-colors " +
                        (active
                          ? "border-white/50 bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                          : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]")
                      }
                      style={{ fontFamily: f.family, fontWeight: f.weight }}
                    >
                      Ag
                    </button>
                  );
                })}
              </div>
              <SizeControl
                label="Text size"
                value={settings.textScale}
                onChange={(v) => setSettings((s) => ({ ...s, textScale: v }))}
              />
            </div>
          )}

          {settings.source === "svg" && (
            <>
              <FilePicker
                accept=".svg,image/svg+xml"
                label={settings.sourceDataUrl ? settings.sourceLabel : "Choose an SVG file"}
                onFile={(f) => void onFileSelected(f, "svg")}
              />
              <div
                aria-disabled={!settings.sourceDataUrl}
                className={
                  "transition-opacity " +
                  (settings.sourceDataUrl ? "" : "pointer-events-none opacity-40 select-none")
                }
              >
                <SizeControl
                  label="SVG size"
                  value={settings.svgScale}
                  onChange={(v) => setSettings((s) => ({ ...s, svgScale: v }))}
                />
              </div>
            </>
          )}

          {settings.source === "image" && (
            <>
              <FilePicker
                accept="image/png,image/jpeg,image/webp"
                label={settings.sourceDataUrl ? settings.sourceLabel : "Choose an image"}
                onFile={(f) => void onFileSelected(f, "image")}
              />
              <div
                aria-disabled={!settings.sourceDataUrl}
                className={
                  "transition-opacity " +
                  (settings.sourceDataUrl ? "" : "pointer-events-none opacity-40 select-none")
                }
              >
                <SizeControl
                  label="Image size"
                  value={settings.imageScale}
                  onChange={(v) => setSettings((s) => ({ ...s, imageScale: v }))}
                />
              </div>
              <div
                aria-disabled={!settings.sourceDataUrl}
                className={
                  "flex items-start justify-between gap-3 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)]/50 p-3 transition-opacity " +
                  (settings.sourceDataUrl ? "" : "pointer-events-none opacity-40 select-none")
                }
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ls-foreground)]">
                    Original colors
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--ls-muted-foreground)]">
                    Trace every visible pixel of the image in its original color. Only transparent areas are skipped.
                  </p>
                </div>
                <Switch
                  checked={settings.useImageColors}
                  onChange={(v) =>
                    setSettings((s) => ({
                      ...s,
                      useImageColors: v,
                      // Turning Original on overrides the gradient — leave that tool.
                      colorMode:
                        v && s.colorMode === "gradient" ? "preset" : s.colorMode,
                    }))
                  }
                  label="Use original image colors"
                />
              </div>
            </>
          )}
          </div>

          <div className="space-y-4">
          <SectionHeading title="Mouse" subtitle="Hover the canvas to interact." />

          <div className="space-y-2">
            <div className="inline-flex w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-0.5">
              <SegmentTab
                active={settings.mouseMode === "repel"}
                onClick={() => setSettings((s) => ({ ...s, mouseMode: "repel" }))}
                label="Repel"
              />
              <SegmentTab
                active={settings.mouseMode === "attract"}
                onClick={() => setSettings((s) => ({ ...s, mouseMode: "attract" }))}
                label="Attract"
              />
              <SegmentTab
                active={settings.mouseMode === "circle"}
                onClick={() => setSettings((s) => ({ ...s, mouseMode: "circle" }))}
                label="Circle"
              />
            </div>
            <p className="text-[10px] text-[var(--ls-muted-foreground)]">
              {settings.mouseMode === "repel"
                ? "Push particles away from the cursor."
                : settings.mouseMode === "attract"
                ? "Pull particles toward the cursor — opposite of Repel."
                : "Capture particles inside the cursor's disc."}
            </p>
          </div>

          <TickSlider
            label="Radius"
            value={settings.mouseRadius}
            min={0}
            max={240}
            step={1}
            unit="px"
            onChange={(v) => setSettings((s) => ({ ...s, mouseRadius: v }))}
          />
          <TickSlider
            label="Force"
            value={settings.mouseForce}
            min={0}
            max={120}
            step={1}
            onChange={(v) => setSettings((s) => ({ ...s, mouseForce: v }))}
          />
          </div>

          </div>

          {/* Column 3: Effects */}
          <div className="space-y-3">
            <SectionHeading title="Effects" subtitle="Layer extras on top of the base render." />
            <EffectCard
              label="Glow"
              hint="Soft additive halo around each particle."
              on={settings.glow}
              onToggle={(v) => setSettings((s) => ({ ...s, glow: v }))}
              slider={
                <TickSlider
                  label="Strength"
                  value={settings.glowStrength}
                  min={0.1}
                  max={1.5}
                  step={0.05}
                  onChange={(v) => setSettings((s) => ({ ...s, glowStrength: v }))}
                />
              }
            />
            <EffectCard
              label="Twinkle"
              hint="Per-particle alpha pulsing — like glitter."
              on={settings.twinkle}
              onToggle={(v) => setSettings((s) => ({ ...s, twinkle: v }))}
              slider={
                <TickSlider
                  label="Speed"
                  value={settings.twinkleSpeed}
                  min={0.2}
                  max={4}
                  step={0.05}
                  onChange={(v) => setSettings((s) => ({ ...s, twinkleSpeed: v }))}
                />
              }
            />
            <EffectCard
              label="Hue cycle"
              hint="Slowly rotates the color through the spectrum."
              on={settings.hueCycle}
              onToggle={(v) => setSettings((s) => ({ ...s, hueCycle: v }))}
              slider={
                <TickSlider
                  label="Speed"
                  value={settings.hueSpeed}
                  min={0.02}
                  max={1}
                  step={0.01}
                  onChange={(v) => setSettings((s) => ({ ...s, hueSpeed: v }))}
                />
              }
            />
            <EffectCard
              label="Trails"
              hint="Particles leave fading streaks as they move."
              on={settings.trails}
              onToggle={(v) => setSettings((s) => ({ ...s, trails: v }))}
              slider={
                <TickSlider
                  label="Fade"
                  value={settings.trailFade}
                  min={0.03}
                  max={0.5}
                  step={0.01}
                  onChange={(v) => setSettings((s) => ({ ...s, trailFade: v }))}
                />
              }
            />
            <EffectCard
              label="Constellation"
              hint="Connect nearby particles with lines."
              on={settings.constellation}
              onToggle={(v) => setSettings((s) => ({ ...s, constellation: v }))}
              slider={
                <TickSlider
                  label="Distance"
                  value={settings.constellationDist}
                  min={20}
                  max={160}
                  step={1}
                  unit="px"
                  onChange={(v) => setSettings((s) => ({ ...s, constellationDist: v }))}
                />
              }
            />
            <EffectCard
              label="Velocity boost"
              hint="Fast particles render brighter, settled ones dim."
              on={settings.velocityBoost}
              onToggle={(v) => setSettings((s) => ({ ...s, velocityBoost: v }))}
            />
          </div>

        </div>
      </section>

      <ConfirmSheet
        open={deleteCandidate !== null}
        title={
          deleteCandidate ? `Delete preset "${deleteCandidate.name}"?` : ""
        }
        description="This can't be undone — the preset will be removed from your saved list."
        confirmLabel="Delete"
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={() => {
          if (!deleteCandidate) return;
          handleDeletePreset(deleteCandidate.id);
          setDeleteCandidate(null);
        }}
      />

      <ConfirmSheet
        open={resetConfirmOpen}
        title="Reset all controls?"
        description="Source, color, motion, and effect settings will return to their defaults. Saved presets aren't affected."
        confirmLabel="Reset"
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          reset();
          setResetConfirmOpen(false);
        }}
      />
    </div>
  );
}

/* ============ Renderers ============ */

function renderArcs(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  s: Settings,
  width: number,
  height: number,
  now: number,
  canvasBg: string
) {
  const TAU = Math.PI * 2;
  const t = now * 0.001;
  const hueShift = s.hueCycle ? (t * s.hueSpeed * 360) % 360 : 0;

  if (s.trails) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const fadeAlpha = Math.max(0.02, Math.min(1, s.trailFade));
    const { r, g, b } = hexToRgb(canvasBg);
    ctx.fillStyle = `rgba(${r},${g},${b},${fadeAlpha})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  let fillStyle: string | CanvasGradient;
  if (s.colorMode === "gradient") {
    const stops = getGradientStops(s).map((c) =>
      hueShift ? shiftHueHex(c, hueShift) : c
    );
    const coords = gradientAngleToCoords(s.gradientAngle, width, height);
    const g = ctx.createLinearGradient(coords.x0, coords.y0, coords.x1, coords.y1);
    const last = Math.max(1, stops.length - 1);
    stops.forEach((c, i) => g.addColorStop(i / last, c));
    fillStyle = g;
  } else {
    fillStyle = hueShift ? shiftHueHex(s.color, hueShift) : s.color;
  }

  ctx.globalCompositeOperation = s.glow ? "lighter" : "source-over";
  ctx.fillStyle = fillStyle;

  const useImageColors = s.useImageColors && s.source === "image";
  const perParticle = s.twinkle || s.velocityBoost || s.glow || useImageColors;
  const haloSize = s.size * (2.4 + s.glowStrength * 1.8);
  const haloAlpha = 0.18 + s.glowStrength * 0.35;

  if (!perParticle) {
    ctx.globalAlpha = 1;
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.moveTo(p.x + s.size, p.y);
      ctx.arc(p.x, p.y, s.size, 0, TAU);
    }
    ctx.fill();
  } else {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let alpha = 1;
      if (s.twinkle) {
        alpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 3 * s.twinkleSpeed + p.seed));
      }
      if (s.velocityBoost) {
        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        alpha *= Math.min(1, 0.3 + sp * 0.35);
      }
      if (useImageColors && p.hasColor) {
        ctx.fillStyle = `rgb(${p.cr},${p.cg},${p.cb})`;
      }
      if (s.glow) {
        ctx.globalAlpha = alpha * haloAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloSize, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, s.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (s.constellation) {
    ctx.globalCompositeOperation = "source-over";
    drawConstellation(ctx, particles, s, width, height);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

function drawConstellation(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  s: Settings,
  width: number,
  height: number
) {
  const maxD = Math.max(8, s.constellationDist);
  const maxD2 = maxD * maxD;
  const cellSize = maxD;
  const cols = Math.max(1, Math.ceil(width / cellSize));
  const rows = Math.max(1, Math.ceil(height / cellSize));
  const grid: number[][] = new Array(cols * rows);
  for (let i = 0; i < grid.length; i++) grid[i] = [];

  const max = Math.min(particles.length, 2500);
  for (let i = 0; i < max; i++) {
    const p = particles[i];
    const cx = Math.max(0, Math.min(cols - 1, (p.x / cellSize) | 0));
    const cy = Math.max(0, Math.min(rows - 1, (p.y / cellSize) | 0));
    grid[cy * cols + cx].push(i);
  }

  ctx.lineWidth = 0.5;
  const baseColor = s.colorMode === "gradient" ? s.gradientTo : s.color;
  const rgb = hexToRgb(baseColor);

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const cell = grid[cy * cols + cx];
      if (!cell.length) continue;
      for (let dy = 0; dy <= 1; dy++) {
        for (let dx = dy === 0 ? 0 : -1; dx <= 1; dx++) {
          const ncx = cx + dx;
          const ncy = cy + dy;
          if (ncx < 0 || ncx >= cols || ncy < 0 || ncy >= rows) continue;
          const neighbor = grid[ncy * cols + ncx];
          if (!neighbor.length) continue;
          for (const i of cell) {
            const p = particles[i];
            for (const j of neighbor) {
              if (i >= j) continue;
              const q = particles[j];
              const ddx = p.x - q.x;
              const ddy = p.y - q.y;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 < maxD2) {
                const a = 1 - d2 / maxD2;
                ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.4})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
              }
            }
          }
        }
      }
    }
  }
}

function shiftHueHex(hex: string, deg: number): string {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.h = (((hsl.h + deg / 360) % 1) + 1) % 1;
  const out = hslToRgb(hsl.h, hsl.s, hsl.l);
  return `rgb(${out.r},${out.g},${out.b})`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, tt: number) => {
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function renderImageData(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: Particle[],
  s: Settings,
  cssWidth: number,
  dpr: number,
  bufRef: React.RefObject<ImageBuffer | null>
) {
  const pixW = canvas.width;
  const pixH = canvas.height;

  let buf = bufRef.current;
  if (!buf || buf.w !== pixW || buf.h !== pixH) {
    const imageData = ctx.createImageData(pixW, pixH);
    buf = { imageData, data: imageData.data, w: pixW, h: pixH };
    bufRef.current = buf;
  }
  const data = buf.data;
  data.fill(0);

  const useImageColors = s.useImageColors && s.source === "image";
  const isGradient = !useImageColors && s.colorMode === "gradient";
  const lutR = new Uint8Array(256);
  const lutG = new Uint8Array(256);
  const lutB = new Uint8Array(256);
  let solidR = 0;
  let solidG = 0;
  let solidB = 0;

  if (isGradient) {
    const stopRgb = getGradientStops(s).map(hexToRgb);
    const segments = Math.max(1, stopRgb.length - 1);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      const segF = Math.min(segments - 1, Math.floor(t * segments));
      const segStart = segF / segments;
      const segEnd = (segF + 1) / segments;
      const localT = (t - segStart) / Math.max(1e-6, segEnd - segStart);
      const a = stopRgb[segF];
      const b = stopRgb[segF + 1];
      lutR[i] = Math.round(a.r + (b.r - a.r) * localT);
      lutG[i] = Math.round(a.g + (b.g - a.g) * localT);
      lutB[i] = Math.round(a.b + (b.b - a.b) * localT);
    }
  } else if (!useImageColors) {
    const c = hexToRgb(s.color);
    solidR = c.r;
    solidG = c.g;
    solidB = c.b;
  }

  const stamp = Math.max(1, Math.round(s.size * dpr));
  const half = (stamp - 1) >> 1;
  const cssHeight = pixH / Math.max(0.0001, dpr);
  const gradCoords = isGradient
    ? gradientAngleToCoords(s.gradientAngle, cssWidth, cssHeight)
    : null;
  const gradDx = gradCoords ? gradCoords.x1 - gradCoords.x0 : 0;
  const gradDy = gradCoords ? gradCoords.y1 - gradCoords.y0 : 0;
  const gradLenSq = Math.max(1e-6, gradDx * gradDx + gradDy * gradDy);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const px = (p.x * dpr) | 0;
    const py = (p.y * dpr) | 0;
    if (px < -half || px >= pixW + half || py < -half || py >= pixH + half) continue;

    let r: number;
    let g: number;
    let b: number;
    if (useImageColors && p.hasColor) {
      r = p.cr;
      g = p.cg;
      b = p.cb;
    } else if (isGradient && gradCoords) {
      const t = ((p.x - gradCoords.x0) * gradDx + (p.y - gradCoords.y0) * gradDy) / gradLenSq;
      let u = (t * 255) | 0;
      if (u < 0) u = 0;
      else if (u > 255) u = 255;
      r = lutR[u];
      g = lutG[u];
      b = lutB[u];
    } else {
      r = solidR;
      g = solidG;
      b = solidB;
    }

    const y0 = Math.max(0, py - half);
    const y1 = Math.min(pixH - 1, py + half);
    const x0 = Math.max(0, px - half);
    const x1 = Math.min(pixW - 1, px + half);
    for (let sy = y0; sy <= y1; sy++) {
      let idx = (sy * pixW + x0) * 4;
      for (let sx = x0; sx <= x1; sx++) {
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
        idx += 4;
      }
    }
  }

  ctx.putImageData(buf.imageData, 0, 0);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  };
}

/* ============ UI bits ============ */

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--ls-foreground)]">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-xs text-[var(--ls-muted-foreground)]">{subtitle}</p>
      )}
    </div>
  );
}

function AngleDial({
  value,
  onChange,
  size = 32,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const setFromEvent = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      if (e.shiftKey) angle = Math.round(angle / 15) * 15;
      else angle = Math.round(angle);
      onChange(angle % 360);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return;
    setFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const rad = (value * Math.PI) / 180;
  const tipX = Math.sin(rad);
  const tipY = -Math.cos(rad);

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label="Gradient angle"
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={value}
      title={`Gradient angle: ${value}° (drag, Shift = snap 15°)`}
      className="relative shrink-0 cursor-grab touch-none rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] transition-colors hover:bg-[var(--ls-border)]/40 active:cursor-grabbing"
      style={{ width: size, height: size }}
    >
      {dragging && (
        <div
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--ls-foreground)] shadow-lg"
          style={{ bottom: `calc(100% + 6px)` }}
        >
          {value}°
        </div>
      )}
      <svg
        viewBox="-1 -1 2 2"
        className="absolute inset-0 h-full w-full text-[var(--ls-foreground)]"
      >
        <defs>
          <radialGradient id="angle-tip" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="45%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
          <radialGradient id="angle-tip-spec" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="0.92" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.06" />
        <line
          x1="0"
          y1="0"
          x2={tipX * 0.8}
          y2={tipY * 0.8}
          stroke="currentColor"
          strokeWidth="0.18"
          strokeLinecap="round"
        />
        <circle
          cx={tipX * 0.8}
          cy={tipY * 0.8}
          r="0.2"
          fill="rgba(0,0,0,0.45)"
          transform={`translate(${tipX * 0.02} ${tipY * 0.02 + 0.04})`}
        />
        <circle cx={tipX * 0.8} cy={tipY * 0.8} r="0.19" fill="url(#angle-tip)" stroke="#881337" strokeWidth="0.02" />
        <ellipse
          cx={tipX * 0.8 - 0.06}
          cy={tipY * 0.8 - 0.07}
          rx="0.09"
          ry="0.06"
          fill="url(#angle-tip-spec)"
        />
        <circle cx="0" cy="0" r="0.1" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={
        "relative h-5 w-9 shrink-0 rounded-full border transition-colors " +
        (checked
          ? "border-transparent bg-[var(--ls-foreground)]"
          : "border-[var(--ls-border)] bg-[var(--ls-card)]")
      }
    >
      <span
        className={
          "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full shadow transition-transform " +
          (checked
            ? "left-[18px] bg-[var(--ls-card)]"
            : "left-[2px] bg-[var(--ls-foreground)]/70")
        }
      />
    </button>
  );
}

function EffectCard({
  label,
  hint,
  on,
  onToggle,
  slider,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onToggle: (v: boolean) => void;
  slider?: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-md border p-3 transition-colors " +
        (on
          ? "border-[var(--ls-border)] bg-[var(--ls-card)]/80"
          : "border-[var(--ls-border)]/60 bg-[var(--ls-card)]/30")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ls-foreground)]">
            {label}
          </p>
          {hint && (
            <p className="mt-0.5 text-[10px] text-[var(--ls-muted-foreground)]">{hint}</p>
          )}
        </div>
        <Switch checked={on} onChange={onToggle} label={label} />
      </div>
      {on && slider && <div className="mt-3">{slider}</div>}
    </div>
  );
}

function SourceTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex flex-1 items-center justify-center gap-1.5 rounded-[5px] px-2 py-1.5 text-[11px] font-medium transition-colors " +
        (active
          ? "bg-[var(--ls-foreground)] text-[var(--ls-card)]"
          : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
      }
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SegmentTab({
  active,
  onClick,
  label,
  disabled = false,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        "flex-1 rounded-[5px] py-1.5 text-[11px] font-medium transition-colors " +
        (disabled
          ? "cursor-not-allowed text-[var(--ls-muted-foreground)]/40"
          : active
            ? "bg-[var(--ls-foreground)] text-[var(--ls-card)]"
            : "text-[var(--ls-muted-foreground)] hover:text-[var(--ls-foreground)]")
      }
    >
      {label}
    </button>
  );
}

function SwatchRow({
  label,
  value,
  onChange,
  onRemove,
  dragIndex,
  onDragStartStop,
  onDropStop,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
  dragIndex?: number;
  onDragStartStop?: (i: number) => void;
  onDropStop?: (i: number) => void;
}) {
  const [dragOver, setDragOver] = React.useState(false);
  const justDraggedRef = React.useRef(false);
  const draggable = dragIndex !== undefined && onDragStartStop !== undefined;
  return (
    <div
      className={
        "group relative rounded-md transition-shadow " +
        (dragOver ? "ring-2 ring-white/60 ring-offset-1 ring-offset-[var(--ls-card)]" : "")
      }
      draggable={draggable}
      onDragStart={
        draggable
          ? (e) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(dragIndex));
              onDragStartStop?.(dragIndex!);
              justDraggedRef.current = true;
            }
          : undefined
      }
      onDragEnd={
        draggable
          ? () => {
              window.setTimeout(() => {
                justDraggedRef.current = false;
              }, 150);
            }
          : undefined
      }
      onDragOver={
        onDropStop !== undefined
          ? (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (!dragOver) setDragOver(true);
            }
          : undefined
      }
      onDragLeave={onDropStop !== undefined ? () => setDragOver(false) : undefined}
      onDrop={
        onDropStop !== undefined
          ? (e) => {
              e.preventDefault();
              setDragOver(false);
              const src = Number(e.dataTransfer.getData("text/plain"));
              if (!Number.isNaN(src) && dragIndex !== undefined && src !== dragIndex) {
                onDropStop(src);
              }
              justDraggedRef.current = true;
              window.setTimeout(() => {
                justDraggedRef.current = false;
              }, 150);
            }
          : undefined
      }
      onClickCapture={(e) => {
        if (justDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <ColorPickerPopover
        value={value}
        onChange={onChange}
        trigger={
          <button
            type="button"
            aria-label={`${label} color`}
            title={draggable ? "Drag to swap with another stop" : undefined}
            className={
              "flex w-full items-center gap-2.5 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] p-2 text-left transition-colors hover:bg-[var(--ls-border)]/40 " +
              (draggable ? "cursor-grab active:cursor-grabbing" : "")
            }
          >
            <span
              className="pointer-events-none relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-inner ring-1 ring-black/30"
              style={{ backgroundColor: value }}
            />
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-[11px] font-medium text-[var(--ls-foreground)]">
                {label}
              </span>
              <span className="truncate font-mono text-[10px] uppercase text-[var(--ls-muted-foreground)]">
                {value}
              </span>
            </span>
          </button>
        }
      />
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          title="Remove stop"
          className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] opacity-0 transition-opacity hover:bg-rose-500/20 hover:text-rose-300 group-hover:opacity-100"
        >
          <X size={8} />
        </button>
      )}
    </div>
  );
}

function blendHex(a: string, b: string, t: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(mix(ra.r, rb.r))}${toHex(mix(ra.g, rb.g))}${toHex(mix(ra.b, rb.b))}`;
}

const SIZE_PRESETS: { label: string; value: number }[] = [
  { label: "S", value: 0.4 },
  { label: "M", value: 0.7 },
  { label: "L", value: 1.0 },
  { label: "XL", value: 1.35 },
];

function SizeControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-4 gap-1">
        {SIZE_PRESETS.map((p) => {
          const active = Math.abs(value - p.value) < 0.02;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(p.value)}
              className={
                "h-7 rounded-md border text-[10px] font-semibold uppercase tracking-wider transition-colors " +
                (active
                  ? "border-white/40 bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                  : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]")
              }
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <DialSlider
        label={label}
        value={value}
        min={0.2}
        max={1.5}
        step={0.01}
        warnAbove={0.9}
        editable
        onChange={onChange}
      />
    </div>
  );
}

function ShapePicker({
  activeId,
  onPick,
  scale,
  onScale,
}: {
  activeId: ShapeId;
  onPick: (id: ShapeId, label: string) => void;
  scale: number;
  onScale: (v: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const favorites = FAVORITE_SHAPES;
  const activeShape = SHAPES_BY_ID[activeId] ?? favorites[0];
  const isFavorite = FAVORITE_SHAPE_IDS.includes(activeId);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? LUCIDE_SHAPES.filter((s) => s.label.toLowerCase().includes(q))
    : LUCIDE_SHAPES;

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-5 gap-1.5">
        {favorites.map(({ id, label, Icon }) => {
          const active = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id, label)}
              className={
                "flex h-12 items-center justify-center rounded-md border transition-colors " +
                (active
                  ? "border-white/40 bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                  : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]")
              }
              aria-label={label}
              title={label}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </button>
          );
        })}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={
                "flex h-12 items-center justify-center gap-1 rounded-md border transition-colors " +
                (!isFavorite
                  ? "border-white/40 bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                  : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]")
              }
              aria-label="Browse icons"
              title="Browse icons"
            >
              {!isFavorite ? (
                <activeShape.Icon className="h-5 w-5" strokeWidth={2} />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={6}
            className="luminous-spinners w-[min(360px,calc(100vw-2rem))] border-[var(--ls-border)] bg-[var(--ls-card)] p-3"
          >
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ls-muted-foreground)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="h-8 w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] pl-7 pr-2 text-xs text-[var(--ls-foreground)] outline-none placeholder:text-[var(--ls-muted-foreground)] focus:border-white/40"
                autoFocus
              />
            </div>
            <div className="grid max-h-72 grid-cols-6 gap-1 overflow-y-auto p-0.5">
              {filtered.map(({ id, label, Icon }) => {
                const active = activeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onPick(id, label);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={
                      "flex h-10 items-center justify-center rounded-md border transition-colors " +
                      (active
                        ? "border-white/50 bg-[var(--ls-border)]/60 text-[var(--ls-foreground)]"
                        : "border-[var(--ls-border)]/60 bg-[var(--ls-card)] text-[var(--ls-muted-foreground)] hover:bg-[var(--ls-border)]/40 hover:text-[var(--ls-foreground)]")
                    }
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-6 py-6 text-center text-[11px] text-[var(--ls-muted-foreground)]">
                  No icons match “{query}”
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <SizeControl label="Icon size" value={scale} onChange={onScale} />
    </div>
  );
}

function fileMatchesAccept(file: File, accept: string): boolean {
  const parts = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return parts.some((p) => {
    if (p.startsWith(".")) return name.endsWith(p);
    if (p.endsWith("/*")) return type.startsWith(p.slice(0, -1));
    return type === p;
  });
}

function FilePicker({
  accept,
  label,
  onFile,
  size = "sm",
  hint,
}: {
  accept: string;
  label: string;
  onFile: (file: File | null) => void;
  size?: "sm" | "lg";
  hint?: string;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  const [dragState, setDragState] = React.useState<"idle" | "valid" | "invalid">("idle");
  const dragDepthRef = React.useRef(0);

  const stateClasses =
    dragState === "valid"
      ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : dragState === "invalid"
        ? "border-rose-400/60 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        : "border-[var(--ls-border)] bg-[var(--ls-card)] text-[var(--ls-foreground)] hover:border-white/40 hover:bg-[var(--ls-border)]/40";

  const displayLabel =
    dragState === "valid"
      ? "Drop to upload"
      : dragState === "invalid"
        ? "Unsupported file"
        : label;

  return (
    <div
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        dragDepthRef.current += 1;
        const item = e.dataTransfer.items?.[0];
        const valid = item ? fileMatchesAcceptType(item, accept) : true;
        setDragState(valid ? "valid" : "invalid");
      }}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = dragState === "invalid" ? "none" : "copy";
      }}
      onDragLeave={() => {
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setDragState("idle");
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragDepthRef.current = 0;
        setDragState("idle");
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!fileMatchesAccept(file, accept)) return;
        onFile(file);
      }}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {size === "lg" ? (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={
            "flex h-[88px] w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed px-3 py-2 text-xs font-medium transition-colors " +
            stateClasses
          }
        >
          <Upload className="h-4 w-4 opacity-80" />
          <span className="max-w-full truncate text-[11px] leading-tight">{displayLabel}</span>
          {hint && dragState === "idle" && (
            <span className="truncate text-[10px] font-normal leading-tight text-[var(--ls-muted-foreground)]">
              {hint}
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={
            "flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 text-xs font-medium transition-colors " +
            stateClasses
          }
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="truncate">{displayLabel}</span>
        </button>
      )}
    </div>
  );
}

function fileMatchesAcceptType(item: DataTransferItem, accept: string): boolean {
  const parts = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length === 0) return true;
  const type = item.type.toLowerCase();
  if (!type) return true;
  return parts.some((p) => {
    if (p.startsWith(".")) return true;
    if (p.endsWith("/*")) return type.startsWith(p.slice(0, -1));
    return type === p;
  });
}

function TickSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  editable,
  warnAbove,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  editable?: boolean;
  warnAbove?: number;
}) {
  const isWarn = warnAbove !== undefined && value > warnAbove;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const decimals = step >= 1 ? 0 : step.toString().split(".")[1]?.length ?? 1;
  const display = value.toFixed(decimals);
  const tickCount = 36;

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(display);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(clamped.toFixed(decimals));
    } else {
      setDraft(display);
    }
    setEditing(false);
  };

  const pctMV = useMotionValue(pct);
  React.useEffect(() => {
    pctMV.set(pct);
  }, [pct, pctMV]);

  const rawVelocity = useVelocity(pctMV);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 18,
    mass: 0.4,
  });

  const indicatorScaleY = useTransform(smoothVelocity, (v) =>
    1 + Math.min(Math.abs(v) / 260, 1) * 0.9
  );

  return (
    <div className="group flex items-center gap-3 rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] px-3.5 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.18),0_2px_6px_-3px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.22),0_4px_10px_-4px_rgba(0,0,0,0.22)]">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <div className="relative flex-1 h-5">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 items-stretch justify-between">
          {Array.from({ length: tickCount }).map((_, i) => (
            <Tick
              key={i}
              index={i}
              tickCount={tickCount}
              pctMV={pctMV}
              velocity={smoothVelocity}
            />
          ))}
        </div>
        <motion.div
          className="pointer-events-none absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] transition-[background-color,box-shadow] duration-200"
          style={{
            left: `${pct}%`,
            scale: indicatorScaleY,
            transformOrigin: "50% 50%",
            backgroundColor: isWarn ? "oklch(0.78 0.19 60)" : "oklch(0.72 0.24 5)",
            boxShadow: isWarn
              ? "0 0 4px oklch(0.78 0.19 60 / 0.9), 0 0 10px oklch(0.78 0.19 60 / 0.55)"
              : "0 0 4px oklch(0.72 0.24 5 / 0.9), 0 0 10px oklch(0.72 0.24 5 / 0.55)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          aria-label={label}
        />
      </div>
      {editable ? (
        editing ? (
          <div className="flex shrink-0 items-center gap-0.5 rounded border border-white/30 bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)]">
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                else if (e.key === "Escape") {
                  setDraft(display);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-14 bg-transparent text-right tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {unit && <span className="text-[var(--ls-muted-foreground)]">{unit}</span>}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(display);
              setEditing(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="shrink-0 cursor-text font-mono text-xs tabular-nums text-[var(--ls-foreground)] hover:underline decoration-dotted underline-offset-2"
            title="Click to edit"
          >
            {display}
            {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
          </button>
        )
      ) : (
        <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
          {display}
          {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
        </span>
      )}
    </div>
  );
}

function Tick({
  index,
  tickCount,
  pctMV,
  velocity,
}: {
  index: number;
  tickCount: number;
  pctMV: MotionValue<number>;
  velocity: MotionValue<number>;
}) {
  const tickPct = (index / (tickCount - 1)) * 100;

  const scaleY = useTransform<number, number>(
    [pctMV, velocity] as unknown as MotionValue<number>[],
    (latest) => {
      const [p, v] = latest as unknown as [number, number];
      const dist = Math.abs(tickPct - p);
      const intensity = Math.min(Math.abs(v) / 260, 1);
      const sigma = 8 + intensity * 22;
      const envelope = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      return 1 + envelope * intensity * 2.4;
    }
  );

  const opacity = useTransform(pctMV, (p) => (tickPct <= p ? 0.7 : 0.15));

  return (
    <motion.span
      className="w-px origin-center bg-[var(--ls-foreground)]"
      style={{ scaleY, opacity }}
    />
  );
}

function DialSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  editable,
  warnAbove,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  editable?: boolean;
  warnAbove?: number;
}) {
  const isWarn = warnAbove !== undefined && value > warnAbove;
  const decimals = step >= 1 ? 0 : step.toString().split(".")[1]?.length ?? 1;
  const display = value.toFixed(decimals);

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(display);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(clamped.toFixed(decimals));
    } else {
      setDraft(display);
    }
    setEditing(false);
  };

  const tickSpacing = 5;
  const numSteps = Math.max(1, Math.round((max - min) / step));
  const stripWidth = numSteps * tickSpacing;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setViewportWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      setViewportWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const valueToX = React.useCallback(
    (v: number) => viewportWidth / 2 - ((v - min) / step) * tickSpacing,
    [viewportWidth, min, step]
  );
  const xToValue = React.useCallback(
    (px: number) => min + ((viewportWidth / 2 - px) / tickSpacing) * step,
    [viewportWidth, min, step]
  );

  const x = useMotionValue(0);
  const draggingRef = React.useRef(false);
  const syncingRef = React.useRef(false);
  const lastSentRef = React.useRef(value);

  React.useEffect(() => {
    if (draggingRef.current) return;
    if (viewportWidth === 0) return;
    const target = valueToX(value);
    if (Math.abs(x.get() - target) < 0.5) {
      x.set(target);
      lastSentRef.current = value;
      return;
    }
    syncingRef.current = true;
    const controls = animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 32,
      mass: 0.5,
    });
    controls.then(() => {
      syncingRef.current = false;
      lastSentRef.current = value;
    });
    return () => {
      controls.stop();
      syncingRef.current = false;
    };
  }, [value, viewportWidth, valueToX, x]);

  useMotionValueEvent(x, "change", (latest) => {
    if (syncingRef.current) return;
    const v = xToValue(latest);
    const snapped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, snapped));
    const rounded = Number(clamped.toFixed(decimals));
    if (Math.abs(rounded - lastSentRef.current) >= step / 2) {
      lastSentRef.current = rounded;
      onChange(rounded);
    }
  });

  const rawVelocity = useVelocity(x);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 300,
    damping: 18,
    mass: 0.4,
  });
  const indicatorScaleY = useTransform(smoothVelocity, (v) =>
    1 + Math.min(Math.abs(v) / 1400, 1) * 0.9
  );

  const ready = viewportWidth > 0;
  const leftConstraint = viewportWidth / 2 - stripWidth;
  const rightConstraint = viewportWidth / 2;

  return (
    <div className="group flex items-center gap-3 rounded-full border border-[var(--ls-border)] bg-[var(--ls-card)] px-3.5 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.18),0_2px_6px_-3px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.22),0_4px_10px_-4px_rgba(0,0,0,0.22)]">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ls-muted-foreground)]">
        {label}
      </span>
      <div
        ref={containerRef}
        className="relative flex-1 h-5 cursor-grab overflow-hidden touch-none select-none active:cursor-grabbing"
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {ready && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3"
            style={{ x, width: stripWidth, left: 0 }}
            drag="x"
            dragConstraints={{ left: leftConstraint, right: rightConstraint }}
            dragElastic={0.06}
            dragMomentum
            dragTransition={{
              power: 0.22,
              timeConstant: 260,
              modifyTarget: (target) => {
                const v = xToValue(target);
                const snapped = Math.round((v - min) / step) * step + min;
                const clamped = Math.min(max, Math.max(min, snapped));
                return valueToX(clamped);
              },
            }}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={() => {
              draggingRef.current = false;
            }}
          >
            {Array.from({ length: numSteps + 1 }).map((_, i) => {
              const isMajor = i % 10 === 0;
              return (
                <span
                  key={i}
                  className={
                    "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 " +
                    (isMajor
                      ? "h-3 bg-[var(--ls-foreground)]/55"
                      : "h-1.5 bg-[var(--ls-foreground)]/22")
                  }
                  style={{ left: i * tickSpacing }}
                />
              );
            })}
          </motion.div>
        )}

        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] transition-[background-color,box-shadow] duration-200"
          style={{
            scale: indicatorScaleY,
            transformOrigin: "50% 50%",
            backgroundColor: isWarn ? "oklch(0.78 0.19 60)" : "oklch(0.72 0.24 5)",
            boxShadow: isWarn
              ? "0 0 4px oklch(0.78 0.19 60 / 0.9), 0 0 10px oklch(0.78 0.19 60 / 0.55)"
              : "0 0 4px oklch(0.72 0.24 5 / 0.9), 0 0 10px oklch(0.72 0.24 5 / 0.55)",
          }}
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[var(--ls-card)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[var(--ls-card)] to-transparent" />
      </div>
      {editable ? (
        editing ? (
          <div className="flex shrink-0 items-center gap-0.5 rounded border border-white/30 bg-[var(--ls-card)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-foreground)]">
            <input
              ref={inputRef}
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                else if (e.key === "Escape") {
                  setDraft(display);
                  setEditing(false);
                }
              }}
              autoFocus
              className="w-14 bg-transparent text-right tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {unit && <span className="text-[var(--ls-muted-foreground)]">{unit}</span>}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(display);
              setEditing(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="shrink-0 cursor-text font-mono text-xs tabular-nums text-[var(--ls-foreground)] hover:underline decoration-dotted underline-offset-2"
            title="Click to edit"
          >
            {display}
            {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
          </button>
        )
      ) : (
        <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--ls-foreground)]">
          {display}
          {unit ? <span className="ml-0.5 text-[var(--ls-muted-foreground)]">{unit}</span> : null}
        </span>
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
  compact,
}: {
  label: string;
  code: string;
  className?: string;
  icon?: React.ReactNode;
  copyLabel?: string;
  description?: string;
  hidePreview?: boolean;
  compact?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const wrapperBg = className ? "" : "bg-[var(--ls-code-bg)]/60";
  return (
    <div
      className={
        "flex min-w-0 flex-col " +
        (compact ? "p-3 " : "p-4 ") +
        wrapperBg +
        " " +
        (className ?? "")
      }
    >
      <div className={(compact ? "" : "mb-3 ") + "flex items-start justify-between gap-3"}>
        <div className="min-w-0">
          <span
            className={
              "inline-flex items-center gap-1.5 font-semibold uppercase text-[var(--ls-foreground)] " +
              (compact ? "text-[11px] tracking-[0.15em]" : "text-[11px] tracking-wider")
            }
          >
            {icon}
            {label}
          </span>
          {description && (
            <p
              className={
                "text-[var(--ls-muted-foreground)] " +
                (compact ? "mt-0.5 text-[10px]" : "mt-1 text-[11px]")
              }
            >
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={
            "shrink-0 inline-flex items-center gap-1 rounded-md border border-[var(--ls-border)] bg-[var(--ls-card)] font-medium text-[var(--ls-foreground)] transition-colors hover:bg-[var(--ls-border)] " +
            (compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs")
          }
        >
          {copied ? <Check size={compact ? 10 : 12} /> : <Copy size={compact ? 10 : 12} />}
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

function AttachSourceTip({ kind, fileName }: { kind: "image" | "svg"; fileName: string }) {
  const label = kind === "svg" ? "SVG" : fileName.toLowerCase().endsWith(".png") ? "PNG" : "image";
  return (
    <div className="relative overflow-hidden rounded-md border border-sky-600/40 bg-gradient-to-r from-sky-500/[0.12] via-sky-400/[0.06] to-transparent p-3 dark:border-sky-400/30 dark:from-sky-500/[0.10] dark:via-sky-400/[0.05]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-sky-600 via-sky-500/80 to-sky-600/40 dark:from-sky-300 dark:via-sky-400/70 dark:to-sky-500/30" />
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-600/50 bg-sky-500/20 dark:border-sky-400/40 dark:bg-sky-500/15">
          <Paperclip size={10} className="text-sky-700 dark:text-sky-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
              Pro tip
            </span>
            <span className="text-[10px] text-sky-700/50 dark:text-sky-200/40">·</span>
            <span className="truncate text-[10px] text-[var(--ls-muted-foreground)]">
              {fileName}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--ls-foreground)]/80">
            Attach the original <span className="font-medium text-sky-700 dark:text-sky-200">{label}</span> file
            alongside this prompt in your AI tool. The prompt references the silhouette of your
            upload — without the file, the AI will fall back to scattered points.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============ Sampling ============ */

async function sampleTargets(
  settings: Settings,
  width: number,
  height: number
): Promise<{ x: number; y: number; r?: number; g?: number; b?: number }[]> {
  const off = document.createElement("canvas");
  off.width = Math.max(1, Math.floor(width));
  off.height = Math.max(1, Math.floor(height));
  const ctx = off.getContext("2d");
  if (!ctx) return [];

  ctx.clearRect(0, 0, off.width, off.height);
  ctx.fillStyle = "#000";

  let drew = false;
  if (settings.source === "shape") {
    drew = await drawSvgString(
      ctx,
      shapeSvgString(settings.sourceShape),
      off.width,
      off.height,
      settings.iconScale
    );
  } else if (settings.source === "text") {
    drew = drawText(
      ctx,
      settings.sourceText || "Hello",
      off.width,
      off.height,
      settings.textFont,
      settings.textScale
    );
  } else if (settings.source === "svg" && settings.sourceDataUrl) {
    drew = await drawDataUrl(ctx, settings.sourceDataUrl, off.width, off.height, settings.svgScale);
  } else if (settings.source === "image" && settings.sourceDataUrl) {
    drew = await drawDataUrl(ctx, settings.sourceDataUrl, off.width, off.height, settings.imageScale);
  }

  if (!drew) return scatterTargets(settings.count, width, height);

  const imageData = ctx.getImageData(0, 0, off.width, off.height);
  const data = imageData.data;
  const sampleColors = settings.useImageColors && settings.source === "image";
  const candidates: { x: number; y: number; r?: number; g?: number; b?: number }[] = [];
  const step = 2;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4;
      if (data[i + 3] <= 128) continue;
      if (sampleColors) {
        candidates.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2] });
      } else {
        candidates.push({ x, y });
      }
    }
  }
  if (candidates.length === 0) return scatterTargets(settings.count, width, height);

  const targets: { x: number; y: number; r?: number; g?: number; b?: number }[] = [];
  for (let i = 0; i < settings.count; i++) {
    targets.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return targets;
}

function scatterTargets(count: number, width: number, height: number) {
  const targets: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    targets.push({ x: Math.random() * width, y: Math.random() * height });
  }
  return targets;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  fontId: TextFont,
  scale: number
): boolean {
  const font = TEXT_FONTS.find((f) => f.id === fontId) ?? TEXT_FONTS[0];
  const baseSize = Math.min(width * 0.32, height * 0.6);
  const fontSize = Math.max(8, baseSize * Math.max(0.1, Math.min(1.5, scale)));
  ctx.font = `${font.weight} ${fontSize}px ${font.family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return true;
}

async function drawSvgString(
  ctx: CanvasRenderingContext2D,
  svg: string,
  width: number,
  height: number,
  scale?: number
): Promise<boolean> {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    return await drawUrl(ctx, url, width, height, scale);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function drawDataUrl(
  ctx: CanvasRenderingContext2D,
  dataUrl: string,
  width: number,
  height: number,
  scale?: number
): Promise<boolean> {
  return drawUrl(ctx, dataUrl, width, height, scale);
}

function drawUrl(
  ctx: CanvasRenderingContext2D,
  url: string,
  width: number,
  height: number,
  scale = 0.9
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const iw = img.naturalWidth || img.width || 1;
      const ih = img.naturalHeight || img.height || 1;
      const clamped = Math.max(0.1, Math.min(1.5, scale));
      const targetW = width * clamped;
      const targetH = height * clamped;
      const ratio = iw / ih;
      let dw = targetW;
      let dh = targetW / ratio;
      if (dh > targetH) {
        dh = targetH;
        dw = targetH * ratio;
      }
      const dx = (width - dw) / 2;
      const dy = (height - dh) / 2;
      try {
        ctx.drawImage(img, dx, dy, dw, dh);
        resolve(true);
      } catch {
        resolve(false);
      }
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* ============ Snippet builders ============ */

function describeSource(s: Settings): string {
  if (s.source === "shape") return `lucide stroked icon "${shapeLabel(s.sourceShape)}" (vector line-art — see SVG_MARKUP below)`;
  if (s.source === "text") return `the text "${s.sourceText}" rendered as filled glyphs`;
  if (s.source === "svg")
    return s.sourceDataUrl
      ? "the SVG file I'm attaching alongside this prompt (treat its rendered pixels as the source — do not invent your own shape)"
      : "an SVG file (none uploaded yet — placeholder; particles will fall back to scattered random points)";
  return s.sourceDataUrl
    ? "the raster image I'm attaching alongside this prompt (treat its opaque pixels as the silhouette — do not invent your own shape)"
    : "a raster image (none uploaded yet — placeholder; particles will fall back to scattered random points)";
}

function fitContainSnippet(scaleVar: string): string {
  return `// fit-contain into (W × ${scaleVar}) × (H × ${scaleVar}), centered, preserving aspect ratio
const scale = Math.max(0.1, Math.min(1.5, ${scaleVar}));
const tW = W * scale, tH = H * scale;
const ratio = img.naturalWidth / img.naturalHeight;
let dw = tW, dh = tW / ratio;
if (dh > tH) { dh = tH; dw = tH * ratio; }
const dx = (W - dw) / 2, dy = (H - dh) / 2;
ctx.drawImage(img, dx, dy, dw, dh);`;
}

function buildSourceBlock(s: Settings): string {
  if (s.source === "shape") {
    const svgMarkup = shapeSvgString(s.sourceShape);
    return `SOURCE — lucide-react icon "${shapeLabel(s.sourceShape)}"
- This is a STROKED VECTOR icon (fill="none", stroke="#000", strokeWidth=2, strokeLinecap="round", strokeLinejoin="round"). Particles trace the OUTLINE strokes — NOT a filled silhouette. Do not "fill in" the interior; the look is line-art with dots along the path.
- Use this exact SVG markup verbatim (do not redraw, do not regenerate, do not "improve" the path — it must match the lucide icon stroke-for-stroke):

SVG_MARKUP =
\`${svgMarkup}\`

- Render pipeline (run once, then sample):
  1. const svgBlob = new Blob([SVG_MARKUP], { type: "image/svg+xml" });
  2. const url = URL.createObjectURL(svgBlob);
  3. const img = new Image(); img.src = url; await img.decode() (or img.onload).
  4. Create an offscreen canvas of size W × H. Get its 2D ctx. Background stays transparent (do NOT fillRect first).
  5. Apply fit-contain at scale ${s.iconScale.toFixed(2)}:
     ${fitContainSnippet(s.iconScale.toFixed(2)).replace(/\n/g, "\n     ")}
  6. URL.revokeObjectURL(url).
- The drawn result is the stroked outline of the rabbit/star/etc. — alpha is non-zero only along the stroke path. Sampling alpha > 128 gives ~few hundred candidate points along the strokes. ${s.count} particles will be sampled WITH REPLACEMENT from those candidates, so the strokes appear "denser" as count grows but the topology is the line-art outline.`;
  }

  if (s.source === "text") {
    const font = TEXT_FONTS.find((f) => f.id === s.textFont);
    const family = font?.family ?? "ui-sans-serif, system-ui, -apple-system, sans-serif";
    const weight = font?.weight ?? "900";
    return `SOURCE — text glyphs "${s.sourceText}"
- This is FILLED text (no stroke). Particles distribute across the interior of each glyph — dense fill, not an outline.
- Render pipeline (run once, then sample):
  1. Create an offscreen canvas of size W × H. Get its 2D ctx.
  2. const fs = Math.max(8, Math.min(W * 0.32, H * 0.6) * ${s.textScale.toFixed(2)});
  3. ctx.font = "${weight} " + fs + "px ${family}";
  4. ctx.textAlign = "center"; ctx.textBaseline = "middle";
  5. ctx.fillStyle = "#000"; ctx.fillText("${s.sourceText.replace(/"/g, '\\"')}", W / 2, H / 2);
- Sampling: alpha > 128 gives a dense set of pixels inside each glyph; sample ${s.count} with replacement for a uniformly dense fill.`;
  }

  if (s.source === "svg") {
    if (!s.sourceDataUrl) {
      return `SOURCE — SVG file (NONE uploaded yet)
- No user SVG attached. Fall back to scattered random points: targets[i] = (Math.random() × W, Math.random() × H).`;
    }
    return `SOURCE — user-supplied SVG (attached alongside this prompt)
- Treat the attached SVG verbatim. If it is stroked (fill="none" or transparent fills) particles trace its outline; if it has filled regions, particles fill those regions. Whatever the file contains, do not modify it.
- Render pipeline:
  1. Load the attached SVG into an Image element (via Blob URL or data URL).
  2. Create an offscreen canvas of size W × H, transparent background.
  3. Apply fit-contain at scale ${s.svgScale.toFixed(2)}:
     ${fitContainSnippet(s.svgScale.toFixed(2)).replace(/\n/g, "\n     ")}
- Sampling: collect pixels with alpha > 128 from the offscreen canvas; sample ${s.count} with replacement.`;
  }

  if (!s.sourceDataUrl) {
    return `SOURCE — raster image (NONE uploaded yet)
- No user image attached. Fall back to scattered random points: targets[i] = (Math.random() × W, Math.random() × H).`;
  }
  const colorClause = s.useImageColors
    ? `\n- "Use original image colors" is ON: when reading getImageData, store each sampled pixel's RGBA. When drawing a particle, use that stored color instead of the global fill (override per-particle).`
    : `\n- "Use original image colors" is OFF: ignore the image's RGB; every particle uses the global fill (${colorDesc(s)}).`;
  return `SOURCE — user-supplied raster image (attached alongside this prompt)
- Treat the attached image as the silhouette. Use only its opaque pixels (alpha > 128) as targets. Do not invent or filter the shape.
- Render pipeline:
  1. Load the attached image into an Image element (preserve aspect; crossOrigin="anonymous" if needed).
  2. Create an offscreen canvas of size W × H, transparent background.
  3. Apply fit-contain at scale ${s.imageScale.toFixed(2)}:
     ${fitContainSnippet(s.imageScale.toFixed(2)).replace(/\n/g, "\n     ")}
- Sampling: collect (x, y) with alpha > 128; sample ${s.count} with replacement.${colorClause}`;
}

function colorDesc(s: Settings): string {
  if (s.colorMode === "gradient") {
    const a = s.gradientAngle;
    const stops = getGradientStops(s);
    const last = Math.max(1, stops.length - 1);
    const stopLines = stops
      .map((c, i) => `addColorStop(${(i / last).toFixed(3)}, "${c}")`)
      .join("; ");
    return `a linear gradient at CSS angle ${a}° (0° = bottom→top, 90° = left→right, 180° = top→bottom, 270° = right→left). Compute canvas endpoints as: const rad = (${a} * Math.PI) / 180; const r = Math.hypot(W, H) / 2; const cx = W / 2, cy = H / 2; const dx = Math.sin(rad) * r, dy = -Math.cos(rad) * r; const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy); then ${stopLines}. Total ${stops.length} stops, evenly spaced.`;
  }
  return s.colorMode === "custom"
    ? `solid fill ${s.color} (custom hex)`
    : `solid fill ${s.color} (preset)`;
}

function buildAiPrompt(s: Settings): string {
  const fillDesc = colorDesc(s);
  const sourceBlock = buildSourceBlock(s);

  const hoverBlock = (() => {
    if (s.mouseForce <= 0 || s.mouseRadius <= 0) {
      return `HOVER INTERACTION
- DISABLED (mouseForce=${s.mouseForce}, mouseRadius=${s.mouseRadius}). Skip all pointer handlers; particles only obey the shape spring + drift.`;
    }
    if (s.mouseMode === "circle") {
      const dep = (s.mouseRadius * 0.7).toFixed(2);
      const mk = (0.04 * Math.max(0.2, s.mouseForce / 30)).toFixed(4);
      return `HOVER INTERACTION — mode: Circle / capture (radius=${s.mouseRadius}px, force=${s.mouseForce})
- Track pointer with pointermove on the canvas; set mouse.active=true on move and false on pointerleave/pointercancel.
- Each particle has a precomputed restAngle (uniform [0, 2π)) and restR01 = √random() so deposits form a uniform-density disc fill.
- While mouse.active, every particle within ${s.mouseRadius}px of the cursor is "captured". Its target switches to:
    target.x = mouse.x + cos(restAngle) × ${dep} × restR01
    target.y = mouse.y + sin(restAngle) × ${dep} × restR01
  (deposit radius = 0.7 × mouseRadius = ${dep}px.)
- Capture physics override: stiffness magnetK = 0.04 × max(0.2, ${s.mouseForce}/30) = ${mk}, damping = 0.78. Released particles instantly use the shape spring again.`;
    }
    const dir = s.mouseMode === "attract" ? "toward" : "away from";
    const sign = s.mouseMode === "attract" ? "-1" : "+1";
    const label = s.mouseMode === "attract" ? "Attract" : "Repel";
    return `HOVER INTERACTION — mode: ${label} (radius=${s.mouseRadius}px, force=${s.mouseForce})
- Track pointer with pointermove on the canvas; set mouse.active=true on move and false on pointerleave/pointercancel.
- While mouse.active, for every particle: dx = p.x - mouse.x; dy = p.y - mouse.y; md² = dx² + dy². If md² < ${s.mouseRadius}² AND md² > 0.01:
    md = √md²; falloff = 1 - md / ${s.mouseRadius};
    push = (falloff × falloff × ${s.mouseForce} × ${sign}) / md;
    p.vx += dx × push; p.vy += dy × push;
  This pushes particles ${dir} the cursor with quadratic falloff.
- Particles outside the radius are untouched; the shape spring still runs underneath every frame.`;
  })();

  const effects: string[] = [];
  if (s.glow) effects.push(`Additive glow ON — ctx.globalCompositeOperation="lighter" while drawing particles; draw an outer halo arc of radius size × (2.4 + ${s.glowStrength.toFixed(2)} × 1.8) at alpha 0.18 + ${s.glowStrength.toFixed(2)} × 0.35, then the solid particle on top.`);
  if (s.twinkle) effects.push(`Per-particle twinkle ON — multiply each particle's alpha by 0.55 + 0.45 × sin(now × 0.001 × ${s.twinkleSpeed.toFixed(2)} × 2π + p.seed).`);
  if (s.hueCycle) effects.push(`Hue cycle ON — every frame shift all fill colors by (t × ${s.hueSpeed.toFixed(2)} × 360) degrees in HSL space (apply to gradient stops AND solid fill before drawing).`);
  if (s.trails) effects.push(`Motion trails ON — instead of clearRect, fillRect the whole canvas with rgba(12,12,12,${s.trailFade.toFixed(2)}) at the start of each frame.`);
  if (s.constellation) effects.push(`Constellation lines ON — after drawing particles, iterate pairs (i<j); if Euclidean distance < ${s.constellationDist}px, stroke a line with alpha = (1 - d / ${s.constellationDist}) × 0.4.`);
  if (s.velocityBoost) effects.push(`Velocity-modulated brightness ON — multiply each particle's alpha by clamp(0.4 + speed × 0.6, 0.4, 1), where speed = √(vx² + vy²).`);
  const effectsBlock = effects.length
    ? `EFFECTS (apply in this order, each frame)
- ${effects.join("\n- ")}`
    : `EFFECTS
- None enabled. Each frame: clearRect, then draw solid particles with no compositing tricks.`;

  return `Build an HTML5 canvas particle-morph animation that exactly matches these settings. Do not invent values, do not "improve" the design, do not change the color, count, or shape.

EXECUTION ORDER (this is the contract — follow it strictly):
1. Render the source onto an offscreen canvas to obtain its pixel mask (see SOURCE block).
2. Sample target positions from that mask (see SAMPLING block).
3. Spawn particles at random positions, then animate them toward their targets with spring physics (PARTICLES + PHYSICS blocks).
4. Apply hover interaction and layered effects every frame.

CANVAS
- Single full-width <canvas id="particles"> with display:block, height 560px, background #0c0c0c, border-radius 12px.
- Use devicePixelRatio: set canvas.width = clientWidth × dpr, canvas.height = clientHeight × dpr, then ctx.setTransform(dpr, 0, 0, dpr, 0, 0). Re-run inside a ResizeObserver. Treat W/H below as CSS pixels (post-setTransform).
- Source: ${describeSource(s)}.

${sourceBlock}

SAMPLING (run once after the source has been drawn to the offscreen canvas)
- const data = offCtx.getImageData(0, 0, W, H).data;
- const candidates = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y*W + x)*4 + 3] > 128) candidates.push([x, y]);
- If candidates is empty, fall back to candidates = Array.from({length: ${s.count}}, () => [Math.random()*W, Math.random()*H]).
- const targets = Array.from({length: ${s.count}}, () => candidates[(Math.random() * candidates.length) | 0]);
- IMPORTANT: do NOT thin, jitter, dither, dedupe, or "improve" the candidate set. Sample exactly as above. The topology of the result is determined entirely by what was drawn — stroked outline → line-art (dots along the strokes); filled glyphs / opaque silhouette → dense interior fill. Match the source faithfully.

PARTICLES
- Exactly ${s.count} particles. Each has: x, y (start = random across W×H), vx=0, vy=0, tx/ty (its sampled target), seed = random()×1000, restAngle = random()×2π, restR01 = √random().
- Render each particle as a filled circle of radius ${s.size.toFixed(2)}px via ctx.arc(x, y, ${s.size.toFixed(2)}, 0, 2π); ctx.fill(). Fill = ${fillDesc}.

PHYSICS (per frame, in this order)
1. Spring toward target: k = 0.02 × ${s.speed.toFixed(2)} = ${(0.02 * s.speed).toFixed(4)}; damping = 0.86.
     vx = (vx + (tx - x) × k) × damping
     vy = (vy + (ty - y) × k) × damping
2. Hover impulse (see HOVER INTERACTION block below) — applied AFTER the shape spring, BEFORE integration.
3. Integrate: x += vx; y += vy.
4. Idle drift (only when settled — (tx - x)² + (ty - y)² < 4 — and NOT currently captured):
     x += sin(t × 2 + seed) × ${s.drift.toFixed(2)} × 0.5
     y += cos(t × 1.7 + seed × 0.7) × ${s.drift.toFixed(2)} × 0.5
   where t = now × 0.001. Drift amplitude = ${s.drift.toFixed(2)} (0 = fully frozen when settled).

${hoverBlock}

${effectsBlock}

LOOP
- requestAnimationFrame(render); pass the rAF timestamp into all time-based math. No setInterval, no setTimeout for animation.

OUTPUT
- Return ONE self-contained HTML file: <!doctype html>, a <style> block for the canvas, the <canvas id="particles">, and a <script> that runs immediately. No module imports, no external libraries, no UI controls, no text overlays, no extra elements. Background stays #0c0c0c.`;
}
