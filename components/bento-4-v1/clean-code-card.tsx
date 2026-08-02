// Clean Code — converted from the Figma SVG export to a real React component.
// Vector text is now selectable HTML; the code icon and syntax-highlighted
// snippet are the only genuinely-graphical bits. This card's typography is the
// reference for the whole bento: gradient heading + #7B7B7B body.

import { Fragment, type CSSProperties } from "react"

// The snippet as data — each line a list of [text, colour] tokens. Rendered
// twice per line: a grey copy that's always there, and a colour copy stacked
// on top that types across it on hover. Data rather than JSX so the two copies
// can't drift apart, and so the step counts below stay honest if the code
// changes.
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

const CHAR_MS = 11
// The reveal is stepped per character, so the cadence only stays even if each
// line's step count matches its real length.
const lineCh = (i: number) => LINES[i].reduce((n, [text]) => n + text.length, 0)

// Lines type in sequence: each starts where the previous one finished.
const typeStyle = (i: number): CSSProperties => {
    let delay = 0
    for (let n = 0; n < i; n++) delay += lineCh(n) * CHAR_MS
    return {
        "--b4-type-dur": `${lineCh(i) * CHAR_MS}ms`,
        "--b4-type-steps": `steps(${lineCh(i)}, end)`,
        "--b4-type-delay": `${delay}ms`,
        "--b4-caret-delay": `${delay + lineCh(i) * CHAR_MS}ms`,
    } as CSSProperties
}

const tokens = (line: [string, string][]) =>
    line.map(([text, color], i) => (
        <span key={i} style={{ color }}>
            {text}
        </span>
    ))

export default function CleanCodeCard() {
    return (
        <div className="group relative flex h-full min-h-[230px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--b4-border)] bg-[var(--b4-surface)] p-5">
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
                    className="mt-1 select-none overflow-hidden font-mono text-[10px] leading-[1.7] opacity-75 transition-opacity duration-200 ease-out group-hover:opacity-100"
                >
                    <code>
                        {/* Grey copy is always there; the colour copy on top types
                            across it on hover, one line after the other. */}
                        {LINES.map((line, i) => (
                            <Fragment key={i}>
                                {i > 0 && "\n"}
                                <span
                                    className={`b4-type${i === LINES.length - 1 ? " b4-type-last" : ""}`}
                                    style={typeStyle(i)}
                                >
                                    <span className="b4-type-base">{tokens(line)}</span>
                                    <span className="b4-type-text">{tokens(line)}</span>
                                </span>
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
