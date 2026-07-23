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

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

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

// The one switch, and the one shape of its throw: glow, card brightness and the
// globe's spin all run off these so the section powers up and down as a single
// movement. Slow both ways, slower going out.
export const useLit = () => useContext(Stage).lit;
export const light = (lit: boolean, still?: boolean | null) => ({
    duration: still ? 0.2 : lit ? 1.44 : 1.98,
    ease: SOFT,
});

export function LoadInGroup({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const [lit, setLit] = useState(false);
    const [entered, setEntered] = useState(false);
    useMotionValueEvent(scrollYProgress, "change", (p) =>
        setLit(p >= ON && p < OFF),
    );

    return (
        <Stage.Provider value={{ entered, lit }}>
            <motion.div
                ref={ref}
                className={className}
                viewport={VIEWPORT}
                onViewportEnter={() => setEntered(true)}
            >
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
    const still = useReducedMotion();
    // Every glow and every card follows the one switch on the group, so the four
    // come up together rather than each on its own card's crossing.
    const { entered, lit } = useContext(Stage);
    const sweep = light(lit, still);

    if (glow)
        return (
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

    // The rise is the entrance, on the cell's delay; the dimming is the switch,
    // on the glow's curve. Two states, so two transitions.
    //
    // The dimming is a black veil at 1 - DIM rather than filter: brightness(DIM)
    // — the same arithmetic, since either way the card's rendered pixels come
    // out multiplied by DIM, but not the same cost. A filter on the cell is a
    // filter over everything in it, including the globe card's WebGL canvas and
    // its mix-blend-mode: screen; a blend inside an animating filter cannot be
    // handed to the compositor, so Chrome re-rasterised the whole card, globe
    // frame and all, on every frame of the 1.44s/1.98s sweep — which is exactly
    // when the globe is meant to be spinning up. An opacity animation on a
    // sibling layer is composited outright and touches none of that. isolate
    // keeps the card its own blend group, which the filter used to do for free
    // and which the globe's screen blend needs: without it the canvas would
    // blend against the page instead of the card underneath it.
    const rise = still ? { duration: 0.2 } : { duration: 0.7, ease: EASE, delay };

    return (
        <motion.div
            className={`isolate ${className ?? ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 10 }}
            transition={rise}
        >
            {children}
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
