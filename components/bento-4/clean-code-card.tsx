// Clean Code — converted from the Figma SVG export to a real React component.
// Vector text is now selectable HTML; the code icon and syntax-highlighted
// snippet are the only genuinely-graphical bits. This card's typography is the
// reference for the whole bento: gradient heading + #7B7B7B body.

export default function CleanCodeCard() {
    return (
        <div className="relative flex h-full min-h-[230px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--b4-border)] bg-[var(--b4-surface)] p-5">
            <div className="flex items-start justify-between gap-4">
                {/* Code-window icon tile */}
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--b4-border)] bg-[var(--b4-tile)]">
                    {/* 22-unit square viewBox centred on the glyph (bbox 38–58 x,
                        57–73 y). The old 30×22 box was non-square, so `meet` shrank
                        the whole icon — and its stroke — to 0.8×. */}
                    <svg width="24" height="24" viewBox="37 54 22 22" fill="none" aria-hidden>
                        <path
                            d="M54 69L58 65L54 61M42 61L38 65L42 69M50.5 57L45.5 73"
                            stroke="#41A4D2"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Faint syntax-highlighted snippet */}
                <pre
                    aria-hidden
                    className="mt-1 select-none overflow-hidden font-mono text-[10px] leading-[1.7] opacity-75"
                >
                    <code>
                        <span className="text-[#6B7280]">import </span>
                        <span className="text-[#6B7280]">{"{ "}</span>
                        <span className="text-[#34D399]">ClassValue, clsx</span>
                        <span className="text-[#6B7280]">{" }"}</span>
                        <span className="text-[#6B7280]"> from </span>
                        <span className="text-[#FCD34D]">&quot;clsx&quot;</span>
                        {"\n"}
                        <span className="text-[#6B7280]">import </span>
                        <span className="text-[#6B7280]">{"{ "}</span>
                        <span className="text-[#34D399]">twMerge</span>
                        <span className="text-[#6B7280]">{" }"}</span>
                        <span className="text-[#6B7280]"> from </span>
                        <span className="text-[#FCD34D]">&quot;tailwind-merge&quot;</span>
                        {"\n"}
                        <span className="text-[#F87171]">export </span>
                        <span className="text-[#6B7280]">{"{ "}</span>
                        <span className="text-[#34D399]">twMerge</span>
                        <span className="text-[#6B7280]">{" }"}</span>
                        <span className="text-[#6B7280]"> from </span>
                        <span className="text-[#FCD34D]">&quot;tailwind-merge&quot;</span>
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
