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
    name: "cross",
    color: c(),
    pattern: { size: 3, interval: 360, frames: f([0, 2, 6, 8], []) },
  },
  {
    name: "x-shape",
    color: c(),
    pattern: { size: 3, interval: 360, frames: f([1, 3, 4, 5, 7], []) },
  },
  {
    name: "corners",
    color: c(),
    pattern: { size: 3, interval: 320, frames: f([0, 2, 4, 6, 8], [4]) },
  },
  {
    name: "diamond",
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
    name: "spiral-cw",
    color: c(),
    pattern: {
      size: 3,
      interval: 160,
      frames: f([0, 1], [1, 2], [2, 5], [5, 8], [8, 7], [7, 6], [6, 3], [3, 0]),
    },
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
    name: "snake",
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
    name: "rain",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([0, 5], [3, 8], [6, 2], [0, 5]) },
  },
  {
    name: "rain-rev",
    color: c(),
    pattern: { size: 3, interval: 180, frames: f([2, 3], [5, 6], [8, 0], [2, 3]) },
  },
  {
    name: "waterfall",
    color: c(),
    pattern: { size: 3, interval: 160, frames: f([0, 1, 2], [3, 4, 5], [6, 7, 8], []) },
  },
  {
    name: "breathing",
    color: c(),
    pattern: {
      size: 3,
      interval: 360,
      frames: f([4], [1, 3, 4, 5, 7], [0, 1, 2, 3, 4, 5, 6, 7, 8], [1, 3, 4, 5, 7]),
    },
  },
  {
    name: "heartbeat",
    color: c(),
    pattern: {
      size: 3,
      interval: 200,
      frames: f([4], [0, 1, 2, 3, 4, 5, 6, 7, 8], [4], [], [4], [0, 1, 2, 3, 4, 5, 6, 7, 8], []),
    },
  },
  {
    name: "twinkle",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0, 4, 8], [2, 4, 6], [1, 4, 7], [3, 4, 5]),
    },
  },
  {
    name: "sparkle",
    color: c(),
    pattern: {
      size: 3,
      interval: 200,
      frames: f([0, 5, 7], [2, 3, 8], [1, 6, 8], [4, 0, 5]),
    },
  },
  {
    name: "chaos",
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
    name: "border",
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
    name: "line-h-mid",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([3], [4], [5], [4]) },
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
    name: "line-v-mid",
    color: c(),
    pattern: { size: 3, interval: 200, frames: f([1], [4], [7], [4]) },
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
    name: "corners-only",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0], [2], [8], [6]),
    },
  },
  {
    name: "corners-sync",
    color: c(),
    pattern: {
      size: 3,
      interval: 380,
      frames: f([0, 2, 6, 8], []),
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
    name: "L-tl",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0, 1], [0, 3], [0, 1, 3]),
    },
  },
  {
    name: "L-tr",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([1, 2], [2, 5], [1, 2, 5]),
    },
  },
  {
    name: "L-bl",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([3, 6], [6, 7], [3, 6, 7]),
    },
  },
  {
    name: "L-br",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([5, 8], [7, 8], [5, 7, 8]),
    },
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
    name: "duo-diag",
    color: c(),
    pattern: {
      size: 3,
      interval: 280,
      frames: f([0, 8], [2, 6]),
    },
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
    name: "frame-sync",
    color: c(),
    pattern: {
      size: 3,
      interval: 360,
      frames: f([0, 1, 2, 3, 5, 6, 7, 8], [4], [0, 1, 2, 3, 5, 6, 7, 8]),
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
    name: "hourglass",
    color: c(),
    pattern: {
      size: 3,
      interval: 220,
      frames: f([0, 1, 2, 4, 8], [1, 4, 7], [4], [4, 6, 7, 8]),
    },
  },
  {
    name: "zigzag",
    color: c(),
    pattern: {
      size: 3,
      interval: 180,
      frames: f([0, 4, 8], [1, 3, 5, 7], [2, 4, 6]),
    },
  },
  {
    name: "clock",
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
    name: "bounce",
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
    name: "wink",
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
    name: "wave-4-tb",
    color: c(),
    pattern: {
      size: 4,
      interval: 160,
      frames: f([0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]),
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
];
