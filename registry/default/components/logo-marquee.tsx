"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { BrandIcons } from "./brand-showcase/brand-icons";

// A logo rail that never stops, driven by the Web Animations API rather than by
// a per-frame write from JavaScript.
//
// That is the whole performance story. A rail animated by setting a transform
// on every rAF tick is main-thread work for as long as the page is open, and it
// competes with whatever else the page is doing — so it stutters exactly when
// the page is busiest, which on a landing page is while the visitor is
// scrolling. Handing the same transform to WAAPI puts it on the compositor: the
// browser owns the interpolation, the main thread is not involved, and a busy
// frame cannot reach it.
//
// It also removes the seam arithmetic. The children are wrapped in two copies,
// each carrying the gap as trailing padding, so the track is exactly two copies
// wide and `translateX(-50%)` lands the second copy precisely where the first
// one started. No half-a-gap correction, no measurement to get it wrong.
//
// The one number still measured is the duration, because `speed` is px per
// second and only the copy's own width can turn that into a time.

const DEFAULT_LOGOS = [
  BrandIcons.tailwind,
  BrandIcons.shadcn,
  BrandIcons.react,
  BrandIcons.nextjs,
  BrandIcons.vercel,
  BrandIcons.supabase,
  BrandIcons.convex,
  BrandIcons.threejs,
];

/** motion's `useReducedMotion` in five lines, so a rail that no longer animates
 *  in JavaScript does not keep a motion library as a dependency for one
 *  boolean. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  return reduced;
}

export function InfiniteSlider({
  children,
  gap = 88,
  speed = 50,
  speedOnHover,
  className,
}: {
  children: React.ReactNode;
  /** Space between items, and the trailing padding on each copy so the two
   *  meet at the same spacing they keep internally. A number is px; a string is
   *  any CSS length, which is how the spacing is made responsive without a
   *  breakpoint hook (the duration is measured, so it follows on its own). */
  gap?: number | string;
  /** px per second. */
  speed?: number;
  speedOnHover?: number;
  className?: string;
}) {
  const track = React.useRef<HTMLDivElement>(null);
  const copy = React.useRef<HTMLDivElement>(null);
  const ghost = React.useRef<HTMLDivElement>(null);
  const anim = React.useRef<Animation | null>(null);
  const reduced = usePrefersReducedMotion();
  // Stripped of the punctuation React wraps its ids in, so what lands in a
  // `url(#…)` is a plain fragment name.
  const suffix = `-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Every id under this rail is renamed to something only this rail uses.
  //
  // A brand mark is an inline SVG carrying hardcoded ids in its defs —
  // `clip0_3_297`, `paint0_linear_3_338` — and `url(#…)` resolves across the
  // whole document, to whichever element comes first. So a page that draws the
  // same mark anywhere else wins, and every reference in here binds into *that*
  // subtree instead. It is not a cosmetic problem: the gradients and masks are
  // `userSpaceOnUse`, so a reference resolved against a different SVG root is
  // measured in the wrong coordinate space, and a browser invalidates every
  // referrer whenever the shared resource is touched — which, for a rail that
  // is transformed without pause, is every frame, and reads as the marks
  // flickering.
  //
  // Both copies, not just the duplicate: the collision is with the rest of the
  // page as much as with the rail's own second half. Renaming after paint
  // rather than templating the ids keeps the marks themselves free of a
  // `useId`, which would pull all ten across the client boundary for every
  // consumer, including the ones that render a single mark on the server and
  // have nothing to collide with.
  React.useEffect(() => {
    // Per copy, not per rail: the two halves are the same marks rendered
    // twice, so one shared suffix would leave them colliding with each other
    // exactly as they collided with the page.
    const scopeIds = (scope: HTMLElement | null, tag: string) => {
      if (!scope) return;

      const renamed = new Map<string, string>();
      scope.querySelectorAll<HTMLElement>("[id]").forEach((el) => {
        if (el.id.endsWith(tag)) return;
        const to = `${el.id}${tag}`;
        renamed.set(el.id, to);
        el.id = to;
      });
      if (!renamed.size) return;

      // Matched with the closing paren, and href only on an exact match, so an
      // id that is another id's prefix cannot be rewritten by it.
      scope.querySelectorAll("*").forEach((node) => {
        for (const attr of Array.from(node.attributes)) {
          if (!attr.value.includes("#")) continue;
          let next = attr.value;
          renamed.forEach((to, from) => {
            next = next.split(`url(#${from})`).join(`url(#${to})`);
            if (attr.name.endsWith("href") && next === `#${from}`) next = `#${to}`;
          });
          if (next !== attr.value) node.setAttribute(attr.name, next);
        }
      });
    };

    scopeIds(copy.current, `${suffix}a`);
    scopeIds(ghost.current, `${suffix}b`);
  }, [children, suffix]);

  React.useEffect(() => {
    const node = track.current;
    const first = copy.current;
    if (!node || !first || reduced) return;

    // One copy's width, in pixels, and never as a percentage. A percentage in
    // a transform resolves against the element's own box, which is layout the
    // compositor does not own — so Blink keeps the animation on the main
    // thread and repaints the track every frame instead of transforming a
    // texture it has already rasterised. The symptom is the marks shimmering
    // in step with the travel: faster rail, faster shimmer.
    //
    // Read off the rect rather than offsetWidth because that one is rounded to
    // whole pixels, and half a pixel of error at the seam is half a pixel the
    // second copy does not line up with the first.
    const distanceOf = () => first.getBoundingClientRect().width;

    const frames = (distance: number) => [
      { transform: "translateX(0px)" },
      { transform: `translateX(${-distance}px)` },
    ];

    let distance = distanceOf();

    const running = node.animate(frames(distance), {
      duration: (distance / speed) * 1000,
      iterations: Infinity,
      easing: "linear",
    });
    anim.current = running;

    // A web font settling changes the copy's width after the first paint, so
    // both the travel and the time it should take are now wrong. Rewriting
    // either one alone would move the rail — progress is elapsed over
    // duration, and the divisor is about to change — so the fraction is read
    // first and written back after, and the rail holds its place while the
    // geometry corrects underneath it.
    const ro = new ResizeObserver(() => {
      const effect = running.effect as KeyframeEffect | null;
      if (!effect) return;
      const next = distanceOf();
      if (!next || Math.abs(next - distance) < 0.5) return;

      const before = Number(effect.getTiming().duration) || 0;
      const after = (next / speed) * 1000;
      const progress = before
        ? ((Number(running.currentTime) || 0) % before) / before
        : 0;

      distance = next;
      effect.setKeyframes(frames(next));
      effect.updateTiming({ duration: after });
      running.currentTime = progress * after;
    });
    ro.observe(first);

    // Nothing to animate while the rail is off screen, and the page above it is
    // a full viewport of live components: the scroll through that is the one
    // moment this must not be spending frames.
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? running.play() : running.pause(),
    );
    io.observe(node);

    return () => {
      ro.disconnect();
      io.disconnect();
      running.cancel();
      anim.current = null;
    };
  }, [speed, reduced]);

  // playbackRate rather than a new duration: WAAPI keeps the current time when
  // the rate changes, so the rail slows from where it is instead of jumping to
  // wherever the new timing says it should have been.
  const setRate = (rate: number) => anim.current?.updatePlaybackRate(rate);

  // A tap fires mouseenter on a touch screen and never fires the matching
  // leave, which would strand the rail at its hover speed for good.
  const hoverAware =
    speedOnHover != null &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const copyProps = {
    className: "flex shrink-0 items-center",
    style: { gap, paddingRight: gap },
  } as const;

  return (
    // `contain: inline-size` beside the clip. The track is `w-max` — two full
    // copies of the row, well over a phone's width — and `overflow-hidden`
    // clips the paint while the wrapper still reports that width as its own
    // min-content. Any parent that sizes to its content then takes it, and the
    // whole section is dragged wider than the screen with the eyebrow centred
    // somewhere off the right edge. Containment cuts the contribution; the
    // width comes from the parent alone.
    <div className={cn("overflow-hidden [contain:inline-size]", className)}>
      <div
        ref={track}
        className="flex w-max will-change-transform"
        onMouseEnter={hoverAware ? () => setRate(speedOnHover! / speed) : undefined}
        onMouseLeave={hoverAware ? () => setRate(1) : undefined}
      >
        <div ref={copy} {...copyProps}>
          {children}
        </div>
        <div ref={ghost} aria-hidden {...copyProps}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LogoMarquee({
  eyebrow = "Trusted by teams building on the modern stack",
  logos = DEFAULT_LOGOS,
  className = "",
}: {
  eyebrow?: string;
  logos?: React.ComponentType<React.SVGProps<SVGSVGElement>>[];
  className?: string;
}) {
  return (
    <section className={cn("bg-background relative border-y py-12", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-muted-foreground text-center font-mono text-xs tracking-[0.18em] uppercase">
          {eyebrow}
        </p>

        <div className="relative mt-8">
          {/* The rail runs edge to edge and is cut back into the page by two
              gradients of the page's own background, so logos arrive and leave
              rather than being clipped by a hard boundary. */}
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent sm:w-24" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent sm:w-24" />

          {/* The gap is a clamp rather than the flat 88: two logos and half
              of a third is what 88px leaves on a phone, and the rail reads as
              a queue rather than as a row. */}
          <InfiniteSlider
            speed={50}
            speedOnHover={18}
            gap="clamp(2.5rem, 8vw, 5.5rem)"
          >
            {logos.map((Logo, i) => (
              <div
                key={i}
                className="text-muted-foreground flex h-9 items-center transition-[color] duration-200 [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:hover:text-foreground [&_svg]:max-h-7 [&_svg]:w-auto"
              >
                <Logo />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
