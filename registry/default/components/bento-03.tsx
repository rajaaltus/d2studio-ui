"use client"

import {
    Blend,
    CodeXml,
    MoonStar,
    PackagePlus,
    WandSparkles,
    Zap,
    type LucideIcon,
} from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

// Hover motion, per Figma spec. The keycap's inner shadow flips inward-top-left
// (X1 Y1 b3 → X-1 Y-1 b2) while the grey icon cross-fades to the D2 gradient.
const EASE = [0.22, 1, 0.36, 1] as const
const DUR = 0.45

const tileShadow: Variants = {
    rest: { boxShadow: "inset 1px 1px 3px 0px rgba(114,114,114,0.5)" },
    hover: { boxShadow: "inset -1px -1px 2px 0px rgba(114,114,114,0.5)" },
}
const iconFade: Variants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
}

// Faithful to src-bento-3.tsx: a flat 3×2 feature grid on thin #E4E6EA rules —
// no cards, no fills. Each cell holds a rounded "keycap" icon tile (top-left),
// a sans-serif title, and a monospace description. On hover each icon
// cross-fades from grey to the D2 holographic gradient.

type Feature = {
    Icon: LucideIcon
    title: string
    description: string
}

const LINE = "border-[#E4E6EA] dark:border-white/[0.08]"

const features: Feature[] = [
    {
        Icon: CodeXml,
        title: "Copy & Paste",
        description: "No packages to install. just copy and paste components into your project.",
    },
    {
        Icon: MoonStar,
        title: "Beautifully Designed",
        description: "Modern minimal components designed with attention to details and usability.",
    },
    {
        Icon: PackagePlus,
        title: "Shadcn Compatible",
        description: "Built on Shadcn/ui conversions. Works seamlessly with your existing setup.",
    },
    {
        Icon: WandSparkles,
        title: "Production Ready",
        description: "Fully typed, accessible and optimized for performance out of the box.",
    },
    {
        Icon: Blend,
        title: "Open Source",
        description: "MIT licensed. Use it in personal and commercial projects without restrictions.",
    },
    {
        Icon: Zap,
        title: "Regular Updates",
        description: "New components added weekly. Stay up to date with the latest UI trends.",
    },
]

function Module({ Icon, title, description }: Feature) {
    const reduce = useReducedMotion()
    const transition = reduce ? { duration: 0 } : { duration: DUR, ease: EASE }

    return (
        <motion.div
            initial="rest"
            animate="rest"
            whileHover="hover"
            className="flex flex-col p-8 sm:p-10"
        >
            {/* Keycap icon tile — 48px, solid #F2F3F5 fill + thin border.
                Rest inner shadow: X1 Y1, blur 3, spread 0, #727272 @ 50%.
                Hover flips it inward-top-left: X-1 Y-1, blur 2 (same color). */}
            <motion.div
                variants={tileShadow}
                transition={transition}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[oklch(0.9_0.004_286.3)] bg-[#F2F3F5] shadow-[inset_1px_1px_3px_0px_rgba(114,114,114,0.5)] dark:border-white/10 dark:bg-zinc-800"
            >
                {/* Base icon: #D1D1D1 stroke (weight 2), genuinely recessed via the
                    SVG inner-shadow filter — X0 Y2 blur2 #000 @ 25% per spec. */}
                <Icon
                    className="col-start-1 row-start-1 h-5 w-5 text-[#D1D1D1] [filter:url(#bento3-inner-shadow)]"
                    strokeWidth={2}
                />
                {/* Hover overlay: same icon painted with the D2 holographic gradient,
                    cross-faded in via opacity so the swap animates smoothly. */}
                <motion.span
                    aria-hidden
                    variants={iconFade}
                    transition={transition}
                    className="col-start-1 row-start-1 grid place-items-center"
                >
                    <Icon
                        className="h-5 w-5 [stroke:url(#bento3-icon-gradient)]"
                        strokeWidth={2}
                    />
                </motion.span>
            </motion.div>

            <h3 className="mt-6 text-[15px] font-semibold text-[oklch(0.21_0.006_285.9)] dark:text-zinc-50">
                {title}
            </h3>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-[oklch(0.5_0.016_285.9)] dark:text-zinc-400">
                {description}
            </p>
        </motion.div>
    )
}

const Bento3 = () => {
    return (
        <section className="w-full px-6 py-16 sm:px-8 md:py-24">
            {/* Inner-shadow filter for the icons (X0 Y2 blur2 #000 @ 25%) */}
            <svg width="0" height="0" aria-hidden className="absolute">
                <defs>
                    {/* Hover: D2 holographic gradient painted on the icon stroke. */}
                    <linearGradient id="bento3-icon-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#50F2FA" />
                        <stop offset="50%" stopColor="#6BCEFD" />
                        <stop offset="100%" stopColor="#86AAFF" />
                    </linearGradient>
                    <filter
                        id="bento3-inner-shadow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feComponentTransfer in="SourceAlpha" result="inv">
                            <feFuncA type="table" tableValues="1 0" />
                        </feComponentTransfer>
                        <feGaussianBlur in="inv" stdDeviation="1" result="blur" />
                        <feOffset in="blur" dx="0" dy="2" result="off" />
                        <feFlood floodColor="#000000" floodOpacity="0.25" result="col" />
                        <feComposite in="col" in2="off" operator="in" result="sh" />
                        <feComposite in="sh" in2="SourceAlpha" operator="in" result="clipped" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode in="clipped" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[oklch(0.21_0.006_285.9)] sm:text-4xl dark:text-zinc-50">
                        Beautifully Designed Components
                    </h2>
                    <p className="mt-3 text-base text-[oklch(0.552_0.016_285.9)] dark:text-zinc-400">
                        A modern, minimal component library crafted with attention to detail and built for
                        real-world usability.
                    </p>
                </div>

                {/* Lined grid. The rules live on a separate overlay layer so the
                    horizontal edge-mask fades ONLY the lines, not the content.
                    Both layers share the same grid so the lines land on the cell
                    seams; equal rows (auto-rows-fr) keep the mid rule aligned. */}
                <div className="relative grid sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3">
                    {/* Line overlay — masked at the left/right edges */}
                    <div
                        aria-hidden
                        className={`pointer-events-none absolute inset-0 grid border-y sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3 ${LINE} [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]`}
                    >
                        {features.map((_, i) => (
                            <div
                                key={i}
                                className={`${i % 3 < 2 ? "lg:border-r" : ""} ${i >= 3 ? "lg:border-t" : ""} ${LINE}`}
                            />
                        ))}
                    </div>

                    {features.map((f, i) => (
                        <Module key={i} {...f} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Bento3
