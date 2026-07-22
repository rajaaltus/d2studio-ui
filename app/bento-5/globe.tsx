"use client";

// Cobe globe for the "Global by default" card.
//
// Pinned to cobe 0.6.x, because 2.0.1 renders the sphere but never draws the
// land dots, even on its own README config.
//
// The canvas is `mix-blend-mode: screen` so the globe composites onto the card
// artwork instead of sitting on top of it: the near-black sphere body drops out
// and only the land dots, the terminator and the glow add light to the gradient.
// That only works with a dark render, hence dark:1 + a very low baseColor.
//
// cobe centres and scales the sphere against the width/height it is handed, in
// device pixels, while the backing buffer follows the canvas element's own box.
// The two have to agree: hand it a fixed size and the sphere lands off-centre and
// at the wrong scale. So the element is measured, and re-measured on resize.

import createGlobe from "cobe";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { light, useLit } from "./load-in";

const { sin, cos, sqrt, PI } = Math;

const THETA = 0.2;
const SAMPLES = 16000;

type Vec = [number, number, number];

// cobe's marker vector: lat/lng -> unit sphere, with lng offset by a half turn.
function world(lat: number, lng: number): Vec {
  const la = (lat * PI) / 180;
  const lo = (lng * PI) / 180 - PI;
  const cl = cos(la);
  return [-cl * cos(lo), sin(la), cl * sin(lo)];
}

// The shader paints a marker on the nearest dot of its Fibonacci lattice, not at
// the exact lat/lng, so a chip placed on the true coordinate misses the dot it
// belongs to by up to ~5px at this card's globe size. Snap to the same lattice.
// ponytail: brute force over all samples, once per city at module load (~160k
// distance tests); index-window the search if the city list ever grows.
function snap([x, y, z]: Vec): Vec {
  let best: Vec = [x, y, z];
  let bd = Infinity;
  for (let j = 0; j <= SAMPLES; j++) {
    const zj = 1 - (2 * j) / SAMPLES;
    const l = sqrt(1 - zj * zj);
    const k = ((j * 0.618034) % 1) * 2 * PI;
    const p: Vec = [cos(k) * l, zj, sin(k) * l];
    const d = (p[0] - x) ** 2 + (p[1] - y) ** 2 + (p[2] - z) ** 2;
    if (d < bd) [bd, best] = [d, p];
  }
  return best;
}

// The cobe site's "Analytics" showcase: live visitor counts per city with a
// trend delta, green markers. Its own version positions the chips with CSS
// anchor positioning, which needs cobe 2.x and is Chrome-only, so the chips
// here ride the projection below instead.
// London, Paris and Berlin sit within a few degrees of each other, so on a card
// this narrow their chips land on top of one another. Sydney is below the
// card's window entirely. All ten stay as markers; only the ones whose chips
// never collide, checked pairwise over a full rotation, get a chip.
const CITIES = [
  {
    city: "New York",
    visitors: 847,
    trend: 12,
    chip: true,
    location: [40.71, -74.01],
  },
  {
    city: "London",
    visitors: 623,
    trend: -3,
    chip: true,
    location: [51.51, -0.13],
  },
  {
    city: "Los Angeles",
    visitors: 534,
    trend: 7,
    chip: true,
    location: [34.05, -118.24],
  },
  {
    city: "Mumbai",
    visitors: 468,
    trend: 21,
    chip: true,
    location: [19.08, 72.88],
  },
  {
    city: "Tokyo",
    visitors: 412,
    trend: 8,
    chip: true,
    location: [35.68, 139.65],
  },
  {
    city: "Paris",
    visitors: 385,
    trend: 5,
    chip: false,
    location: [48.86, 2.35],
  },
  {
    city: "Singapore",
    visitors: 296,
    trend: 4,
    chip: true,
    location: [1.35, 103.82],
  },
  {
    city: "Lagos",
    visitors: 224,
    trend: 18,
    chip: true,
    location: [6.52, 3.38],
  },
  {
    city: "Sydney",
    visitors: 201,
    trend: 15,
    chip: false,
    location: [-33.87, 151.21],
  },
  {
    city: "Berlin",
    visitors: 178,
    trend: -1,
    chip: false,
    location: [52.52, 13.41],
  },
].map((c) => ({ ...c, vec: snap(world(c.location[0], c.location[1])) }));

// The shader rotates the view ray by mat3 L(theta, phi); applying the same
// rotation forward puts a world point in view space. The sphere fills 0.8 of the
// half-box, and z > 0 is the front hemisphere.
function project([wx, wy, wz]: Vec, phi: number) {
  const [ct, st, cp, sp] = [cos(THETA), sin(THETA), cos(phi), sin(phi)];
  return {
    x: cp * wx + sp * wz,
    y: sp * st * wx + ct * wy - cp * st * wz,
    z: -sp * ct * wx + st * wy + cp * ct * wz,
  };
}

export default function Globe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  // Nothing starts until the section is actually on screen: booting the globe
  // means compiling shaders and rasterising 16k dots, and then a render loop
  // that never stops. once, because a reader scrolling back should find it
  // already turning rather than watch it boot a second time.
  // "some", not a fraction: the canvas is deliberately far bigger than the card
  // and mostly clipped by it, so any percentage of the canvas itself is the
  // wrong measure — asking for 30% of it never comes true.
  const inView = useInView(ref, { once: true, amount: "some" });

  // The sphere is on the same switch as the light: it spins up as the section
  // lights and coasts to a stop as the reader leaves, on the glow's curve and
  // its two durations. A factor on the step rather than a stop/start, so the
  // rotation eases out of its current angle instead of snapping — and the render
  // loop keeps running, since the chips still have to be placed at rest.
  const lit = useLit();
  const still = useReducedMotion();
  const spin = useMotionValue(0);

  useEffect(() => {
    const run = animate(spin, lit ? 1 : 0, light(lit, still));
    return () => run.stop();
  }, [lit, still, spin]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !inView) return;

    let phi = 0;
    let globe: { destroy: () => void } | null = null;
    let built = 0;

    const build = () => {
      const size = canvas.offsetWidth * 2;
      if (!size || size === built) return;
      built = size;
      // Fades rather than pops: the first frames land while the section is
      // still settling into view.
      canvas.style.opacity = "1";
      const [w, h] = [canvas.offsetWidth, canvas.offsetHeight];
      globe?.destroy();
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: size,
        height: size,
        phi: 0,
        theta: THETA,
        dark: 1,
        diffuse: 1.2,
        mapSamples: SAMPLES,
        mapBrightness: 7,
        baseColor: [0.08, 0.1, 0.18],
        markerColor: [0.3, 0.85, 0.45],
        glowColor: [0.14, 0.18, 0.42],
        markers: CITIES.map(({ location }) => ({
          location: [location[0], location[1]],
          size: 0.04,
        })),
        onRender: (state) => {
          state.phi = phi;
          if (!still) phi += 0.004 * spin.get();

          CITIES.forEach((c, i) => {
            const el = labels.current[i];
            if (!el) return;
            const { x, y, z } = project(c.vec, phi);
            // Positioned with a transform, not left/top: percentage offsets are
            // laid out, so they snap to whole pixels and the chip shivers as it
            // creeps sideways while the canvas marker moves subpixel-smooth.
            el.style.transform = `translate3d(${(x * 0.8 + 1) * 0.5 * w}px, ${
              (1 - y * 0.8) * 0.5 * h
            }px, 0) translate(-50%, -50%)`;
            // On the front face, and inside the slice of sphere the card
            // actually shows: the globe box is far wider than the card and
            // offset right, so the window is the sphere's left side, x in
            // [-0.79, -0.22] once the chip's own width is allowed for. The
            // box also sits low enough that the copy is clear of the sphere,
            // so only the bottom needs a y bound.
            // Entry/exit is a CSS transition on the flag, not a per-frame
            // opacity: transitions retarget when a marker skims the boundary,
            // where a fresh keyframe each frame would restart from zero.
            // Written only on change so the loop doesn't touch the DOM 60x/s.
            const on = z > 0.12 && x <= -0.22 && x >= -0.79 && y >= -0.49;
            if ((el.dataset.on === "true") !== on) el.dataset.on = `${on}`;
          });
        },
      });
    };

    // Fires once on observe, so this is also the initial build.
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      globe?.destroy();
    };
  }, [inView, still, spin]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={ref}
        aria-hidden
        className="h-full w-full opacity-0 transition-opacity duration-700 ease-out"
        style={{ mixBlendMode: "screen" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {CITIES.map((c, i) =>
          !c.chip ? null : (
            <div
              key={c.city}
              ref={(el) => {
                labels.current[i] = el;
              }}
              data-on="false"
              className="group absolute top-0 left-0 will-change-transform"
            >
              {/* The dot leads in and trails out; the chip follows it and
                  leaves first, so the pair reads as one thing arriving.
                  Exits are quicker than entrances, and each span transitions
                  only the properties it moves — Tailwind v4 compiles scale
                  and translate to the standalone CSS properties, not to
                  `transform`, so those are what have to be named. */}
              <span className="block size-1.5 scale-50 rounded-full bg-[#4ADE80] opacity-0 shadow-[0_0_9px_2px_rgba(52,211,153,0.7)] transition-[scale,opacity] delay-[90ms] duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[on=true]:scale-100 group-data-[on=true]:opacity-100 group-data-[on=true]:delay-0 group-data-[on=true]:duration-200 motion-reduce:scale-100!" />
              <span className="absolute bottom-3.5 left-1/2 flex origin-bottom -translate-x-1/2 translate-y-[3px] scale-[0.96] items-baseline gap-1.5 rounded-[4px] bg-black/85 px-2 py-[0.3rem] whitespace-nowrap opacity-0 transition-[scale,translate,opacity] duration-[130ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[on=true]:translate-y-0 group-data-[on=true]:scale-100 group-data-[on=true]:opacity-100 group-data-[on=true]:delay-[70ms] group-data-[on=true]:duration-200 motion-reduce:translate-y-0! motion-reduce:scale-100!">
                <span className="font-mono text-[0.85rem] leading-none font-semibold tracking-[-0.02em] text-white">
                  {c.visitors}
                </span>
                <span
                  className={`font-mono text-[0.55rem] leading-none font-medium tracking-[0.02em] ${
                    c.trend >= 0 ? "text-[#34D399]" : "text-[#F87171]"
                  }`}
                >
                  {c.trend >= 0 ? "↑" : "↓"} {Math.abs(c.trend)}%
                </span>
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
