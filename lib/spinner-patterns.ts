import type { SpinnerPattern, SpinnerColor } from "@/components/pixel-spinner";

const f = (...arrs: number[][]): SpinnerPattern["frames"] => arrs;

const colors: SpinnerColor[] = ["crimson", "hotpink", "violet", "blue"];
let colorIndex = 0;
const c = (): SpinnerColor => {
  const col = colors[colorIndex % colors.length];
  colorIndex++;
  return col;
};

export type SpinnerDef = {
  name: string;
  color: SpinnerColor;
  pattern: SpinnerPattern;
};

export const SPINNER_LIBRARY: SpinnerDef[] = [
  {
    name: "wave-lr",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([0, 3, 6], [1, 4, 7], [2, 5, 8]) },
  },
  {
    name: "ripple-out",
    color: c(),
    pattern: { size: 3, interval: 260, frames: f([4], [1, 3, 5, 7], [0, 2, 6, 8]) },
  },
  {
    name: "ripple-in",
    color: c(),
    pattern: { size: 3, interval: 260, frames: f([0, 2, 6, 8], [1, 3, 5, 7], [4]) },
  },
  {
    name: "corners-y",
    color: c(),
    pattern: { size: 3, interval: 320, frames: f([0, 2, 4, 6, 8], [4]) },
  },
  {
    name: "rows-alt",
    color: c(),
    pattern: { size: 3, interval: 240, frames: f([0, 1, 2], [3, 4, 5], [6, 7, 8], [3, 4, 5]) },
  },
  {
    name: "checkerboard",
    color: c(),
    pattern: { size: 3, interval: 320, frames: f([0, 2, 4, 6, 8], [1, 3, 5, 7]) },
  },
  {
    name: "spiral-ccw",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f([0, 3], [3, 6], [6, 7], [7, 8], [8, 5], [5, 2], [2, 1], [1, 0]),
    },
  },
  {
    name: "line-h-mid",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([3], [4], [5], [4]) },
  },
  {
    name: "line-v-mid",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([1], [4], [7], [4]) },
  },
  {
    name: "corners-only",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0], [2], [8], [6]),
    },
  },
  {
    name: "plus-hollow",
    color: c(),
    pattern: {
      size: 3,
      interval: 240,
      frames: f([1, 3, 5, 7], [0, 2, 6, 8], [4]),
    },
  },
  {
    name: "duo-h",
    color: c(),
    pattern: {
      size: 3,
      interval: 240,
      frames: f([0, 2], [3, 5], [6, 8], [3, 5]),
    },
  },
  {
    name: "duo-v",
    color: c(),
    pattern: {
      size: 3,
      interval: 240,
      frames: f([0, 6], [1, 7], [2, 8], [1, 7]),
    },
  },
  {
    name: "frame-sync",
    color: c(),
    pattern: {
      size: 3,
      interval: 360,
      frames: f([0, 1, 2, 3, 5, 6, 7, 8], [4], [0, 1, 2, 3, 5, 6, 7, 8]),
    },
  },
  {
    name: "sparse-3",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f([0], [1, 4], [2, 5, 8], [3, 6, 9, 12], [7, 10, 13], [11, 14], [15]),
    },
  },

  // ── Shapes & chevrons (3x3) ───────────────────────
  {
    name: "zigzag-zl",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([0, 4, 8], [1, 3, 5, 7], [2, 4, 6]),
    },
  },
  {
    name: "clock-rg",
    color: c(),
    pattern: {
      size: 3,
      interval: 120,
      frames: f(
        [4, 1],
        [4, 2],
        [4, 5],
        [4, 8],
        [4, 7],
        [4, 6],
        [4, 3],
        [4, 0]
      ),
    },
  },
  {
    name: "wink-k",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([3], [4], [5], []) },
  },

  // ── 4x4 additions ─────────────────────────────────
  {
    name: "wave-4-lr",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f([0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]),
    },
  },
  {
    name: "ring-4-cw",
    color: c(),
    pattern: {
      size: 4,
      interval: 110,
      frames: f(
        [0],
        [1],
        [2],
        [3],
        [7],
        [11],
        [15],
        [14],
        [13],
        [12],
        [8],
        [4]
      ),
    },
  },
  {
    name: "rain-4",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f(
        [0, 5, 10, 15],
        [4, 9, 14, 3],
        [8, 13, 2, 7],
        [12, 1, 6, 11]
      ),
    },
  },

  // ── Elements & billboards ─────────────────────────
  {
    name: "fire-rise",
    color: c(),
    pattern: {
      size: 4,
      interval: 140,
      frames: f(
        [12, 13, 14, 15],
        [8, 9, 10, 11, 13, 14],
        [4, 5, 6, 7, 9, 10],
        [0, 1, 2, 3, 5, 6],
        [0, 1, 2, 3],
        []
      ),
    },
  },
  {
    name: "wind-flow",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f(
        [0, 1, 4, 5],
        [1, 2, 5, 6],
        [2, 3, 6, 7],
        [8, 9, 12, 13],
        [9, 10, 13, 14],
        [10, 11, 14, 15]
      ),
    },
  },
  {
    name: "vortex-in",
    color: c(),
    pattern: {
      size: 4,
      interval: 90,
      frames: f(
        [0],
        [1],
        [2],
        [3],
        [7],
        [11],
        [15],
        [14],
        [13],
        [12],
        [8],
        [4],
        [5],
        [6],
        [10],
        [9]
      ),
    },
  },
  {
    name: "billboard-tiles",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f(
        [0, 5, 10, 15],
        [1, 4, 11, 14],
        [2, 7, 8, 13],
        [3, 6, 9, 12],
        [5, 6, 9, 10]
      ),
    },
  },
  {
    name: "transmit-pulse",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f(
        [5, 6, 9, 10],
        [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15],
        [],
        [5, 6, 9, 10]
      ),
    },
  },
  {
    name: "neon-ring",
    color: c(),
    pattern: {
      size: 4,
      interval: 130,
      frames: f(
        [0, 1, 2],
        [2, 3, 7],
        [7, 11, 15],
        [15, 14, 13],
        [13, 12, 8],
        [8, 4, 0]
      ),
    },
  },
  {
    name: "tide-roll",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f(
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [8, 9, 10, 11],
        [4, 5, 6, 7]
      ),
    },
  },

  // ── Sea & ocean ───────────────────────────────────
  {
    name: "swell-roll",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f(
        [2, 5, 6, 7, 8, 9, 12],
        [3, 4, 6, 7, 9, 10, 13],
        [0, 4, 5, 7, 10, 11, 14],
        [1, 4, 5, 6, 8, 11, 15]
      ),
    },
  },
  {
    name: "bubbles-up",
    color: c(),
    pattern: {
      size: 4,
      interval: 180,
      frames: f(
        [12, 14],
        [8, 10, 13, 15],
        [4, 6, 9, 11],
        [0, 2, 5, 7],
        [1, 3],
        []
      ),
    },
  },
  {
    name: "stars-fall",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f(
        [1],
        [5, 3],
        [9, 7, 0],
        [13, 11, 4, 2],
        [15, 8, 6],
        [12, 10],
        [14],
        []
      ),
    },
  },

  // ── Matrix-inspired 5x5 patterns ─────────────────
  // Boustrophedon snake — head moves row-by-row, trail naturally fades
  {
    name: "snake-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 70,
      frames: f(
        [0], [1], [2], [3], [4],
        [9], [8], [7], [6], [5],
        [10], [11], [12], [13], [14],
        [19], [18], [17], [16], [15],
        [20], [21], [22], [23], [24]
      ),
    },
  },
  // Spiral inward — outer ring CW then inner ring then center
  {
    name: "spiral-in-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 75,
      frames: f(
        [0], [1], [2], [3], [4],
        [9], [14], [19], [24],
        [23], [22], [21], [20],
        [15], [10], [5],
        [6], [7], [8], [13],
        [18], [17], [16], [11],
        [12]
      ),
    },
  },
  // Outer ring clockwise sweep
  {
    name: "outer-ring-cw-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 90,
      frames: f(
        [0], [1], [2], [3], [4],
        [9], [14], [19], [24],
        [23], [22], [21], [20],
        [15], [10], [5]
      ),
    },
  },
  // Anti-diagonal wavefront — each frame lights one diagonal
  {
    name: "diag-wave-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 130,
      frames: f(
        [0],
        [1, 5],
        [2, 6, 10],
        [3, 7, 11, 15],
        [4, 8, 12, 16, 20],
        [9, 13, 17, 21],
        [14, 18, 22],
        [19, 23],
        [24]
      ),
    },
  },
  // Concentric ripple — pulses out from center
  {
    name: "concentric-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 240,
      frames: f(
        [12],
        [6, 7, 8, 11, 13, 16, 17, 18],
        [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24]
      ),
    },
  },
  // Column wave back-and-forth
  {
    name: "col-wave-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 120,
      frames: f(
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [3, 8, 13, 18, 23],
        [2, 7, 12, 17, 22],
        [1, 6, 11, 16, 21]
      ),
    },
  },
  // Row sweep top-down (mirrors matrix row-wave snake)
  {
    name: "row-sweep-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 130,
      frames: f(
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24]
      ),
    },
  },
  // Ring + middle ring + center pulse
  {
    name: "ring-pulse-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 220,
      frames: f(
        [0, 1, 2, 3, 4, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5],
        [6, 7, 8, 11, 13, 16, 17, 18],
        [12],
        [6, 7, 8, 11, 13, 16, 17, 18]
      ),
    },
  },
  // Dual ring chase — outer CW + inner CCW (matrix dual-ring loaders)
  {
    name: "dual-ring-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 110,
      frames: f(
        [0, 6],
        [1, 11],
        [2, 16],
        [3, 17],
        [4, 18],
        [9, 13],
        [14, 8],
        [19, 7],
        [24, 6],
        [23, 11],
        [22, 16],
        [21, 17],
        [20, 18],
        [15, 13],
        [10, 8],
        [5, 7]
      ),
    },
  },
  // Collapse — ripple inward, hold, then ripple outward
  {
    name: "collapse-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 200,
      frames: f(
        [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24],
        [6, 7, 8, 11, 13, 16, 17, 18],
        [12],
        [],
        [12],
        [6, 7, 8, 11, 13, 16, 17, 18],
        [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24]
      ),
    },
  },
  // TR→BL diagonal alternating sweep — bright + dim slices alternate
  {
    name: "tr-bl-sweep-5",
    color: c(),
    pattern: {
      size: 5,
      interval: 110,
      frames: f(
        [4],
        [3, 9],
        [2, 8, 14],
        [1, 7, 13, 19],
        [0, 6, 12, 18, 24],
        [5, 11, 17, 23],
        [10, 16, 22],
        [15, 21],
        [20]
      ),
    },
  },

  // ── Restored classic patterns (3x3 wave family) ───
  {
    name: "wave-rl",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([2, 5, 8], [1, 4, 7], [0, 3, 6]) },
  },
  {
    name: "wave-tb",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([0, 1, 2], [3, 4, 5], [6, 7, 8]) },
  },
  {
    name: "wave-bt",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([6, 7, 8], [3, 4, 5], [0, 1, 2]) },
  },
  {
    name: "diagonal-tl",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([0], [0, 1, 3], [0, 1, 2, 3, 4, 6]) },
  },
  {
    name: "diagonal-tr",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([2], [1, 2, 5], [0, 1, 2, 4, 5, 8]) },
  },
  {
    name: "diagonal-bl",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([6], [3, 6, 7], [0, 3, 4, 6, 7, 8]) },
  },
  {
    name: "diagonal-br",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([8], [5, 7, 8], [2, 4, 5, 6, 7, 8]) },
  },
  {
    name: "cross-w",
    color: c(),
    pattern: { size: 3, interval: 360, frames: f([0, 2, 6, 8], []) },
  },
  {
    name: "x-shape",
    color: c(),
    pattern: { size: 3, interval: 360, frames: f([1, 3, 4, 5, 7], []) },
  },
  {
    name: "diamond-h",
    color: c(),
    pattern: {
      size: 3,
      interval: 280,
      frames: f([4], [1, 3, 5, 7], [0, 1, 2, 3, 5, 6, 7, 8], [1, 3, 5, 7]),
    },
  },
  {
    name: "stripes-h",
    color: c(),
    pattern: { size: 3, interval: 260, frames: f([0, 1, 2, 6, 7, 8], [3, 4, 5]) },
  },
  {
    name: "stripes-v",
    color: c(),
    pattern: { size: 3, interval: 260, frames: f([0, 2, 3, 5, 6, 8], [1, 4, 7]) },
  },
  {
    name: "spiral-cw",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f([0, 1], [1, 2], [2, 5], [5, 8], [8, 7], [7, 6], [6, 3], [3, 0]),
    },
  },
  {
    name: "snake-v",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([0, 1, 2], [2, 5, 8], [8, 7, 6], [6, 3, 0]),
    },
  },
  {
    name: "snake-rev",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([6, 3, 0], [0, 1, 2], [2, 5, 8], [8, 7, 6]),
    },
  },
  {
    name: "rain-3",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([0, 5], [3, 8], [6, 2], [0, 5]) },
  },
  {
    name: "rain-2",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([2, 3], [5, 6], [8, 0], [2, 3]) },
  },
  {
    name: "waterfall-en",
    color: c(),
    pattern: { size: 3, interval: 160, frames: f([0, 1, 2], [3, 4, 5], [6, 7, 8], []) },
  },
  {
    name: "breathing-gj",
    color: c(),
    pattern: {
      size: 3,
      interval: 360,
      frames: f([4], [1, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5, 6, 7, 8], [1, 3, 4, 5, 7]),
    },
  },
  {
    name: "heart-bt",
    color: c(),
    pattern: {
      size: 3,
      interval: 200,
      frames: f([4], [0, 1, 2, 3, 4, 5, 6, 7, 8], [4], [], [4], [0, 1, 2, 3, 4, 5, 6, 7, 8], []),
    },
  },
  {
    name: "twinkle-fr",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0, 4, 8], [2, 4, 6], [1, 4, 7], [3, 4, 5]),
    },
  },
  {
    name: "sparkle-gt",
    color: c(),
    pattern: {
      size: 3,
      interval: 200,
      frames: f([0, 5, 7], [2, 3, 8], [1, 6, 8], [4, 0, 5]),
    },
  },
  {
    name: "chaos-rn",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f([0, 4], [2, 7], [6, 1], [8, 3], [5, 0], [4, 8]),
    },
  },
  {
    name: "edge-cw",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f([0, 1, 2], [2, 5, 8], [6, 7, 8], [0, 3, 6]),
    },
  },
  {
    name: "border-cn",
    color: c(),
    pattern: {
      size: 3,
      interval: 320,
      frames: f([0, 1, 2, 3, 5, 6, 7, 8], [4]),
    },
  },
  {
    name: "solo-center",
    color: c(),
    pattern: { size: 3, interval: 600, frames: f([4], []) },
  },
  {
    name: "solo-tl",
    color: c(),
    pattern: { size: 3, interval: 600, frames: f([0], []) },
  },
  {
    name: "solo-br",
    color: c(),
    pattern: { size: 3, interval: 600, frames: f([8], []) },
  },
  {
    name: "line-h-top",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([0], [1], [2], [1]) },
  },
  {
    name: "line-h-bot",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([6], [7], [8], [7]) },
  },
  {
    name: "line-v-left",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([0], [3], [6], [3]) },
  },
  {
    name: "line-v-right",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([2], [5], [8], [5]) },
  },
  {
    name: "line-diag-1",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([0], [4], [8], [4]) },
  },
  {
    name: "line-diag-2",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([2], [4], [6], [4]) },
  },
  {
    name: "L-tl",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([0, 1], [0, 3], [0, 1, 3]) },
  },
  {
    name: "L-tr",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([1, 2], [2, 5], [1, 2, 5]) },
  },
  {
    name: "L-bl",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([3, 6], [6, 7], [3, 6, 7]) },
  },
  {
    name: "L-br",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([5, 8], [7, 8], [5, 7, 8]) },
  },
  {
    name: "T-top",
    color: c(),
    pattern: { size: 3, interval: 280, frames: f([0, 1, 2, 4], [4]) },
  },
  {
    name: "T-bot",
    color: c(),
    pattern: { size: 3, interval: 280, frames: f([4, 6, 7, 8], [4]) },
  },
  {
    name: "T-left",
    color: c(),
    pattern: { size: 3, interval: 280, frames: f([0, 3, 4, 6], [4]) },
  },
  {
    name: "T-right",
    color: c(),
    pattern: { size: 3, interval: 280, frames: f([2, 4, 5, 8], [4]) },
  },
  {
    name: "duo-diag",
    color: c(),
    pattern: { size: 3, interval: 280, frames: f([0, 8], [2, 6]) },
  },
  {
    name: "frame",
    color: c(),
    pattern: {
      size: 3,
      interval: 140,
      frames: f([0], [1], [2], [5], [8], [7], [6], [3]),
    },
  },
  {
    name: "sparse-1",
    color: c(),
    pattern: {
      size: 4,
      interval: 220,
      frames: f([0, 5, 10, 15], [3, 6, 9, 12], [5, 6, 9, 10]),
    },
  },
  {
    name: "sparse-2",
    color: c(),
    pattern: {
      size: 4,
      interval: 200,
      frames: f([0, 3], [5, 6], [9, 10], [12, 15], [9, 10], [5, 6]),
    },
  },
  {
    name: "arrow-right",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([0, 4, 6], [1, 5, 7]) },
  },
  {
    name: "arrow-left",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([2, 4, 8], [1, 3, 7]) },
  },
  {
    name: "arrow-up",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([3, 5, 7], [0, 2, 4]) },
  },
  {
    name: "arrow-down",
    color: c(),
    pattern: { size: 3, interval: 220, frames: f([1, 3, 5], [4, 6, 8]) },
  },
  {
    name: "hourglass-g",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0, 1, 2, 4, 8], [1, 4, 7], [4], [4, 6, 7, 8]),
    },
  },
  {
    name: "bounce-bt",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([1], [4], [7], [4]) },
  },
  {
    name: "dots-load",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([3], [3, 4], [3, 4, 5], []),
    },
  },
  {
    name: "wave-4-tb",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f([0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]),
    },
  },
  {
    name: "storm-zap",
    color: c(),
    pattern: {
      size: 4,
      interval: 120,
      frames: f(
        [1, 6, 11],
        [],
        [3, 4, 9, 14],
        [],
        [0, 5, 10, 15],
        [],
        [2, 7, 8, 13]
      ),
    },
  },
  {
    name: "thunder-hit",
    color: c(),
    pattern: {
      size: 3,
      interval: 140,
      frames: f(
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        [4],
        [],
        [],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        []
      ),
    },
  },
  {
    name: "ember-glow",
    color: c(),
    pattern: {
      size: 3,
      interval: 300,
      frames: f(
        [4],
        [4],
        [1, 3, 4, 5, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [1, 3, 4, 5, 7],
        [4]
      ),
    },
  },
  {
    name: "geyser-up",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([7], [4, 7], [1, 4, 7], [0, 1, 2, 4, 7], [0, 2], []),
    },
  },
  {
    name: "ticker-lr",
    color: c(),
    pattern: {
      size: 4,
      interval: 120,
      frames: f(
        [4],
        [4, 5],
        [4, 5, 6],
        [4, 5, 6, 7],
        [5, 6, 7],
        [6, 7],
        [7],
        []
      ),
    },
  },
  {
    name: "alert-blink",
    color: c(),
    pattern: {
      size: 3,
      interval: 130,
      frames: f(
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        [4],
        []
      ),
    },
  },
  {
    name: "circuit-path",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f(
        [0],
        [0, 3],
        [0, 3, 4],
        [0, 3, 4, 5],
        [0, 3, 4, 5, 2],
        [0, 3, 4, 5, 2],
        [],
        []
      ),
    },
  },
  {
    name: "blizzard-snow",
    color: c(),
    pattern: {
      size: 4,
      interval: 110,
      frames: f(
        [0, 5, 11, 14],
        [1, 4, 10, 15],
        [2, 7, 8, 13],
        [3, 6, 9, 12],
        [0, 6, 9, 15],
        [2, 5, 10, 13]
      ),
    },
  },
  {
    name: "glitch-flip",
    color: c(),
    pattern: {
      size: 3,
      interval: 100,
      frames: f(
        [0, 4, 8],
        [1, 3, 5, 7],
        [2, 4, 6],
        [0, 5, 7],
        [1, 3, 8],
        [4]
      ),
    },
  },
  {
    name: "tsunami-wall",
    color: c(),
    pattern: {
      size: 4,
      interval: 150,
      frames: f(
        [0, 1, 4, 5, 8, 9, 12, 13],
        [1, 2, 5, 6, 9, 10, 13, 14],
        [2, 3, 6, 7, 10, 11, 14, 15]
      ),
    },
  },
  {
    name: "jellyfish-bn",
    color: c(),
    pattern: {
      size: 4,
      interval: 240,
      frames: f(
        [1, 2, 4, 7, 8, 11, 13, 14],
        [5, 6, 9, 10],
        [1, 2, 4, 7, 8, 11, 13, 14],
        []
      ),
    },
  },
  {
    name: "coral-wv",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([6, 3, 0], [7, 4, 1], [8, 5, 2], [7, 4, 1]),
    },
  },
  {
    name: "anchor-ar",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f(
        [4],
        [1, 4, 7],
        [1, 3, 4, 5, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
      ),
    },
  },
  {
    name: "pier-gt",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f(
        [0, 4, 8, 12],
        [2, 6, 10, 14],
        [1, 5, 9, 13],
        [3, 7, 11, 15]
      ),
    },
  },
  {
    name: "foghorn-bl",
    color: c(),
    pattern: {
      size: 3,
      interval: 260,
      frames: f(
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        [],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [],
        []
      ),
    },
  },
];

function complexity(def: SpinnerDef): number {
  const cols = def.pattern.cols ?? def.pattern.size ?? 3;
  const rows = def.pattern.rows ?? def.pattern.size ?? 3;
  const cellArea = cols * rows;
  const frameCount = def.pattern.frames.length;
  const totalLit = def.pattern.frames.reduce((s, fr) => s + fr.length, 0);
  return frameCount * cellArea + totalLit * 2;
}

function hashName(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

SPINNER_LIBRARY.sort((a, b) => {
  const diff = complexity(b) - complexity(a);
  if (diff !== 0) return diff;
  return hashName(a.name) - hashName(b.name);
});

/**
 * Curated "premium" set — the visually distinctive, high-motion spinners.
 * Used by the standalone showcase and the per-spinner registry generator.
 * SPINNER_LIBRARY still holds all patterns for the /spinners playground.
 */
export const PREMIUM_SPINNERS = [
  "spiral-in-5",
  "snake-5",
  "outer-ring-cw-5",
  "ring-4-cw",
  "ring-pulse-5",
  "neon-ring",
  "dual-ring-5",
  "concentric-5",
  "vortex-in",
  "wave-lr",
  "wave-4-lr",
  "col-wave-5",
  "diag-wave-5",
  "row-sweep-5",
  "swell-roll",
  "fire-rise",
  "rain-4",
  "stars-fall",
  "bubbles-up",
  "tide-roll",
  "wind-flow",
  "transmit-pulse",
  "billboard-tiles",
  "ripple-out",
] as const;

export const PREMIUM_LIBRARY: SpinnerDef[] = PREMIUM_SPINNERS.map(
  (name) => SPINNER_LIBRARY.find((s) => s.name === name)!
);
