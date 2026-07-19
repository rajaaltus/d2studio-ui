"use client"

// Chromatic icon hover for the bento-4 cards. Drop one of these inside a
// `.b4-card` wrapper — it owns a private gradient, repaints that card's icon
// with it, and blooms the stops from the resting blue out to the D2
// holographic palette on hover.
//
// The stops are tweened rather than swapping `stroke` between two paints:
// `stroke: url(#id)` is not an interpolatable CSS value, so a CSS transition
// on it snaps instantly. Animating the gradient itself is what actually reads
// as smooth.

import { useId, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

const BASE = "#41A4D2"
const BRAND = ["#56DAFF", "#A8FF80", "#FFF4A3", "#FF9CC8", "#C28AFF", "#56DAFF"]

const OFFSETS = ["0%", "22%", "42%", "62%", "82%", "100%"]

export default function IconHolo() {
    const root = useRef<SVGSVGElement>(null)
    // useId emits colons, which are not valid in a url(#…) reference.
    const id = `holo-${useId().replace(/:/g, "")}`

    useGSAP(
        () => {
            const card = root.current?.closest(".b4-card")
            if (!card) return

            // Repaint via inline style, not the attribute — the [stroke="…"]
            // attribute selector is how every icon is found in the first place.
            const icons = card.querySelectorAll<SVGElement>(`[stroke="${BASE}"]`)
            icons.forEach((el) => {
                el.style.stroke = `url(#${id})`
            })

            const stops = root.current!.querySelectorAll("stop")
            const tl = gsap.timeline({ paused: true })
            stops.forEach((stop, i) => {
                tl.to(stop, { attr: { "stop-color": BRAND[i] }, duration: 0.5, ease: "power2.inOut" }, i * 0.05)
            })
            tl.to(icons, { filter: "drop-shadow(0 0 6px rgba(168,255,128,0.4))", duration: 0.4, ease: "power2.out" }, 0)

            const enter = () => tl.play()
            const leave = () => tl.reverse()
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
        <svg ref={root} aria-hidden width="0" height="0" className="absolute">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    {OFFSETS.map((o) => (
                        <stop key={o} offset={o} stopColor={BASE} />
                    ))}
                </linearGradient>
            </defs>
        </svg>
    )
}
