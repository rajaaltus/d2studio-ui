import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type { SpinnerShape } from "@/components/pixel-spinner";

const TRAIL_OPACITIES = [1, 0.5, 0.25, 0.15];

export type SpinnerGifOptions = {
  rows: number;
  cols: number;
  frames: number[][];
  interval: number;
  cellSize: number;
  gap: number;
  fromColor: string;
  toColor: string;
  shape: SpinnerShape;
  size: number;
  background: "transparent" | "dark" | "light" | string;
  coverage?: number;
};

export async function exportSpinnerToGif(
  options: SpinnerGifOptions
): Promise<Blob> {
  const {
    rows,
    cols,
    frames,
    interval,
    cellSize: srcCell,
    gap: srcGap,
    fromColor,
    toColor,
    shape,
    size,
    background,
    coverage = 0.72,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Unable to acquire 2D context");

  const maxGridDim = Math.max(rows, cols, 1);
  const baseUnits = srcCell + srcGap;
  const cellRatio = srcCell / baseUnits;
  const gapRatio = srcGap / baseUnits;
  const unitsAcross = maxGridDim * cellRatio + Math.max(0, maxGridDim - 1) * gapRatio;
  const pixelsPerUnit = (size * coverage) / unitsAcross;
  const cell = cellRatio * pixelsPerUnit;
  const gapPx = gapRatio * pixelsPerUnit;

  const spinnerW = cols * cell + Math.max(0, cols - 1) * gapPx;
  const spinnerH = rows * cell + Math.max(0, rows - 1) * gapPx;
  const offsetX = (size - spinnerW) / 2;
  const offsetY = (size - spinnerH) / 2;

  const isTransparent = background === "transparent";
  const bgFill =
    background === "dark"
      ? "#0a0a0a"
      : background === "light"
      ? "#ffffff"
      : isTransparent
      ? null
      : background;

  const safeFrames = frames.length > 0 ? frames : [[]];
  const F = safeFrames.length;
  const gif = GIFEncoder();

  for (let fi = 0; fi < F; fi++) {
    ctx.clearRect(0, 0, size, size);
    if (bgFill !== null) {
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, size, size);
    }

    const cellOpacity = new Map<number, number>();
    for (let t = 0; t < TRAIL_OPACITIES.length && t < F; t++) {
      const idx = ((fi - t) % F + F) % F;
      const cells = safeFrames[idx] ?? [];
      for (const c of cells) {
        if (!cellOpacity.has(c)) cellOpacity.set(c, TRAIL_OPACITIES[t]);
      }
    }

    for (const [i, op] of cellOpacity) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = offsetX + col * (cell + gapPx);
      const y = offsetY + row * (cell + gapPx);

      const grad = ctx.createLinearGradient(x, y, x + cell, y + cell);
      grad.addColorStop(0, fromColor);
      grad.addColorStop(1, toColor);

      ctx.globalAlpha = op;
      ctx.fillStyle = grad;
      paintShape(ctx, shape, x, y, cell);
    }
    ctx.globalAlpha = 1;

    const data = ctx.getImageData(0, 0, size, size).data;
    const format = isTransparent ? "rgba4444" : "rgb565";
    const palette = quantize(data, 256, { format });
    const index = applyPalette(data, palette, format);

    const writeOpts: Record<string, unknown> = {
      palette,
      delay: Math.max(20, Math.round(interval)),
    };
    if (isTransparent) {
      writeOpts.transparent = true;
      writeOpts.transparentIndex = paletteAlphaIndex(palette);
    }
    gif.writeFrame(index, size, size, writeOpts);
  }

  gif.finish();
  return new Blob([gif.bytes() as BlobPart], { type: "image/gif" });
}

function paintShape(
  ctx: CanvasRenderingContext2D,
  shape: SpinnerShape,
  x: number,
  y: number,
  s: number
) {
  switch (shape) {
    case "square":
      ctx.fillRect(x, y, s, s);
      return;
    case "rounded": {
      const r = s * 0.22;
      drawRoundRect(ctx, x, y, s, s, r);
      ctx.fill();
      return;
    }
    case "circle": {
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    case "diamond": {
      ctx.beginPath();
      ctx.moveTo(x + s / 2, y);
      ctx.lineTo(x + s, y + s / 2);
      ctx.lineTo(x + s / 2, y + s);
      ctx.lineTo(x, y + s / 2);
      ctx.closePath();
      ctx.fill();
      return;
    }
    case "triangle": {
      ctx.beginPath();
      ctx.moveTo(x + s / 2, y);
      ctx.lineTo(x + s, y + s);
      ctx.lineTo(x, y + s);
      ctx.closePath();
      ctx.fill();
      return;
    }
    case "lines": {
      const h = Math.max(1, s * 0.08);
      ctx.fillRect(x, y + s - h, s, h);
      return;
    }
    case "line-2": {
      const stripe = Math.max(1, s * 0.18);
      const step = Math.max(stripe + 1, s * 0.36);
      for (let yy = y; yy < y + s; yy += step) {
        ctx.fillRect(x, yy, s, stripe);
      }
      return;
    }
    case "line-3":
      ctx.fillRect(x, y, s, s);
      return;
  }
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function paletteAlphaIndex(palette: number[][]): number {
  for (let i = 0; i < palette.length; i++) {
    const c = palette[i];
    if (c.length >= 4 && c[3] === 0) return i;
  }
  return 0;
}
