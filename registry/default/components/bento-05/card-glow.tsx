"use client";

// Ambient light living in the card's own texture. Not a hover effect — it runs
// on its own, all the time, so the artwork reads as lit material rather than
// flat print.
//
// What lights up is always the texture itself — the grain, the stripes. A soft
// field passes over the card and whichever bits of texture it crosses come up.
// That's why there are two nested layers — the field lives on the outer one, the
// texture on the inner, and nesting intersects them for free. The blend sits
// above the pair so they add to the card as a single thing.
//
// Two fields, picked by texture:
//   pin     a lit dot held at the centre of the bolt with thin rings breathing
//           out of it, holding their thickness and fading as they widen — the
//           card marking a location, the way a device pulses on a map
//   sweep   a band running the length of the stripes, top to bottom, easing slow
//           in and slow out so it gathers speed through the middle
//
// The sweep is gated by a cycle on a period that shares no factor with it, so
// how present the light is keeps changing under the motion. The ripple needs no
// gate: each ring carries its own rise and fall, and the rings overlap, so the
// swell is already there in the field itself.
//
// All of it is CSS keyframes — no per-frame JS, no rects, no listeners. The card
// lights itself.

import { useEffect, useState, type CSSProperties } from "react";
import { grainTile } from "./grain";
import { useStill } from "./load-in";

export type Texture = "grain" | "stripes";

// Each lit card is cut by its own texture rather than one house pattern laid
// over both: grain on the bolt, stripes on AI. The 16+ and globe cards stay
// unlit — their artwork carries enough on its own. Measured off the export's own
// pattern images (the alpha profile of one tile, in image pixels), then carried
// through the pattern's scale and the SVG's slice to land on the card at the
// same period the artwork paints:
//
//   AI      32px tile, two bars      -> 12.5px, vertical (the rect is rotated)
//   bolt    256px grain, 0.9u/px     -> 428px
//
// Sizes are percentages of the cell, not pixels, so they scale with it the way
// the artwork does. The values below are those measured periods halved — a
// finer texture inside the light than the artwork paints, on purpose.
// Stripes keep 100% on the y axis: that axis is the bar's length, not its
// period, and scaling it would start tiling the bars vertically.
// ponytail: the percentages are anchored to each card's aspect at the desktop
// grid. The wide cards hold everywhere (their slice is width-driven, and so is a
// percentage); the tall pair only drifts if lg:aspect-auto gives them a shape
// the grid doesn't, and a few percent of drift on a texture this fine reads as
// nothing. Re-measure if the layout changes shape.
const tile = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// The bolt's grain is generated, not drawn — and generated once for the page, so
// asking for it again here is a cache read, not a second field.
const GRAIN_SIZE = "79% 36.75%";

// One ping, two circles — a main ring with a second behind it at a fixed gap.
// Both come out of the single gradient in the CSS, so they're one layer and one
// radius: they cannot drift apart, and the card animates one full-card gradient
// per frame per pass instead of two.
//
// One wave at a time, back to back. It leaves the pin, crosses, and the next
// goes the moment it clears — the keyframes fill the whole period, so there's
// no gap to stagger a second layer into. That's why this is a one-element
// array: succession, not overlap.
//
// The origin is the bolt's own centre, not the card's: its path sits at x
// 48.5–293.3, y 172–678 of the 314x654 viewBox once its transform is applied.
// Percentages of the artwork box below, not of the cell, so they hold at every
// aspect the grid gives the card.
const RIPPLE_ORIGIN = { "--b5-ox": "54%", "--b5-oy": "62%" } as const;

// Every layer here is measured against the export's 314x654 frame, so it is laid
// out on a box of that shape rather than on the cell: the smallest 314x654 box
// that covers the cell, centred — which is what the SVG's xMidYMid slice does
// with the artwork. min-w/min-h supply the "covers", aspect-ratio grows the
// other axis, and the cell's own overflow-hidden trims the overhang.
//
// Without it the origin drifts with the cell's aspect. At the mobile 4/5 the
// slice is width-driven and the artwork hangs ~140px past the cell top and
// bottom, which walks the bolt's centre from 62% of the cell to 70% — the rings
// end up a ring and a half above the bolt. The masks below are unaffected either
// way (cover on a box of the same aspect is an exact fit), but they cost nothing
// to move onto it and it keeps every layer in one coordinate space.
const ART =
  "absolute top-1/2 left-1/2 aspect-[314/654] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2";

// No delay: the card opens on a wave leaving the pin.
const RIPPLES = ["0s"];

// No cutout for the bolt: the rings run across it, so the light reads as
// sitting on top of the artwork rather than behind it.
//
// But running across it isn't the same as showing on it. The field is added
// light, and the bolt is already near-white — there's no headroom left up
// there, so a front that's obvious against the dark card all but vanishes the
// moment it crosses the metal. The fix is a second pass over the bolt alone,
// multiplying instead of adding: on white, multiply by the brand gradient tints
// where adding did nothing, so the front reads as the wave bending the light
// through it rather than as more light on top. Masked to the bolt, because the
// same multiply over the dark card would just fight the plus-lighter pass and
// muddy it.
//
// The path is card-art-4's bolt with its transform baked in (translate(-44.7
// -160.2) scale(1.33) applied to each point) — a <g> transform can't survive
// the trip into a mask image, so the coordinates carry it instead. The artwork
// fades the bolt out down its lower half and this follows the same ramp: bbox y
// 171.95–677.78, faded across 0.35 to 0.95 of its own height, so y 349 to
// 652.5. Without that the tint would keep going after the bolt had gone.
const BOLT_D =
  "M95.43 677.78L160.46 461.86L48.5 479.24L239.72 171.95L181.36 387.62L293.31 370.24Z";
const BOLT_ONLY = tile(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 314 654">' +
    '<linearGradient id="f" gradientUnits="userSpaceOnUse" x1="0" y1="349" x2="0" y2="652.5">' +
    '<stop offset="0" stop-color="#fff"/>' +
    '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    `<path d="${BOLT_D}" fill="url(#f)"/></svg>`,
);

// The inverse: everything except the bolt. Same path and same fade ramp, but
// punched out of a full-card rect instead of drawn on its own — which needs the
// rect and the bolt inside an SVG <mask>, since a CSS alpha mask has no way to
// paint transparency over opacity. This is what puts the disc behind the bolt
// without it actually being behind the artwork, where the card's own background
// would swallow it.
const BOLT_HOLE = tile(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 314 654">' +
    '<linearGradient id="f" gradientUnits="userSpaceOnUse" x1="0" y1="349" x2="0" y2="652.5">' +
    '<stop offset="0" stop-color="#000"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<mask id="m"><rect width="314" height="654" fill="#fff"/>' +
    `<path d="${BOLT_D}" fill="url(#f)" stroke="url(#f)" stroke-width="7"/></mask>` +
    '<rect width="314" height="654" fill="#fff" mask="url(#m)"/></svg>',
);

// cover + center is what xMidYMid slice resolves to, which is how the card
// paints the artwork — so the mask stays registered with the bolt at every
// aspect the grid gives the cell.
const fitToBolt = (mask: string) =>
  ({
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "cover",
    WebkitMaskSize: "cover",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  }) as const;

const BOLT_FIT = fitToBolt(BOLT_ONLY);
const HOLE_FIT = fitToBolt(BOLT_HOLE);

// The rings the bolt stands on: four concentric hairlines from the same origin
// the live ripple leaves from, so the moving front travels along the same
// geometry the static ones describe rather than cutting across it.
//
// Four means a plain gradient rather than a repeating one — repeating has no
// count, it just tiles to the corners, so the stops are written out. One
// element either way.
// ponytail: the radii are pixels, per the 24px spec, so unlike the rest of this
// file they don't scale with the cell. At the desktop size that's what was
// asked for; if the card ever gets much larger they'll sit in close to the
// middle and want redoing as percentages of the corner distance.
const RING_GAP = 24;
const RING_HALF = 0.5;
const RINGS = `radial-gradient(circle at ${RIPPLE_ORIGIN["--b5-ox"]} ${RIPPLE_ORIGIN["--b5-oy"]}, ${[
  1, 2, 3, 4,
]
  .flatMap((n) => {
    const r = n * RING_GAP;
    return [
      `transparent ${r - RING_HALF}px`,
      `#f3f3f3 ${r - RING_HALF}px`,
      `#f3f3f3 ${r + RING_HALF}px`,
      `transparent ${r + RING_HALF}px`,
    ];
  })
  .join(", ")}, transparent 100%)`;

// One band, long and soft, running down a line.
const BAND =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.7) 35%, #000 50%, rgba(0,0,0,.7) 65%, transparent 100%)";

// --- the AI card's stripes -------------------------------------------------
//
// Lines light one at a time, not as a wall. Each bar in the pattern is assigned
// to one of five layers, and a layer is a sweep of its own with its own duration
// and phase — so the light is running down some lines while others are still
// dark, and no two lines are ever quite in step. One bar in the repeat is
// assigned to nothing and never lights at all: the dropped line.
//
// Grouped into layers rather than one element per line, because at this period
// the card carries a few hundred bars and a few hundred animating elements is a
// real cost for an effect whose whole job is to look irregular. Eight bars and
// five layers does it with ten elements, and the repeat is long enough that the
// grouping doesn't read as a grouping.
// Even indices are the 1.0-alpha bars, odd the 0.3 ones, so the mapping spreads
// both across the layers — a layer that drew only faint bars would read as a
// sweep that never quite lights rather than as one more line out of step.
const STRIPE_LAYER = [0, 3, 1, 0, 2, 4, -1, 1];

// Deliberately not multiples of each other — shared factors would let the
// layers fall back into step every few cycles, which is exactly the wall the
// individual lines are meant to break up.
const STRIPE_SWEEP = [
  { dur: "6.5s", delay: "0s" },
  { dur: "7.9s", delay: "-2.3s" },
  { dur: "5.8s", delay: "-4.1s" },
  { dur: "9.1s", delay: "-1.2s" },
  { dur: "7.2s", delay: "-5.6s" },
];

// Bar i sits in tile i>>1, at x 6 or 22 within that tile, at alpha 1.0 or 0.3 —
// the pair the export paints, where the pair is the rhythm and a single bar per
// period would read as half the stripes missing. Eight bars is four 32-unit
// tiles, so the repeat is 4x one texture period.
const STRIPE_SIZE = `${1.0715 * 4}% 100%`;
const stripeTile = (layer: number) =>
  tile(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 1" preserveAspectRatio="none">' +
      STRIPE_LAYER.map((l, i) =>
        l === layer
          ? `<rect x="${(i >> 1) * 32 + (i & 1 ? 22 : 6)}" width="4" height="1" fill="#000"${i & 1 ? ' opacity=".3"' : ""}/>`
          : "",
      ).join("") +
      "</svg>",
  );

// The artwork is dark in both themes, so the light is added in both — and it is
// the same light in both, the blue ramp.
//
// It used to read --d2-blue-gradient, which looks like the right token and is
// not: the house defines it holographic (purple -> magenta -> orange) at :root
// and blue only under .dark, so the card's waves came up magenta on the pale
// theme and blue on the dark one. The artwork underneath does not change between
// themes, so neither should the light falling on it.
//
// --b5-lit is the override hook instead: block-scoped, unset by default, so a
// project that wants its own ramp sets one value and gets it in both themes
// rather than inheriting a token that flips underneath it.
const lit = {
  background:
    "var(--b5-lit, linear-gradient(135deg, oklch(0.82 0.105 235.7) 0%, oklch(0.8303 0.1245 219.879) 50%, oklch(0.899 0.059 233.6) 100%))",
} as const;

export default function CardGlow({ texture }: { texture: Texture }) {
  // The grain needs a canvas, so it arrives on the pass after mount — the same
  // deal the bolt card itself makes for it.
  const [grain, setGrain] = useState("");
  const still = useStill();
  useEffect(() => {
    if (texture === "grain" && !still) setGrain(`url("${grainTile()}")`);
  }, [texture, still]);

  // Every layer here exists to move. Still, the stripes have nothing to show —
  // the light is the effect — and the bolt keeps the rings it stands on, which
  // are a static gradient and cost a paint once. No grain canvas either.
  if (still)
    return texture === "stripes" ? null : (
      <div
        aria-hidden
        className={`pointer-events-none opacity-40 mix-blend-overlay ${ART}`}
        style={{ ...HOLE_FIT, background: RINGS }}
      />
    );

  if (texture === "stripes")
    return (
      <div
        aria-hidden
        className="b5-sweep-gate pointer-events-none absolute inset-0 mix-blend-plus-lighter"
      >
        {STRIPE_SWEEP.map((s, i) => (
          <div
            key={i}
            className="b5-sweep absolute inset-0"
            style={{
              maskImage: BAND,
              WebkitMaskImage: BAND,
              animationDuration: s.dur,
              animationDelay: s.delay,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                maskImage: stripeTile(i),
                WebkitMaskImage: stripeTile(i),
                maskSize: STRIPE_SIZE,
                WebkitMaskSize: STRIPE_SIZE,
                ...lit,
              }}
            />
          </div>
        ))}
      </div>
    );

  // What every layer lights: the card's own grain. No texture yet means the
  // grain hasn't been drawn, and an empty mask-image would paint the field
  // solid, so the layer waits a frame for it.
  const grainLayer = (
    <div
      className="absolute inset-0"
      hidden={!grain}
      style={{
        maskImage: grain,
        WebkitMaskImage: grain,
        maskSize: GRAIN_SIZE,
        WebkitMaskSize: GRAIN_SIZE,
        ...lit,
      }}
    />
  );

  // Both passes draw the same pin and the same rings off the same delays, so
  // they stay in step without anything having to keep them there.
  const signal = (
    <>
      {/* The source, first — everything after it is what leaves it. */}
      <div
        className="b5-pin absolute inset-0"
        style={RIPPLE_ORIGIN as CSSProperties}
      >
        {grainLayer}
      </div>
      {RIPPLES.map((delay, i) => (
        <div
          key={i}
          className="b5-ripple absolute inset-0"
          style={{ ...RIPPLE_ORIGIN, animationDelay: delay } as CSSProperties}
        >
          {grainLayer}
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* The rings, under everything. Overlay rather than a flat stroke, so
          they lift the artwork they cross instead of drawing a grey line over
          it — the card's own colour still reads through each hairline. Held out
          of the bolt by the cutout, which is what makes them read as behind. */}
      <div
        aria-hidden
        className={`pointer-events-none opacity-40 mix-blend-overlay ${ART}`}
        style={{ ...HOLE_FIT, background: RINGS }}
      />
      {/* The card: added light, which is what the dark artwork wants. */}
      <div
        aria-hidden
        className={`pointer-events-none mix-blend-plus-lighter ${ART}`}
      >
        {signal}
      </div>
      {/* The bolt: the same fronts, tinting instead of adding. Full strength —
          the ring band is thin and the grain inside it is fine, so what lands on
          the metal is a swing of about 77/255 at the crest and nothing at all
          either side of it. Dialled back it just disappeared into the artwork. */}
      <div
        aria-hidden
        className={`pointer-events-none mix-blend-multiply ${ART}`}
        style={BOLT_FIT}
      >
        {signal}
      </div>
    </>
  );
}
