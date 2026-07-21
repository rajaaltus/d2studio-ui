"use client"

// Chromatic icon hover for the bento-4 cards. Renders one private gradient per
// card; the card wrapper points its icons at it via --b4-holo (globals.css),
// and GSAP blooms the stops from the resting blue out to the D2 holographic
// palette on hover.
//
// Only `stop-color` is animated here. `stroke` stays pinned to this gradient —
// a paint server (`url(#…)`) is not an interpolatable value, so swapping stroke
// between two paints snaps no matter what drives it.

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { onCardHover } from "@/components/bento-4/card-hover"

gsap.registerPlugin(useGSAP)

const BASE = "#41A4D2"
const BRAND = ["#56DAFF", "#A8FF80", "#FFF4A3", "#FF9CC8", "#C28AFF", "#56DAFF"]
const OFFSETS = ["0%", "22%", "42%", "62%", "82%", "100%"]

const DURATION = 0.35
const STAGGER = 0.035

export default function IconHolo({ id }: { id: string }) {
    const root = useRef<SVGSVGElement>(null)

    useGSAP(
        () => {
            const card = root.current?.closest(".b4-card")
            if (!card) return

            // One paused timeline played forwards on enter and reversed on
            // leave, so the bloom retreats the way it arrived and an
            // interrupted hover rewinds from wherever it got to.
            const stops = root.current!.querySelectorAll("stop")
            const tl = gsap.timeline({ paused: true })
            stops.forEach((stop, i) => {
                tl.to(stop, { attr: { "stop-color": BRAND[i] }, duration: DURATION, ease: "power2.inOut" }, i * STAGGER)
            })

            return onCardHover(
                card,
                () => tl.play(),
                () => tl.reverse(),
            )
        },
        { scope: root },
    )

    return (
        <svg ref={root} aria-hidden width="0" height="0" className="absolute">
            <defs>
                <linearGradient id={id} className="b4-holo" x1="0" y1="0" x2="1" y2="1">
                    {OFFSETS.map((o) => (
                        <stop key={o} offset={o} stopColor={BASE} />
                    ))}
                </linearGradient>
            </defs>
        </svg>
    )
}
