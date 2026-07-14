import {
    Atom,
    CodeXml,
    Figma,
    PenTool,
    Smartphone,
    Target,
    Zap,
    type LucideIcon,
} from "lucide-react"
import { type ReactNode } from "react"

// Faithful to src-bento-4.tsx: a "Service Overview" bento — 3-col grid where
// the intro card spans 2 cols and the "Future Forward" stack spans 2 rows.
// Each card carries a circular green icon tile (top-left) + title + copy, some
// with a decoration (tech-stack pills, Figma mark, code snippet, bolt). Static —
// no hover/pattern motion, matching the reference.

// D2 brand green — the accent from the reference (#4CD241).
const GREEN = "#4CD241"

type Card = {
    Icon: LucideIcon
    title: string
    description: string
    className?: string // grid spans
    decoration?: ReactNode
}

// Future Forward's tech-stack pills — labels verbatim from the reference.
// ponytail: text pills, not brand-logo SVGs (monochrome house rule + 9 logos
// isn't worth the extraction); say the word to swap in real logos.
const STACK = ["React", "Tailwind CSS", "Vercel", "Shift", "Angular", "Java", "Vs code", "Vue js", "Docker"]

function StackPills() {
    return (
        <div className="mt-6 flex flex-wrap gap-2">
            {STACK.map((t) => (
                <span
                    key={t}
                    className="rounded-lg border border-[oklch(0.9_0.004_286.3)] bg-[oklch(0.975_0_0)] px-2.5 py-1 text-xs text-[oklch(0.442_0.016_285.9)] dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
                >
                    {t}
                </span>
            ))}
        </div>
    )
}

function CodeSnippet() {
    return (
        <pre className="mt-6 overflow-hidden rounded-xl border border-[oklch(0.9_0.004_286.3)] bg-[oklch(0.975_0_0)] p-4 font-mono text-[11px] leading-relaxed text-[oklch(0.552_0.016_285.9)] dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500">
            {`import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export { twMerge } from "tailwind-merge";`}
        </pre>
    )
}

const cards: Card[] = [
    {
        Icon: CodeXml,
        title: "Web Design & Development",
        description: "We create visually appealing and functional websites that captivate your audience and drive results.",
        className: "lg:col-span-2",
    },
    {
        Icon: Atom,
        title: "Future Forward",
        description: "Pushing boundaries with emerging technologies",
        className: "lg:row-span-2",
        decoration: <StackPills />,
    },
    {
        Icon: Smartphone,
        title: "Innovative App Development",
        description: "Custom Mobile App Development for iOS and Android.",
    },
    {
        Icon: PenTool,
        title: "UI/UX Magic",
        description: "Crafting Intuitive and Visually Stunning Interfaces",
        decoration: (
            <Figma
                aria-hidden
                className="pointer-events-none absolute -right-4 bottom-0 h-28 w-28 opacity-[0.12]"
                style={{ color: GREEN }}
            />
        ),
    },
    {
        Icon: Target,
        title: "98% Success",
        description: "A skilled team dedicated to delivering quality results and exceeding client expectations",
    },
    {
        Icon: CodeXml,
        title: "Clean Code",
        description: "our expertise in advanced coding techniques, we ensure your digital projects are delivered on time and surpass your expectations",
        decoration: <CodeSnippet />,
    },
    {
        Icon: Zap,
        title: "Accelerate your project",
        description: "Bring your ideas to life faster with our rapid development services.",
        decoration: (
            <Zap
                aria-hidden
                className="pointer-events-none absolute -right-2 bottom-0 h-28 w-28 opacity-[0.12]"
                style={{ color: GREEN, fill: GREEN }}
            />
        ),
    },
]

function BentoCard({ Icon, title, description, className, decoration }: Card) {
    return (
        <div
            className={
                "relative flex h-full flex-col overflow-hidden rounded-2xl border border-[oklch(0.868_0.005_286.3)] bg-[oklch(0.972_0_0)] p-8 dark:border-white/10 dark:bg-zinc-900 " +
                (className ?? "")
            }
        >
            {/* Circular green icon tile */}
            <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: `${GREEN}1a`, boxShadow: `inset 0 0 0 1px ${GREEN}33` }}
            >
                <Icon className="h-5 w-5" style={{ color: GREEN }} strokeWidth={2} />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-[oklch(0.21_0.006_285.9)] dark:text-zinc-50">{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[oklch(0.552_0.016_285.9)] dark:text-zinc-400">
                {description}
            </p>

            {decoration}
        </div>
    )
}

const Bento4 = () => {
    return (
        <section className="w-full px-6 py-16 sm:px-8 md:py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        <span className="text-[oklch(0.552_0.016_285.9)] dark:text-zinc-400">Service </span>
                        <span style={{ color: GREEN }}>Overview</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base text-[oklch(0.552_0.016_285.9)] dark:text-zinc-400">
                        We take pride in building custom solutions that help founders turn their dreams reality!
                    </p>
                </div>

                {/* Bento grid — intro spans 2 cols, Future Forward spans 2 rows */}
                <div className="grid gap-4 lg:auto-rows-fr lg:grid-cols-3">
                    {cards.map((c) => (
                        <BentoCard key={c.title} {...c} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Bento4
