import type {
  SpinnerAnimation,
  SpinnerColor,
  SpinnerPattern,
} from "@/components/pixel-spinner";

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
  // Only set where the hard pixel step is wrong for the pattern; the engine
  // defaults to "pixels".
  animation?: SpinnerAnimation;
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
  "ring-4-cw",
  "dual-ring-5",
  "vortex-in",
  "col-wave-5",
  "swell-roll",
  "rain-4",
  "tide-roll",
  "billboard-tiles",
  "ripple-out",
] as const;

export const PREMIUM_LIBRARY: SpinnerDef[] = PREMIUM_SPINNERS.map(
  (name) => SPINNER_LIBRARY.find((s) => s.name === name)!
);

/**
 * The Pro set: patterns drawn by hand in the /spinners playground rather than
 * generated. They live here, not in the gallery page, so the showcase and the
 * registry generator read the same frames.
 */
export const PRO_LIBRARY: SpinnerDef[] = [
  {
    name: "pro-1",
    color: c(),
    // The grid fills column by column, empties to the centre block, then walks
    // the ring — the long one, and the reason it opens the set.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 130,
      frames: f(
        [8],
        [4, 8],
        [0, 4, 8, 12],
        [0, 4, 5, 8, 9, 12],
        [0, 4, 5, 6, 8, 9, 10, 12],
        [0, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15],
        [5, 6, 9, 10],
        [0, 3, 5, 6, 9, 10, 12, 15],
        [0, 3, 5, 6, 9, 10, 12, 15],
        [2, 4, 5, 6, 9, 10, 11, 13],
        [1, 5, 6, 7, 8, 9, 10, 14],
        [0, 3, 5, 6, 9, 10, 12, 15],
      ),
    },
  },
  {
    name: "pro-2",
    color: c(),
    // Diagonal pairs stepping bottom-right to top-left across the grid.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 120,
      frames: f([13, 14], [9, 10, 12, 15], [1, 2], [0, 3, 5, 6]),
    },
  },
  {
    name: "pro-3",
    color: c(),
    // The two columns alternate, each sweep widening into the middle rows.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 110,
      frames: f(
        [0, 2, 4, 6],
        [0, 2, 3, 4, 5, 6],
        [1, 3, 5, 7],
        [1, 2, 3, 4, 5, 7],
      ),
    },
  },
  {
    name: "pro-4",
    color: c(),
    // One cell walks the ring clockwise; the 4-step trail turns it into a
    // comet orbiting the grid, the way a terminal star rotates.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 100,
      frames: f([0], [1], [3], [5], [7], [6], [4], [2]),
    },
  },
  {
    name: "pro-5",
    color: c(),
    // A diagonal walk down to the corner, then the grid floods back up it.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: f(
        [0],
        [1, 4],
        [5],
        [6, 9, 10],
        [15],
        [11, 14, 15],
        [7, 10, 11, 13, 14, 15],
        [3, 6, 7, 9, 10, 11, 12, 13, 14, 15],
        [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      ),
    },
  },
  {
    name: "pro-6",
    color: c(),
    // Breathes out from the middle rows and back in.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 130,
      frames: f([2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 6, 7], [2, 3, 4, 5]),
    },
  },
  {
    name: "pro-7",
    color: c(),
    // A 2x2 block climbs the diagonal to the top-left, pauses, then a second
    // block sweeps up from the bottom and settles in the middle.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 160,
      frames: f(
        [15],
        [10, 11, 14, 15],
        [5, 6, 9, 10],
        [0, 1, 4, 5],
        [0],
        [],
        [8, 9, 12, 13],
        [5, 6, 8, 9, 10, 12, 13],
        [2, 3, 5, 6, 7, 9, 10],
        [],
        [],
      ),
    },
  },
  {
    name: "pro-8",
    color: c(),
    // A scan line bouncing down and back up.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 120,
      frames: f([0, 1], [2, 3], [4, 5], [6, 7], [4, 5], [2, 3]),
    },
  },
  {
    name: "pro-9",
    color: c(),
    // One cell per frame: down the right column, up the left, so the trail
    // reads as a single dot orbiting the 2-wide grid.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 160,
      frames: f([6], [4], [3], [1], [0], [2], [5], [7]),
    },
  },
  {
    name: "pro-10",
    color: c(),
    // One cell per frame: with a 4-step trail, two per frame would keep all
    // eight lit at once and the grid would read as a solid block. A single
    // drop falls down one column, then the other, so the loop stays unbroken.
    // "wavy" swaps the hard pixel step for the eased cell transition, so the
    // drop glides between frames instead of snapping.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 2,
      interval: 110,
      frames: f([0], [2], [4], [6], [1], [3], [5], [7]),
    },
  },
  {
    name: "pro-11",
    color: c(),
    // Heartbeat: two quick beats, then empty frames let the trail decay so the
    // rest is real silence rather than more motion.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 110,
      frames: f(
        [2, 3, 4, 5],
        [0, 1, 6, 7],
        [],
        [2, 3, 4, 5],
        [0, 1, 6, 7],
        [],
        [],
        [],
      ),
    },
  },
  {
    name: "pro-12",
    color: c(),
    // A pair climbs the grid to the top, then widening groups sweep back down.
    pattern: {
      rows: 4,
      cols: 2,
      interval: 160,
      frames: f([5, 6], [3, 4], [1, 2], [0], [0, 1], [2, 3, 4], [5, 6], [4, 7]),
    },
  },
  {
    name: "pro-13",
    color: c(),
    // Ring shifts left, then right, drops to the four corners, and the corners
    // pull back into the centre block before the first frame repeats.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 130,
      frames: f(
        [1, 5, 6, 7, 8, 9, 10, 14],
        [2, 4, 5, 6, 9, 10, 11, 13],
        [0, 3, 5, 6, 9, 10, 12, 15],
        [1, 5, 6, 7, 8, 9, 10, 14],
        [0, 3, 12, 15],
        [2, 4, 11, 13],
        [1, 7, 8, 14],
      ),
    },
  },
  {
    name: "pro-14",
    color: c(),
    // Two dots run the corners inward along both diagonals, meet as the centre
    // block, then snap back out to the corners.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: f(
        [0],
        [0, 15],
        [1, 14],
        [2, 13],
        [12],
        [4, 11],
        [5, 10],
        [5, 6, 9, 10],
        [0, 15],
        [3, 12],
      ),
    },
  },
  {
    name: "pro-15",
    color: c(),
    // The centre block holds while a ring rocks left, right, bare, then left
    // again — the corners never light, so the whole loop reads as one shrug.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 160,
      frames: f(
        [2, 4, 5, 6, 9, 10, 11, 13],
        [0, 3, 5, 6, 9, 10, 12, 15],
        [5, 6, 9, 10],
        [1, 5, 6, 7, 8, 9, 10, 14],
      ),
    },
  },
  {
    name: "pro-16",
    color: c(),
    // One dot hops the 3x4 grid with no path to it — corner, middle, corner —
    // so the trail behind it is what draws the shape rather than the dot.
    pattern: {
      rows: 3,
      cols: 4,
      interval: 160,
      frames: f([0], [5], [8], [3], [6], [11], [5]),
    },
  },
  {
    name: "pro-17",
    color: c(),
    // A corner grows into a block, spills across the whole grid, collapses to
    // the right half, then lights everything but the two side cells.
    pattern: {
      rows: 3,
      cols: 3,
      interval: 140,
      frames: f(
        [6],
        [3, 4, 6, 7],
        [0, 1, 2, 4, 5, 8],
        [1, 2, 4, 5],
        [0, 2, 3, 4, 6, 7, 8],
      ),
    },
  },
  {
    name: "pro-18",
    color: c(),
    // Edges and corners trade places, then the X sheds an arm at a time until
    // only a rotating three-cell wedge is left turning around the centre.
    pattern: {
      rows: 3,
      cols: 3,
      interval: 140,
      frames: f(
        [1, 3, 5, 7],
        [0, 2, 6, 8],
        [0, 2, 4, 6, 8],
        [0, 2, 4, 6],
        [0, 2, 4],
        [2, 4, 8],
        [4, 6, 8],
        [0, 4, 6],
      ),
    },
  },
  {
    name: "pro-19",
    color: c(),
    // A diagonal band sweeps corner to corner and back, so the trail behind it
    // reverses direction at each end without the grid ever going dark.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 120,
      frames: f(
        [0],
        [1, 5],
        [2, 6, 10],
        [3, 7, 11],
        [4, 8, 12],
        [9, 13],
        [14],
        [9, 13],
        [4, 8, 12],
        [3, 7, 11],
        [2, 6, 10],
        [1, 5],
      ),
    },
  },
  {
    name: "pro-20",
    color: c(),
    // A dot runs the middle row left to right, then splits and comes back along
    // the top and bottom rows at once.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 120,
      frames: f(
        [5],
        [6],
        [7],
        [8],
        [9],
        [4, 14],
        [13],
        [3, 12],
        [2, 11],
        [1, 10],
        [0, 10],
      ),
    },
  },
  {
    name: "pro-21",
    color: c(),
    // The two opposite corners alternate, then close on each other in step —
    // one walking the top row, one the bottom, meeting at the middle row.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 120,
      frames: f([0], [14], [1], [13], [2, 12], [3, 11], [4, 10], [5, 9]),
    },
  },
  {
    name: "pro-22",
    color: c(),
    // The two chessboard halves trade, and the trail on the half handing off
    // keeps the board from ever reading half-empty. Two frames is the whole
    // loop — A,B,A,B renders identically.
    // "wavy" eases the swap instead of stepping it. The interval has to clear
    // the 320ms cell transition, or the two halves never finish crossing and
    // the board settles into a flat shimmer.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 160,
      frames: f(
        [0, 2, 4, 7, 9, 11, 12, 14, 16],
        [1, 3, 5, 6, 8, 10, 13, 15, 17],
      ),
    },
  },
  {
    name: "pro-23",
    color: c(),
    // A chevron rises in from below the bottom edge on the same 3x6 grid as
    // pro-22, opens out to its full span, then sinks back the way it came. The
    // top of the arc is held by the frame either side of it rather than by a
    // repeat, so the bounce eases without the shape ever leaving the grid.
    // "wavy" for the same reason as pro-22: stepping a rise this short reads as
    // a flicker, easing it reads as one breath.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 160,
      frames: f(
        [14, 15],
        [8, 9, 13, 16],
        [2, 3, 7, 10, 12, 17],
        [8, 9, 13, 16],
      ),
    },
  },
  {
    name: "pro-24",
    color: c(),
    // pro-23's chevron, in its original single-pass form: it rises in from
    // below the bottom edge, opens to full span, and keeps going until it has
    // left through the top. The tip clears the grid two frames before the outer
    // arms, and the empty last frame is the gap before the next pass — the
    // trail is still fading through it, so the grid never goes dark.
    // Same "wavy" easing as pro-23; only the exit differs from the bounce.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 160,
      frames: f(
        [14, 15],
        [8, 9, 13, 16],
        [2, 3, 7, 10, 12, 17],
        [1, 4, 6, 11],
        [0, 5],
        [],
      ),
    },
  },
  {
    name: "pro-25",
    color: c(),
    // pro-24's chevron turned on its side and mirrored: one enters through the
    // left edge and one through the right, tips first, in the same frame. They
    // close on the centre at the same rate, meet head on, and rebound straight
    // back out the way they came — the converge frames replayed in reverse,
    // which is the whole bounce. Every frame is symmetric about the middle
    // column, so neither side can read as arriving ahead of the other. The
    // empty frame is the gap before the next entry; the trail is still fading
    // through it, so the grid never actually goes dark.
    // "wavy" for the same reason as pro-23/24: at this speed a stepped edge
    // reads as a flicker, an eased one reads as travel.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 130,
      frames: f(
        [6, 11],
        [0, 5, 7, 10, 12, 17],
        [1, 4, 8, 9, 13, 16],
        [2, 3, 8, 9, 14, 15],
        [1, 4, 8, 9, 13, 16],
        [0, 5, 7, 10, 12, 17],
        [6, 11],
        [],
      ),
    },
  },
  {
    name: "pro-26",
    color: c(),
    // pro-25's chevron, but only the left-hand one and with no beginning and no
    // end: chevrons three columns apart, all sliding one column per frame, so
    // one enters through
    // the left edge exactly as the one ahead leaves through the right. The
    // spacing is the loop — after three frames the train is back where it
    // started, which is why this is the whole pattern. Six cells lit every
    // frame, no fill and no gap.
    // The loop is only three frames, so the interval sets how fast the train
    // reads: at 160 a chevron takes near half a second to clear one column and
    // it drags. 110 keeps it moving, and the 320ms cell fade spans the next two
    // frames, which puts a soft trail one and two columns behind each chevron —
    // that overlap is what smooths the step, not a slower clock.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 110,
      frames: f(
        [2, 5, 6, 9, 14, 17],
        [0, 3, 7, 10, 12, 15],
        [1, 4, 8, 11, 13, 16],
      ),
    },
  },
  {
    name: "pro-27",
    color: c(),
    // A ball with gravity, which nothing else in the set has: it leaves the
    // floor at the left, arcs over the middle and lands at the right, then does
    // the same trip back. One cell in the air, two on the floor — the squash on
    // impact is what sells the weight. The spacing is the physics: two frames
    // side by side across the top because that is where a throw is slowest, and
    // a full column of drop per frame either side of the floor because that is
    // where it is fastest. Even timing here would read as a dot on a wire.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 5,
      interval: 100,
      frames: f(
        [15, 16],
        [11],
        [7],
        [2],
        [3],
        [8],
        [14],
        [18, 19],
        [14],
        [8],
        [3],
        [2],
        [7],
        [11],
      ),
    },
  },
  {
    name: "pro-28",
    color: c(),
    // A trace on a scope. One cell runs the middle row left to right, throws a
    // spike above the line, cuts back through it to an undershoot below, and
    // recovers — then the gap before the next beat. Only ever one cell is lit;
    // the waveform is drawn entirely by the 320ms fade behind it, which is the
    // point of running this one at 100ms. Slower and the tail dies before the
    // shape closes, and all you see is a dot wandering.
    animation: "wavy",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 100,
      frames: f([6], [7], [2], [9], [15], [10], [11], []),
    },
  },
  {
    name: "pro-29",
    color: c(),
    // An hourglass, and the only pattern here that reads as an amount rather
    // than a position. The top chamber holds two rows of sand, a grain sits in
    // the neck, the level drops a row at a time and the same rows build up
    // below. The last frame is the flip: the bottom is full, the top comes back
    // whole, and the eased fade crosses the two over instead of cutting. Slow
    // on purpose at 200 — sand that keeps spinner pace reads as a leak.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 3,
      interval: 200,
      frames: f(
        [0, 1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4, 5, 7],
        [3, 4, 5, 7, 9, 10, 11],
        [4, 7, 9, 10, 11],
        [6, 7, 8, 9, 10, 11],
        [6, 7, 8, 9, 10, 11],
      ),
    },
  },
  {
    name: "pro-30",
    color: c(),
    // Drawn in the playground, kept frame for frame. Six cells hold across the
    // whole loop and the motion is entirely in the one or two that come and go
    // below them — including a frame where none do, which is the beat the rest
    // reads against.
    // "wavy" because a spark that steps on and off at this size is a flicker;
    // eased, it catches and dies.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 140,
      frames: f(
        [1, 2, 3, 6, 7, 11, 12],
        [1, 2, 3, 6, 7, 9, 11],
        [1, 2, 3, 6, 7, 11],
        [1, 2, 3, 6, 7, 8, 11, 13],
      ),
    },
  },
  {
    name: "pro-31",
    color: c(),
    // Pro-30's cells, drawn as a strobe instead of a held shape: two lone sparks
    // low on the grid, then the whole six-cell figure at once, then a third
    // spark. Nothing carries across a frame boundary, so the fade is the only
    // thing joining them — this one lives or dies on "wavy".
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 140,
      frames: f([12], [9], [1, 2, 3, 6, 7, 11], [8, 13]),
    },
  },
  {
    name: "pro-32",
    color: c(),
    // Drawn in the playground, kept frame for frame. The centre block holds
    // while the mass around it leans one diagonal then the other, twice over,
    // and then the whole thing sheds down to the block and breaks into two
    // three-cell wedges on opposite corners. Ten of sixteen cells lit at the
    // top of the loop against three at the bottom, so the loop reads as weight
    // draining rather than a shape moving.
    // "wavy" because each lean swaps most of the grid at once: stepped, that is
    // a flash; eased, the mass reads as tipping.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 150,
      frames: f(
        [1, 4, 5, 6, 9, 10, 11, 14],
        [0, 1, 4, 5, 6, 9, 10, 11, 14, 15],
        [2, 3, 5, 6, 7, 8, 9, 10, 12, 13],
        [0, 1, 4, 5, 6, 9, 10, 11, 14, 15],
        [2, 3, 5, 6, 7, 8, 9, 10, 12, 13],
        [5, 6, 9, 10],
        [2, 5, 6],
        [9, 10, 14],
      ),
    },
  },
  {
    name: "pro-33",
    color: c(),
    // Drawn in the playground, kept frame for frame. The top bar drops as a
    // single cell down the middle, lands as the bottom bar, throws the four side
    // cells out sideways, and the splash closes on the full outline — the one
    // frame where the whole rim is lit, which is what reads as complete. A
    // single drop back up to the top starts the next fall. Nothing else holds
    // between frames — every frame is a different part of the grid, so the fade
    // is what connects the fall to the landing.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 3,
      interval: 140,
      frames: f(
        [0, 1, 2],
        [4],
        [7],
        [9, 10, 11],
        [3, 5, 6, 8],
        [0, 1, 2, 3, 5, 6, 8, 9, 10, 11],
        [1],
      ),
    },
  },
  {
    name: "pro-34",
    color: c(),
    // Drawn in the playground, kept frame for frame, and the widest swing in the
    // set: seventeen of twenty-five cells lit, down to a diagonal band, back up
    // to a near-inverse seventeen, then shut to a five-cell plus at the centre.
    // Two of the four frames are almost complements of each other, so the loop
    // reads as an aperture working rather than a shape travelling.
    // "wavy" and a roomy 170: a swap this large has to cross-fade, and stepping
    // it at spinner pace would strobe.
    animation: "wavy",
    pattern: {
      rows: 5,
      cols: 5,
      interval: 170,
      frames: f(
        [0, 1, 2, 3, 4, 6, 7, 8, 12, 16, 17, 18, 20, 21, 22, 23, 24],
        [3, 8, 9, 10, 11, 12, 15, 16, 17, 21, 22],
        [0, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 24],
        [7, 11, 12, 13, 17],
      ),
    },
  },
  {
    name: "pro-35",
    color: c(),
    // Drawn in the playground, kept frame for frame. Two cells ride the middle
    // columns from top to bottom and back, and at each end they split to the
    // corners of that row — the flare is the turn. Never more than two cells
    // lit, so at this speed the fade behind the pair is most of what you see,
    // which is what gives the travel its length.
    // The loop runs one frame long on purpose: it comes back through the second
    // row twice, so the return does not land on the same beat as the descent.
    // Hard step, not wavy: the eased mode fades over a fixed 320ms, which at
    // this interval swallows five frames and caps how fast the travel can read.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 60,
      frames: f(
        [0, 3],
        [1, 2],
        [5, 6],
        [9, 10],
        [13, 14],
        [12, 15],
        [13, 14],
        [12, 15],
        [9, 10],
        [5, 6],
        [1, 2],
        [0, 3],
        [1, 2],
      ),
    },
  },
  {
    name: "pro-36",
    color: c(),
    // Drawn in the playground, kept frame for frame. The centre block fires,
    // and a spark runs out of it to one corner and off the grid — top-left out
    // through bottom-right on the first pass, then top-right, then bottom-left.
    // Three passes, a different diagonal each time, so the loop takes fourteen
    // frames to repeat itself even though the block is doing the same thing
    // every fifth. The empty frame after each pass is the reload.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: f(
        [5, 6, 9, 10],
        [0],
        [1, 4],
        [11, 14],
        [15],
        [],
        [5, 6, 9, 10],
        [2, 7],
        [3],
        [],
        [5, 6, 9, 10],
        [8, 13],
        [12],
        [],
      ),
    },
  },
  {
    name: "pro-37",
    color: c(),
    // Drawn in the playground, kept frame for frame, and the longest loop in the
    // set. It runs three ideas back to back without a dark frame between them: a
    // band climbing out of the bottom row to the top, the same band folding back
    // in, and then diagonals crossing the grid. Four cells light on every frame
    // but never the same four twice, apart from one held pair mid-loop that is
    // the only beat where it sits still.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: f(
        [13, 14],
        [9, 10, 12, 15],
        [5, 6, 8, 11],
        [1, 2, 4, 7],
        [0, 3, 5, 6],
        [4, 7, 9, 10],
        [8, 11, 13, 14],
        [3, 6, 10, 15],
        [2, 5, 9, 14],
        [1, 4, 8, 13],
        [0, 5, 9, 12],
        [1, 6, 10, 13],
        [1, 6, 10, 13],
        [2, 7, 11, 14],
        [4, 7, 9, 10],
      ),
    },
  },
  {
    name: "pro-38",
    color: c(),
    // Drawn in the playground, kept frame for frame, and the shortest loop in
    // the set at five frames. A three-cell wedge hops the four quadrants
    // clockwise, and the four corners never light, so what turns is a pinwheel
    // rather than a ring. The last frame repeats the first: bottom-left gets two
    // beats, which is the only thing telling you where the loop starts.
    animation: "wavy",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: f([8, 9, 13], [1, 4, 5], [2, 6, 7], [10, 11, 14], [8, 9, 13]),
    },
  },
];
