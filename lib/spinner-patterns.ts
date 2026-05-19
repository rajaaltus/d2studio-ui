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
  {
    name: "pattern-1",
    color: "blue",
    pattern: {
      size: 3,
      interval: 190,
      frames: f([4], [2], [1], [0], [3], [6], [7], [8], [5], [4], [], []),
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
