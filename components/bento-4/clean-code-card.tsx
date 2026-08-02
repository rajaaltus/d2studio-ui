"use client"

// Clean Code — converted from the Figma SVG export to a real React component.
// Vector text is now selectable HTML; the code icon and syntax-highlighted
// snippet are the only genuinely-graphical bits. This card's typography is the
// reference for the whole bento: gradient heading + #7B7B7B body.

import { Fragment, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { onCardHover } from "@/components/bento-4/card-hover"

gsap.registerPlugin(useGSAP, ScrambleTextPlugin)

// The snippet as data — each line a list of [text, colour] tokens. One copy in
// the DOM: it rests grey and, on hover, each token scrambles in place while its
// colour lands, so the snippet resolves from grey to syntax-coloured.
const LINES: [string, string][][] = [
    [
        ["import ", "#6B7280"],
        ["{ ", "#6B7280"],
        ["ClassValue, clsx", "#34D399"],
        [" }", "#6B7280"],
        [" from ", "#6B7280"],
        ['"clsx"', "#FCD34D"],
    ],
    [
        ["import ", "#6B7280"],
        ["{ ", "#6B7280"],
        ["twMerge", "#34D399"],
        [" }", "#6B7280"],
        [" from ", "#6B7280"],
        ['"tailwind-merge"', "#FCD34D"],
    ],
    [
        ["export ", "#F87171"],
        ["{ ", "#6B7280"],
        ["twMerge", "#34D399"],
        [" }", "#6B7280"],
        [" from ", "#6B7280"],
        ['"tailwind-merge"', "#FCD34D"],
    ],
]

const GREY = "#6B7280"
const SCRAMBLE = 0.16 // per token
const STAGGER = 0.015 // between tokens, in DOM order — reads as line-by-line

const tokens = (line: [string, string][]) =>
    line.map(([text, color], i) => (
        <span key={i} data-color={color} style={{ color: GREY }}>
            {text}
        </span>
    ))

export default function CleanCodeCard() {
    const root = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const card = root.current!
            const spans = card.querySelectorAll<HTMLSpanElement>("code span[data-color]")
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

            // Freeze the snippet box at its resting size so nothing reflows
            // while the tokens are scrambling.
            // Measured after fonts settle — a mono swap mid-load would otherwise
            // freeze the fallback's metrics.
            const pre = card.querySelector("pre")!
            document.fonts.ready.then(() => gsap.set(pre, { width: pre.offsetWidth, height: pre.offsetHeight }))

            // Paused timeline played on enter / reversed on leave, so an
            // interrupted hover rewinds from wherever it got to.
            const tl = gsap.timeline({ paused: true })
            spans.forEach((span, i) => {
                tl.to(
                    span,
                    {
                        color: span.dataset.color,
                        duration: reduce ? 0.2 : SCRAMBLE,
                        ease: "none",
                        ...(reduce
                            ? {}
                            : { scrambleText: { text: span.textContent!, chars: "01<>/{}", speed: 1 } }),
                    },
                    reduce ? 0 : i * STAGGER,
                )
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
        <div
            ref={root}
            className="group relative flex h-full min-h-[230px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--b4-border)] bg-[var(--b4-surface)] p-5"
        >
            <div className="flex items-start justify-between gap-4">
                {/* Code-window icon tile */}
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--b4-border)] bg-[var(--b4-tile)]">
                    {/* 22-unit square viewBox centred on the glyph (bbox 38–58 x,
                        57–73 y). The old 30×22 box was non-square, so `meet` shrank
                        the whole icon — and its stroke — to 0.8×. */}
                    <svg width="21.6" height="21.6" viewBox="37 54 22 22" fill="none" className="overflow-visible" aria-hidden>
                        <path
                            d="M54 69L58 65L54 61M42 61L38 65L42 69M50.5 57L45.5 73"
                            stroke="#41A4D2"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Faint syntax-highlighted snippet */}
                <pre
                    aria-hidden
                    className="mt-1 select-none overflow-hidden font-mono text-[10px] leading-[1.7] opacity-75 transition-opacity duration-200 ease-out group-hover:opacity-100 [.b4-card.b4-on_&]:opacity-100"
                >
                    <code>
                        {LINES.map((line, i) => (
                            <Fragment key={i}>
                                {i > 0 && "\n"}
                                <span className="inline-block whitespace-nowrap">{tokens(line)}</span>
                            </Fragment>
                        ))}
                    </code>
                </pre>
            </div>

            <h3 className="mt-[17px] bg-gradient-to-b from-[var(--b4-title-from)] to-[var(--b4-title-to)] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                Clean Code
            </h3>
            <p className="mt-2 max-w-[300px] text-[13px] leading-relaxed text-[var(--b4-body)]">
                our expertise in advanced coding techniques, we ensure your digital
                projects are delivered on time and surpass your expectations
            </p>
        </div>
    )
}
