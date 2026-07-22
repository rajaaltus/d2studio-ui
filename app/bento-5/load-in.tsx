"use client";

// The section's entrance, back on Motion. Two shapes of the same beat: the card
// rises the last few pixels into place, the ambilight behind it blooms up and
// settles, both on the cell's own delay.
//
// The glow overshoots rather than easing straight to its resting value: it runs
// a little past, then falls back. That is how light behaves when a source comes
// up — a flare and then a level — and it is what makes the section read as
// switching on instead of fading in. The overshoot is small on purpose; large
// enough to see, not large enough to notice as an effect.
//
// The glow animates its own opacity rather than a wrapper's. A wrapper at
// opacity < 1 would isolate the layer into its own stacking context and its
// mix-blend-mode would then blend against nothing instead of the page — which on
// the pale theme means the multiply drops out and the raw gradient flashes
// through for the length of the fade. So this component *is* the layer: it takes
// the layer's className rather than wrapping it.
//
// Both the peak and the resting value are variables because they differ per
// theme (0.45/0.62 light, 0.5/0.68 dark); Motion resolves them off the element,
// so the animation lands on whichever pair the current theme set.
//
// Both fades are hydration-gated, which is the cost of doing this in JS: the
// page is eight full-size inline SVGs, so nothing moves until React has caught
// up with them. The globe's boot is held back past the entrance (globe.tsx) so
// the two are not fighting over the same main thread.

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

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
    const from = glow ? { opacity: 0 } : { opacity: 0, y: 10 };
    const to = glow
        ? { opacity: [0, "var(--b5-peak)", "var(--b5-glow)"] }
        : { opacity: 1, y: 0 };

    // Up on the same eased-out curve as the card, then a slower fall back to the
    // resting level — the settle is the half that has to feel unhurried.
    const bloom = {
        duration: 1.6,
        times: [0, 0.45, 1],
        ease: [EASE, [0.33, 0, 0.35, 1]],
        delay,
    };

    return (
        <motion.div
            aria-hidden={glow || undefined}
            className={className}
            initial={from}
            animate={to}
            transition={
                still
                    ? { duration: 0.2 }
                    : glow
                      ? bloom
                      : { duration: 0.7, ease: EASE, delay }
            }
        >
            {children}
        </motion.div>
    );
}
