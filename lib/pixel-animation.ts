// SVG rasterization + animation frame generation for the Pixel Animation tool.
//
// Pipeline: SVG text -> Image (via blob URL) -> off-screen canvas (high-res with
// antialiasing) -> downsampled grid of alpha values -> binary "mask" of cells
// that belong to the icon. The mask is the base shape; animation generators
// produce ordered "wavefront" frames over those mask cells.

export type PixelMask = {
  rows: number;
  cols: number;
  /** row-major flat array; true = icon cell, false = empty */
  cells: boolean[];
};

export type AnimationStyleId =
  | "scan-down"
  | "scan-up"
  | "scan-right"
  | "scan-left"
  | "ripple-out"
  | "ripple-in"
  | "spiral-in"
  | "spiral-out"
  | "spiral-spin"
  | "diagonal-sw"
  | "diagonal-ne"
  | "random-reveal"
  | "marquee"
  | "pulse"
  | "heartbeat"
  | "music-rhythm"
  | "sparkle"
  | "twinkle"
  | "fire-rise"
  | "particles"
  // "Smooth" pack — CSS-transition-driven, dot-motion-builder style.
  // The renderer toggles cells on/off and lets a fixed-duration CSS
  // transition do the fading instead of computing a JS trail.
  | "smooth-blink"
  | "smooth-wave"
  | "smooth-sweep"
  | "smooth-bloom"
  | "smooth-fisheye"
  | "smooth-ripple"
  | "smooth-pulse"
  | "smooth-spiral"
  | "smooth-corners"
  | "smooth-snake"
  | "smooth-checkerboard"
  | "smooth-rain"
  | "smooth-pinwheel";

/** True when the style uses the CSS-transition rendering path. */
export function isSmoothStyle(id: AnimationStyleId): boolean {
  return id.startsWith("smooth-");
}

export const ANIMATION_STYLES: { id: AnimationStyleId; label: string }[] = [
  { id: "scan-down", label: "Scan ↓" },
  { id: "scan-up", label: "Scan ↑" },
  { id: "scan-right", label: "Scan →" },
  { id: "scan-left", label: "Scan ←" },
  { id: "ripple-out", label: "Ripple Out" },
  { id: "ripple-in", label: "Ripple In" },
  { id: "spiral-in", label: "Spiral In" },
  { id: "spiral-out", label: "Spiral Out" },
  { id: "spiral-spin", label: "Spiral Spin" },
  { id: "diagonal-sw", label: "Diagonal ↘" },
  { id: "diagonal-ne", label: "Diagonal ↗" },
  { id: "random-reveal", label: "Random Reveal" },
  { id: "marquee", label: "Marquee" },
  { id: "pulse", label: "Pulse" },
  { id: "heartbeat", label: "Heartbeat" },
  { id: "music-rhythm", label: "Music Rhythm" },
  { id: "sparkle", label: "Sparkle" },
  { id: "twinkle", label: "Twinkle" },
  { id: "fire-rise", label: "Fire Rise" },
  { id: "particles", label: "Particles" },
  { id: "smooth-blink", label: "Smooth · Blink" },
  { id: "smooth-wave", label: "Smooth · Wave" },
  { id: "smooth-sweep", label: "Smooth · Sweep" },
  { id: "smooth-bloom", label: "Smooth · Bloom" },
  { id: "smooth-fisheye", label: "Smooth · Fisheye" },
  { id: "smooth-ripple", label: "Smooth · Ripple" },
  { id: "smooth-pulse", label: "Smooth · Pulse" },
  { id: "smooth-spiral", label: "Smooth · Spiral" },
  { id: "smooth-corners", label: "Smooth · Corners" },
  { id: "smooth-snake", label: "Smooth · Snake" },
  { id: "smooth-checkerboard", label: "Smooth · Checker" },
  { id: "smooth-rain", label: "Smooth · Rain" },
  { id: "smooth-pinwheel", label: "Smooth · Pinwheel" },
];

/* ============================================================
 * SVG rasterization
 * ============================================================ */

/** Quick check whether the input string looks like SVG markup. */
export function looksLikeSvg(text: string): boolean {
  const t = text.trim();
  return t.startsWith("<") && /<svg[\s>]/i.test(t);
}

/**
 * Make sure the SVG has explicit width/height/viewBox so the browser can
 * rasterize it. Some hand-authored SVGs only have a viewBox or only width.
 */
function normalizeSvg(svgText: string): string {
  let out = svgText.trim();
  if (!/<svg[\s>]/i.test(out)) return out;

  // Inject xmlns if missing (required for Image rasterization in Safari/FF).
  if (!/xmlns\s*=\s*"http:\/\/www\.w3\.org\/2000\/svg"/i.test(out)) {
    out = out.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // If width/height are missing but viewBox is present, derive them.
  const hasW = /\bwidth\s*=/.test(out);
  const hasH = /\bheight\s*=/.test(out);
  const vb = out.match(/viewBox\s*=\s*"([\d.\s\-]+)"/i);
  if ((!hasW || !hasH) && vb) {
    const parts = vb[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4) {
      const [, , w, h] = parts;
      if (!hasW) out = out.replace(/<svg\b/i, `<svg width="${w}"`);
      if (!hasH) out = out.replace(/<svg\b/i, `<svg height="${h}"`);
    }
  }
  return out;
}

/**
 * Rasterize an SVG string into a PixelMask of the given grid resolution.
 *
 * The SVG is rendered into an off-screen canvas at a higher resolution
 * (`renderScale * resolution` per side) so antialiasing produces smooth edges,
 * then downsampled by averaging alpha over each cell. A cell is "on" when its
 * average alpha is above `alphaThreshold` (0..255).
 */
export async function rasterizeSvgToMask(
  svgText: string,
  opts: {
    rows: number;
    cols: number;
    alphaThreshold?: number;
    renderScale?: number;
    invert?: boolean;
  }
): Promise<PixelMask> {
  const {
    rows,
    cols,
    alphaThreshold = 96,
    renderScale = 16,
    invert = false,
  } = opts;

  const normalized = normalizeSvg(svgText);
  const blob = new Blob([normalized], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);

    // We render into a square canvas so the SVG keeps its aspect ratio
    // (centered with letterboxing). The output mask is rows×cols.
    const targetMax = Math.max(rows, cols);
    const renderW = cols * renderScale;
    const renderH = rows * renderScale;

    const canvas = document.createElement("canvas");
    canvas.width = renderW;
    canvas.height = renderH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("canvas 2d context unavailable");

    // Fit the image into the canvas, preserving aspect ratio.
    const imgRatio = img.width / img.height;
    const canvasRatio = renderW / renderH;
    let drawW: number, drawH: number, dx: number, dy: number;
    if (imgRatio > canvasRatio) {
      drawW = renderW;
      drawH = Math.round(renderW / imgRatio);
      dx = 0;
      dy = Math.round((renderH - drawH) / 2);
    } else {
      drawH = renderH;
      drawW = Math.round(renderH * imgRatio);
      dy = 0;
      dx = Math.round((renderW - drawW) / 2);
    }
    ctx.clearRect(0, 0, renderW, renderH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, drawW, drawH);

    const data = ctx.getImageData(0, 0, renderW, renderH).data;

    // Downsample: for each output cell, average alpha over its source block.
    const cells = new Array<boolean>(rows * cols).fill(false);
    const blockW = renderW / cols;
    const blockH = renderH / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = Math.floor(c * blockW);
        const y0 = Math.floor(r * blockH);
        const x1 = Math.floor((c + 1) * blockW);
        const y1 = Math.floor((r + 1) * blockH);
        let sum = 0;
        let count = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            // We sum alpha. Solid SVG colors will hit this; light strokes
            // will only fill some pixels in the block, hence the average.
            sum += data[(y * renderW + x) * 4 + 3];
            count++;
          }
        }
        const avg = count > 0 ? sum / count : 0;
        const on = avg >= alphaThreshold;
        cells[r * cols + c] = invert ? !on : on;
      }
    }

    // Edge case: if the whole grid ended up empty (e.g. a stroke-only SVG with
    // very thin strokes lost in downsampling), retry with a much lower
    // threshold so the user at least sees *something* and can lower it
    // manually. We only do this once at the rasterizer level when the result
    // would otherwise be blank.
    if (!cells.some(Boolean) && alphaThreshold > 8) {
      return rasterizeSvgToMask(svgText, {
        rows,
        cols,
        alphaThreshold: 8,
        renderScale,
        invert,
      });
    }

    void targetMax;
    return { rows, cols, cells };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Failed to load SVG. Check that the markup is valid."));
    img.src = src;
  });
}

/* ============================================================
 * Animation frame generation
 *
 * Each generator returns the indices of the icon's "lit" cells per frame —
 * the cells that should pulse to peak brightness on that frame. Cells
 * outside the current frame still render at the base mask opacity.
 *
 * The generator only ever lights cells that are part of the mask (so the
 * icon shape is preserved and animations don't bleed into negative space).
 * ============================================================ */

export type FrameSet = {
  rows: number;
  cols: number;
  /** Always-on icon cells (row-major indices). */
  maskIndices: number[];
  /** Per-frame array of cell indices that hit peak brightness. */
  frames: number[][];
};

type Bucket = { key: number; idx: number };

/**
 * Group masked cells by an integer "wave" key (e.g. row, column, distance)
 * and emit one frame per distinct key in ascending order.
 */
function bucketedFrames(
  mask: PixelMask,
  keyFn: (r: number, c: number) => number
): FrameSet {
  const { rows, cols, cells } = mask;
  const buckets: Bucket[] = [];
  const maskIndices: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (!cells[i]) continue;
      maskIndices.push(i);
      buckets.push({ key: keyFn(r, c), idx: i });
    }
  }
  if (buckets.length === 0) {
    return { rows, cols, maskIndices, frames: [[]] };
  }
  const byKey = new Map<number, number[]>();
  for (const b of buckets) {
    const list = byKey.get(b.key) ?? [];
    list.push(b.idx);
    byKey.set(b.key, list);
  }
  const sortedKeys = [...byKey.keys()].sort((a, b) => a - b);
  const frames = sortedKeys.map((k) => byKey.get(k)!);
  return { rows, cols, maskIndices, frames };
}

function reverseFrames(fs: FrameSet): FrameSet {
  return { ...fs, frames: [...fs.frames].reverse() };
}

function spiralKey(rows: number, cols: number): (r: number, c: number) => number {
  // Build an order map by walking the bounding box inward.
  const order = new Array<number>(rows * cols).fill(-1);
  let top = 0,
    bottom = rows - 1,
    left = 0,
    right = cols - 1,
    step = 0;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) order[top * cols + c] = step++;
    top++;
    for (let r = top; r <= bottom; r++) order[r * cols + right] = step++;
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) order[bottom * cols + c] = step++;
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) order[r * cols + left] = step++;
      left--;
    }
  }
  return (r, c) => order[r * cols + c];
}

/** Group sequential indices into N roughly-equal "wave" frames. */
function groupIntoFrames(indices: number[], frameCount: number): number[][] {
  if (indices.length === 0) return [[]];
  const out: number[][] = Array.from({ length: frameCount }, () => []);
  for (let i = 0; i < indices.length; i++) {
    const f = Math.min(frameCount - 1, Math.floor((i / indices.length) * frameCount));
    out[f].push(indices[i]);
  }
  // Drop empty frames at the end (so loops feel right).
  while (out.length > 1 && out[out.length - 1].length === 0) out.pop();
  return out;
}

/** Deterministic pseudo-random shuffle so successive renders match. */
function seededShuffle<T>(arr: T[], seed = 1): T[] {
  const out = arr.slice();
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** How ripple rings should be shaped — drives the distance metric used to
 * bucket cells into wave fronts. */
export type RippleShape = "square" | "circle" | "diamond";

function rippleDistance(
  shape: RippleShape
): (r: number, c: number, cy: number, cx: number) => number {
  switch (shape) {
    case "circle":
      // Euclidean — produces concentric round rings.
      return (r, c, cy, cx) =>
        Math.round(Math.hypot(r - cy, c - cx));
    case "diamond":
      // Manhattan — produces diamond-shaped rings.
      return (r, c, cy, cx) =>
        Math.round(Math.abs(r - cy) + Math.abs(c - cx));
    default:
      // Chebyshev — produces square rings (the original behavior).
      return (r, c, cy, cx) =>
        Math.round(Math.max(Math.abs(r - cy), Math.abs(c - cx)));
  }
}

export function generateFrames(
  mask: PixelMask,
  style: AnimationStyleId,
  rippleShape: RippleShape = "square"
): FrameSet {
  const { rows, cols } = mask;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;

  switch (style) {
    case "scan-down":
      return bucketedFrames(mask, (r) => r);
    case "scan-up":
      return bucketedFrames(mask, (r) => -r);
    case "scan-right":
      return bucketedFrames(mask, (_r, c) => c);
    case "scan-left":
      return bucketedFrames(mask, (_r, c) => -c);
    case "diagonal-sw":
      return bucketedFrames(mask, (r, c) => r + c);
    case "diagonal-ne":
      return bucketedFrames(mask, (r, c) => -r - c);
    case "ripple-out": {
      const dist = rippleDistance(rippleShape);
      return bucketedFrames(mask, (r, c) => dist(r, c, cy, cx));
    }
    case "ripple-in": {
      const dist = rippleDistance(rippleShape);
      return reverseFrames(
        bucketedFrames(mask, (r, c) => dist(r, c, cy, cx))
      );
    }
    case "spiral-in": {
      const key = spiralKey(rows, cols);
      const fs = bucketedFrames(mask, key);
      // Spiral keys are dense, so collapse adjacent keys into ~16 frames.
      const flat = fs.frames.flat();
      return { ...fs, frames: groupIntoFrames(flat, 16) };
    }
    case "spiral-out": {
      const key = spiralKey(rows, cols);
      const fs = bucketedFrames(mask, key);
      const flat = fs.frames.flat().reverse();
      return { ...fs, frames: groupIntoFrames(flat, 16) };
    }
    case "spiral-spin": {
      // Continuous rotating spiral arms — bucket cells by (angle + radius)
      // so a wedge sweeps around the center while also creating a spiral
      // shape. Quantizing into F frames gives a smooth rotation loop.
      const F = 18;
      return bucketedFrames(mask, (r, c) => {
        const dx = c - cx;
        const dy = r - cy;
        const angle = Math.atan2(dy, dx); // -π..π
        const dist = Math.hypot(dx, dy);
        const t = (angle + Math.PI) / (2 * Math.PI); // 0..1
        // Mod 1 so distance wraps the angle into a spiral arm.
        const k = (t + dist * 0.06) % 1;
        return Math.floor(k * F);
      });
    }
    case "marquee":
      // Vertical bar sweep — a single column lights at a time.
      return bucketedFrames(mask, (_r, c) => c);
    case "pulse": {
      // All icon cells pulse together. We split into two frames so the
      // trail/ease produces a breathing rhythm.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      return { rows, cols, maskIndices: all, frames: [all, []] };
    }
    case "heartbeat": {
      // Lub-dub-rest: two close peaks then a long pause so the trail decay
      // produces the classic cardiac rhythm.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      return {
        rows,
        cols,
        maskIndices: all,
        frames: [all, [], all, [], [], [], [], []],
      };
    }
    case "music-rhythm": {
      // Equalizer-style: per-column bars rise from the icon's bottom row
      // and bob to a 4/4 beat envelope. Each column has a slightly
      // different phase + frequency so adjacent bars don't move in lockstep.
      const F = 14;
      const colTop = new Array<number>(cols).fill(rows);
      const colBottom = new Array<number>(cols).fill(-1);
      const all: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (mask.cells[i]) {
            all.push(i);
            if (r < colTop[c]) colTop[c] = r;
            if (r > colBottom[c]) colBottom[c] = r;
          }
        }
      }
      let s = 991;
      const rand = () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
      const phases: number[] = [];
      const freqs: number[] = [];
      for (let c = 0; c < cols; c++) {
        phases.push(rand() * Math.PI * 2);
        freqs.push(0.7 + rand() * 0.6);
      }
      const frames: number[][] = [];
      for (let f = 0; f < F; f++) {
        // 4 beats per loop — strong on the beat, soft between.
        const beat = 0.35 + 0.65 * Math.abs(Math.sin((f / F) * Math.PI * 4));
        const lit: number[] = [];
        for (let c = 0; c < cols; c++) {
          if (colBottom[c] < 0) continue;
          const colRange = colBottom[c] - colTop[c] + 1;
          const wave =
            0.5 + 0.5 * Math.sin(phases[c] + (f / F) * Math.PI * 2 * freqs[c]);
          const h = Math.max(1, Math.round(beat * wave * colRange));
          for (let r = colBottom[c] - h + 1; r <= colBottom[c]; r++) {
            const i = r * cols + c;
            if (mask.cells[i]) lit.push(i);
          }
        }
        frames.push(lit);
      }
      return { rows, cols, maskIndices: all, frames };
    }
    case "fire-rise":
      // Bottom rows light first, walking up — feels like flames.
      return bucketedFrames(mask, (r) => -r);
    case "random-reveal": {
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      return {
        rows,
        cols,
        maskIndices: all,
        frames: groupIntoFrames(seededShuffle(all, 7), 12),
      };
    }
    case "sparkle": {
      // A handful of random cells per frame — gives a glittering effect.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      const frames: number[][] = [];
      const F = 14;
      const cellsPerFrame = Math.max(1, Math.round(all.length / 6));
      for (let f = 0; f < F; f++) {
        const shuffled = seededShuffle(all, 13 + f * 17);
        frames.push(shuffled.slice(0, cellsPerFrame));
      }
      return { rows, cols, maskIndices: all, frames };
    }
    case "twinkle": {
      // Like sparkle but very sparse — one or two cells per frame.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      const frames: number[][] = [];
      const F = 18;
      const cellsPerFrame = Math.max(1, Math.round(all.length / 18));
      for (let f = 0; f < F; f++) {
        const shuffled = seededShuffle(all, 31 + f * 23);
        frames.push(shuffled.slice(0, cellsPerFrame));
      }
      return { rows, cols, maskIndices: all, frames };
    }
    case "particles": {
      // Particle preset — cells barely flicker; the canvas particle overlay
      // does the heavy visual lifting. Keep emission rate low (~1/28 of mask
      // cells per frame) so the steady-state particle population stays
      // manageable on large grids.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      const frames: number[][] = [];
      const F = 22;
      const cellsPerFrame = Math.max(1, Math.round(all.length / 28));
      for (let f = 0; f < F; f++) {
        const shuffled = seededShuffle(all, 47 + f * 19);
        frames.push(shuffled.slice(0, cellsPerFrame));
      }
      return { rows, cols, maskIndices: all, frames };
    }
    /* ============================================================
     * Smooth pack — emit one wavefront frame per tick. The renderer
     * runs in smooth mode (no JS trail) so a CSS transition fades
     * cells in/out between frames; tighter, dot-matrix style motion.
     * ============================================================ */
    case "smooth-blink": {
      // Two crisp pulses then a long rest — status-indicator feel.
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      return {
        rows,
        cols,
        maskIndices: all,
        frames: [all, [], all, [], [], [], [], [], [], []],
      };
    }
    case "smooth-wave":
    case "smooth-sweep":
      // Column-by-column wavefront. Sweep is identical at the data layer;
      // the renderer's CSS transition is what gives "sweep" its softer tail.
      return bucketedFrames(mask, (_r, c) => c);
    case "smooth-bloom":
    case "smooth-ripple": {
      // Concentric circular wave from the center.
      return bucketedFrames(mask, (r, c) =>
        Math.round(Math.hypot(r - cy, c - cx))
      );
    }
    case "smooth-fisheye": {
      // Diagonal wavefront with a fisheye warp — cells nearer the center
      // get pulled forward, so rings curve like a wide-angle lens.
      const maxDist = Math.hypot(cx, cy) || 1;
      return bucketedFrames(mask, (r, c) => {
        const diag = r + c;
        const dist = Math.hypot(r - cy, c - cx);
        const warp = Math.round((dist / maxDist) * 2);
        return diag - warp;
      });
    }
    case "smooth-pulse": {
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      return { rows, cols, maskIndices: all, frames: [all, []] };
    }
    case "smooth-spiral": {
      const key = spiralKey(rows, cols);
      const fs = bucketedFrames(mask, key);
      const flat = fs.frames.flat();
      return { ...fs, frames: groupIntoFrames(flat, 16) };
    }
    case "smooth-corners": {
      // Distance from the nearest of the four corners — corners light first,
      // waves grow inward and meet at the center.
      return bucketedFrames(mask, (r, c) => {
        const tl = r + c;
        const tr = r + (cols - 1 - c);
        const bl = rows - 1 - r + c;
        const br = rows - 1 - r + (cols - 1 - c);
        return Math.min(tl, tr, bl, br);
      });
    }
    case "smooth-snake": {
      // Boustrophedon path: row 0 →, row 1 ←, row 2 →, … grouped into 16
      // frames so the head moves smoothly instead of one cell per tick.
      const order = new Array<number>(rows * cols).fill(-1);
      let step = 0;
      for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
          for (let c = 0; c < cols; c++) order[r * cols + c] = step++;
        } else {
          for (let c = cols - 1; c >= 0; c--) order[r * cols + c] = step++;
        }
      }
      const fs = bucketedFrames(mask, (r, c) => order[r * cols + c]);
      const flat = fs.frames.flat();
      return { ...fs, frames: groupIntoFrames(flat, 16) };
    }
    case "smooth-checkerboard": {
      const evens: number[] = [];
      const odds: number[] = [];
      const all: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (!mask.cells[i]) continue;
          all.push(i);
          if ((r + c) % 2 === 0) evens.push(i);
          else odds.push(i);
        }
      }
      return { rows, cols, maskIndices: all, frames: [evens, odds] };
    }
    case "smooth-rain": {
      // Scattered drops fall column-by-column from the top. Pre-computed so
      // the loop is reproducible — drops appear at random columns/offsets and
      // cycle through the frame count.
      const F = Math.max(rows + 6, 16);
      const all = mask.cells
        .map((on, i) => (on ? i : -1))
        .filter((i) => i >= 0);
      const validCols: number[] = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (mask.cells[r * cols + c]) {
            validCols.push(c);
            break;
          }
        }
      }
      let s = 271;
      const rand = () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
      const numDrops = Math.max(3, Math.floor(validCols.length / 1.5));
      const drops: { col: number; start: number }[] = [];
      for (let i = 0; i < numDrops; i++) {
        drops.push({
          col: validCols[Math.floor(rand() * validCols.length)] ?? 0,
          start: Math.floor(rand() * F),
        });
      }
      const frames: number[][] = [];
      for (let f = 0; f < F; f++) {
        const lit: number[] = [];
        for (const d of drops) {
          const row = (f - d.start + F) % F;
          if (row >= 0 && row < rows) {
            const i = row * cols + d.col;
            if (mask.cells[i]) lit.push(i);
          }
        }
        frames.push(lit);
      }
      return { rows, cols, maskIndices: all, frames };
    }
    case "smooth-pinwheel": {
      // Angular sweep around the center — 16 wedges, one per frame, so the
      // arm rotates a full turn per loop.
      const F = 16;
      return bucketedFrames(mask, (r, c) => {
        const dx = c - cx;
        const dy = r - cy;
        const angle = Math.atan2(dy, dx); // -π..π
        const t = (angle + Math.PI) / (2 * Math.PI); // 0..1
        return Math.floor(t * F);
      });
    }
    default:
      return bucketedFrames(mask, (r) => r);
  }
}

/* ============================================================
 * Built-in sample SVGs (so the page works without an upload)
 * ============================================================ */

export type SampleSvg = { id: string; label: string; svg: string };

export const SAMPLE_SVGS: SampleSvg[] = [
  {
    id: "heart",
    label: "Heart",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-9.7-9.4C.6 7.5 3.4 3 7.5 3c2 0 3.6 1 4.5 2.5C12.9 4 14.5 3 16.5 3 20.6 3 23.4 7.5 21.7 11.6 19.5 16.3 12 21 12 21z"/></svg>`,
  },
  {
    id: "star",
    label: "Star",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01z"/></svg>`,
  },
  {
    id: "bolt",
    label: "Bolt",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>`,
  },
  {
    id: "rocket",
    label: "Rocket",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 2 5 5 5 9v6l3 3v2h-6l-2-2-2 2H4v-2l3-3v-6c0-4 2-7 5-9zm0 7a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
  },
  {
    id: "ghost",
    label: "Ghost",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a8 8 0 00-8 8v11l3-2 3 2 2-2 2 2 3-2 3 2V10a8 8 0 00-8-8zm-3 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>`,
  },
  {
    id: "robot",
    label: "Robot",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v3H7a3 3 0 00-3 3v9a3 3 0 003 3h10a3 3 0 003-3V8a3 3 0 00-3-3h-5V2h-2zM8 11h2v3H8v-3zm6 0h2v3h-2v-3zm-5 6h6v1H9v-1z"/></svg>`,
  },
  {
    id: "flower",
    label: "Flower",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><circle cx="12" cy="18" r="3"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    id: "skull",
    label: "Skull",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a8 8 0 00-8 8v6l3 2v3h3v-2h4v2h3v-3l3-2v-6a8 8 0 00-8-8zm-3 9a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4z"/></svg>`,
  },
];
