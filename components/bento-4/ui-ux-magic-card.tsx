// UI/UX Magic — converted from the Figma SVG export. Text is real HTML (card4
// type style); the Figma-mark glyph on the right stays as a faithful inline SVG
// (exact shapes, gradients and blur glow from the export).

export default function UiUxMagicCard() {
    return (
        <div className="relative flex h-full min-h-[311px] w-full flex-col justify-center overflow-hidden rounded-2xl border border-[#342F2F] bg-[#151313] p-6">
            {/* Figma mark (right) */}
            <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 383 311"
                fill="none"
                preserveAspectRatio="xMaxYMid meet"
            >
                <g filter="url(#c3glow)">
                    <ellipse cx={280.982} cy={131} rx={101} ry={68.5} fill="url(#c3p3)" fillOpacity={0.25} />
                </g>
                <path
                    d="M290.5 34H255.25C235.782 34 220 49.67 220 69C220 88.33 235.782 104 255.25 104M290.5 34V104M290.5 34H325.75C345.218 34 361 49.67 361 69C361 88.33 345.218 104 325.75 104M290.5 104H255.25M290.5 104H325.75M290.5 104V174M255.25 104C235.782 104 220 119.67 220 139C220 158.33 235.782 174 255.25 174M325.75 104C306.282 104 290.5 119.67 290.5 139C290.5 158.33 306.282 174 325.75 174C345.218 174 361 158.33 361 139C361 119.67 345.218 104 325.75 104ZM290.5 174H255.25M290.5 174V209C290.5 228.33 274.718 244 255.25 244C235.782 244 220 228.33 220 209C220 189.67 235.782 174 255.25 174"
                    stroke="url(#c3p2)"
                    strokeOpacity={0.15}
                    strokeWidth={4}
                />
                <path d="M300 44H325.491C339.561 44 350.982 55.4215 350.982 69.4911C350.982 83.5607 339.561 94.9822 325.491 94.9822H300V44Z" fill="#FF7262" fillOpacity={0.3} />
                <path d="M230 68.4911C230 54.4215 241.422 43 255.491 43H280.982V94.0089H255.491C241.422 94.0089 230 82.5874 230 68.5178V68.4911Z" fill="#F24E1E" fillOpacity={0.3} />
                <path d="M230 139.491C230 125.421 241.422 114 255.491 114H280.982V165.009H255.491C241.422 165.009 230 153.587 230 139.518V139.491Z" fill="#A259FF" fillOpacity={0.3} />
                <path d="M351.25 139.491C351.25 153.561 339.828 164.982 325.759 164.982C311.689 164.982 300 153.561 300 139.491C300 125.421 311.422 114 325.491 114C339.561 114 350.982 125.421 350.982 139.491H351.25Z" fill="#1ABCFE" fillOpacity={0.3} />
                <path d="M255.491 232.982C269.561 232.982 280.982 221.561 280.982 207.491V182H255.491C241.422 182 230 193.422 230 207.491C230 221.561 241.422 232.982 255.491 232.982Z" fill="#0ACF83" fillOpacity={0.3} />
                <defs>
                    <filter id="c3glow" x={99.98} y={-17.5} width={362} height={297} filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation={40} />
                    </filter>
                    <linearGradient id="c3p2" x1={290.5} y1={34} x2={290.5} y2={244} gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E4DBFF" />
                        <stop offset={1} stopColor="#2F0CBA" />
                    </linearGradient>
                    <linearGradient id="c3p3" x1={381.98} y1={131} x2={179.98} y2={131} gradientUnits="userSpaceOnUse">
                        <stop stopColor="#307BBC" />
                        <stop offset={1} stopColor="#7D5608" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Pen-tool icon tile */}
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#342F2F] bg-[#1E1E1F]">
                <svg width="24" height="24" viewBox="37 37 22 22" fill="none" aria-hidden>
                    <path
                        d="M54 49L52.625 42.126C52.5876 41.939 52.4975 41.7666 52.3653 41.6291C52.2331 41.4916 52.0644 41.3947 51.879 41.35L39.235 38.028C39.0684 37.9877 38.8943 37.9909 38.7293 38.0373C38.5644 38.0837 38.4141 38.1717 38.2929 38.2929C38.1717 38.4141 38.0837 38.5644 38.0373 38.7293C37.9909 38.8943 37.9877 39.0684 38.028 39.235L41.35 51.879C41.3947 52.0644 41.4916 52.2331 41.6291 52.3653C41.7666 52.4975 41.939 52.5876 42.126 52.625L49 54M38.3 38.3L45.586 45.586M51.707 57.293C51.5195 57.4805 51.2652 57.5858 51 57.5858C50.7348 57.5858 50.4805 57.4805 50.293 57.293L48.707 55.707C48.5195 55.5195 48.4142 55.2652 48.4142 55C48.4142 54.7348 48.5195 54.4805 48.707 54.293L54.293 48.707C54.4805 48.5195 54.7348 48.4142 55 48.4142C55.2652 48.4142 55.5195 48.5195 55.707 48.707L57.293 50.293C57.4805 50.4805 57.5858 50.7348 57.5858 51C57.5858 51.2652 57.4805 51.5195 57.293 51.707L51.707 57.293ZM49 47C49 48.1046 48.1046 49 47 49C45.8954 49 45 48.1046 45 47C45 45.8954 45.8954 45 47 45C48.1046 45 49 45.8954 49 47Z"
                        stroke="#41A4D2"
                        strokeOpacity={0.7}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h3 className="relative mt-5 bg-gradient-to-b from-[#F9FAFB] to-[#949495] bg-clip-text text-[18px] font-semibold leading-tight text-transparent">
                UI/UX Magic
            </h3>
            <p className="relative mt-2 max-w-[160px] text-[13px] leading-relaxed text-[#7B7B7B]">
                Crafting Intuitive and Visually Stunning Interfaces
            </p>
        </div>
    )
}
