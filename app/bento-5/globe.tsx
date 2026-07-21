"use client"

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
// Fixed 600px backing buffer, CSS-scaled by the wrapper: cobe sizes the sphere
// against the buffer, so letting it track the (small, responsive) element box
// shrinks the globe to a dot.

import createGlobe from "cobe"
import { useEffect, useRef } from "react"

const { sin, cos, min, max, PI } = Math

const THETA = 0.2

type Vec = [number, number, number]

// cobe's marker vector: lat/lng -> unit sphere, with lng offset by a half turn.
function world(lat: number, lng: number): Vec {
    const la = (lat * PI) / 180
    const lo = (lng * PI) / 180 - PI
    const cl = cos(la)
    return [-cl * cos(lo), sin(la), cl * sin(lo)]
}

const CITIES = [
    { city: "Bengaluru", stat: "9ms", size: 0.05, location: [12.9716, 77.5946] },
    { city: "Singapore", stat: "14ms", size: 0.04, location: [1.3521, 103.8198] },
    { city: "London", stat: "11ms", size: 0.05, location: [51.5072, -0.1276] },
    { city: "San Francisco", stat: "7ms", size: 0.05, location: [37.7749, -122.4194] },
    { city: "Sydney", stat: "16ms", size: 0.04, location: [-33.8688, 151.2093] },
].map((c) => ({ ...c, vec: world(c.location[0], c.location[1]) }))

// The shader rotates the view ray by mat3 L(theta, phi); applying the same
// rotation forward puts a world point in view space. The sphere fills 0.8 of the
// half-box, and z > 0 is the front hemisphere.
function project([wx, wy, wz]: Vec, phi: number) {
    const [ct, st, cp, sp] = [cos(THETA), sin(THETA), cos(phi), sin(phi)]
    return {
        x: cp * wx + sp * wz,
        y: sp * st * wx + ct * wy - cp * st * wz,
        z: -sp * ct * wx + st * wy + cp * ct * wz,
    }
}

export default function Globe({ className = "" }: { className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null)
    const labels = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return

        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let phi = 0

        const globe = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: 600,
            height: 600,
            phi: 0,
            theta: THETA,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 7,
            baseColor: [0.08, 0.1, 0.18],
            markerColor: [0.55, 0.62, 1],
            glowColor: [0.14, 0.18, 0.42],
            markers: CITIES.map(({ location, size }) => ({
                location: [location[0], location[1]],
                size,
            })),
            onRender: (state) => {
                state.phi = phi
                if (!still) phi += 0.004

                CITIES.forEach((c, i) => {
                    const el = labels.current[i]
                    if (!el) return
                    const { x, y, z } = project(c.vec, phi)
                    el.style.left = `${(x * 0.8 + 1) * 50}%`
                    el.style.top = `${(1 - y * 0.8) * 50}%`
                    // Fade across the limb instead of popping at z === 0, then
                    // drop the chip outside the slice of sphere the card actually
                    // shows: the wrapper is wider than the card and hangs past its
                    // bottom edge, so chips near either limb or low on the sphere
                    // would be cut in half.
                    const front = max(0, min(1, (z - 0.08) * 5))
                    el.style.opacity = `${x > 0.35 || x < -0.35 || y < -0.58 ? 0 : front}`
                })
            },
        })

        return () => globe.destroy()
    }, [])

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={ref}
                aria-hidden
                className="h-full w-full"
                style={{ mixBlendMode: "screen" }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {CITIES.map((c, i) => (
                    <div
                        key={c.city}
                        ref={(el) => {
                            labels.current[i] = el
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ opacity: 0 }}
                    >
                        <span className="block size-1.5 rounded-full bg-[#8FB7FF] shadow-[0_0_9px_2px_rgba(119,131,243,0.75)]" />
                        <span className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2 py-1 font-mono text-[11px] leading-none tracking-wide whitespace-nowrap text-white/90 uppercase backdrop-blur-md">
                            {c.city}
                            <span className="text-[#8FB7FF]">{c.stat}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
