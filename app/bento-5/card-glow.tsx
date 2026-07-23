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
//   ripple  a train of rings going out from the centre of the bolt, each
//           holding its thickness and fading as it widens, so the grain lights
//           in a front that passes and leaves — a drop landing, not an orbit
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

// Two waves per drop — four rings, since each wave is a main front with a thin
// one trailing it (the gradient in the CSS draws the pair). Evenly spaced,
// which is right here where it was wrong for the stripes: a drop in water
// throws its fronts at a steady interval, and staggering them irregularly would
// read as several drops rather than one. The second peak sits well under the
// first so the trailing wave is clearly the answer to the leading one.
//
// Negative delays start the loop mid-flight — otherwise the card opens empty
// and waits out most of a period for the first front.
//
// The origin is the bolt's own centre, not the card's: its path sits at x
// 48.5–293.3, y 172–678 of the 314x654 viewBox once its transform is applied.
// ponytail: exact at the card's declared aspect; the slice crops elsewhere and
// walks it a few percent, which on a field this soft reads as nothing.
const RIPPLE_ORIGIN = { "--b5-ox": "54%", "--b5-oy": "62%" } as const;

// The burst. One drop throws its rings in quick succession, so these are the
// first 0.7s of an 11s period and the rest is still water. Positive delays, not
// negative: the card should open on a drop landing rather than halfway through
// one.
const RIPPLES = ["0s", "0.7s"];
const RIPPLE_PEAK = [0.85, 0.62];

// No cutout for the bolt: the rings run across it, so the light reads as
// sitting on top of the artwork rather than behind it.

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

// The artwork is dark in both themes, so the light is added in both — the brand
// gradient, per the rest of the section's overlays.
const lit = { background: "var(--d2-blue-gradient)" } as const;

export default function CardGlow({ texture }: { texture: Texture }) {
  // The grain needs a canvas, so it arrives on the pass after mount — the same
  // deal the bolt card itself makes for it.
  const [grain, setGrain] = useState("");
  useEffect(() => {
    if (texture === "grain") setGrain(`url("${grainTile()}")`);
  }, [texture]);

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

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-plus-lighter"
    >
      {RIPPLES.map((delay, i) => (
        <div
          key={i}
          className="b5-ripple absolute inset-0"
          style={
            {
              ...RIPPLE_ORIGIN,
              "--b5-peak": RIPPLE_PEAK[i],
              animationDelay: delay,
            } as CSSProperties
          }
        >
          {/* No texture yet means the grain hasn't been drawn; an empty
              mask-image would paint the field solid, so the layer waits a frame
              for it. */}
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
        </div>
      ))}
    </div>
  );
}
