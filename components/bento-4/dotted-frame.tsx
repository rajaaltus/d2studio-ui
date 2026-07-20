// Dashed blueprint frame — 1px dashed lines (dash 4 / gap 4) 8px outside the
// parent on all sides. Parent must be `relative`.
//
// Each side is gradiented independently along its own length, symmetric about
// its midpoint: brightest at the center of the edge, fading to near-black at
// both ends. Every edge gets the same bright center regardless of its length.
const STOPS: [string, string][] = [
    ["0%", "#1C1919"],
    ["25%", "#4A4444"],
    ["50%", "#8A8181"],
    ["75%", "#4A4444"],
    ["100%", "#1C1919"],
]

const LINES = [
    { k: "top", x1: "0", y1: "0", x2: "100%", y2: "0", g: "h" },
    { k: "bottom", x1: "0", y1: "100%", x2: "100%", y2: "100%", g: "h" },
    { k: "left", x1: "0", y1: "0", x2: "0", y2: "100%", g: "v" },
    { k: "right", x1: "100%", y1: "0", x2: "100%", y2: "100%", g: "v" },
] as const

// `id` must be unique per card: the gradients are userSpaceOnUse, so a shared id
// would make every frame resolve against the first card's box.
export default function DottedFrame({ id }: { id: string }) {
    const h = `${id}-h`
    const v = `${id}-v`
    return (
        <svg
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-2 h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-visible opacity-70 transition-opacity duration-500 [.b4-card:hover_&]:opacity-100"
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
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke={`url(#${l.g === "h" ? h : v})`}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    strokeLinecap="butt"
                />
            ))}
        </svg>
    )
}
