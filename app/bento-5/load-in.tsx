"use client";

// The section's entrance. Two shapes of the same beat: the card rises the last
// few pixels into place, the ambilight behind it blooms up and settles, both on
// the cell's own delay.
//
// It fires when the section is scrolled to, not when the page mounts, and the
// whole grid fires off one observer on the group rather than four of its own.
// That is what keeps the stagger a choreography: with an observer per card the
// bottom row would trip a scroll-length after the top one and the beats would
// land in whatever order the reader's scroll happened to produce. Motion
// propagates a parent's variant state down the tree, so the children only name
// the states and the group decides when they change.
//
// The glow is a light switch, not part of the entrance: it comes up when the
// section is on screen and goes out when it leaves, every time. So it runs off
// its own viewport toggle instead of the group's one-shot variants — the cards
// still rise once and stay.
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
import type { Variants } from "motion/react";
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
const [ON, OFF] = [0.4, 0.8];

const Lit = createContext(false);

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
    useMotionValueEvent(scrollYProgress, "change", (p) =>
        setLit(p >= ON && p < OFF),
    );

    return (
        <Lit.Provider value={lit}>
            <motion.div
                ref={ref}
                className={className}
                initial="dark"
                whileInView="lit"
                viewport={VIEWPORT}
            >
                {children}
            </motion.div>
        </Lit.Provider>
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
    // Every glow follows the one switch on the group, so the four come up
    // together rather than each on its own card's crossing. Slow both ways,
    // slower going out.
    const lit = useContext(Lit);

    if (glow)
        return (
            <motion.div
                aria-hidden
                className={className}
                initial={false}
                animate={{ opacity: lit ? "var(--b5-glow)" : 0 }}
                transition={{
                    duration: still ? 0.2 : lit ? 1.44 : 1.98,
                    ease: SOFT,
                }}
            >
                {children}
            </motion.div>
        );

    const variants: Variants = {
        dark: { opacity: 0, y: 10 },
        lit: {
            opacity: 1,
            y: 0,
            transition: still ? { duration: 0.2 } : { duration: 0.7, ease: EASE, delay },
        },
    };

    return (
        <motion.div className={className} variants={variants}>
            {children}
        </motion.div>
    );
}
