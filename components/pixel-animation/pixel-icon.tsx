"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import type { SpinnerColor, SpinnerGradient, SpinnerShape } from "@/components/pixel-spinner";

const SHAPE_STYLE: Record<SpinnerShape, React.CSSProperties> = {
  square: {},
  rounded: { borderRadius: "22%" },
  circle: { borderRadius: "50%" },
  diamond: { clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" },
  triangle: { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" },
  lines: { clipPath: "inset(calc(100% - 0.2px) 0 0 0)" },
  "line-2": {
    maskImage: "repeating-linear-gradient(to bottom, black 0 1px, transparent 1px 3px)",
    WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0 1px, transparent 1px 3px)",
  },
  "line-3": {},
};

// Hex equivalents for the 4 built-in presets — used when a particle is rendered
// on canvas (oklch is supported in modern browsers but we keep particles in hex
// so the canvas path is rock solid across engines).
const PRESET_HEX: Record<SpinnerColor, string> = {
  crimson: "#5cdf5c",
  hotpink: "#ff4070",
  violet: "#a974f0",
  blue: "#4f7ddc",
};

/** Convert a #RRGGBB string to `r,g,b` for use in rgba(). Falls back to
 * white if the input isn't a 6-digit hex (e.g. an oklch from a gradient). */
function hexToRgbTriple(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "255,255,255";
  const v = parseInt(m[1], 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
}

/** Build (or rebuild) the radial-gradient sprite used to draw every particle.
 * Drawing one cached sprite via drawImage is ~100× faster than calling
 * shadowBlur per particle on every frame. */
function buildParticleSprite(color: string): HTMLCanvasElement {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d");
  if (!ctx) return cv;
  const rgb = hexToRgbTriple(color);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return cv;
}

export type PixelIconAnimation = "pixels" | "wavy";

export interface PixelIconProps {
  rows: number;
  cols: number;
  maskIndices: number[];
  frames: number[][];
  color: SpinnerColor;
  customColor?: string;
  gradient?: SpinnerGradient;
  cellSize?: number;
  gap?: number;
  /** ms between animation frames */
  intervalOverride?: number;
  glow?: number;
  glowSpread?: number;
  shape?: SpinnerShape;
  animation?: PixelIconAnimation;
  /** 0..1 — how visible non-active mask cells are */
  baseOpacity?: number;
  /** When true, draws a 1px stroke around every non-peaking mask cell so the
   * icon shape stays readable under sparse animations like Twinkle. */
  outlineEnabled?: boolean;
  /** Stroke color used by the outline overlay (any CSS color). */
  outlineColor?: string;
  /** When true, peaking cells emit drifting glow particles via a canvas overlay. */
  particlesEnabled?: boolean;
  /** 0..2 — relative density of particles emitted per peak event. */
  particleDensity?: number;
  /** When true, skip the JS trail and let a CSS transition fade cells in/out
   * between frames — dot-motion-builder style. The cell either holds the
   * current frame's peak (opacity 1) or settles to baseOpacity. */
  smoothMode?: boolean;
  /** When true, every cell entering the peak set runs an elastic
   * scale + brightness bounce via a CSS keyframe. Modifier composes
   * with both trail and smooth rendering paths. */
  popEnabled?: boolean;
  className?: string;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  color: string;
};

/**
 * Renders a pixel-grid icon. The `maskIndices` define which cells are part of
 * the icon (always shown, dimly, controlled by baseOpacity); `frames` define
 * which mask cells pulse to peak brightness on each animation frame.
 *
 * Cells outside the mask are not rendered at all (the parent decides whether
 * to leave their slots blank or show empty grid styling).
 */
export function PixelIcon({
  rows,
  cols,
  maskIndices,
  frames,
  color,
  customColor,
  gradient,
  cellSize = 14,
  gap = 2,
  intervalOverride = 220,
  glow,
  glowSpread,
  shape = "square",
  animation = "wavy",
  baseOpacity = 0.32,
  outlineEnabled = false,
  outlineColor = "#7ab7ff",
  particlesEnabled = false,
  particleDensity = 1,
  smoothMode = false,
  popEnabled = false,
  className,
}: PixelIconProps) {
  const shapeStyle = SHAPE_STYLE[shape];
  const total = rows * cols;
  const safeFrames = useMemo(
    () => (frames.length > 0 ? frames : [[]]),
    [frames]
  );
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % safeFrames.length);
    }, intervalOverride);
    return () => clearInterval(id);
  }, [safeFrames.length, intervalOverride]);

  // Trail opacities apply on top of the base mask brightness. We use 8 steps
  // with exponential decay (instead of 4 linear-ish steps) so the fade reads
  // as a smooth glow tail rather than a few discrete dimming steps.
  //
  // In smoothMode we skip the trail entirely — only the current frame's
  // cells light up, and a CSS transition fades them in/out. This matches
  // the dot-motion-builder rendering: the "tail" is purely a side effect
  // of the transition unwinding, not a JS-discretized comet.
  const trail = [1, 0.85, 0.7, 0.55, 0.4, 0.28, 0.18, 0.1];
  const cellPeak = new Map<number, number>();
  if (smoothMode) {
    const cells = safeFrames[frame] ?? [];
    for (const c of cells) cellPeak.set(c, 1);
  } else {
    for (let t = 0; t < trail.length; t++) {
      const f = (frame - t + safeFrames.length) % safeFrames.length;
      const cells = safeFrames[f] ?? [];
      for (const c of cells) {
        if (!cellPeak.has(c)) cellPeak.set(c, trail[t]);
      }
    }
  }

  const maskSet = useMemo(() => new Set(maskIndices), [maskIndices]);
  const useCustom = !!customColor || !!gradient;
  const variant = useCustom ? "c-custom" : `c-${color}`;

  // CSS transitions on the cells should track the animation tempo — at fast
  // speeds a fixed 360ms ease smears frames into each other; at slow speeds we
  // still want a snappy peak.
  const iconEase = Math.max(60, Math.min(360, intervalOverride * 0.9));

  // Resolve a single representative color for particle emission.
  const particleColor = useMemo(() => {
    if (gradient) return gradient.glow;
    if (customColor) return customColor;
    return PRESET_HEX[color];
  }, [gradient, customColor, color]);

  /* ============================================================
   * Canvas particle overlay
   * ============================================================ */

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const prevPeakRef = useRef<Set<number>>(new Set());
  const spriteRef = useRef<HTMLCanvasElement | null>(null);

  // Rebuild the particle sprite when the color changes. Drawing this once
  // and reusing it via drawImage replaces the per-particle shadowBlur that
  // was the main bottleneck.
  useEffect(() => {
    if (typeof document === "undefined") return;
    spriteRef.current = buildParticleSprite(particleColor);
  }, [particleColor]);

  // On every frame change, find cells that newly entered the peak set and
  // spawn a small burst of particles at their center.
  useEffect(() => {
    if (!particlesEnabled) {
      particlesRef.current = [];
      prevPeakRef.current = new Set();
      return;
    }
    const currentPeak = new Set<number>();
    const cells = safeFrames[frame] ?? [];
    for (const c of cells) {
      if (maskSet.has(c)) currentPeak.add(c);
    }
    const newlyPeaked: number[] = [];
    for (const c of currentPeak) {
      if (!prevPeakRef.current.has(c)) newlyPeaked.push(c);
    }
    prevPeakRef.current = currentPeak;

    // Lower spawn count keeps the steady-state population manageable on
    // large grids (a 32×32 mask can otherwise carry 300+ particles).
    const baseCount = Math.max(1, Math.round(2 * particleDensity));
    for (const idx of newlyPeaked) {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const cx = c * (cellSize + gap) + cellSize / 2;
      const cy = r * (cellSize + gap) + cellSize / 2;
      const count = baseCount + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Outward drift speed scales with cell size so dense grids don't fling
        // particles all the way across the canvas.
        const speed = (cellSize * 0.6) + Math.random() * (cellSize * 1.4);
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - cellSize * 0.4, // gentle upward bias
          age: 0,
          life: 0.6 + Math.random() * 0.5,
          size: cellSize * 0.18 * (0.7 + Math.random() * 0.7),
          color: particleColor,
        });
      }
    }
  }, [frame, particlesEnabled, particleDensity, cellSize, gap, cols, particleColor, maskSet, safeFrames]);

  // rAF loop: advance particles and draw them to the canvas. Gated on
  // `particlesEnabled` so we don't keep a no-op rAF alive forever.
  useEffect(() => {
    if (!particlesEnabled) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = [];
      prevPeakRef.current = new Set();
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = "lighter";

      const t0 = now * 0.001;
      const sprite = spriteRef.current;
      const arr = particlesRef.current;
      const next: Particle[] = [];
      for (const p of arr) {
        p.age += dt;
        if (p.age >= p.life) continue;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vx += Math.sin(t0 * 1.6 + p.life * 7) * 6 * dt;
        p.vy += Math.cos(t0 * 1.3 + p.size) * 5 * dt - 4 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.age / p.life;
        const alpha = (1 - t) * (1 - t) * (1 - t);
        // Clamp to 0 — cellSize can briefly be 0 during HMR/resize, and
        // the canvas API throws on negative arc radius / drawImage size.
        const radius = Math.max(0, p.size * 3 * (1 - t * 0.25));

        ctx.globalAlpha = alpha;
        if (sprite) {
          ctx.drawImage(
            sprite,
            p.x - radius,
            p.y - radius,
            radius * 2,
            radius * 2
          );
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        next.push(p);
      }
      particlesRef.current = next;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [particlesEnabled]);

  // Keep the canvas sized to the grid (with DPR for crispness).
  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const setSize = () => {
      const r = el.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cellSize, gap, rows, cols]);

  /* ============================================================
   * Mount-in spring — the whole icon settles into view with a damped
   * spring so changing SVG / animation feels alive, not snappy.
   * ============================================================ */

  const mountSpring = useSpring(0, { stiffness: 220, damping: 22, mass: 0.9 });
  useEffect(() => {
    mountSpring.set(0);
    const t = requestAnimationFrame(() => mountSpring.set(1));
    return () => cancelAnimationFrame(t);
    // Re-run on key shape changes; the parent already remounts on big changes
    // (see the `key` prop in the playground), but cellSize/gap tweaks reuse
    // the same instance and benefit from a soft re-settle.
  }, [maskIndices, mountSpring]);
  const mountScale = useTransform(mountSpring, (v) => 0.85 + 0.15 * v);
  const mountOpacity = useTransform(mountSpring, (v) => v);

  // CSS custom properties don't fit MotionStyle's known-keys typing, so we
  // build the style as a loose record and cast at the boundary.
  const gridStyle: Record<string, unknown> = {
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gap: `${gap}px`,
    "--icon-base-opacity": String(baseOpacity),
    "--icon-ease": `${iconEase}ms`,
    scale: mountScale,
    opacity: mountOpacity,
  };
  if (glow !== undefined) gridStyle["--glow"] = String(glow);
  if (glowSpread !== undefined) gridStyle["--glow-spread"] = `${glowSpread}px`;

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "spinner-grid grid",
        animation === "wavy" ? "anim-wavy" : "anim-pixels",
        "pixel-icon-grid",
        smoothMode && "pixel-icon-smooth",
        popEnabled && "pixel-icon-pop",
        className
      )}
      style={gridStyle as React.CSSProperties}
      role="img"
      aria-label="Pixel icon"
    >
      {Array.from({ length: total }).map((_, i) => {
        const inMask = maskSet.has(i);
        const peak = cellPeak.get(i);

        // Cells outside the icon are still rendered as empty placeholders so
        // the grid keeps its dimensions, but they don't get any glow.
        if (!inMask) {
          return (
            <div
              key={i}
              className="cell pixel-icon-empty"
              style={{
                width: cellSize,
                height: cellSize,
                ...shapeStyle,
              }}
            />
          );
        }

        // Floor the trail at baseOpacity so a recently-lit cell never dims
        // below the resting mask brightness — matches the exported CSS.
        const opacity = peak !== undefined ? Math.max(peak, baseOpacity) : baseOpacity;
        const customVars: Record<string, string> = {};
        if (gradient) {
          customVars["--cell-gradient"] = `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
          customVars["--cell-glow"] = gradient.glow;
        } else if (customColor) {
          customVars["--cell-color"] = customColor;
        }

        // Outline overlay: when enabled, every non-peaking mask cell gets a
        // 1px inset stroke instead of its gradient fill. Peak cells keep
        // their normal fill + glow so the wave still reads through.
        const showOutline = outlineEnabled && peak === undefined;
        const outlineStyle: React.CSSProperties = showOutline
          ? {
              background: "transparent",
              boxShadow: `inset 0 0 0 1px ${outlineColor}`,
            }
          : {};

        // Trail-decayed scale — peak cells punch out to ~1.4×, then ease
        // back to 1 as the trail fades, so the wavefront feels organic
        // instead of a binary on/off pop. Smooth mode keeps cells at 1×
        // — the dot-motion look is flat-bodied with a snap-on glow halo
        // instead of a scale punch.
        const peakAmount = peak ?? 0;
        const cellScale = smoothMode ? 1 : 1 + 0.45 * peakAmount;

        return (
          <div
            key={i}
            className={cn(
              "cell on pixel-icon-cell",
              `shape-${shape}`,
              variant,
              peak !== undefined && "pixel-icon-peak",
              showOutline && "pixel-icon-outlined"
            )}
            style={{
              width: cellSize,
              height: cellSize,
              ...shapeStyle,
              ...customVars,
              ...outlineStyle,
              opacity: showOutline ? 1 : opacity,
              transform: `scale(${cellScale})`,
            }}
          />
        );
      })}
      {/* Particle overlay — sits on top of the grid but ignores pointer events. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}
