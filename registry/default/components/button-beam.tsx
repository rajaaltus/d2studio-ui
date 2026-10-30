"use client";

import * as React from "react";
import { BorderBeam, type BorderBeamColorVariant } from "border-beam";

import { cn } from "@/lib/utils";

// A glass pill with a beam travelling along its edge. The beam is the whole
// look, so the chip under it is deliberately quiet: one tinted plate, a hairline
// border and ink that comes up to full under the cursor. Anything louder and the
// two compete.
//
// "use client" because border-beam calls useId/useState/useEffect and ships no
// directive of its own, so the boundary has to be drawn on this side of it.
// A page that renders this from a server component gets it for free.
const PILL = [
  "group relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full",
  "border border-foreground/15 bg-muted/70 text-sm font-medium text-foreground/70",
  // The line along the top inner edge, which is what reads as thickness on a
  // pill this flat. An inset shadow rather than a second layer: it lands on the
  // padding box, so the parent's own clip rounds it. Mixed off the ink, so it
  // is a sheen on the dark plate and a shading on the pale one, which is which
  // way the light falls in either theme.
  "shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_8%,transparent)]",
  "hover:border-foreground/30 hover:bg-muted hover:text-foreground",
  // Named properties rather than a blanket transition: only the ink, the plate,
  // the border and the press scale ever move. `scale`, not `transform`, because
  // Tailwind v4 sets the standalone scale property.
  "transition-[scale,color,background-color,border-color] duration-200 [transition-timing-function:var(--ease-out)]",
  // The press, so the pill answers the finger before the navigation does. Past
  // about 0.97 a wide pill visibly shrinks away from the cursor.
  "active:scale-[0.98]",
  "disabled:pointer-events-none disabled:opacity-50",
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
].join(" ");

// border-beam's light line is tuned for a white card: its stroke lands at
// 0.16 against 1.14 in the dark. On this tinted plate, and under `strength`,
// that leaves the line invisible, so the light theme lifts each layer back up
// through the package's own multipliers. Opacity clamps at 1 either way.
const LIGHT_LIFT = {
  "--beam-stroke-opacity": 4.5,
  "--beam-inner-opacity": 1.5,
  "--beam-bloom-opacity": 2,
} as React.CSSProperties;

// The shadcn scale, with the padding opened up a step: a pill's corners eat the
// horizontal room a square chip keeps, so the same label needs more of it.
export const BEAM_SIZES = {
  sm: "h-8 gap-1.5 px-4",
  default: "h-9 px-5",
  lg: "h-10 px-6",
  icon: "size-9 px-0",
} as const;

export type BeamSize = keyof typeof BEAM_SIZES;

// How the light moves, by border-beam's preset for it: a beam along the lower
// edge, one running round the whole border, or a glow breathing inside it.
const MOTIONS = {
  line: "line",
  rotate: "md",
  breathe: "pulse-inner",
} as const;

export type BeamMotion = keyof typeof MOTIONS;

export function BeamButton({
  size = "default",
  color = "ocean",
  motion = "line",
  beam = true,
  strength = 0.73,
  className,
  href,
  proximity = false,
  mirror = false,
  smoke = false,
  shadow = false,
  ...props
}: React.ComponentProps<"button"> & {
  size?: BeamSize;
  /** Which palette the beam travels in. */
  color?: BorderBeamColorVariant;
  /** How the light moves: along the lower edge, round the border, or a
   *  breath inside the pill. */
  motion?: BeamMotion;
  /** Off leaves the pill and its plate, which is the rest state of the look. */
  beam?: boolean;
  /** How much of the beam and its bloom land, 0 to 1. */
  strength?: number;
  /** Present renders an anchor rather than a button, same chrome either way. */
  href?: string;
  /** The beam brightens as the pointer comes near, up to full at the pill. */
  proximity?: boolean;
  /** The cursor reflects the beam as it comes near. "beam" mirrors the moving
   *  beam on the arrow, "edge" a still halo of the palette round it, "water"
   *  a still sheen of it in the body. Off by default. */
  mirror?: MirrorStyle | false;
  /** With a mirror: soft smoke off the cursor, lit by the beam. */
  smoke?: boolean;
  /** With a mirror: the cursor casts a soft shadow away from the beam. */
  shadow?: boolean;
}) {
  const El = href ? "a" : "button";
  const theme = useHostTheme();
  const frame = React.useRef<HTMLDivElement>(null);
  usePauseOffscreen(frame);
  useProximity(frame, proximity, strength);
  useMirror(frame, mirror, color, smoke, shadow, motion);
  return (
    // The plate is a token and follows the host's theme, so the beam over it
    // has to as well. Resolved here rather than with the package's "auto".
    <BorderBeam
      ref={frame}
      size={MOTIONS[motion]}
      colorVariant={color}
      strength={strength}
      active={beam}
      theme={theme}
      style={theme === "light" ? LIGHT_LIFT : undefined}
      className="inline-flex w-fit"
    >
      <El
        href={href}
        className={cn(
          PILL,
          BEAM_SIZES[size],
          // The mirror sets its cursor on <html> and --beam-cursor here; the pill
          // takes it from there, and the plain arrow when there is none.
          // Inheriting instead would give "auto": a text cursor over the label.
          mirror && "cursor-[var(--beam-cursor,default)]",
          className,
        )}
        {...(props as React.ComponentProps<"a"> & React.ComponentProps<"button">)}
      />
    </BorderBeam>
  );
}

// Every distance the effects use is set for the default pill, 36px tall, and
// scales with the pill actually drawn: a larger button reaches further and
// its light carries further, a smaller one less, so the effect keeps the
// same proportions wherever the button is and however big it is made.
const BASE_HEIGHT = 36;
const scaleOf = (r: DOMRect) => Math.max(0.5, r.height / BASE_HEIGHT);

/** Listens for anything that can move a pill under a still pointer: the
 *  pointer itself, a scroll in any container (capture, so nested scrollers
 *  count), and a resize. Returns the unsubscribe. */
function onPointerOrLayout(onMove: (e: PointerEvent) => void, onLayout: () => void) {
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", onLayout, { passive: true, capture: true });
  window.addEventListener("resize", onLayout, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", onLayout, { capture: true });
    window.removeEventListener("resize", onLayout);
  };
}

// How far out the pointer starts to brighten the beam, at the base height.
const PROXIMITY_REACH = 120;

// Every pill with proximity on, and the strength it rests at, read by one
// shared listener so a page of buttons still costs a single pointermove.
const nearby = new Map<HTMLElement, number>();
let stopProximity: (() => void) | null = null;

function startProximity() {
  let raf = 0;
  let x = 0;
  let y = 0;
  const shown = new WeakMap<HTMLElement, number>();
  const paint = () => {
    raf = 0;
    // All reads first, then all writes, so no write forces a layout mid-loop.
    const next = [...nearby].map(([el, rest]) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / (PROXIMITY_REACH * scaleOf(r)));
      // Rest strength out of reach, full at the pill. Hundredths, so a
      // pointer moving far away writes nothing.
      return [el, Math.round((rest + (1 - rest) * near) * 100) / 100] as const;
    });
    for (const [el, value] of next) {
      if (shown.get(el) === value) continue;
      shown.set(el, value);
      // border-beam reads this for every layer's opacity; React only writes
      // it again if the strength prop itself changes.
      el.style.setProperty("--beam-strength", String(value));
    }
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(paint);
  };
  const off = onPointerOrLayout((e) => {
    x = e.clientX;
    y = e.clientY;
    schedule();
  }, schedule);
  return () => {
    off();
    cancelAnimationFrame(raf);
  };
}

/** Holds the beam's animations while the pill is off screen. border-beam
 *  animates inherited custom properties, which the browser restyles every
 *  frame even where nothing is visible. Only running animations are held and
 *  resumed, so a finished fade-in is never replayed, and the beam carries on
 *  from where it stopped. */
function usePauseOffscreen(ref: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let held: Animation[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        for (const a of held) a.play();
        held = [];
      } else {
        held = el.getAnimations({ subtree: true }).filter((a) => a.playState === "running");
        for (const a of held) a.pause();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/** Brightens the beam as the pointer nears. A fine-pointer thing: on touch
 *  there is no "near", only a tap. */
function useProximity(
  ref: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  strength: number,
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rest = Math.max(0, Math.min(1, strength));
    nearby.set(el, rest);
    stopProximity ??= startProximity();
    return () => {
      nearby.delete(el);
      el.style.setProperty("--beam-strength", String(rest));
      if (!nearby.size) {
        stopProximity?.();
        stopProximity = null;
      }
    };
  }, [ref, enabled, strength]);
}

// How far out the cursor starts to catch the beam.
// At the base height; scaled with the pill (see scaleOf).
const MIRROR_REACH = 120;
// Coarse steps on purpose: each one is a cursor image, built once and cached.
// Coarse enough that a still pointer keeps landing on images it has already
// worn, which macOS draws sharp, wherever it is round the pill.
const MIRROR_LEVELS = 24;
// Steps along the pill the beam's reflection can sit at, each a cursor image.
const MIRROR_FRAMES = 48;
// How finely the reflection follows the beam's brightness: each step is a
// cursor image, so a handful is enough to read as a fade.
const GLOW_STEPS = 10;
// Directions the light can come from, round the arrow, each a cursor image.
const MIRROR_TURNS = 32;

// The beam's line colours per palette, from border-beam's own border stops.
const MIRROR_TONES: Record<BorderBeamColorVariant, number[][]> = {
  colorful: [[255, 50, 100], [255, 120, 40], [50, 200, 80], [30, 185, 170], [40, 140, 255], [100, 70, 255], [240, 50, 180]],
  mono: [[190, 190, 190], [140, 140, 140], [170, 170, 170], [130, 130, 130]],
  ocean: [[100, 80, 220], [60, 120, 255], [50, 140, 220], [120, 80, 255], [140, 100, 240]],
  sunset: [[255, 80, 50], [255, 160, 40], [255, 200, 50], [255, 60, 60], [255, 140, 50]],
  forest: [[46, 160, 90], [30, 190, 120], [120, 210, 70], [20, 150, 130], [60, 195, 140]],
  candy: [[240, 70, 170], [255, 90, 140], [215, 60, 200], [200, 80, 240], [230, 120, 220]],
  ice: [[90, 200, 240], [60, 175, 230], [150, 230, 250], [70, 190, 215], [110, 210, 255]],
  gold: [[240, 190, 60], [255, 225, 120], [225, 165, 40], [250, 200, 70], [215, 155, 35]],
};
// The macOS arrow's rim, a hair off white.
const RIM = [250, 250, 250];

const rgb = (c: number[]) => `rgb(${c.join(" ")})`;

/** The palette for the host's theme. border-beam deepens its colours on a
 *  light page, where the dark-tuned ones wash out; the mirror does the same,
 *  most of all for the halo, which sits on the page itself. */
function tonesFor(color: BorderBeamColorVariant, theme: "dark" | "light", hue = 0) {
  const tones = (MIRROR_TONES[color] ?? MIRROR_TONES.ocean).map((c) => hueRotate(c, hue));
  return theme === "dark" ? tones : tones.map((c) => c.map((v) => Math.round(v * 0.72)));
}

/** A colour turned round the wheel the way CSS hue-rotate() turns it, so the
 *  mirror's tones drift with the beam's own hue shift. */
function hueRotate([r, g, b]: number[], deg: number) {
  if (!deg) return [r, g, b];
  const a = Math.cos((deg * Math.PI) / 180);
  const s = Math.sin((deg * Math.PI) / 180);
  const m = [
    [0.213 + 0.787 * a - 0.213 * s, 0.715 - 0.715 * a - 0.715 * s, 0.072 - 0.072 * a + 0.928 * s],
    [0.213 - 0.213 * a + 0.143 * s, 0.715 + 0.285 * a + 0.14 * s, 0.072 - 0.072 * a - 0.283 * s],
    [0.213 - 0.213 * a - 0.787 * s, 0.715 - 0.715 * a + 0.715 * s, 0.072 + 0.928 * a + 0.072 * s],
  ];
  return m.map(([x, y, z]) => Math.round(Math.min(255, Math.max(0, x * r + y * g + z * b))));
}

// The mirror follows the beam's hue in steps this wide, each step a set of
// cursor images; the beam swings 30deg either way.
const HUE_STEP = 10;

/** Where border-beam's hue shift has turned the beam right now, read off the
 *  layer it animates, in HUE_STEP steps. */
// Each pill's hue-shift animation, found once rather than by walking all of
// its animations every frame; found again once border-beam replaces it.
const hueShift = new WeakMap<HTMLElement, CSSAnimation>();
function hueNow(el: HTMLElement) {
  let a = hueShift.get(el);
  if (!a || a.playState === "idle") {
    a = el.getAnimations({ subtree: true }).find(
      (x): x is CSSAnimation =>
        x instanceof CSSAnimation && x.animationName.startsWith("beam-hue-shift-") && !x.animationName.includes("bloom"),
    );
    if (!a) return 0;
    hueShift.set(el, a);
  }
  const fx = a.effect as KeyframeEffect | null;
  if (!fx?.target) return 0;
  const m = getComputedStyle(fx.target, fx.pseudoElement).filter.match(/hue-rotate\((-?[\d.]+)deg\)/);
  return m ? Math.round(parseFloat(m[1]) / HUE_STEP) * HUE_STEP : 0;
}

const cursorCache = new Map<string, string>();

// Cursor images the browser has decoded. A cursor swapped to an image still
// decoding shows its fallback, the plain arrow, until it is ready; with the
// light moving, nearly every frame wants a new image, so the reflection
// flickered or never showed. Each image is decoded off to the side first and
// the cursor keeps the last ready one until then.
const ready = new Set<string>();
const decoding = new Set<string>();
function decoded(css: string) {
  if (!css || ready.has(css)) return true;
  if (!decoding.has(css)) {
    decoding.add(css);
    const img = new Image();
    img.src = css.slice(css.indexOf('url("') + 5, css.indexOf('")'));
    const done = () => {
      decoding.delete(css);
      // Bounded like the cache, oldest first.
      if (ready.size >= CURSOR_CACHE_MAX) ready.delete(ready.values().next().value!);
      ready.add(css);
    };
    img.decode().then(done, done);
  }
  return false;
}
// Enough for a pass round one pill; the oldest image goes first past that.
const CURSOR_CACHE_MAX = 300;
function remember(key: string, css: string) {
  cursorCache.set(key, css);
  if (cursorCache.size > CURSOR_CACHE_MAX) cursorCache.delete(cursorCache.keys().next().value!);
  return css;
}

// How lit the border is at a share of the turn past --beam-angle: border-beam's
// own mask on the rotating beam, dark to 30%, full from 52% to 80%, out by 97%.
const rotateLight = (f: number) =>
  f < 0.3 ? 0 : f < 0.52 ? (f - 0.3) / 0.22 : f < 0.8 ? 1 : f < 0.97 ? (0.97 - f) / 0.17 : 0;
const ROTATE_SAMPLES = 64;

type Light = { x: number; y: number; edge: number };

/** The pill's light as it is right now: where it sits on the pill (x and y,
 *  0 to 1 across and down) and how lit it is (0 to 1). Read straight off the
 *  custom properties border-beam animates, so the reflection and the shadow
 *  follow the beam's own state rather than a model of it that could drift.
 *  The line runs along the lower edge; the rotating beam is a point on the
 *  border at its angle; a breath lights the whole pill, so its light is the
 *  middle. */
function beamNow(el: HTMLElement, motion: BeamMotion): Light {
  const id = el.dataset.beam;
  const css = getComputedStyle(el);
  if (motion === "rotate") {
    // The lit stretch of border is wide, and on a long pill most of it is in
    // the round ends, so the light is the centre of that stretch: points
    // spaced evenly round the border, each weighted by how lit it is.
    const deg = parseFloat(css.getPropertyValue(`--beam-angle-${id}`));
    const start = (Number.isFinite(deg) ? deg : 0) / 360;
    const { width: w, height: h } = el.getBoundingClientRect();
    const round = 2 * (w + h);
    let sx = 0;
    let sy = 0;
    let sum = 0;
    for (let i = 0; i < ROTATE_SAMPLES; i++) {
      let d = ((i + 0.5) / ROTATE_SAMPLES) * round;
      // Clockwise from the top left: top, right, bottom, left.
      const [px, py] = d < w ? [d, 0] : (d -= w) < h ? [w, d] : (d -= h) < w ? [w - d, h] : [0, h - (d - w)];
      // CSS angles run clockwise from straight up, from the middle.
      const at = Math.atan2(px - w / 2, h / 2 - py) / (Math.PI * 2);
      const lit = rotateLight((((at - start) % 1) + 1) % 1);
      sx += px * lit;
      sy += py * lit;
      sum += lit;
    }
    return sum ? { x: sx / sum / w, y: sy / sum / h, edge: 1 } : { x: 0.5, y: 0.5, edge: 0 };
  }
  if (motion !== "line") return { x: 0.5, y: 0.5, edge: 1 };
  const x = parseFloat(css.getPropertyValue(`--beam-x-${id}`));
  const edge = parseFloat(css.getPropertyValue(`--beam-edge-${id}`));
  return { x: Number.isFinite(x) ? x : 0.5, y: 1, edge: Number.isFinite(edge) ? edge : 1 };
}

/** A platform's default arrow, drawn in a 28-unit box: its rim and body as
 *  bare shapes (colour is applied around them), the rim's own stroke where
 *  the rim is an outline rather than a shape, the colours of each, its extent
 *  and where its hotspot sits. */
type Arrow = {
  rim: string;
  body: string;
  rimStroke: number;
  rimColor: number[];
  bodyColor: number[];
  top: number;
  bottom: number;
  left: number;
  right: number;
  hot: [number, number];
};

const MAC_ARROW: Arrow = {
  rim: `<polygon points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6"/><polygon points="17.3,21.6 13.7,23.1 9,12 12.7,10.5"/>`,
  body:
    `<rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8"/>` +
    `<polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5"/>`,
  rimStroke: 0,
  rimColor: RIM,
  bodyColor: [20, 20, 20],
  top: 4.9,
  bottom: 23.1,
  left: 8.2,
  right: 19.8,
  hot: [8, 5],
};

// Windows draws it the other way round: a white arrow in a thin dark outline,
// with a straight left edge and a longer tail.
const WINDOWS_POINTS = "5,3 5,21.5 9.4,17.4 12.5,24.2 15.4,23 12.3,16.2 18.2,16.2";
const WINDOWS_ARROW: Arrow = {
  rim: `<polygon points="${WINDOWS_POINTS}"/>`,
  body: `<polygon points="${WINDOWS_POINTS}"/>`,
  rimStroke: 2,
  rimColor: [20, 20, 20],
  bodyColor: RIM,
  top: 3,
  bottom: 24.2,
  left: 5,
  right: 18.2,
  hot: [5, 3],
};

/** The pointer's own platform, for its arrow. GNOME's Adwaita arrow, and
 *  ChromeOS's, are dark with a light rim like the Mac's, so anything not
 *  Windows gets that one. Read once: the platform does not change. */
let hostArrow: Arrow | null = null;
function arrowFor() {
  if (hostArrow) return hostArrow;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent;
  hostArrow = /win/i.test(platform) ? WINDOWS_ARROW : MAC_ARROW;
  return hostArrow;
}

const isLight = (c: number[]) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 > 0.5;

/** The cursor image shell. The light covers the whole arrow under a mask that
 *  runs across it in the direction of the pill: full on the side facing it,
 *  fading toward the far side, all of it stronger the nearer the pill is.
 *  `turn` is that direction, in MIRROR_TURNS steps clockwise from +x. */
// Blur on the cursor's light as it fades in or out, in arrow units.
const LIGHT_FADE_BLUR = 1.5;

function arrowCursor(
  arrow: Arrow,
  level: number,
  turn: number,
  defs: string,
  light: string,
  // Where the light goes: "body" blends it onto the body, "halo" sits it
  // under the arrow so it shows outside the rim.
  place: "body" | "halo" = "body",
  // How lit the beam is right now, 0 to 1: the reflection is only ever as
  // bright as its source.
  glow = 1,
) {
  const a = (turn / MIRROR_TURNS) * Math.PI * 2;
  const cx = (arrow.left + arrow.right) / 2;
  const cy = (arrow.top + arrow.bottom) / 2;
  // Half the arrow's diagonal, so the gradient spans it whichever way it runs.
  const reach = Math.hypot(arrow.right - arrow.left, arrow.bottom - arrow.top) / 2;
  const ux = Math.cos(a) * reach;
  const uy = Math.sin(a) * reach;
  // No floor: the light runs all the way down to nothing at the edge of
  // reach, so the hand-back to the system arrow there is seamless.
  // Eased out, so mid-range reads clearly rather than fading in late.
  const strength = 1 - (1 - level / MIRROR_LEVELS) ** 2;
  // The far side keeps a good share of the light, so the whole arrow reflects
  // wherever the light is: lit from above, the side facing it is only the
  // tip, and at 15% the rest read as no reflection at all.
  const far = (strength * 0.45).toFixed(2);
  const rimPaint = `fill="${rgb(arrow.rimColor)}"` +
    (arrow.rimStroke ? ` stroke="${rgb(arrow.rimColor)}" stroke-width="${arrow.rimStroke}" stroke-linejoin="round"` : "");
  // Blends that keep the arrow's own colours: screen lifts a dark body and
  // leaves a light rim as it is; multiply tints a light body and leaves a
  // dark rim as it is.
  const blend = isLight(arrow.bodyColor) ? "multiply" : "screen";
  // Coming and going, the light blurs as it thins: sharp at full strength,
  // up to LIGHT_FADE_BLUR at nothing. Read off the level and glow the image
  // is already keyed on, so it costs no extra images.
  const soft = (LIGHT_FADE_BLUR * (1 - strength * glow)).toFixed(2);
  const art =
    `viewBox="0 0 28 28"><defs>${defs}` +
    `<linearGradient id="c" gradientUnits="userSpaceOnUse" x1="${(cx + ux).toFixed(2)}" y1="${(cy + uy).toFixed(2)}" x2="${(cx - ux).toFixed(2)}" y2="${(cy - uy).toFixed(2)}">` +
    `<stop offset="0" stop-color="${rgb(RIM)}" stop-opacity="${strength.toFixed(2)}"/>` +
    `<stop offset="1" stop-color="${rgb(RIM)}" stop-opacity="${far}"/></linearGradient>` +
    `<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28"><rect width="28" height="28" fill="url(#c)"/></mask>` +
    `<filter id="f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${soft}"/></filter>` +
    // A body sheen stays inside the body, so its blur never spills past the
    // arrow's shape; a halo is meant to sit outside it.
    `<clipPath id="k">${arrow.body}</clipPath></defs>` +
    (place === "halo" ? `<g mask="url(#m)" opacity="${glow}"><g filter="url(#f)">${light}</g></g>` : "") +
    `<g ${rimPaint}>${arrow.rim}</g>` +
    `<g fill="${rgb(arrow.bodyColor)}">${arrow.body}</g>` +
    (place === "body" ? `<g mask="url(#m)" clip-path="url(#k)" opacity="${glow}" style="mix-blend-mode:${blend}"><g filter="url(#f)">${light}</g></g>` : "") +
    `</svg>`;
  return cursorValue(art, arrow.hot);
}

/** The cursor declaration for an arrow drawn in a 28-unit box. A plain url()
 *  SVG: an image-set() of 2x and 3x copies is accepted as a value by Chrome
 *  but not drawn, so the pointer silently fell back to the system arrow. */
function cursorValue(art: string, hot: [number, number]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" ${art}`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hot[0]} ${hot[1]}, auto`;
}

/** The palette for a sheen inside the arrow's body. A dark body screens it,
 *  so it wants the bright colours whatever the page; a light body
 *  multiplies it, so it wants the deep ones. */
function sheenTones(color: BorderBeamColorVariant, arrow: Arrow, hue: number) {
  return tonesFor(color, isLight(arrow.bodyColor) ? "light" : "dark", hue);
}

/** The platform arrow with no light on it, for while the beam is out. */
function plainCursor() {
  let css = cursorCache.get("plain");
  if (!css) {
    css = arrowCursor(arrowFor(), 0, 1, "", "", "body", 0);
    remember("plain", css);
  }
  return css;
}

/** "beam": the beam's own streak, white-hot with its colours either side,
 *  sheened onto the body and sliding across it as the beam slides across the
 *  pill. */
function beamCursor(
  color: BorderBeamColorVariant,
  level: number,
  turn: number,
  frame: number,
  glow: number,
  hue: number,
) {
  const key = `beam:${color}:${level}:${turn}:${frame}:${glow}:${hue}`;
  let css = cursorCache.get(key);
  if (css) return css;
  const arrow = arrowFor();
  const tones = sheenTones(color, arrow, hue);
  const x = frame / MIRROR_FRAMES;
  const at = Math.min(tones.length - 1, Math.floor(x * tones.length));
  const near = rgb(tones[at]);
  const far = rgb(tones[(at + 1) % tones.length]);
  // Across the arrow's own span, as the beam goes across the pill.
  const cx = (arrow.left + x * (arrow.right - arrow.left)).toFixed(2);
  const cy = ((arrow.top + arrow.bottom) / 2).toFixed(2);
  // The streak's hot core is white, which a light body cannot show; there the
  // core is the palette colour itself.
  const core = isLight(arrow.bodyColor) ? near : rgb(RIM);
  const defs =
    `<radialGradient id="l" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${cx} ${cy}) scale(9 14)">` +
    `<stop offset="0" stop-color="${core}"/><stop offset=".25" stop-color="${near}"/>` +
    `<stop offset=".6" stop-color="${far}"/><stop offset="1" stop-color="${far}" stop-opacity="0"/></radialGradient>`;
  css = arrowCursor(arrow, level, turn, defs, `<g fill="url(#l)">${arrow.body}</g>`, "body", glow / GLOW_STEPS);
  return remember(key, css);
}

/** The two still options, in the palette laid across the arrow. "edge" is a
 *  thin halo of it just outside the rim, where the rim stands out from the
 *  page (a body sheen where it does not); "water" a sheen of it on the body. */
function stillCursor(
  style: "edge" | "water",
  color: BorderBeamColorVariant,
  theme: "dark" | "light",
  level: number,
  turn: number,
  glow: number,
  hue: number,
) {
  const key = `${style}:${color}:${theme}:${level}:${turn}:${glow}:${hue}`;
  let css = cursorCache.get(key);
  if (css) return css;
  const arrow = arrowFor();
  // A rim the same tone as the page vanishes into it, so anything drawn round
  // it floats free of the arrow and reads as a second cursor. A halo only
  // goes where the rim shows: a light rim on a dark page, a dark rim on a
  // light one. Elsewhere "edge" takes the body sheen, which leaves the
  // arrow's shape exactly the system one.
  const halo = style === "edge" && isLight(arrow.rimColor) === (theme === "dark");
  // A halo sits on the page, so it takes the page's palette; a sheen sits in
  // the body, so it takes the body's.
  const tones = halo ? tonesFor(color, theme, hue) : sheenTones(color, arrow, hue);
  const stops = tones.map((c, i) => `<stop offset="${i / (tones.length - 1)}" stop-color="${rgb(c)}"/>`).join("");
  const defs =
    `<linearGradient id="p" gradientUnits="userSpaceOnUse" x1="${arrow.left}" y1="0" x2="${arrow.right}" y2="0">${stops}</linearGradient>` +
    `<filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.5"/></filter>`;
  const stroke = (width: number) =>
    `fill="none" stroke="url(#p)" stroke-width="${width + arrow.rimStroke}" stroke-linejoin="round"`;
  const light = halo
    ? // A soft bloom under a crisp line, so it reads as light, not a stroke.
      `<g ${stroke(6.5)} filter="url(#b)">${arrow.rim}</g><g ${stroke(3)}>${arrow.rim}</g>`
    : `<g fill="url(#p)">${arrow.body}</g>`;
  css = arrowCursor(arrow, level, turn, defs, light, halo ? "halo" : "body", glow / GLOW_STEPS);
  return remember(key, css);
}

export type MirrorStyle = "beam" | "edge" | "water";
type MirrorSpec = { color: BorderBeamColorVariant; style: MirrorStyle; smoke: boolean; shadow: boolean; motion: BeamMotion };

// Every pill with a mirror, read by one shared listener: only the nearest one
// may set the cursor, and a page of buttons still costs a single pointermove.
const mirrors = new Map<HTMLElement, MirrorSpec>();
let stopMirror: (() => void) | null = null;

// How quickly the reflection catches up with the pointer: a critically
// damped follow, no overshoot, settled in about a quarter second, so it
// glides between cursor images the way an ease-out would.
const MIRROR_EASE_MS = 70;

// Smoke off the cursor, kept mild: a haze the light catches, not a plume
// that competes with it. At the base height (scaled with the pill): wisps
// born per frame at full light, how long each lasts, how wide it starts and
// grows to, and how fast it rises.
const SMOKE_RATE = 1;
const SMOKE_LIFE_MS = 1000;
const SMOKE_R0 = 1.5;
const SMOKE_R1 = 10;
const SMOKE_RISE = 0.045;
const SMOKE_MAX = 40;

// The cursor's shadow as a real one: the beam is a sun SUN_HEIGHT px over
// the page, and the arrow floats STICK_HEIGHT px over it. A point light
// throws the arrow d * h / (H - h) away from it, d being how far the arrow
// stands from the point under the light, and H / (H - h) its size, so the
// shadow is the arrow's own shape a touch larger, moved a little under the
// sun and a little more as the cursor walks away. Near the tip it is
// darkest and sharp; it fades and softens toward the tail, a progressive
// blur from none at the tip to SHADOW_BLUR px at the tail. It is coloured
// light, not grey: the beam's own tones, run across the arrow. However far it
// is thrown, nothing of it reaches past SHADOW_RADIUS px from the cursor's
// middle.
const SUN_HEIGHT = 100;
const STICK_HEIGHT = 12;
const SHADOW_MAX = 10;
const SHADOW_MIN = 4;
const SHADOW_GROW = SUN_HEIGHT / (SUN_HEIGHT - STICK_HEIGHT);
// Penumbra: blur at the far end per px of shadow length, up to SHADOW_BLUR.
const SHADOW_SOFTEN = 0.7;
// A standard deviation, so about Figma's 4.
const SHADOW_BLUR = 2;
// Bands the progressive blur is built from, each a step sharper than the next.
const SHADOW_BANDS = 5;
const SHADOW_RADIUS = 32;
const SHADOW_ALPHA = { dark: 0.8, light: 0.75 };
// Extra blur over the whole shadow as it fades in or out, so it melts in and
// away rather than only thickening and thinning.
const SHADOW_FADE_BLUR = 3;
// Browser zoom scales the page but not a cursor image, so the shadow, drawn in
// page px, is sized back to the cursor by the zoom. No API gives it; the
// window's outer width over its inner one does, snapped to a zoom step.
// shortcut: a panel docked beside the page (devtools) skews the ratio; off a
// zoom step it is ignored and 1 assumed, on one the shadow is mis-sized.
const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
function pageZoom() {
  let w: Window = window;
  try {
    // A same-origin frame reads its host window; its zoom is the host's.
    if (window.top?.innerWidth) w = window.top;
  } catch {}
  const z = w.outerWidth / w.innerWidth;
  const step = ZOOM_STEPS.reduce((a, b) => (Math.abs(b - z) < Math.abs(a - z) ? b : a));
  return Math.abs(step - z) < 0.02 * step ? step : 1;
}

/** `dx, dy`: how far the tail's shadow falls from the tail; `tones`: the
 *  beam's colours, as rgb(r g b). */
type Shade = { x: number; y: number; dx: number; dy: number; alpha: number; soften: number; arrow: Arrow; tones: string[] };

// The arrow's outline as a canvas path, from the same polygons the cursor
// image is drawn with, so the shadow is exactly the arrow's shape.
const arrowPaths = new WeakMap<Arrow, Path2D>();
function arrowPath(arrow: Arrow) {
  let path = arrowPaths.get(arrow);
  if (!path) {
    path = new Path2D();
    for (const [, pts] of arrow.rim.matchAll(/points="([^"]+)"/g)) {
      const xy = pts.trim().split(/[\s,]+/).map(Number);
      path.moveTo(xy[0], xy[1]);
      for (let i = 2; i < xy.length; i += 2) path.lineTo(xy[i], xy[i + 1]);
      path.closePath();
    }
    arrowPaths.set(arrow, path);
  }
  return path;
}

type Wisp = { x: number; y: number; born: number; seed: number; scale: number; color: string; alpha: number };

/** What the cursor leaves on the page: soft wisps rising off the arrow,
 *  tinted by the beam where it is now, and the arrow's shadow cast away from
 *  it. One click-through canvas over the page, made on first use and drawn
 *  only while there is something on it. Each wisp is a radial gradient that
 *  widens and fades out on an ease-out, so it thins rather than vanishes. */
function createOverlay() {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let owed = 0;
  let drawn = false;
  const wisps: Wisp[] = [];
  // Scratch for one band of the shadow at a time.
  const band = document.createElement("canvas");
  const surface = () => {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "2147483646" });
      document.body.appendChild(canvas);
      ctx = canvas.getContext("2d");
    }
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };
  /** One frame: emit smoke at (x, y) if given, `density` (0 to 1, from how
   *  near the pill is) setting how much and `light` (0 to 1, from the beam)
   *  how lit it is, then
   *  draw what is alive. Returns whether anything is still on the canvas. */
  const step = (
    now: number,
    emit: { x: number; y: number; density: number; light: number; scale: number; color: string; dark: boolean } | null,
    shade: Shade | null = null,
  ) => {
    // (emit.dark only sets how strong a new wisp is.)
    if (!emit && !shade && !wisps.length && !drawn) return false;
    const g = surface();
    if (!g) return false;
    if (emit && emit.density > 0.02) {
      owed += SMOKE_RATE * emit.density;
      for (; owed >= 1 && wisps.length < SMOKE_MAX; owed--) {
        wisps.push({
          x: emit.x + (Math.random() - 0.5) * 10 * emit.scale,
          y: emit.y + (Math.random() - 0.5) * 8 * emit.scale,
          born: now,
          seed: Math.random() * 100,
          scale: emit.scale,
          color: emit.color,
          // A touch stronger on a dark page, where haze needs more to show.
          // Unlit smoke is still smoke: the beam only brightens it, down to
          // a third when the beam is out.
          alpha: (emit.dark ? 0.12 : 0.1) * emit.density * (0.35 + 0.65 * emit.light),
        });
      }
      owed = Math.min(owed, 1);
    }
    g.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (shade && shade.alpha > 0.005) {
      // Under the smoke: the shadow lies on the page, the smoke in the air.
      const { arrow } = shade;
      const len = Math.hypot(shade.dx, shade.dy);
      // The arrow's axis, tip to the middle of its body: how far along it a
      // point lies is how high it stands, 0 at the tip, 1 at the tail.
      const reach = Math.hypot(arrow.right - arrow.hot[0], arrow.bottom - arrow.hot[1]);
      const mx = (arrow.left + arrow.right) / 2 - arrow.hot[0];
      const my = (arrow.top + arrow.bottom) / 2 - arrow.hot[1];
      const ax = mx / (Math.hypot(mx, my) || 1) / reach;
      const ay = my / (Math.hypot(mx, my) || 1) / reach;
      // Soft by length: the tail of a long shadow is all penumbra.
      // Cursor px to page px.
      const fit = 1 / pageZoom();
      const far = Math.min(SHADOW_BLUR, len * SHADOW_SOFTEN) * fit;
      const dpr = window.devicePixelRatio || 1;
      const ox = shade.x + shade.dx * fit;
      const oy = shade.y + shade.dy * fit;
      // Room for the whole arrow and its shadow either way from the tip,
      // plus the blur.
      const half = Math.ceil((reach * SHADOW_GROW + len + 3 * (SHADOW_BLUR + shade.soften)) * fit);
      const side = Math.ceil(half * 2 * dpr);
      if (band.width < side) band.width = band.height = side;
      const b = band.getContext("2d");
      if (b) {
        // In the arrow's own space, moved to where its shadow falls and
        // grown about its tip. Gradients filled in it run tip to tail.
        const cast = (c: CanvasRenderingContext2D) => {
          c.setTransform(dpr, 0, 0, dpr, (half - ox) * dpr, (half - oy) * dpr);
          c.translate(ox, oy);
          c.scale(SHADOW_GROW * fit, SHADOW_GROW * fit);
          c.translate(-arrow.hot[0], -arrow.hot[1]);
        };
        const tail = (c: CanvasRenderingContext2D) =>
          c.createLinearGradient(arrow.hot[0], arrow.hot[1], arrow.hot[0] + ax * reach * reach, arrow.hot[1] + ay * reach * reach);
        // Progressive blur: the shadow drawn once per band, each blurred a
        // step more and kept only over its stretch from tip to tail
        // (overlapping ramps that sum to one), the bands added back together.
        g.globalCompositeOperation = "lighter";
        for (let i = 0; i < SHADOW_BANDS; i++) {
          const at = i / (SHADOW_BANDS - 1);
          const step = 1 / (SHADOW_BANDS - 1);
          b.setTransform(1, 0, 0, 1, 0, 0);
          b.clearRect(0, 0, side, side);
          cast(b);
          b.globalCompositeOperation = "source-over";
          // Canvas blur lengths are in bitmap px, not the transformed ones.
          b.filter = `blur(${((far * at + shade.soften * fit) * dpr).toFixed(2)}px)`;
          // The beam's tones across the arrow, side to side.
          const tint = b.createLinearGradient(arrow.left, arrow.bottom, arrow.right, arrow.top);
          shade.tones.forEach((c, j) =>
            tint.addColorStop(j / Math.max(1, shade.tones.length - 1), c.replace(")", ` / ${shade.alpha.toFixed(3)})`)),
          );
          b.fillStyle = tint;
          b.fill(arrowPath(arrow));
          b.filter = "none";
          b.globalCompositeOperation = "destination-in";
          const mask = tail(b);
          if (i > 0) mask.addColorStop(at - step, "rgb(0 0 0 / 0)");
          // Strongest at the tip, fading toward the tail.
          mask.addColorStop(at, `rgb(0 0 0 / ${1 - 0.6 * at})`);
          if (i < SHADOW_BANDS - 1) mask.addColorStop(at + step, "rgb(0 0 0 / 0)");
          b.fillStyle = mask;
          // Arrow space is shrunk by the zoom fit; this still covers the band.
          b.fillRect(arrow.hot[0] - 10 * half, arrow.hot[1] - 10 * half, 20 * half, 20 * half);
          // Eased out to nothing by SHADOW_RADIUS from the cursor's middle.
          b.setTransform(dpr, 0, 0, dpr, (half - ox) * dpr, (half - oy) * dpr);
          const cx = shade.x + mx * fit;
          const cy = shade.y + my * fit;
          const bound = b.createRadialGradient(cx, cy, SHADOW_RADIUS * 0.7 * fit, cx, cy, SHADOW_RADIUS * fit);
          bound.addColorStop(0, "rgb(0 0 0)");
          bound.addColorStop(1, "rgb(0 0 0 / 0)");
          b.fillStyle = bound;
          b.fillRect(ox - half, oy - half, half * 2, half * 2);
          g.drawImage(band, 0, 0, side, side, ox - half, oy - half, side / dpr, side / dpr);
        }
        g.globalCompositeOperation = "source-over";
      }
    }
    // Plain over-painting, not additive: dozens of wisps share the spot by
    // the cursor, and additive light saturates there into a flame.
    for (let i = wisps.length - 1; i >= 0; i--) {
      const w = wisps[i];
      const t = (now - w.born) / SMOKE_LIFE_MS;
      if (t >= 1) {
        wisps.splice(i, 1);
        continue;
      }
      // Ease-out on the growth and the rise; the fade follows the growth,
      // so the wisp thins as it spreads.
      const e = 1 - (1 - t) ** 3;
      const age = now - w.born;
      // The curl widens as the wisp ages, so the plume frays at the top.
      const cx = w.x + Math.sin(w.seed + age / 220) * 9 * w.scale * e;
      const cy = w.y - age * SMOKE_RISE * w.scale;
      const r = (SMOKE_R0 + (SMOKE_R1 - SMOKE_R0) * e) * w.scale;
      const a = w.alpha * (1 - e);
      const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      // rgb(r g b) to rgb(r g b / a).
      grad.addColorStop(0, w.color.replace(")", ` / ${a.toFixed(3)})`));
      grad.addColorStop(1, w.color.replace(")", " / 0)"));
      g.fillStyle = grad;
      // Drawn taller than wide, so overlapping wisps read as a rising plume
      // rather than a round glow.
      g.save();
      g.translate(cx, cy);
      g.scale(1, 1.6);
      g.translate(-cx, -cy);
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    drawn = wisps.length > 0 || !!(shade && shade.alpha > 0.005);
    return wisps.length > 0;
  };
  const dispose = () => {
    canvas?.remove();
    canvas = null;
    ctx = null;
    wisps.length = 0;
  };
  return { step, dispose };
}
// The beam as a light: brightness falls off with distance from its point on
// the pill, 1 / (1 + (d / FALLOFF)^2), half strength at FALLOFF px.
const MIRROR_FALLOFF = 100;
// Above the pill, the pill itself stands between the cursor and the beam on
// its bottom edge; it is glass, so some of the light still comes through.
const MIRROR_THROUGH_GLASS = 0.75;
// How long after its last move the pointer still counts as moving, and the
// least time between cursor images while it is still (see show in
// startMirror). A first load, its images slow to decode, ran at about this
// rate and drew sharp.
const MOVING_MS = 120;
// Least time between frames run straight from pointer moves.
const SYNC_MS = 8;
const STILL_SWAP_MS = 250;

function startMirror() {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;
  let x = 0;
  let y = 0;
  let last = 0;
  // The pill in reach, if any; the light is worked out from it each frame,
  // since its beam moves even when the pointer does not.
  let target: (MirrorSpec & { el: HTMLElement; d: number; scale: number }) | null = null;
  // The pill being reflected, kept through the fade-out after it leaves.
  let source: (MirrorSpec & { el: HTMLElement }) | null = null;
  // What the reflection shows now, easing toward the target.
  let near = 0;
  let angle = Math.PI / 2;
  let shown = "";
  // With the pointer still, macOS drew the arrow soft until the next move
  // when its image changed every frame, and sharp at a few changes a second.
  // So a still pointer changes image at most every STILL_SWAP_MS; a moving
  // one, every frame. Leaving the rate to decode timing worked on a first
  // load, where decoding is slow, and not after a refresh, where the images
  // are cached and decode at once.
  let movedAt = 0;
  let swappedAt = 0;
  let syncedAt = 0;
  // The unlit drawn arrow, decoded up front: the stand-in while the image a
  // move wants is still decoding, so the system arrow never shows in reach.
  const plain = plainCursor();
  decoded(plain);
  const show = (css: string) => {
    if (css === shown) return;
    if (!decoded(css)) {
      if (!css || shown || !decoded(plain)) return;
      css = plain;
    }
    const now = performance.now();
    if (css && now - movedAt > MOVING_MS && now - swappedAt < STILL_SWAP_MS) return;
    swappedAt = now;
    shown = css;
    const root = document.documentElement.style;
    // The pills read --beam-cursor; set on them rather than on <html>, where a
    // custom property would restyle the whole document on every change.
    if (css) {
      root.cursor = css;
      for (const el of mirrors.keys()) el.style.setProperty("--beam-cursor", css);
    } else {
      root.removeProperty("cursor");
      for (const el of mirrors.keys()) el.style.removeProperty("--beam-cursor");
    }
  };
  const overlay = createOverlay();
  // Where the light was last, so the shadow still falls the right way while
  // it fades after the pointer leaves.
  let lightX = 0;
  let lightY = 0;
  // The shadow's offset and darkness as drawn, easing toward where the light
  // puts them; the beam jumps back to the start of its run each lap, and an
  // unsmoothed shadow would flip with it in one frame.
  let shadeX = 0;
  let shadeY = 0;
  let shadeA = 0;
  // How dark the shadow was when the pointer left reach, and the fade-out
  // blur easing toward its share of SHADOW_FADE_BLUR.
  let leftAt = 0;
  let shadeSoft = 0;
  const frame = (now: number) => {
    raf = 0;
    // Reduced motion snaps straight to the target; otherwise each value
    // closes the same share of its gap per ms, whatever the frame rate.
    // A frame run from a move can be timed after the next animation frame's
    // own timestamp, so time only ever counts forward.
    const k = still.matches || !last ? 1 : 1 - Math.exp(-Math.max(0, now - last) / MIRROR_EASE_MS);
    last = Math.max(last, now);
    // Reduced motion holds the beam still, mid-pill and fully lit.
    const beam = (spec: { el: HTMLElement; motion: BeamMotion }): Light =>
      still.matches ? { x: 0.5, y: spec.motion === "line" ? 1 : 0.5, edge: 1 } : beamNow(spec.el, spec.motion);
    let goal = 0;
    // Read once a frame: each read of the beam forces a style recalc.
    let b: Light | null = null;
    if (target) {
      source = target;
      // The light source: the beam's own point on the pill, kept a pixel
      // inside its box.
      const r = target.el.getBoundingClientRect();
      b = beam(target);
      const sx = Math.min(r.right - 1, Math.max(r.left + 1, r.left + r.width * b.x));
      const sy = Math.min(r.bottom - 1, Math.max(r.top + 1, r.top + r.height * b.y));
      // While the beam is out there is no light to move the shadow: it holds
      // where the light last was, instead of swinging with the beam's jump
      // back to the start of its run.
      if (b.edge > 0.1) {
        lightX = sx;
        lightY = sy;
      }
      const toward = Math.atan2(sy - y, sx - x);
      // Turn the short way round.
      angle += Math.atan2(Math.sin(toward - angle), Math.cos(toward - angle)) * k;
      const falloff = 1 / (1 + (Math.hypot(sx - x, sy - y) / (MIRROR_FALLOFF * target.scale)) ** 2);
      // Tapered to nothing at the edge of reach, so it never pops on or off.
      const taper = Math.min(1, (1 - target.d / (MIRROR_REACH * target.scale)) * 3);
      // Seen from the far side of the pill from its light, the light comes
      // through the glass.
      const across = (y < r.top && b.y > 0.5) || (y > r.bottom && b.y < 0.5);
      goal = falloff * taper * (across ? MIRROR_THROUGH_GLASS : 1);
    }
    near += (goal - near) * k;
    // Out of reach and faded: hand back the system cursor, and stop once any
    // smoke still in the air has gone.
    if (!target && near < 0.02) {
      near = 0;
      source = null;
      show("");
      if (overlay.step(now, null) && !still.matches) raf = requestAnimationFrame(frame);
      else last = 0;
      return;
    }
    if (!source) return;
    const theme = hostTheme();
    // Any light at all draws at least the faintest level, so the far edge of
    // reach still shows the right direction instead of the plain arrow.
    const level = near > 0.004 ? Math.max(1, Math.round(near * MIRROR_LEVELS)) : 0;
    const turn = ((Math.round((angle / (Math.PI * 2)) * MIRROR_TURNS) % MIRROR_TURNS) + MIRROR_TURNS) % MIRROR_TURNS;
    const lit = b ?? beam(source);
    const glow = Math.round(lit.edge * GLOW_STEPS);
    // The beam's hue as it drifts, so the reflection, the smoke and the
    // shadow are always the colour the beam is now.
    const hue = still.matches ? 0 : hueNow(source.el);
    // While the beam is out, so is the light on the cursor. The drawn arrow
    // stays, unlit, rather than handing back to the system one each lap:
    // the two are never pixel-identical, so the swap reads as a flicker.
    if (!glow || !level) show(plainCursor());
    else if (source.style !== "beam") show(stillCursor(source.style, source.color, theme, level, turn, glow, hue));
    else show(beamCursor(source.color, level, turn, Math.round(lit.x * MIRROR_FRAMES), glow, hue));
    // Smoke rises off the arrow's body, as lit as the arrow is; the shadow
    // falls away from the light, as dark as the light is bright.
    {
      const arrow = arrowFor();
      const tones = tonesFor(source.color, theme, hue);
      const scale = target?.scale ?? 1;
      const away = Math.hypot(x - lightX, y - lightY) || 1;
      // d * h / (H - h), with the sun and the stick both scaled to the pill.
      const length = Math.min(SHADOW_MAX, Math.max(SHADOW_MIN, (away * STICK_HEIGHT) / (SUN_HEIGHT - STICK_HEIGHT))) * scale;
      shadeX += (((x - lightX) / away) * length - shadeX) * k;
      shadeY += (((y - lightY) / away) * length - shadeY) * k;
      // A shadow is only as dark as its light is bright.
      shadeA += (SHADOW_ALPHA[theme] * near * (0.15 + 0.85 * lit.edge) - shadeA) * k;
      // Coming and going, it blurs as it thins: none at the darkness it is
      // heading for (or had when the pointer left), the full amount at nothing.
      if (target) leftAt = 0;
      else leftAt ||= shadeA;
      const peak = target ? SHADOW_ALPHA[theme] * near * (0.15 + 0.85 * lit.edge) : leftAt;
      const softGoal = peak > 0.001 ? SHADOW_FADE_BLUR * (1 - Math.min(1, shadeA / peak)) : SHADOW_FADE_BLUR;
      shadeSoft += (softGoal - shadeSoft) * k;
      const shade: Shade | null = source.shadow
        ? {
            x,
            y,
            dx: shadeX,
            dy: shadeY,
            alpha: shadeA,
            soften: shadeSoft,
            arrow,
            tones: tones.map(rgb),
          }
        : null;
      overlay.step(now, source.smoke && !still.matches ? {
        x: x + (arrow.left + arrow.right) / 2 - arrow.hot[0],
        y: y + (arrow.top + arrow.bottom) / 2 - arrow.hot[1],
        // Steeper than the light: thick close in, thin by mid-reach.
        density: near ** 2,
        light: lit.edge,
        scale: target?.scale ?? 1,
        color: rgb(tones[Math.min(tones.length - 1, Math.floor(lit.x * tones.length))]),
        dark: theme === "dark",
      } : null, shade);
    }
    // The beam keeps moving while in reach, so keep following it; after it
    // leaves, run only until the fade settles.
    if (!still.matches) raf = requestAnimationFrame(frame);
  };
  const measure = () => {
    let best: (MirrorSpec & { d: number; el: HTMLElement; scale: number }) | null = null;
    for (const [el, spec] of mirrors) {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const d = Math.hypot(dx, dy);
      const scale = scaleOf(r);
      // Nearest by distance in the pill's own units, so a big button does not
      // lose to a small one just because its edge is a few px further off.
      if (d < MIRROR_REACH * scale && (!best || d / scale < best.d / best.scale)) best = { ...spec, d, el, scale };
    }
    // Coming in from nowhere, start the light on the pill's side rather than
    // swinging round to it.
    if (best && !source) {
      const r = best.el.getBoundingClientRect();
      angle = Math.atan2(r.bottom - y, r.left + r.width / 2 - x);
    }
    target = best && { el: best.el, color: best.color, style: best.style, smoke: best.smoke, shadow: best.shadow, motion: best.motion, d: best.d, scale: best.scale };
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const off = onPointerOrLayout((e) => {
    x = e.clientX;
    y = e.clientY;
    movedAt = performance.now();
    measure();
    // The cursor for this move, set now rather than a frame later: the
    // browser picks the cursor while it handles the move, so a frame-late
    // image was always one move behind, and a browser that only redraws the
    // cursor on a move (Safari) kept that stale one while the pointer rested.
    // Coming into reach, the stale one was the system arrow.
    // At most once per SYNC_MS: a 1000 Hz mouse would otherwise run the whole
    // frame a thousand times a second.
    if (movedAt - syncedAt < SYNC_MS) return;
    syncedAt = movedAt;
    cancelAnimationFrame(raf);
    raf = 0;
    frame(movedAt);
  }, measure);
  return () => {
    off();
    cancelAnimationFrame(raf);
    overlay.dispose();
    show("");
  };
}

/** The cursor as a mirror: near the pill, the platform's own arrow (macOS,
 *  Windows, or the Mac-like Linux one) picks up the beam
 *  in the chosen style, over more of the arrow the closer it gets. A real
 *  `cursor: url()` swap, so the arrow stays the system-drawn one with no lag,
 *  and nothing is painted on the page. Fine pointers only. */
function useMirror(
  ref: React.RefObject<HTMLDivElement | null>,
  style: MirrorStyle | false,
  color: BorderBeamColorVariant,
  smoke: boolean,
  shadow: boolean,
  motion: BeamMotion,
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !style || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    mirrors.set(el, { color, style, smoke, shadow, motion });
    stopMirror ??= startMirror();
    return () => {
      mirrors.delete(el);
      if (!mirrors.size) {
        stopMirror?.();
        stopMirror = null;
      }
    };
  }, [ref, style, color, smoke, shadow, motion]);
}

/** The host's theme, for the beam. border-beam's own "auto" reads the OS
 *  scheme in a useState initializer: the server takes "dark", a light OS takes
 *  "light", and the beam's inline <style> hydration-mismatches on every page
 *  that draws one. It also ignores a site's own toggle. So the class a
 *  class-strategy theme writes on <html> wins, then the color-scheme it sets
 *  there, and the OS scheme is the fallback
 *  for hosts without one, and the server snapshot is the package's own "dark"
 *  default, so hydration agrees and the real value lands in the next commit. */
function subscribeTheme(onChange: () => void) {
  const root = new MutationObserver(onChange);
  root.observe(document.documentElement, { attributeFilter: ["class", "style"] });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  return () => {
    root.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function hostTheme(): "dark" | "light" {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  // Theme scripts that only toggle "dark" mark light mode by the
  // color-scheme they set on <html>; without this, a light site on a dark OS
  // would get the dark beam.
  const scheme = root.style.colorScheme;
  if (scheme === "dark" || scheme === "light") return scheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useHostTheme() {
  return React.useSyncExternalStore(subscribeTheme, hostTheme, () => "dark" as const);
}

export default BeamButton;
