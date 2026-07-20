// Dither cursor — the pointer becomes a dithered avatar while it's over a card.
// One per card, seeded off the card so each gets its own colour pair (the
// library derives hue from a hash of the seed).
//
// A multiplayer-style pointer: the brand-gradient arrow sits exactly on the
// pointer, with the avatar disc trailing just behind it on a spring. Binding a
// visual directly to mouse position feels artificial because it has no motion
// of its own — the spring gives the disc weight, while the arrow stays pinned
// so the real pointer position is never in doubt.

"use client"

import { useEffect, useRef, useState } from "react"
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "motion/react"
import { ditherAvatarDataUri, generateColors } from "dither-avatar"

// Enough follow-through to read as weight, not so much it feels broken.
const FOLLOW = { stiffness: 220, damping: 24, mass: 0.7 }

export default function DitherCursor({ seed, size = 44 }: { seed: string; size?: number }) {
    // Same pair the avatar is drawn from, so the arrow belongs to its disc
    // rather than reading as a second, unrelated element.
    const { fill, stroke } = generateColors(seed)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, FOLLOW)
    const springY = useSpring(y, FOLLOW)
    const [inside, setInside] = useState(false)
    const first = useRef(true)
    const reduce = useReducedMotion()

    // Reduced motion drops the trailing — the avatar sits on the pointer.
    const avatarX = reduce ? x : springX
    const avatarY = reduce ? y : springY

    // Full transform string rather than motion's x/y shorthand: the shorthand
    // runs on the main thread, so it drops frames exactly when the page is busy.
    const avatar = useMotionTemplate`translate3d(${avatarX}px, ${avatarY}px, 0)`
    const dot = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`

    // Listen on the card, not on this layer. The layer spans the whole card, so
    // if it took pointer events it would swallow every hover and click inside.
    const layer = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const card = layer.current?.parentElement
        if (!card || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

        const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            const px = e.clientX - r.left
            const py = e.clientY - r.top
            // On the first move, jump the spring to the pointer instead of
            // letting it fly in from the card's top-left corner.
            if (first.current) {
                first.current = false
                springX.jump(px)
                springY.jump(py)
            }
            x.set(px)
            y.set(py)
        }
        const enter = () => setInside(true)
        const leave = () => {
            setInside(false)
            first.current = true
        }

        const previousCursor = card.style.cursor
        card.style.cursor = "none"
        card.addEventListener("pointermove", move)
        card.addEventListener("pointerenter", enter)
        card.addEventListener("pointerleave", leave)
        return () => {
            card.style.cursor = previousCursor
            card.removeEventListener("pointermove", move)
            card.removeEventListener("pointerenter", enter)
            card.removeEventListener("pointerleave", leave)
        }
    }, [springX, springY, x, y])

    return (
        <div ref={layer} className="b4-cursor pointer-events-none absolute inset-0 z-20">
            {/* Trailing avatar disc, offset to sit behind the arrow's tail the
                way a name label does on a multiplayer cursor. Scale, not opacity
                alone — nothing in the real world appears from nothing. Exit is
                quicker than entry: the pointer has already gone. */}
            <motion.img
                src={ditherAvatarDataUri(seed)}
                alt=""
                width={size}
                height={size}
                aria-hidden
                style={{ transform: avatar, marginLeft: 14, marginTop: 18 }}
                className={`absolute left-0 top-0 rounded-full border-[3px] border-white transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    inside ? "scale-100 opacity-100" : "scale-90 opacity-0 duration-150"
                }`}
            />

            {/* The arrow itself, unsprung so it never lags the real pointer.
                Bright at the tip, deep at the tail. Gradient id is seeded —
                four of these share a page. */}
            <motion.svg
                width="18"
                height="22"
                viewBox="0 0 18 22"
                fill="none"
                aria-hidden
                style={{ transform: dot }}
                className={`absolute left-0 top-0 transition-[opacity,scale] duration-150 ease-out ${
                    inside ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
            >
                <path d="M1 1L17 15H8.5L1 21V1Z" fill={`url(#b4-cursor-${seed})`} />
                <linearGradient id={`b4-cursor-${seed}`} x1="1" y1="1" x2="17" y2="21">
                    <stop stopColor={stroke} />
                    <stop offset="1" stopColor={fill} />
                </linearGradient>
            </motion.svg>
        </div>
    )
}
