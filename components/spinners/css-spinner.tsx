import type { SpinnerPattern } from "@/components/pixel-spinner";

// A pixel spinner drawn with CSS only, copied from D2 Pro's gallery. The frames
// are known upfront, so the loop is one @keyframes track per cell: no timer
// and no re-render per tick, and opacity is the only animated property. A wall
// of forty PixelSpinners would be forty intervals re-rendering their grids.

// The trail PixelSpinner draws: the freshest frame a cell appears in wins.
const TRAIL = [1, 0.5, 0.25, 0.15];

function cellTrack(frames: number[][], cell: number): number[] {
  return frames.map((_, f) => {
    for (let t = 0; t < TRAIL.length; t++) {
      const src = frames[(f - t + frames.length) % frames.length] ?? [];
      if (src.includes(cell)) return TRAIL[t];
    }
    return 0;
  });
}

// Cells that share a track share one @keyframes rule, named after the track.
const trackName = (track: number[]) => `ls-t${track.map((v) => Math.round(v * 1000)).join("-")}`;

const trackRule = (track: number[]) =>
  `@keyframes ${trackName(track)}{` +
  track.map((v, i) => `${((i * 100) / track.length).toFixed(3)}%{opacity:${v}}`).join("") +
  `100%{opacity:${track[0]}}}`;

// Cell and gap at a given width, off the standard 4-wide grid every pattern is
// authored on, keeping one 14:4.64 cell-to-gap ratio in whole pixels.
const GAP_RATIO = 4.64 / 14;
export function metrics(size: number, cols = 4) {
  let cellSize = Math.max(1, Math.round(size / (cols + (cols - 1) * GAP_RATIO)));
  let gap = Math.max(1, Math.round(cellSize * GAP_RATIO));
  while (cellSize * cols + gap * (cols - 1) > size) {
    if (gap > 1) gap -= 1;
    else if (cellSize > 1) cellSize -= 1;
    else break;
  }
  return { cellSize, gap };
}

// Two layers per cell: the dim plate holds still and the lit one on top is
// the only thing that animates. Flat, as pro draws them: one solid colour per
// layer, no stroke, no glow, no growth. The caller sets --cell-color (lit) and
// --cell-off (unlit).
export type CellShape = "square" | "circle";

export function CssSpinner({
  pattern,
  size = 16,
  shape = "square",
}: {
  pattern: SpinnerPattern;
  size?: number;
  shape?: CellShape;
}) {
  const round = shape === "circle" ? " rounded-full" : "";
  const rows = pattern.rows ?? pattern.size ?? 3;
  const cols = pattern.cols ?? pattern.size ?? 3;
  const { cellSize, gap } = metrics(size);
  const duration = (pattern.interval ?? 220) * pattern.frames.length;
  const tracks = Array.from({ length: rows * cols }, (_, i) => cellTrack(pattern.frames, i));
  const rules = [
    ...new Map(tracks.filter((t) => t.some(Boolean)).map((t) => [trackName(t), trackRule(t)])).values(),
  ].join("");

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gap }}
      role="status"
      aria-label="Loading"
    >
      {/* display:none by UA rule, so it is not a grid item. */}
      <style>{rules}</style>
      {tracks.map((track, i) => (
        <div key={i} className={`relative bg-[var(--cell-off)]${round}`} style={{ width: cellSize, height: cellSize }}>
          {track.some(Boolean) && (
            <div
              className={`absolute inset-0 bg-[var(--cell-color)] opacity-0${round}`}
              style={{ animation: `${trackName(track)} ${duration}ms linear infinite` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
