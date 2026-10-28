// The spinners D2 Pro gives away, mirrored here so the free site can show
// them running and hand out their code. Copied from pro-d2 (its free tier in
// lib/gallery/entries.ts: the presets, the hand-drawn patterns that ship free
// and the page-only ones). Every one plays on the @d2/pixel-spinner engine.

import type {
  SpinnerAnimation,
  SpinnerColor,
  SpinnerPattern,
} from "@/components/pixel-spinner";

export type FreeSpinner = {
  name: string;
  label: string;
  color: SpinnerColor;
  animation?: SpinnerAnimation;
  pattern: SpinnerPattern;
};

export const FREE_SPINNERS: FreeSpinner[] = [
  {
    name: "ring-4-cw",
    label: "Halo",
    color: "blue",
    pattern: {
      size: 4,
      interval: 110,
      frames: [[0], [1], [2], [3], [7], [11], [15], [14], [13], [12], [8], [4]],
    },
  },
  {
    name: "dual-ring-5",
    label: "Binary",
    color: "blue",
    pattern: {
      size: 5,
      interval: 110,
      frames: [
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
        [5, 7],
      ],
    },
  },
  {
    name: "vortex-in",
    label: "Vortex",
    color: "blue",
    pattern: {
      size: 4,
      interval: 90,
      frames: [
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
        [9],
      ],
    },
  },
  {
    name: "col-wave-5",
    label: "Cascade",
    color: "crimson",
    pattern: {
      size: 5,
      interval: 120,
      frames: [
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [3, 8, 13, 18, 23],
        [2, 7, 12, 17, 22],
        [1, 6, 11, 16, 21],
      ],
    },
  },
  {
    name: "rain-4",
    label: "Drizzle",
    color: "crimson",
    pattern: {
      size: 4,
      interval: 180,
      frames: [
        [0, 5, 10, 15],
        [4, 9, 14, 3],
        [8, 13, 2, 7],
        [12, 1, 6, 11],
      ],
    },
  },
  {
    name: "tide-roll",
    label: "Tide",
    color: "blue",
    pattern: {
      size: 4,
      interval: 180,
      frames: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [8, 9, 10, 11],
        [4, 5, 6, 7],
      ],
    },
  },
  {
    name: "billboard-tiles",
    label: "Mosaic",
    color: "crimson",
    pattern: {
      size: 4,
      interval: 180,
      frames: [
        [0, 5, 10, 15],
        [1, 4, 11, 14],
        [2, 7, 8, 13],
        [3, 6, 9, 12],
        [5, 6, 9, 10],
      ],
    },
  },
  {
    name: "pro-4",
    label: "Comet",
    color: "violet",
    pattern: {
      rows: 4,
      cols: 2,
      interval: 100,
      frames: [[0], [1], [3], [5], [7], [6], [4], [2]],
    },
  },
  {
    name: "pro-27",
    label: "Bounce",
    color: "blue",
    pattern: {
      rows: 4,
      cols: 5,
      interval: 100,
      frames: [
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
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-28",
    label: "Pulse",
    color: "crimson",
    pattern: {
      rows: 3,
      cols: 6,
      interval: 100,
      frames: [[6], [7], [2], [9], [15], [10], [11], []],
    },
    animation: "wavy",
  },
  {
    name: "pro-29",
    label: "Hourglass",
    color: "hotpink",
    pattern: {
      rows: 4,
      cols: 3,
      interval: 200,
      frames: [
        [0, 1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4, 5, 7],
        [3, 4, 5, 7, 9, 10, 11],
        [4, 7, 9, 10, 11],
        [6, 7, 8, 9, 10, 11],
        [6, 7, 8, 9, 10, 11],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-30",
    label: "Spark",
    color: "violet",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 140,
      frames: [
        [1, 2, 3, 6, 7, 11, 12],
        [1, 2, 3, 6, 7, 9, 11],
        [1, 2, 3, 6, 7, 11],
        [1, 2, 3, 6, 7, 8, 11, 13],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-31",
    label: "Strobe",
    color: "blue",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 140,
      frames: [[12], [9], [1, 2, 3, 6, 7, 11], [8, 13]],
    },
    animation: "wavy",
  },
  {
    name: "pro-32",
    label: "Tumble",
    color: "crimson",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 150,
      frames: [
        [1, 4, 5, 6, 9, 10, 11, 14],
        [0, 1, 4, 5, 6, 9, 10, 11, 14, 15],
        [2, 3, 5, 6, 7, 8, 9, 10, 12, 13],
        [0, 1, 4, 5, 6, 9, 10, 11, 14, 15],
        [2, 3, 5, 6, 7, 8, 9, 10, 12, 13],
        [5, 6, 9, 10],
        [2, 5, 6],
        [9, 10, 14],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-33",
    label: "Splash",
    color: "hotpink",
    pattern: {
      rows: 4,
      cols: 3,
      interval: 140,
      frames: [
        [0, 1, 2],
        [4],
        [7],
        [9, 10, 11],
        [3, 5, 6, 8],
        [0, 1, 2, 3, 5, 6, 8, 9, 10, 11],
        [1],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-34",
    label: "Aperture",
    color: "violet",
    pattern: {
      rows: 5,
      cols: 5,
      interval: 170,
      frames: [
        [0, 1, 2, 3, 4, 6, 7, 8, 12, 16, 17, 18, 20, 21, 22, 23, 24],
        [3, 8, 9, 10, 11, 12, 15, 16, 17, 21, 22],
        [0, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 24],
        [7, 11, 12, 13, 17],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-35",
    label: "Piston",
    color: "blue",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 150,
      frames: [
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
      ],
    },
  },
  {
    name: "pro-38",
    label: "Pinwheel",
    color: "violet",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: [
        [8, 9, 13],
        [1, 4, 5],
        [2, 6, 7],
        [10, 11, 14],
        [8, 9, 13],
      ],
    },
    animation: "wavy",
  },
  {
    name: "pro-51",
    label: "Shutter",
    color: "crimson",
    pattern: {
      rows: 3,
      cols: 5,
      interval: 110,
      frames: [
        [0, 1, 2, 5, 7, 10, 11, 12],
        [1, 2, 3, 6, 8, 11, 12, 13],
        [2, 3, 4, 7, 9, 12, 13, 14],
        [3, 4, 8, 9, 13, 14],
        [4, 9, 14],
        [3, 4, 8, 9, 13, 14],
        [2, 3, 4, 7, 9, 12, 13, 14],
        [1, 2, 3, 6, 8, 11, 12, 13],
        [0, 1, 2, 5, 7, 10, 11, 12],
      ],
    },
  },
  {
    name: "pro-59",
    label: "Seesaw",
    color: "crimson",
    pattern: {
      rows: 5,
      cols: 5,
      interval: 100,
      frames: [
        [5, 6, 15, 16],
        [0, 5, 6, 15, 16, 20],
        [12],
        [8, 9, 18, 19],
        [4, 8, 9, 18, 19, 24],
        [],
      ],
    },
  },
  {
    name: "pro-61",
    label: "Skitter",
    color: "violet",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 130,
      frames: [
        [4, 9],
        [9, 14],
        [2, 7],
        [8, 13],
        [1, 4],
        [6, 9],
        [5, 8],
        [6, 9],
        [2, 5, 7, 8, 10, 13],
      ],
    },
  },
  {
    name: "pro-72",
    label: "Stairs",
    color: "crimson",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 160,
      frames: [[15], [10, 11, 14, 15], [5, 6, 9, 10], [0, 1, 4, 5], [0]],
    },
  },
  {
    name: "pro-73",
    label: "Fold",
    color: "hotpink",
    pattern: {
      rows: 4,
      cols: 4,
      interval: 100,
      frames: [
        [0],
        [0, 15],
        [1, 14],
        [2, 13],
        [12],
        [4, 11],
        [5, 10],
        [5, 6, 9, 10],
        [0, 3, 5, 6, 9, 10, 12, 15],
      ],
    },
  },
  {
    name: "pro-75",
    label: "Stipple",
    color: "blue",
    pattern: {
      size: 3,
      interval: 100,
      frames: [
        [4],
        [8],
        [2],
        [0],
        [4],
        [6],
        [1],
        [7],
        [3],
        [5],
        [2, 6],
        [0, 8],
      ],
    },
  },
  {
    name: "pro-76",
    label: "Eclipse",
    color: "crimson",
    pattern: {
      size: 3,
      interval: 120,
      frames: [
        [2, 4, 5, 6, 7, 8],
        [0, 3, 4, 6, 7, 8],
        [0, 1, 2, 4, 5, 8],
        [0, 1, 2, 3, 4, 6],
        [0, 4, 8],
        [2, 4, 6],
      ],
    },
  },
  {
    name: "free23",
    label: "Downpour",
    color: "blue",
    // 3×6, wider than it is tall: two runs sweep the lower rows left to right
    // while single cells drop in from the top row, so the grid reads as rain
    // landing rather than one shape moving.
    pattern: {
      rows: 3,
      cols: 6,
      interval: 110,
      frames: [
        [12],
        [7, 13],
        [2, 8, 14],
        [9, 15],
        [16],
        [11, 17],
        [6, 12],
        [2, 8, 13, 14],
        [8, 14],
        [3, 9, 15],
        [10, 16],
        [5, 11, 17],
      ],
    },
  },
  {
    name: "free24",
    label: "Crumble",
    color: "blue",
    // Starts full and empties: cells drop out a few at a time, top row first,
    // until only the middle of the bottom row is left. The last frame refills
    // the lower two rows, so the loop reads as a collapse and a catch rather
    // than a dissolve that snaps back to full.
    pattern: {
      rows: 3,
      cols: 6,
      interval: 100,
      frames: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        [0, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17],
        [0, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        [2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17],
        [6, 8, 10, 12, 13, 14, 15, 16, 17],
        [6, 8, 12, 14, 15],
        [14, 15],
        [3, 7, 9, 10, 12, 13, 14, 15, 16, 17],
      ],
    },
  },
  {
    name: "free30",
    label: "Lattice",
    color: "blue",
    // 5×5 read as two diagonals: the corners and the inner X trade off for five
    // frames, then the whole X lights at once and the loop closes on the four
    // corners alone — the same close as pro-41 and pro-42, from a busier build.
    pattern: {
      rows: 5,
      cols: 5,
      interval: 100,
      frames: [
        [0, 2, 8, 18, 20, 22],
        [10, 14, 16, 18],
        [2, 6, 16, 22],
        [6, 8, 10, 14],
        [2, 8, 18, 22],
        [2, 6, 8, 10, 12, 14, 16, 18, 22],
        [0, 4, 20, 24],
      ],
    },
  },
  {
    name: "free38",
    label: "Ferry",
    color: "blue",
    // The top and bottom rows run out to the right and back with the middle row
    // dark throughout, the bottom row trailing the top by one cell. Two cells
    // are left over at the turns — the top-right at the far end, the bottom-left
    // on the closing frame — so neither end of the run lands square.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 110,
      frames: [
        [0, 11],
        [],
        [1, 12],
        [],
        [2, 13],
        [3, 14],
        [],
        [4],
        [3, 14],
        [2, 13],
        [1, 12],
        [0, 11],
        [10],
      ],
    },
  },
  {
    name: "free39",
    label: "Glide",
    color: "blue",
    // A three-column block slides right until it runs off the edge, then three
    // blank frames. The trail carries the whole exit: by the last lit frame only
    // one column is left, and what plays through the gap is it fading out.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 110,
      frames: [
        [0, 1, 2, 5, 6, 7, 10, 11, 12],
        [1, 2, 3, 6, 7, 8, 11, 12, 13],
        [2, 3, 4, 7, 8, 9, 12, 13, 14],
        [3, 4, 8, 9, 13, 14],
        [4, 9, 14],
        [],
        [],
        [],
      ],
    },
  },
  {
    name: "free40",
    label: "Gather",
    color: "blue",
    // Single cells and pairs scatter up the grid with no path between them —
    // bottom corners, then the middle, then the top row — before the last two
    // frames land the bottom two rows nearly whole. The scatter is the setup;
    // the loop reads as the grid assembling itself out of the trail.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 110,
      frames: [
        [10, 14],
        [7],
        [6, 8],
        [1, 3],
        [2],
        [7, 11, 12, 13],
        [2, 6, 7, 8, 10, 11, 12, 13, 14],
      ],
    },
  },
  {
    name: "free45",
    label: "Sift",
    color: "blue",
    // Two opposite corner clusters trade off — top-left first, then
    // bottom-right — so the grid reads as filling downwards. Four cells never
    // light at all, which is what keeps the two clusters legible as separate
    // shapes rather than one wave.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: [
        [0, 1, 4],
        [0, 1, 2, 4, 8, 10],
        [11, 14, 15],
        [5, 7, 11, 13, 14, 15],
      ],
    },
  },
  {
    name: "free46",
    label: "Blink",
    color: "blue",
    // Almost nothing: three cells, then one, then five empty frames. The whole
    // loop is the trail draining, so what plays is a single blink and a long
    // dark beat.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: [[8, 9, 13], [3], [], [], [], [], []],
    },
  },
  {
    name: "free47",
    label: "Fizzle",
    color: "blue",
    // A scatter of six, then one cell twice over, then a single corner, then
    // three empty frames. Like free46 it spends most of the loop draining —
    // the pause is the pattern.
    pattern: {
      rows: 4,
      cols: 4,
      interval: 110,
      frames: [[4, 5, 6, 10, 12, 14], [], [6], [3], [], [], []],
    },
  },
  {
    name: "free43",
    label: "Sundial",
    color: "blue",
    // The four corner triangles light one after another, anticlockwise, and the
    // loop closes on the main anti-diagonal — the one line that touches three of
    // the four corners it just walked.
    pattern: {
      rows: 5,
      cols: 5,
      interval: 110,
      frames: [
        [0, 1, 5],
        [3, 4, 9],
        [19, 23, 24],
        [15, 20, 21],
        [4, 12, 20],
      ],
    },
  },
  {
    name: "free44",
    label: "Frame",
    color: "blue",
    // Four 2×2 corner blocks in three beats: the two on the main diagonal fire
    // together, then the other two one at a time, then a blank frame. Nothing
    // within two cells of the centre ever lights, so it reads as the corners of
    // a frame rather than a shape.
    pattern: {
      rows: 5,
      cols: 5,
      interval: 110,
      frames: [
        [0, 1, 5, 6, 18, 19, 23, 24],
        [3, 4, 8, 9],
        [15, 16, 20, 21],
        [],
      ],
    },
  },
  {
    name: "free42",
    label: "Idle",
    color: "blue",
    // Nearly static on purpose: three cells hold lit through the whole loop and
    // the only motion is two cells at the bottom-right blinking on and off. The
    // trail is what makes those two read as a beat rather than a flicker.
    pattern: {
      rows: 3,
      cols: 5,
      interval: 110,
      frames: [
        [0, 6, 10],
        [0, 6, 10],
        [0, 6, 10],
        [0, 6, 10, 13],
        [0, 6, 10, 13, 14],
        [0, 6, 10, 14],
      ],
    },
  },
  {
    name: "free41",
    label: "Column",
    color: "blue",
    // free40 with the hole filled in: a solid three-row block walks down and
    // back up. Every row is one track, so the whole thing is five keyframes —
    // the plainest pattern here, and the one that reads at the smallest size.
    pattern: {
      rows: 5,
      cols: 3,
      interval: 110,
      frames: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [3, 4, 5, 6, 7, 8, 9, 10, 11],
        [6, 7, 8, 9, 10, 11, 12, 13, 14],
        [9, 10, 11, 12, 13, 14],
        [12, 13, 14],
        [9, 10, 11, 12, 13, 14],
        [6, 7, 8, 9, 10, 11, 12, 13, 14],
        [3, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
      ],
    },
  },
  {
    name: "free48",
    label: "Throb",
    color: "blue",
    // Breathes out from the centre and snaps back. The doubled first frame
    // holds the single lit cell a beat so the expansion reads as a pulse
    // rather than a continuous throb.
    pattern: {
      rows: 3,
      cols: 3,
      interval: 100,
      frames: [
        [4],
        [4],
        [1, 3, 4, 5, 7],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [1, 3, 4, 5, 7],
        [4],
      ],
    },
  },
  {
    name: "free49",
    label: "Clock",
    color: "blue",
    // A lit centre plus one cell walking the ring clockwise — the trail turns
    // the moving cell into a sweeping hand.
    pattern: {
      rows: 3,
      cols: 3,
      interval: 80,
      frames: [
        [4, 1],
        [4, 2],
        [4, 5],
        [4, 8],
        [4, 7],
        [4, 6],
        [4, 3],
        [4, 0],
      ],
    },
  },
];
