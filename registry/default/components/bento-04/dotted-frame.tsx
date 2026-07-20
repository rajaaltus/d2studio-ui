"use client"

// Dashed blueprint frame — 1px dashed lines (dash 4 / gap 4) 8px outside the
// parent on all sides. Parent must be `relative`.
//
// Each line runs the full svg span and overshoots the frame box by OVER on both
// ends, so perpendicular lines cross into a `+` at every corner instead of
// stopping short of each other.
//
// Each side is gradiented independently along its own length, symmetric about
// its midpoint: brightest at the center, fading out only across the overshoot
// tails so the corners themselves stay lit.
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

const OVER = 26

// One dash period (4 + 4). Shifting the offset by exactly this loops seamlessly.
const PERIOD = 8
const CYCLE = 0.6

// Themed in bento-04.css (.b4-card): dark mode fades up from near-black, light
// mode fades down from near-white, so the dashes stay a whisper against the
// page either way instead of a hard outline.
const STOPS: [string, string][] = [
    ["0%", "var(--b4-dash-tail)"],
    ["6%", "var(--b4-dash-mid)"],
    ["50%", "var(--b4-dash-peak)"],
    ["94%", "var(--b4-dash-mid)"],
    ["100%", "var(--b4-dash-tail)"],
]

// Lines span 0→100% of the (overshot) svg; `transform` pulls the far edges back
// in by OVER, since SVG attributes can't express `100% - 14px`.
const LINES = [
    { k: "top", x1: "0", y1: OVER, x2: "100%", y2: OVER, g: "h", t: undefined },
    { k: "bottom", x1: "0", y1: "100%", x2: "100%", y2: "100%", g: "h", t: `translate(0,${-OVER})` },
    { k: "left", x1: OVER, y1: "0", x2: OVER, y2: "100%", g: "v", t: undefined },
    { k: "right", x1: "100%", y1: "0", x2: "100%", y2: "100%", g: "v", t: `translate(${-OVER},0)` },
] as const

// `id` must be unique per card: the gradients are userSpaceOnUse, so a shared id
// would make every frame resolve against the first card's box.
export default function DottedFrame({ id }: { id: string }) {
    const h = `${id}-h`
    const v = `${id}-v`
    const root = useRef<SVGSVGElement>(null)

    // Marching dashes on hover: horizontals run right, verticals run up. Both
    // lines of a pair are drawn in the same direction (h: left→right, v:
    // top→bottom), so one signed offset per axis is enough.
    useGSAP(
        () => {
            const card = root.current?.closest(".b4-card")
            if (!card) return

            const march = (axis: string, to: number) =>
                gsap.to(root.current!.querySelectorAll(`[data-axis="${axis}"]`), {
                    strokeDashoffset: to,
                    duration: CYCLE,
                    ease: "none",
                    repeat: -1,
                    paused: true,
                })

            // Two tweens, not one timeline: they only ever run together, and a
            // shared repeat would still need per-axis targets anyway.
            const tweens = [march("h", -PERIOD), march("v", PERIOD)]
            const enter = () => tweens.forEach((t) => t.play())
            // Pause, not kill — resuming mid-cycle avoids a snap on re-hover.
            const leave = () => tweens.forEach((t) => t.pause())
            card.addEventListener("pointerenter", enter)
            card.addEventListener("pointerleave", leave)
            return () => {
                card.removeEventListener("pointerenter", enter)
                card.removeEventListener("pointerleave", leave)
            }
        },
        { scope: root },
    )

    return (
        <svg
            ref={root}
            aria-hidden
            className="pointer-events-none absolute -left-[34px] -top-[34px] h-[calc(100%+68px)] w-[calc(100%+68px)] overflow-visible opacity-70 transition-opacity duration-500 [.b4-card:hover_&]:opacity-100"
        >
            <defs>
                <linearGradient id={h} gradientUnits="userSpaceOnUse" x1="0%" y1="0" x2="100%" y2="0">
                    {STOPS.map(([o, c]) => (
                        <stop key={o} offset={o} stopColor={c} />
                    ))}
                </linearGradient>
                <linearGradient id={v} gradientUnits="userSpaceOnUse" x1="0" y1="0%" x2="0" y2="100%">
                    {STOPS.map(([o, c]) => (
                        <stop key={o} offset={o} stopColor={c} />
                    ))}
                </linearGradient>
            </defs>
            {LINES.map((l) => (
                <line
                    key={l.k}
                    data-axis={l.g}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    transform={l.t}
                    stroke={`url(#${l.g === "h" ? h : v})`}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    strokeLinecap="butt"
                />
            ))}
        </svg>
    )
}
