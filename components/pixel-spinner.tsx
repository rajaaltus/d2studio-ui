"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SpinnerColor = "crimson" | "hotpink" | "violet" | "blue";

export type SpinnerPattern = {
  size?: number;
  frames: number[][];
  interval?: number;
};

export type SpinnerGradient = { from: string; to: string; glow: string };

interface PixelSpinnerProps {
  pattern: SpinnerPattern;
  color: SpinnerColor;
  cellSize?: number;
  gap?: number;
  className?: string;
  customColor?: string;
  gradient?: SpinnerGradient;
  intervalOverride?: number;
  glow?: number;
  glowSpread?: number;
  easeIn?: number;
  easeOut?: number;
}

export function PixelSpinner({
  pattern,
  color,
  cellSize = 14,
  gap = 2,
  className,
  customColor,
  gradient,
  intervalOverride,
  glow,
  glowSpread,
  easeIn,
  easeOut,
}: PixelSpinnerProps) {
  const size = pattern.size ?? 3;
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
  const total = size * size;

  return (
    <div
      className={cn("spinner-grid grid", className)}
      style={
        {
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gap: `${gap}px`,
          ...(glow !== undefined ? { ["--glow"]: String(glow) } : {}),
          ...(glowSpread !== undefined
            ? { ["--glow-spread"]: `${glowSpread}px` }
            : {}),
          ...(easeIn !== undefined ? { ["--ease-in"]: `${easeIn}ms` } : {}),
          ...(easeOut !== undefined
            ? { ["--ease-out"]: `${easeOut}ms` }
            : {}),
        } as React.CSSProperties
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: total }).map((_, i) => {
        const op = cellOpacity.get(i);
        const useCustom = !!customColor || !!gradient;
        const variant = useCustom ? "c-custom" : `c-${color}`;
        const customVars: Record<string, string> = {};
        if (gradient) {
          customVars["--cell-gradient"] =
            `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
          customVars["--cell-glow"] = gradient.glow;
        } else if (customColor) {
          customVars["--cell-color"] = customColor;
        }
        return (
          <div
            key={i}
            className={cn("cell", op !== undefined && `on ${variant}`)}
            style={
              {
                width: cellSize,
                height: cellSize,
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
