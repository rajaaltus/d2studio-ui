import SrcC1 from "./src-c-1";
import SrcC2 from "./src-c-2";
import SrcC3 from "./src-c-3";
import SrcC4 from "./src-c-4";
import Globe from "./globe";
import CardGlow from "./card-glow";
import Flat from "./flat";
import Glow from "./glow";
import LoadIn, { LoadInGroup } from "./load-in";
import MetallicShimmer from "@/registry/default/components/metallic-shimmer";
import { GLYPH_16, GLYPH_16_AT, GLYPH_AI } from "./glyphs";

// The cards are the Figma exports as-is: each SVG already paints its own glass
// fill and 16px gradient border, so a cell is just a clip + a covering SVG.
// Real shadows are four falloffs, not one: a tight contact line where the card
// meets the page, then progressively softer and more offset layers as the light
// wraps. A single big blur reads as a sticker.
const shadow = [
  "shadow-[0_1px_1px_rgba(0,0,0,0.10),0_4px_8px_-2px_rgba(0,0,0,0.10),0_14px_28px_-8px_rgba(0,0,0,0.14),0_36px_64px_-20px_rgba(0,0,0,0.20)]",
  "dark:shadow-[0_1px_1px_rgba(0,0,0,0.45),0_4px_8px_-2px_rgba(0,0,0,0.40),0_14px_28px_-8px_rgba(0,0,0,0.50),0_36px_64px_-20px_rgba(0,0,0,0.65)]",
].join(" ");

// 24px to match the Figma frame radius; the SVGs carry the same 24 on their own
// base rect, clip and border stroke, so the clip and the artwork agree.
//
// No content-visibility here. It was worth it when a card off screen was still
// running a ripple and a grain field; below lg none of that exists any more, and
// what is left — painting artwork that is not on screen — a browser skips on its
// own. What it did keep doing was hiding anything inside it from an
// IntersectionObserver, which is a blank card for the price of an optimisation
// that had nothing left to save.
const cell = `absolute inset-0 overflow-hidden rounded-3xl ${shadow}`;
const fill = {
  className: "absolute inset-0 h-full w-full",
  preserveAspectRatio: "xMidYMid slice",
} as const;

// The ambilight lives in glow.tsx now — desktop-only, and its copy of the
// artwork is code-split so the phone never carries it.

// "16+"/"AI" repainted opaque over the export's glass, per the Figma frames:
// F7F7F7 -> DFDFDF -> C3C3C3 with a 2px #FAFAFA rim. The ramp runs to 1.25 of
// the glyph, not 1 — Figma's handle ends well below the baseline (y=210 on a
// 169-tall glyph), so the letters only ever reach the middle of it and bottom
// out at a light grey.
//
// The rim goes under the fill (paintOrder) because the AI path is a union of
// overlapping subpaths — the A's crossbar is a full rectangle buried in its
// legs — so a plain stroke outlines every internal seam and the letter comes
// apart. Painted first, the fill covers the seams and only the outer half of
// the stroke survives, so 4 draws a 2px rim.
//
// slice, like the card art, so it stays welded to the glyph the SVG underneath
// already drew once the card crops.
//
// holdTo keeps the ramp near-solid down to a fraction of the glyph's own box.
// The A's counter does not close at the top like the 6's or the 0's — it closes
// on the crossbar, at 0.77 of the letter. The plain 0.35 -> 0.95 ramp is a third
// of the way to nothing by then, so the bar arrives at about a third of the
// fill's alpha over the card's darkest quarter and stops separating the counter
// from the space below it: the A reads as a triangle. Small screens show it
// first, because there the letter is 121px tall rather than 145 and the bar is
// six pixels of it. So the ramp holds, then falls the rest of the way over what
// is left — the letters still dissolve into the bottom, they just stay letters
// while they are still legible.
function Glyph({
  d,
  id,
  transform,
  holdTo = 0,
}: {
  d: string;
  id: string;
  transform?: string;
  holdTo?: number;
}) {
  const [y1, y2] = [0.35, 0.95];
  return (
    <svg
      aria-hidden
      viewBox="0 0 672 313"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id={id} x1={0} y1={0} x2={0} y2={1.25}>
          <stop offset="0%" stopColor="#F7F7F7" />
          <stop offset="50%" stopColor="#DFDFDF" />
          <stop offset="100%" stopColor="#C3C3C3" />
        </linearGradient>
        {/* The letters dissolve into the card's dark bottom rather than
                    ending on an edge. A mask, not a darker fill, because the rim
                    has to go with them — and bbox units, so the same ramp fits
                    either glyph. The rect overhangs the box because the rim is
                    painted outside it, and anything the rect misses is masked
                    away: at 1x1 it shaves the rim off the top of every letter. */}
        <linearGradient
          id={`${id}-fade`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={y1}
          x2={0}
          y2={y2}
        >
          <stop offset="0%" stopColor="#fff" />
          {holdTo > 0 && (
            <stop
              offset={`${((holdTo - y1) / (y2 - y1)) * 100}%`}
              stopColor="#fff"
              stopOpacity={0.88}
            />
          )}
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-mask`} maskContentUnits="objectBoundingBox">
          <rect
            x={-0.2}
            y={-0.2}
            width={1.4}
            height={1.4}
            fill={`url(#${id}-fade)`}
          />
        </mask>
      </defs>
      <path
        d={d}
        transform={transform}
        fill={`url(#${id})`}
        stroke="#FAFAFA"
        strokeWidth={4}
        paintOrder="stroke"
        mask={`url(#${id}-mask)`}
      />
    </svg>
  );
}

// Copy sits on dark artwork in both themes, so it stays light; the scrim keeps
// it legible where the gradients bloom.
function CardCopy({
  title,
  sub,
  className = "",
}: {
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-x-0 z-10 flex flex-col gap-1.5 p-5 sm:p-6 lg:p-7 ${className}`}
    >
      <h3 className="text-balance text-base font-semibold tracking-tight text-white sm:text-lg">
        {title}
      </h3>
      <p className="max-w-[46ch] text-pretty text-xs leading-relaxed text-white/65 sm:text-sm">
        {sub}
      </p>
    </div>
  );
}

// The 48px pattern tile is just a 6px cell repeated 8×8: a diamond, a 1×3
// vertical dash and a 3×1 horizontal dash. Drawn as a mask (alpha only) so the
// ink follows the theme instead of shipping a light and a dark copy.
const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="#000"><path d="M5 1h1v3H5z"/><path d="M1 5h3v1H1z"/><path d="M3 2H4V3H3V4H2V3H1V2H2V1H3V2Z"/></svg>',
)}")`;

// Clear over the content, solid past it.
const VIGNETTE =
  "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 25%, #000 90%)";

const scrimTop =
  "pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/55 to-transparent";
const scrimBottom =
  "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent";

// ponytail: a screen of nothing either side, so the glow's on/off has somewhere
// to happen. Test scaffolding — drop both when the section goes in a real page.
function Runway({ label }: { label: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-black">
      <MetallicShimmer className="text-xs tracking-[0.2em] uppercase">
        {label}
      </MetallicShimmer>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Runway label="Scroll down ↓" />
      {/* overflow-x-clip, not hidden: the glows sit 40px outside their cards and
                the page padding is only 20px at mobile, so they'd otherwise add a
                strip of horizontal scroll. clip doesn't make main a scroll
                container, so position: sticky anywhere inside still works. */}
      <main className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-[#fafafa] px-5 py-12 sm:p-10 dark:bg-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#1C1F21]/15 dark:bg-white/15"
          style={{
            maskImage: patternUrl,
            WebkitMaskImage: patternUrl,
            maskSize: "6px 6px",
            WebkitMaskSize: "6px 6px",
          }}
        />
        {/* The pattern stays at full strength under the content; a page-coloured
                scrim, held off the centre by a radial mask, sinks it to a whisper
                everywhere else. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#fafafa]/80 dark:bg-black/80"
          style={{
            maskImage: VIGNETTE,
            WebkitMaskImage: VIGNETTE,
          }}
        />
        <div className="relative flex w-full flex-col items-center gap-10 sm:gap-14">
          <header className="max-w-2xl text-center">
            {/* pb-1: bg-clip-text paints only inside the padding box, so the
                        "g" descender needs a sliver of room or it gets sheared off. */}
            <h2 className="bg-gradient-to-b from-[#18181B] to-[#71717A] bg-clip-text pb-1 text-3xl font-semibold tracking-tight text-balance text-transparent sm:text-4xl dark:from-[#F9FAFB] dark:to-[#949495]">
              An AI-Native Studio, Engineered to Ship
            </h2>
            <p className="mt-3 text-pretty text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
              D2 Studio pairs a real design system with applied AI and a typed,
              realtime backend, so an idea reaches production in weeks and stays
              cheap to change after launch.
            </p>
          </header>

          {/* The 1049px Figma reference scaled up 15% (1206px); the gutter
                    follows on the spacing scale, 36 -> 40px, rather than the exact
                    41px the ratio asks for. At lg the two wide cards stack in
                    column one and the tall pair spans both rows; below that it
                    folds to two columns, then one. The SVGs cover, so the tall
                    cards just crop. */}
          <LoadInGroup className="grid w-full max-w-[1206px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[672fr_314fr_314fr] lg:gap-10">
            {/* One column at mobile: at the Figma 672/313 the card is only ~156px
                        tall, which the copy alone fills — so it goes to 3/2 and the SVG
                        crops the sides. The glyph is `slice` too and its ink stops well
                        inside the 672 box, so it survives the crop. */}
            <div className="relative aspect-[3/2] sm:aspect-[672/313] sm:col-span-2 lg:col-span-1">
              <Glow delay={0} card={1} />
              <LoadIn delay={0} className={cell}>
                <Flat>
                  <SrcC1 {...fill} />
                </Flat>
                <Glyph d={GLYPH_16} id="glyph-16" transform={GLYPH_16_AT} />
                <div className={scrimBottom} />
                <CardCopy
                  className="bottom-0"
                  title="16+ AI products in Production"
                  sub="Copilots, retrieval search and agent workflows shipped end to end, from the first Figma frame to the deploy that carries real traffic."
                />
              </LoadIn>
            </div>

            {/* One column, one shape: below sm the tall pair takes the wide
                        cards' 3/2 so the four read as one stack rather than two
                        formats. Everything from sm up is the Figma grid, untouched. */}
            <div className="relative aspect-[3/2] sm:aspect-[314/654] lg:row-span-2 lg:aspect-auto">
              <Glow delay={0.12} card={3} />
              <LoadIn delay={0.12} className={cell}>
                {/* Dark, already saturated: light, not colour. */}
                <Flat boost="brightness(1.16)">
                  <SrcC3 {...fill} />
                </Flat>
                <div className={scrimTop} />
                <CardCopy
                  className="top-0"
                  title="Global by default"
                  sub="Realtime Convex data on the edge, so every region reads in milliseconds."
                />
                {/* The sphere, or below lg the numbers it carries — it does its
                                own framing, which is not the same framing in the two
                                cases. */}
                <Globe />
              </LoadIn>
            </div>

            {/* One column, one shape: below sm the tall pair takes the wide
                        cards' 3/2 so the four read as one stack rather than two
                        formats. Everything from sm up is the Figma grid, untouched. */}
            <div className="relative aspect-[3/2] sm:aspect-[314/654] lg:row-span-2 lg:aspect-auto">
              <Glow delay={0.24} card={4} />
              <LoadIn delay={0.24} className={cell}>
                {/* The brightest of the four and the flattest: colour, not light. */}
                <Flat boost="saturate(1.35) brightness(1.04)">
                  <SrcC4 {...fill} />
                </Flat>
                <CardGlow texture="grain" />
                <div className={scrimTop} />
                <CardCopy
                  className="top-0"
                  title="Zero to production, fast"
                  sub="Design system, typed API and CI wired up on day one."
                />
              </LoadIn>
            </div>

            {/* One column at mobile: at the Figma 672/313 the card is only ~156px
                        tall, which the copy alone fills — so it goes to 3/2 and the SVG
                        crops the sides. The glyph is `slice` too and its ink stops well
                        inside the 672 box, so it survives the crop. */}
            <div className="relative aspect-[3/2] sm:aspect-[672/313] sm:col-span-2 lg:col-span-1">
              <Glow delay={0.36} card={2} />
              <LoadIn delay={0.36} className={cell}>
                <Flat boost="saturate(1.12) brightness(1.06)">
                  <SrcC2 {...fill} />
                </Flat>
                <CardGlow texture="stripes" />
                {/* 0.8: the crossbar's underside is at 0.772 of the glyph box,
                                so the hold clears it and the fall starts under the letter
                                rather than through it. */}
                <Glyph d={GLYPH_AI} id="glyph-ai" holdTo={0.8} />
                <div className={scrimBottom} />
                <CardCopy
                  className="bottom-0"
                  title="AI woven through the stack"
                  sub="Model routing, evals and guardrails built into the product from day one, not bolted on once it is already live."
                />
              </LoadIn>
            </div>
          </LoadInGroup>
        </div>
      </main>
      <Runway label="Scroll up ↑" />
    </>
  );
}
