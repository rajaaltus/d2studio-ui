import { cn } from "@/lib/utils";

/** Fill track spans x=16.158 → 175.042 inside the 392px pill (83% ⇒ 131.87, per the Figma source). */
const TRACK_WIDTH = 158.884;
/** The pill, and the cap the fill and the readout keep clear of its ends. */
const PILL_WIDTH = 392;
const PAD = 16.158;
/** What the readout reserves once the tick leaders are gone: the percent's
 *  6-char box, the 9.5px gap, the label's 10-char box — 16 mono chars at 12px —
 *  and 12px of clear air between the fill and the bracket. */
const READOUT = 137;
/** The two reserved boxes, in mono chars: "(100%)" and "Progress..". */
const PCT_CH = 6;
const LABEL_CH = 10;
/** Stop offsets baked into the Figma gradients — only the colours are tunable. */
const SURFACE_OFFSETS = [0, 50, 100];
const FILL_OFFSETS = [37.4, 59.7, 75.6, 100];
/** The reference fades the fill's tail stop to 70%. */
const FILL_ALPHAS = [1, 1, 1, 0.7];

export type Shadow = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
};

export type BarTheme = {
  surface: { mode: "gradient" | "solid"; solid: string; stops: string[] };
  surfaceOpacity: number;
  fill: { mode: "gradient" | "solid"; solid: string; stops: string[] };
  stroke: { color: string; opacity: number };
  backdropBlur: number;
  drop: Shadow;
  inner: Shadow;
  text: { pct: string; label: string };
};

/** The label pair the dark surfaces share — near-white text, tinted percent. */
const LIGHT_TEXT = { pct: "#bbffd2", label: "#f8f8f8" };

/** Light mode — the Figma source values. Two departures, both because the
 *  Figma frame sits on a dark canvas and this theme doesn't: the type, whose
 *  near-white label lands at ~1.3:1 over a light page and is darkened until the
 *  label clears 4.5:1 and the percent — which the component fades to 80% —
 *  clears it composited; and the fill, whose near-white tail stop vanishes into
 *  a light surface and is replaced by a grey that still reads as a fade. */
export const LIGHT_THEME: BarTheme = {
  surface: {
    mode: "gradient",
    solid: "#e3e3e3",
    stops: ["#d7e8ff", "#e9cdff", "#ffefd6"],
  },
  surfaceOpacity: 0.2,
  fill: {
    mode: "gradient",
    solid: "#8b5cf6",
    stops: ["#8b5cf6", "#06b6d4", "#22c55e", "#c2c6d1"],
  },
  stroke: { color: "#f4f4f4", opacity: 0.6 },
  backdropBlur: 20,
  drop: { x: 0, y: 0, blur: 4, spread: 2, color: "#f3f3f3", opacity: 0.25 },
  inner: { x: 1, y: 1, blur: 10, spread: 0, color: "#fafafa", opacity: 1 },
  text: { pct: "#0e3a24", label: "#101013" },
};

/** Dark mode — same glass, dialled back so the white rim/glow doesn't blow out.
 *  The surface is now a wash over a near-black page, so the type flips back to
 *  the source pair. */
export const DARK_THEME: BarTheme = {
  ...LIGHT_THEME,
  surfaceOpacity: 0.16,
  // The source ramp: brighter, and free to fade out into near-white again.
  fill: {
    mode: "gradient",
    solid: "#ac82ff",
    stops: ["#ac82ff", "#67dbff", "#8bff9e", "#e5e5e5"],
  },
  text: LIGHT_TEXT,
  stroke: { color: "#f4f4f4", opacity: 0.32 },
  drop: { x: 0, y: 0, blur: 12, spread: 2, color: "#f3f3f3", opacity: 0.1 },
  inner: { x: 1, y: 1, blur: 10, spread: 0, color: "#fafafa", opacity: 0.5 },
};

/** Fancy — the plain read: opaque surface, no backdrop blur, one lifted shadow
 *  and a 1px rim instead of the glass halo. Same fill, so the bar still reads
 *  as the same component. Opaque means the surface has to follow the page —
 *  a near-black card on a light page is the one thing that can't stay put — so
 *  light mode gets a near-white surface, dark type, and a dark hairline. */
export const FANCY_THEME: BarTheme = {
  ...LIGHT_THEME,
  surface: { ...LIGHT_THEME.surface, mode: "solid", solid: "#fbfcff" },
  surfaceOpacity: 1,
  text: LIGHT_THEME.text,
  stroke: { color: "#000000", opacity: 0.12 },
  backdropBlur: 0,
  drop: { x: 0, y: 8, blur: 24, spread: -6, color: "#000000", opacity: 0.14 },
  inner: { x: 0, y: 1, blur: 0, spread: 0, color: "#ffffff", opacity: 1 },
};

/** Fancy on a dark page — the surface sinks, the rim flips white, the shadow
 *  works harder. */
export const FANCY_DARK_THEME: BarTheme = {
  ...FANCY_THEME,
  surface: { ...FANCY_THEME.surface, solid: "#1a1a1e" },
  fill: DARK_THEME.fill,
  text: LIGHT_TEXT,
  stroke: { color: "#ffffff", opacity: 0.1 },
  drop: { ...FANCY_THEME.drop, opacity: 0.6 },
  inner: { ...FANCY_THEME.inner, opacity: 0.14 },
};

/** Hex → oklch(), so every colour in the rendered CSS stays in one space.
 *  `#abc` and `#aabbcc` convert; anything else — `oklch(...)`, `var(--brand)`,
 *  a named colour — is handed to CSS untouched with its alpha applied through
 *  `color-mix`, so a theme written in any other notation still renders instead
 *  of resolving to a silent NaN. */
export function toOklch(color: string, alpha = 1) {
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.test(color)
    ? color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color
    : null;
  if (!hex)
    return alpha < 1
      ? `color-mix(in oklch, ${color} ${(alpha * 100).toFixed(1)}%, transparent)`
      : color;
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const [R, G, B] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    lin(v / 255),
  );
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(3)} ${Math.hypot(a, b).toFixed(3)} ${h.toFixed(1)}${
    alpha < 1 ? ` / ${alpha}` : ""
  })`;
}

const paint = (
  { mode, solid, stops }: BarTheme["surface"],
  offsets: number[],
  alphas: number[],
  scale = 1,
) =>
  mode === "solid"
    ? toOklch(solid, scale)
    : `linear-gradient(90deg, ${stops
        .map((c, i) => `${toOklch(c, alphas[i] * scale)} ${offsets[i]}%`)
        .join(", ")})`;

/** The dotted fill, as a mask on a 4px cell: three rows of 2px dots with a full
 *  dot of gutter between them, so the grid reads as dots rather than as a
 *  screened strip. It occupies 12px — the same 6px strip grown about its own
 *  centreline — so the bar's axis doesn't move when you switch.
 *
 *  Masked rather than repainted: the gradient, its alpha ramp and any
 *  `fillFilter` all still apply, they just land on dots.
 *
 *  The width snaps to whole cells, so the leading column is always a full dot.
 *  An unsnapped width cuts that column mid-circle and the bar ends on a sliver
 *  that reads as a rendering fault rather than as a value. The cost is real and
 *  small: the dotted read is quantised to 4px, a hair over 2% of the track. */
const CELL = 4;
const DOT_MASK =
  "radial-gradient(circle at 2px 2px, #000 1px, transparent 1.05px)";

/** The fill's light bleeding into the surface. Kept tight and faint: with no
 *  pill to contain it (`plain`) anything wider reads as a smudge on the page
 *  rather than as the glass catching the light. The spread still clears the
 *  pill's left cap — hence the clip on the root. */
const GLOW = { blur: 8, opacity: 0.14 };

const shadow = (s: Shadow, inset = false) =>
  `${inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${toOklch(s.color, s.opacity)}`;

export default function ProgressBar({
  value = 83,
  label = "Progress..",
  theme = LIGHT_THEME,
  fill = "beam",
  chrome = "full",
  fillFilter,
  className,
}: {
  value?: number;
  label?: string;
  theme?: BarTheme;
  /** How the fill is drawn: `beam` is one 6px strip, `matrix` is three rows of
   *  dots reading the same value. */
  fill?: "beam" | "matrix";
  /** How much is around the fill. `full` is the reference: percent and label
   *  bracketed by tick leaders. `bar` drops the leaders and gives the fill the
   *  room they held. `plain` drops the pill too — no surface, rim or shadow,
   *  just the fill, the percent and the status on the page itself. */
  chrome?: "full" | "bar" | "plain";
  /** A CSS filter for the fill alone — blur, saturate, brightness — so a caller
   *  animating the value can soften the gradient while it travels without
   *  touching the label, the ticks, or the surface. */
  fillFilter?: string;
  className?: string;
}) {
  // Clamped, and NaN reads as 0 rather than propagating into every width and
  // gradient stop downstream — a caller dividing by a total that hasn't loaded
  // is the ordinary way this gets an undefined value.
  const pct = Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : 0;
  const hairline = toOklch(theme.stroke.color, theme.stroke.opacity);
  const full = chrome === "full";
  const cased = chrome !== "plain";
  // Without a pill there is nothing to sit inside, so the fill and the readout
  // go to the edges rather than keeping a cap's worth of air off a rim that
  // isn't drawn.
  const pad = cased ? PAD : 0;
  const span = full ? TRACK_WIDTH : PILL_WIDTH - 2 * pad - READOUT;
  const width = (span * pct) / 100;
  // Shared by the fill and the glow it throws — same ramp, same track, so the
  // reflection can't drift out of step with the value.
  const ramp = paint(theme.fill, FILL_OFFSETS, FILL_ALPHAS);
  const track = fill === "beam" ? width : Math.round(width / CELL) * CELL;
  const rail = toOklch(theme.text.label, 0.14);
  // Round caps read as a beam; on the dot grid they'd clip the leading and
  // trailing columns mid-circle, so matrix stays square.
  const strip = cn(
    "absolute",
    fill === "beam" ? "top-[21px] h-1.5 rounded-full" : "top-[18px] h-3",
  );
  // What the readout's reserved boxes leave unused, in mono chars. The boxes
  // are sized for the longest reading each span can take, so a shorter one —
  // "Done." in a 10ch label box, "(83%)" in a 6ch percent box — leaves dead
  // space that would otherwise read as the line being off its centre. Counted
  // on the padded string, not the trimmed one: `Init. ` and `Init..` are the
  // same length, so the ellipsis can cycle without dragging the line with it.
  const pctText = `(${pct}%)`;
  // Never negative: a caller's label longer than the reserved box has no slack
  // to slide over, and letting it go negative would drag the percent left into
  // the tick instead.
  const slack = Math.max(0, LABEL_CH - label.length);
  // Centred, half the slack recentres the pair — and the percent's own slack
  // sits on its left, so it pulls the other way. Pinned right there's nothing to
  // recentre in, so the readout doesn't move at all: closing the label's dead
  // space would slide the whole line as the stage changes ("Init  " has 4ch of
  // slack, "Progress.." none, "Done." 5), which reads as the readout jumping
  // mid-run. The dead space is constant instead, and sits at the right edge.
  const nudge = full ? (slack - (PCT_CH - pctText.length)) / 2 : 0;
  // The dot grid, as style props — the fill wears it, and so does the rail
  // behind it, which would otherwise be a solid block behind a dotted bar.
  const dots =
    fill === "matrix"
      ? {
          maskImage: DOT_MASK,
          maskSize: `${CELL}px ${CELL}px`,
          WebkitMaskImage: DOT_MASK,
          WebkitMaskSize: `${CELL}px ${CELL}px`,
        }
      : undefined;

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      // The label is padded to a fixed width so the ellipsis can cycle without
      // moving the line; a screen reader should hear the word, not the padding,
      // and should hear the stage alongside the number rather than instead of
      // it — `aria-label` on its own replaces the value.
      aria-label={label.trim()}
      aria-valuetext={`${pct}%, ${label.trim()}`}
      className={cn(
        "relative h-12 w-[392px] overflow-hidden",
        cased && "rounded-full",
        className,
      )}
      style={
        cased
          ? {
              background: paint(
                theme.surface,
                SURFACE_OFFSETS,
                [1, 1, 1],
                theme.surfaceOpacity,
              ),
              backdropFilter: `blur(${theme.backdropBlur}px)`,
              WebkitBackdropFilter: `blur(${theme.backdropBlur}px)`,
              outline: `1px solid ${hairline}`,
              outlineOffset: "-1px",
              boxShadow: `${shadow(theme.drop)}, ${shadow(theme.inner, true)}`,
            }
          : undefined
      }
    >
      {/* The unrun remainder, drawn only when there's no pill: the surface is
          what says how far there is left to go, and `plain` doesn't have one —
          without a rail the fill is a stripe with nothing to read it against.
          Taken from the label colour rather than the stroke, which is the glass
          rim's near-white and would vanish on a light page. */}
      {!cased && (
        <div
          aria-hidden
          className={strip}
          style={{
            left: pad,
            width: span,
            background: rail,
            ...dots,
          }}
        />
      )}

      {/* The light the fill throws into the glass. Unmasked even in matrix mode:
          what the surface catches is the beam's colour, not its dot grid.
          Dropped for a plain matrix: there's no glass to catch anything, so the
          blur just fogs the gaps the dot grid is there to show. */}
      {!(fill === "matrix" && !cased) && (
        <div
          aria-hidden
          className={cn(strip, "pointer-events-none")}
          style={{
            left: pad,
            width: track,
            background: ramp,
            filter: `blur(${GLOW.blur}px)`,
            opacity: GLOW.opacity,
          }}
        />
      )}

      {/* progress fill */}
      <div
        className={strip}
        style={{
          left: pad,
          width: track,
          background: ramp,
          filter: fillFilter,
          ...dots,
        }}
      />

      {/* left leader ──┤ */}
      {full && (
        <>
          <div
            className="absolute top-[23.5px] left-[184.807px] h-px w-6"
            style={{ background: hairline }}
          />
          <div
            className="absolute top-[19.5px] left-[209.307px] h-[9px] w-px"
            style={{ background: hairline }}
          />
        </>
      )}

      {/* Centred in the tick gap, but on reserved widths rather than on the
          text: both spans get the width of their widest reading — "(100%)" is
          6 mono chars, "Progress.." is 10 — so the pair is a constant 16ch and
          centring it can't re-measure. Centring the glyphs instead would slide
          the whole line on every frame of a run, as digits are added and the
          ellipsis cycles.
          The percent is right-aligned in its box so the spare digit slot falls
          next to the tick; the label is left-aligned in its own so the trailing
          dots grow into dead space instead of pushing the word about.
          Then the pair slides back over whatever the boxes didn't use — see
          `nudge`, which is what keeps a short reading ("Done.") from sitting off
          to one side of a gap sized for a long one. */}
      <div
        className={cn(
          "absolute inset-y-0 flex items-center gap-[9.5px] font-mono text-xs whitespace-nowrap",
          // Full centres the pair in the gap the leaders bracket; the other two
          // have no gap to sit in, so the readout pins to the right and the
          // fill takes what's left.
          full && "right-[43.693px] left-[209.807px] justify-center",
          // The nudge only moves when the reading changes length — a handful of
          // times in a run, as the percent gains a digit and at each stage —
          // never per frame, so it can afford to ease instead of jumping.
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
        )}
        style={{
          ...(full ? undefined : { right: pad }),
          transform: `translateX(${nudge}ch)`,
        }}
      >
        <span
          className="inline-block w-[6ch] text-right"
          style={{ color: toOklch(theme.text.pct, 0.8) }}
        >
          {pctText}
        </span>
        {/* Clipped, because the box is what the leaders were placed around: a
            caller's longer status has to end in an ellipsis rather than run
            out under the right tick. */}
        <span
          className="inline-block w-[10ch] overflow-hidden text-left text-ellipsis"
          style={{ color: toOklch(theme.text.label) }}
        >
          {label}
        </span>
      </div>

      {/* Right leader ├── — moved out 12px from the Figma x. The source gap
          fits "(83%) Progress.." but not a reserved third digit, and the slack
          has to come from this side: the left leader sits 9.8px off a full
          fill and can't move. Still leaves 23px to the pill's cap. */}
      {full && (
        <>
          <div
            className="absolute top-[19.5px] left-[348.307px] h-[9px] w-px"
            style={{ background: hairline }}
          />
          <div
            className="absolute top-[23.5px] left-[348.807px] h-px w-6"
            style={{ background: hairline }}
          />
        </>
      )}
    </div>
  );
}
