import type { ReactNode } from "react"
import SrcC1 from "./src-c-1"
import SrcC2 from "./src-c-2"
import SrcC3 from "./src-c-3"
import SrcC4 from "./src-c-4"
import Globe from "./globe"
import { GLYPH_16, GLYPH_16_AT, GLYPH_AI } from "./glyphs"

// The cards are the Figma exports as-is: each SVG already paints its own glass
// fill and 16px gradient border, so a cell is just a clip + a covering SVG.
// Real shadows are four falloffs, not one: a tight contact line where the card
// meets the page, then progressively softer and more offset layers as the light
// wraps. A single big blur reads as a sticker.
const shadow = [
    "shadow-[0_1px_1px_rgba(0,0,0,0.10),0_4px_8px_-2px_rgba(0,0,0,0.10),0_14px_28px_-8px_rgba(0,0,0,0.14),0_36px_64px_-20px_rgba(0,0,0,0.20)]",
    "dark:shadow-[0_1px_1px_rgba(0,0,0,0.45),0_4px_8px_-2px_rgba(0,0,0,0.40),0_14px_28px_-8px_rgba(0,0,0,0.50),0_36px_64px_-20px_rgba(0,0,0,0.65)]",
].join(" ")

// 24px to match the Figma frame radius; the SVGs carry the same 24 on their own
// base rect, clip and border stroke, so the clip and the artwork agree.
const cell = `absolute inset-0 overflow-hidden rounded-3xl ${shadow}`
const fill = {
    className: "absolute inset-0 h-full w-full",
    preserveAspectRatio: "xMidYMid slice",
} as const

// Ambilight: the card's own artwork, blown out and blurred behind it, so the
// spill is sampled from the card instead of guessed — a card with a hot
// gradient throws a bright halo, a flat one barely glows. Screen on dark keeps
// only the light; multiply on the pale page leaves a tinted aura instead of a
// grey smudge. Blur is wide enough that the four halos pool across the section.
function Glow({ children }: { children: ReactNode }) {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 opacity-45 mix-blend-multiply blur-[72px] saturate-150 dark:opacity-50 dark:mix-blend-screen"
        >
            {children}
        </div>
    )
}

// "16+"/"AI" repainted opaque over the export's glass, per the Figma frames:
// F7F7F7 -> DFDFDF -> C3C3C3 with a 2px #FAFAFA rim. The ramp runs to 1.25 of
// the glyph, not 1 — Figma's handle ends well below the baseline (y=210 on a
// 169-tall glyph), so the letters only ever reach the middle of it and bottom
// out at a light grey.
//
// The rim goes under the fill (paintOrder) because the AI path is a union of
// overlapping subpaths — the A's crossbar is a full rectangle buried in its
// legs — so a plain stroke outlines every internal seam and the letter comes
// apart. Painted first, the fill covers the seams and only the outer half of
// the stroke survives, so 4 draws a 2px rim.
//
// slice, like the card art, so it stays welded to the glyph the SVG underneath
// already drew once the card crops.
function Glyph({
    d,
    id,
    transform,
    opacity,
}: {
    d: string
    id: string
    transform?: string
    opacity?: number
}) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 672 313"
            preserveAspectRatio="xMidYMid slice"
            opacity={opacity}
            className="pointer-events-none absolute inset-0 h-full w-full"
        >
            <defs>
                <linearGradient id={id} x1={0} y1={0} x2={0} y2={1.25}>
                    <stop offset="0%" stopColor="#F7F7F7" />
                    <stop offset="50%" stopColor="#DFDFDF" />
                    <stop offset="100%" stopColor="#C3C3C3" />
                </linearGradient>
                {/* The letters dissolve into the card's dark bottom rather than
                    ending on an edge. A mask, not a darker fill, because the rim
                    has to go with them — and bbox units, so the same ramp fits
                    either glyph. The rect overhangs the box because the rim is
                    painted outside it, and anything the rect misses is masked
                    away: at 1x1 it shaves the rim off the top of every letter. */}
                <linearGradient
                    id={`${id}-fade`}
                    gradientUnits="userSpaceOnUse"
                    x1={0}
                    y1={0.35}
                    x2={0}
                    y2={0.95}
                >
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
                <mask id={`${id}-mask`} maskContentUnits="objectBoundingBox">
                    <rect x={-0.2} y={-0.2} width={1.4} height={1.4} fill={`url(#${id}-fade)`} />
                </mask>
            </defs>
            <path
                d={d}
                transform={transform}
                fill={`url(#${id})`}
                stroke="#FAFAFA"
                strokeWidth={4}
                paintOrder="stroke"
                mask={`url(#${id}-mask)`}
            />
        </svg>
    )
}

// Copy sits on dark artwork in both themes, so it stays light; the scrim keeps
// it legible where the gradients bloom.
function CardCopy({
    title,
    sub,
    className = "",
}: {
    title: string
    sub: string
    className?: string
}) {
    return (
        <div className={`absolute inset-x-0 z-10 flex flex-col gap-1.5 p-5 sm:p-6 lg:p-7 ${className}`}>
            <h3 className="text-balance text-base font-semibold tracking-tight text-white sm:text-lg">
                {title}
            </h3>
            <p className="max-w-[46ch] text-pretty text-xs leading-relaxed text-white/65 sm:text-sm">
                {sub}
            </p>
        </div>
    )
}

// The 48px pattern tile is just a 6px cell repeated 8×8: a diamond, a 1×3
// vertical dash and a 3×1 horizontal dash. Drawn as a mask (alpha only) so the
// ink follows the theme instead of shipping a light and a dark copy.
const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="#000"><path d="M5 1h1v3H5z"/><path d="M1 5h3v1H1z"/><path d="M3 2H4V3H3V4H2V3H1V2H2V1H3V2Z"/></svg>'
)}")`

// Clear over the content, solid past it.
const VIGNETTE =
    "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 25%, #000 90%)"

const scrimTop =
    "pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/55 to-transparent"
const scrimBottom =
    "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"

export default function Page() {
    return (
        <main className="relative flex min-h-screen items-center justify-center bg-[#fafafa] px-5 py-12 sm:p-10 dark:bg-black">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[#1C1F21]/15 dark:bg-white/15"
                style={{
                    maskImage: patternUrl,
                    WebkitMaskImage: patternUrl,
                    maskSize: "6px 6px",
                    WebkitMaskSize: "6px 6px",
                }}
            />
            {/* The pattern stays at full strength under the content; a page-coloured
                scrim, held off the centre by a radial mask, sinks it to a whisper
                everywhere else. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[#fafafa]/80 dark:bg-black/80"
                style={{
                    maskImage: VIGNETTE,
                    WebkitMaskImage: VIGNETTE,
                }}
            />
            <div className="relative flex w-full flex-col items-center gap-10 sm:gap-14">
                <header className="max-w-2xl text-center">
                    <h2 className="bg-gradient-to-b from-[#18181B] to-[#71717A] bg-clip-text text-3xl font-semibold tracking-tight text-balance text-transparent sm:text-4xl dark:from-[#F9FAFB] dark:to-[#949495]">
                        An AI-native studio, engineered to ship
                    </h2>
                    <p className="mt-3 text-pretty text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
                        D2 Studio pairs a real design system with applied AI and a typed,
                        realtime backend, so an idea reaches production in weeks and stays
                        cheap to change after launch.
                    </p>
                </header>

                {/* The 1049px Figma reference scaled up 15% (1206px); the gutter
                    follows on the spacing scale, 36 -> 40px, rather than the exact
                    41px the ratio asks for. At lg the two wide cards stack in
                    column one and the tall pair spans both rows; below that it
                    folds to two columns, then one. The SVGs cover, so the tall
                    cards just crop. */}
                <div className="grid w-full max-w-[1206px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[672fr_314fr_314fr] lg:gap-10">
                    <div className="relative aspect-[672/313] sm:col-span-2 lg:col-span-1">
                        <Glow>
                            <SrcC1 {...fill} />
                        </Glow>
                        <div className={cell}>
                            <SrcC1 {...fill} />
                            <Glyph d={GLYPH_16} id="glyph-16" transform={GLYPH_16_AT} opacity={0.70} />
                            <div className={scrimBottom} />
                            <CardCopy
                                className="bottom-0"
                                title="16+ AI products in production"
                                sub="Copilots, retrieval search and agent workflows shipped end to end, from the first Figma frame to the deploy that carries real traffic."
                            />
                        </div>
                    </div>

                    <div className="relative aspect-[4/5] sm:aspect-[314/654] lg:row-span-2 lg:aspect-auto">
                        <Glow>
                            <SrcC3 {...fill} />
                        </Glow>
                        <div className={cell}>
                            <SrcC3 {...fill} />
                            <div className={scrimTop} />
                            <CardCopy
                                className="top-0"
                                title="Global by default"
                                sub="Realtime Convex data on the edge, so every region reads in milliseconds."
                            />
                            {/* Oversized, so the card is a window onto the sphere;
                                pushed half a card-width right, so the window lands
                                on the left limb rather than the middle. ml is a %
                                of the card, unlike translate which is a % of the
                                (much wider) globe box. Down a quarter of the card
                                via top, not mt: percentage margins resolve against
                                the container's width even vertically. */}
                            <div className="pointer-events-none absolute top-3/4 left-1/2 ml-[50%] aspect-square w-[248%] -translate-x-1/2 -translate-y-1/2">
                                <Globe className="h-full w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-[4/5] sm:aspect-[314/654] lg:row-span-2 lg:aspect-auto">
                        <Glow>
                            <SrcC4 {...fill} />
                        </Glow>
                        <div className={cell}>
                            <SrcC4 {...fill} />
                            <div className={scrimTop} />
                            <CardCopy
                                className="top-0"
                                title="Zero to production, fast"
                                sub="Design system, typed API and CI wired up on day one."
                            />
                        </div>
                    </div>

                    <div className="relative aspect-[672/313] sm:col-span-2 lg:col-span-1">
                        <Glow>
                            <SrcC2 {...fill} />
                        </Glow>
                        <div className={cell}>
                            <SrcC2 {...fill} />
                            <Glyph d={GLYPH_AI} id="glyph-ai" />
                            <div className={scrimBottom} />
                            <CardCopy
                                className="bottom-0"
                                title="AI woven through the stack"
                                sub="Model routing, evals and guardrails built into the product from day one, not bolted on once it is already live."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
