"use client";

// The section's entrance. Two shapes of the same beat: the card rises the last
// few pixels into place, the ambilight behind it blooms up and settles, both on
// the cell's own delay.
//
// It fires when the section is scrolled to, not when the page mounts, and the
// whole grid fires off one observer on the group rather than four of its own.
// That is what keeps the stagger a choreography: with an observer per card the
// bottom row would trip a scroll-length after the top one and the beats would
// land in whatever order the reader's scroll happened to produce. The group
// publishes both of its states on context and the cards read them, so one
// observer and one scroll reader drive the whole grid.
//
// The glow is a light switch, not part of the entrance: it comes up when the
// section is on screen and goes out when it leaves, every time — hence a
// separate state from the one-shot entrance, which happens once and stays.
//
// The cards ride the same switch at their own brightness: lit they sit at full
// strength, otherwise they sink to DIM. Same curve and same two durations as the
// glow, so the light and the cards it falls on move as one thing rather than two
// effects that happen to overlap.
//
// The glow animates its own opacity rather than a wrapper's. A wrapper at
// opacity < 1 would isolate the layer into its own stacking context and its
// mix-blend-mode would then blend against nothing instead of the page — which on
// the pale theme means the multiply drops out and the raw gradient flashes
// through for the length of the fade. So this component *is* the layer: it takes
// the layer's className rather than wrapping it.
//
// The resting value is a variable because it differs per theme (0.45 light,
// 0.5 dark); Motion resolves it off the element, so the animation lands on
// whichever value the current theme set.

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

type Bezier = [number, number, number, number];

const EASE: Bezier = [0.22, 1, 0.36, 1];
// The glow gets an ease-in-out instead: no edge at either end, so the light
// swells and dies rather than arriving and stopping.
const SOFT: Bezier = [0.33, 0, 0.35, 1];

// 0.15, not "some": on a phone the grid is several screens tall, and a trigger
// on the first pixel would spend the entrance off-screen. once, because a
// reader scrolling back should find the section lit, not watch it switch on
// again.
const VIEWPORT = { once: true, amount: 0.15 } as const;

// The light is on for the middle of the section's pass: 0 is the section's top
// meeting the bottom of the window, 1 its bottom leaving the top. Read as scroll
// progress rather than a visible fraction because on a phone the grid is taller
// than the window, and "40% of it is showing" is then never true.
//
// Both ends are placed by what is left to scroll, not by where the section sits:
// a power-down that starts at 0.8 has a fifth of the pass to play in, which at
// any real scroll speed is less than the ramp takes — so most of it happened to
// an empty screen. Off at 0.68 leaves a third of the pass, and the section
// visibly powers down before it goes. On is early for the same reason from the
// other side: the bloom then overlaps the cards' rise instead of arriving after
// the entrance has already finished.
const [ON, OFF] = [0.34, 0.68];

// How far the cards sink when the light is off. Deep enough to read as the
// section powering down, shallow enough that the copy stays legible on the way
// past.
const DIM = 0.72;

const Stage = createContext({ entered: false, lit: false });

// Everything in this file is a desktop luxury, and the desktop is where it is
// judged. Below lg the section is a still picture: lit cards, no entrance, no
// ambilight, no ripple, no spin. The cost it sheds is not the choreography, it
// is what the choreography keeps touching — four extra copies of artwork
// carrying eighteen SVG blur filters apiece, a 72px blur on a pinned layer, and
// a scroll listener driving all of it.
//
// False until the effect runs, so the server renders the still version. That is
// also what the phone should get first regardless: the animated path server-
// renders its cards at opacity 0, so until JS lands the section is a blank
// screen. Static-first means the artwork arrives with the document.
//
// The desktop upgrade lands a tick after hydration, above the fold of this
// section — the reader is a screen away, and the entrance is keyed to scrolling
// into it, not to mount.
// ponytail: the ambilight's artwork still rides the RSC payload as this
// component's children even where it never renders. Dropping that too means the
// glow importing the four exports itself behind an ssr:false dynamic(), which
// trades document bytes for a lazily-loaded desktop-only chunk.
export const useWide = () => {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const q = matchMedia("(min-width: 1024px)");
    const sync = () => setWide(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  return wide;
};

// The one question the animated parts ask. Reduced motion is folded in here
// rather than checked separately: a reader who asked for less motion and a phone
// that cannot afford it want the same still frame.
// Both hooks called, never short-circuited — || would skip the second one for as
// long as the first is false, and the count would change the moment it flips.
export const useStill = () => {
  const wide = useWide();
  const reduced = useReducedMotion();
  return !wide || !!reduced;
};

// The one switch, and the one shape of its throw: glow, card brightness and the
// globe's spin all run off these so the section powers up and down as a single
// movement. Slow both ways, slower going out.
export const useLit = () => useContext(Stage).lit;
export const light = (lit: boolean, still?: boolean | null) => ({
  duration: still ? 0.2 : lit ? 1.44 : 1.98,
  ease: SOFT,
});

// The scroll reader, as a child that draws nothing.
//
// useScroll is not free: it listens for scroll and measures its target on every
// event, and on a phone the target is a grid several screens tall. Below lg
// there is no light for it to switch — the callback was already guarded — so all
// of that was measurement in aid of a no-op. Hooks cannot be skipped, so the
// hook moves into a component that is only mounted when something reads it.
//
// A null-rendering child rather than a second branch of the group itself:
// swapping the group would change the element type at the moment `still`
// resolves, and remounting four cards' worth of artwork costs more than the
// listener it saves.
function ScrollLit({
  target,
  onChange,
}: {
  target: RefObject<HTMLDivElement | null>;
  onChange: (lit: boolean) => void;
}) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    onChange(p >= ON && p < OFF),
  );
  return null;
}

export function LoadInGroup({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [lit, setLit] = useState(false);
  const [entered, setEntered] = useState(false);

  // Still means the switch is welded on: everything downstream reads lit and
  // entered, so one pair of values makes the whole section a lit still frame
  // without a second code path in any of the four cards.
  return (
    <Stage.Provider value={{ entered: entered || still, lit: lit || still }}>
      {/* The entrance observer goes the same way as the scroll reader:
                still means `entered` is already true, so the IntersectionObserver
                would fire once to set a value nothing reads. Dropped as props
                rather than by swapping the element, for the same remount reason. */}
      <motion.div
        ref={ref}
        className={className}
        {...(still
          ? {}
          : {
              viewport: VIEWPORT,
              onViewportEnter: () => setEntered(true),
            })}
      >
        {!still && <ScrollLit target={ref} onChange={setLit} />}
        {children}
      </motion.div>
    </Stage.Provider>
  );
}

export default function LoadIn({
  className,
  delay = 0,
  glow = false,
  children,
}: {
  className?: string;
  delay?: number;
  glow?: boolean;
  children: ReactNode;
}) {
  const wide = useWide();
  const reduced = useReducedMotion();
  const still = !wide || !!reduced;
  // Every glow and every card follows the one switch on the group, so the four
  // come up together rather than each on its own card's crossing.
  const { entered, lit } = useContext(Stage);
  const sweep = light(lit, still);

  if (glow) {
    // No ambilight below lg. Reduced motion keeps it — a halo is not motion,
    // its fade is — so it comes on and stays on.
    if (!wide) return null;
    return still ? (
      <div
        aria-hidden
        className={className}
        style={{ opacity: "var(--b5-glow)" }}
      >
        {children}
      </div>
    ) : (
      <motion.div
        aria-hidden
        className={className}
        initial={false}
        animate={{ opacity: lit ? "var(--b5-glow)" : 0 }}
        transition={sweep}
      >
        {children}
      </motion.div>
    );
  }

  // Lit, in place, and nothing to run.
  if (still) return <div className={className}>{children}</div>;

  // The rise is the entrance, on the cell's delay; the brightness is the
  // switch, on the glow's curve. Separate transitions on the one element
  // because they answer to different states.
  const rise = still ? { duration: 0.2 } : { duration: 0.7, ease: EASE, delay };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 10 }}
      transition={{ opacity: rise, y: rise }}
    >
      {children}
      {/* The dim, as black over the card rather than brightness() on it.
                The two are the same arithmetic — brightness(b) scales every
                channel by b, and black at 1-b alpha leaves c*b — but a filter
                re-rasters what it covers on every frame it changes, and what it
                covers here is an export carrying eighteen SVG blur filters. Two
                seconds of that, each way, every time the section passes. As an
                overlay it is one opacity on its own layer, which is the
                compositor's job and nobody else's. Above the copy (z-20), since
                brightness() dimmed that too. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-black"
        initial={{ opacity: 1 - DIM }}
        animate={{ opacity: lit ? 0 : 1 - DIM }}
        transition={sweep}
      />
    </motion.div>
  );
}
