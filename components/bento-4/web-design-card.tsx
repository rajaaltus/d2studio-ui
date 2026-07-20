// Web Design & Development card — faithful to the Figma reference (665×266).
// Left: blue code-window icon tile, gradient title, muted subtitle.
// Right: a clipped "screen" panel — a horizontal gold→blue gradient wash under
// 6 faint gradient columns, a cream→blue centered label, and gold "12"/"H"
// annotation marks. Static, pixel-positioned to match the export.

const ACCENT = "#41A4D2"

// 6 vertical column strips inside the inner panel (x offset 9, pitch 55, width 43).
const COLS = [9, 64, 119, 174, 229, 284]

export default function WebDesignCard() {
    return (
        <div className="relative h-[266px] w-full max-w-full overflow-hidden rounded-2xl bg-[var(--b4-surface)]">
            {/* Outline as a top-most overlay, not a `border` on the card itself:
                the screen panel below overhangs the card's right and bottom
                edges, and a real border paints *under* children — it vanished
                exactly there. */}
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border border-[var(--b4-border)]" />

            {/* Left column */}
            <div className="absolute left-5 top-[55px] w-[250px]">
                {/* Code-window icon tile */}
                <div className="grid h-14 w-14 place-items-center rounded-full border border-[var(--b4-border)] bg-[var(--b4-tile)]">
                    {/* Shared metric across the four cards: ~21px glyph, ~2.1px
                        stroke. This one is authored at 18 units and fills its box
                        edge to edge, so it's drawn at 21 (scale 1.167) and 1.9
                        lands the stroke on 2.2. */}
                    <svg width="21" height="21" viewBox="0 0 18 18" fill="none" aria-hidden>
                        <path
                            d="M7 6.5L5 9L7 11.5M11 6.5L13 9L11 11.5M2 0H16C17.1046 0 18 0.8954 18 2V16C18 17.1046 17.1046 18 16 18H2C0.8954 18 0 17.1046 0 16V2C0 0.8954 0.8954 0 2 0Z"
                            stroke={ACCENT}
                            strokeWidth={1.9}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h3 className="mt-[17px] bg-gradient-to-b from-[var(--b4-title-from)] to-[var(--b4-title-to)] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                    Web Design &amp; Development
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--b4-body)]">
                    We create visually appealing and functional websites that
                    captivate your audience and drive results.
                </p>
            </div>

            {/* Right "screen" panel — clipped at the card's bottom edge */}
            <div className="absolute left-[291px] top-[50px] h-[272px] w-[354px] rounded-xl bg-[var(--b4-scr-bezel)] ring-1 ring-inset ring-[var(--b4-scr-line)]">
                {/* "12" dimension mark: gold H-line whose verticals sit on the column stripes (inner-x 52/64) */}
                <div className="absolute -top-[9px] left-[60px]">
                    <span className="relative block h-[18px] w-[12px]">
                        <span className="absolute inset-y-0 left-0 w-px bg-[var(--b4-mark)] opacity-80" />
                        <span className="absolute inset-y-0 right-0 w-px bg-[var(--b4-mark)] opacity-80" />
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--b4-mark)] opacity-80" />
                    </span>
                    <span
                        className="absolute -top-[15px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium leading-none"
                        style={{ color: "var(--b4-mark)" }}
                    >
                        12
                    </span>
                </div>

                {/* Inner recessed panel */}
                <div className="absolute inset-2 overflow-hidden rounded-lg bg-[var(--b4-scr-inner)] ring-1 ring-inset ring-[var(--b4-scr-line)]">
                    {/* Horizontal gold → blue gradient wash (under the columns) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "var(--b4-scr-wash)",
                            opacity: "var(--b4-scr-wash-opacity)",
                        }}
                    />

                    {/* Faint gradient columns */}
                    {COLS.map((x) => (
                        <div
                            key={x}
                            className="absolute top-0 h-full w-[43px] border-x"
                            style={{
                                left: x,
                                borderColor: "rgba(255,255,255,0.06)",
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.022))",
                            }}
                        />
                    ))}

                    {/* Centered label */}
                    <p className="absolute left-1/2 top-[44%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--b4-scr-text-from)] to-[var(--b4-scr-text-to)] bg-clip-text text-center text-[15px] font-medium text-transparent opacity-90">
                        Website that delivers a unique
                    </p>
                </div>
            </div>
        </div>
    )
}
