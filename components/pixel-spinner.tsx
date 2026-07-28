"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SpinnerColor = "crimson" | "hotpink" | "violet" | "blue";

export type SpinnerPattern = {
  size?: number;
  rows?: number;
  cols?: number;
  frames: number[][];
  interval?: number;
};

export type SpinnerGradient = { from: string; to: string; glow: string };

export type SpinnerShape =
  | "square"
  | "rounded"
  | "circle"
  | "diamond"
  | "triangle"
  | "lines"
  | "line-2"
  | "line-3";

export type SpinnerEffect = "none" | "light" | "wave";

export type SpinnerAnimation = "pixels" | "wavy";

const SHAPE_STYLE: Record<SpinnerShape, React.CSSProperties> = {
  square: {},
  rounded: { borderRadius: "22%" },
  circle: { borderRadius: "50%" },
  diamond: { clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" },
  triangle: { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" },
  lines: {
    clipPath: "inset(calc(100% - 0.2px) 0 0 0)",
  },
  "line-2": {
    maskImage:
      "repeating-linear-gradient(to bottom, black 0 1px, transparent 1px 3px)",
    WebkitMaskImage:
      "repeating-linear-gradient(to bottom, black 0 1px, transparent 1px 3px)",
  },
  "line-3": {},
};

interface PixelSpinnerProps {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  cellSize?: number;
  gap?: number;
  className?: string;
  customColor?: string;
  /** Design token for the lit cell color: a `var(--token)` reference or any
   * CSS color. Wins over `customColor` and `color` when set. */
  token?: string;
  gradient?: SpinnerGradient;
  intervalOverride?: number;
  glow?: number;
  glowSpread?: number;
  easeIn?: number;
  easeOut?: number;
  shape?: SpinnerShape;
  effect?: SpinnerEffect;
  animation?: SpinnerAnimation;
  /** When true, every cell entering the peak set runs an elastic
   * scale + brightness bounce via a CSS keyframe. */
  pop?: boolean;
  /** Intensity multiplier for the pop bounce (0 = no movement, 1 = default,
   * up to ~2 for an exaggerated punch). */
  popStrength?: number;
  /** Duration of one pop cycle in ms. */
  popDuration?: number;
}

export function PixelSpinner({
  pattern,
  color,
  cellSize = 14,
  gap = 2,
  className,
  customColor,
  token,
  gradient,
  intervalOverride,
  glow,
  glowSpread,
  easeIn,
  easeOut,
  shape = "square",
  effect = "light",
  animation = "pixels",
  pop = false,
  popStrength = 1,
  popDuration = 480,
}: PixelSpinnerProps) {
  const shapeStyle = SHAPE_STYLE[shape];
  const cols = pattern.cols ?? pattern.size ?? 3;
  const rows = pattern.rows ?? pattern.size ?? 3;
  const interval = intervalOverride ?? pattern.interval ?? 220;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % pattern.frames.length);
    }, interval);
    return () => clearInterval(id);
  }, [pattern.frames.length, interval]);

  const trailOpacities = [1, 0.5, 0.25, 0.15];
  const cellOpacity = new Map<number, number>();
  for (let t = 0; t < trailOpacities.length; t++) {
    const f = (frame - t + pattern.frames.length) % pattern.frames.length;
    const cells = pattern.frames[f] ?? [];
    for (const c of cells) {
      if (!cellOpacity.has(c)) {
        cellOpacity.set(c, trailOpacities[t]);
      }
    }
  }
  const total = rows * cols;

  return (
    <div
      className={cn(
        "spinner-grid grid",
        effect === "light" && "effect-light",
        effect === "wave" && "effect-wave",
        animation === "wavy" ? "anim-wavy" : "anim-pixels",
        pop && "pop-on-peak",
        className
      )}
      style={
        {
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: `${gap}px`,
          ...(glow !== undefined ? { ["--glow"]: String(glow) } : {}),
          ...(glowSpread !== undefined
            ? { ["--glow-spread"]: `${glowSpread}px` }
            : {}),
          ...(easeIn !== undefined ? { ["--ease-in"]: `${easeIn}ms` } : {}),
          ...(easeOut !== undefined
            ? { ["--ease-out"]: `${easeOut}ms` }
            : {}),
          ...(pop
            ? {
                ["--ls-pop-strength"]: String(popStrength),
                ["--ls-pop-duration"]: `${popDuration}ms`,
              }
            : {}),
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: total }).map((_, i) => {
        const op = cellOpacity.get(i);
        const paint = token ?? customColor;
        const useCustom = !!paint || !!gradient;
        const variant = useCustom ? "c-custom" : `c-${color}`;
        const customVars: Record<string, string> = {};
        if (gradient) {
          customVars["--cell-gradient"] =
            `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
          customVars["--cell-glow"] = gradient.glow;
        } else if (paint) {
          customVars["--cell-color"] = paint;
        }
        return (
          <div
            key={i}
            className={cn(
              "cell",
              `shape-${shape}`,
              op !== undefined && `on ${variant}`,
              op === 1 && "peak"
            )}
            style={
              {
                width: cellSize,
                height: cellSize,
                ...shapeStyle,
                ...customVars,
                ...(op !== undefined ? { opacity: op } : {}),
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
