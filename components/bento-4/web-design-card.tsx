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
        <div className="relative h-[266px] w-full max-w-full overflow-hidden rounded-2xl border border-[#342F2F] bg-[#151313]">
            {/* Left column */}
            <div className="absolute left-5 top-[55px] w-[250px]">
                {/* Code-window icon tile */}
                <div className="grid h-[55px] w-[55px] place-items-center rounded-full border border-[#342F2F] bg-[#1E1E1F]">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                        <path
                            d="M7 6.5L5 9L7 11.5M11 6.5L13 9L11 11.5M2 0H16C17.1046 0 18 0.8954 18 2V16C18 17.1046 17.1046 18 16 18H2C0.8954 18 0 17.1046 0 16V2C0 0.8954 0.8954 0 2 0Z"
                            transform="translate(4 4)"
                            stroke={ACCENT}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h3 className="mt-[17px] bg-gradient-to-b from-[#F9FAFB] to-[#949495] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                    Web Design &amp; Development
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#525252]">
                    We create visually appealing and functional websites that
                    captivate your audience and drive results.
                </p>
            </div>

            {/* Right "screen" panel — clipped at the card's bottom edge */}
            <div className="absolute left-[291px] top-[50px] h-[272px] w-[354px] rounded-xl bg-[#0A0A0A] ring-1 ring-inset ring-[#FFECEC]/15">
                {/* "12" dimension mark: gold H-line whose verticals sit on the column stripes (inner-x 52/64) */}
                <div className="absolute -top-[9px] left-[60px]">
                    <span className="relative block h-[18px] w-[12px]">
                        <span className="absolute inset-y-0 left-0 w-px bg-[#FFE7B2]/80" />
                        <span className="absolute inset-y-0 right-0 w-px bg-[#FFE7B2]/80" />
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#FFE7B2]/80" />
                    </span>
                    <span
                        className="absolute -top-[15px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium leading-none"
                        style={{ color: "#FFE7B2" }}
                    >
                        12
                    </span>
                </div>

                {/* Inner recessed panel */}
                <div className="absolute inset-2 overflow-hidden rounded-lg bg-[#5E5D60]/30 ring-1 ring-inset ring-[#FFF3F3]/15">
                    {/* Horizontal gold → blue gradient wash (under the columns) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(90deg, #7D5608, #307BBC)",
                            opacity: 0.3,
                        }}
                    />

                    {/* Faint gradient columns */}
                    {COLS.map((x) => (
                        <div
                            key={x}
                            className="absolute top-0 h-full w-[43px] border-x border-[#FFEFEF]/15"
                            style={{
                                left: x,
                                background:
                                    "linear-gradient(180deg, rgba(217,217,217,0.08), rgba(115,115,115,0.08))",
                            }}
                        />
                    ))}

                    {/* Centered label */}
                    <p className="absolute left-1/2 top-[44%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#FFF2DC] to-[#B6E1FF] bg-clip-text text-center text-[15px] font-medium text-transparent opacity-50">
                        Website that delivers a unique
                    </p>
                </div>
            </div>
        </div>
    )
}
