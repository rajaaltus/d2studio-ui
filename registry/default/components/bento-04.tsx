// Bento 4 — the whole section as one drop-in component: heading, the four
// cards, their dashed frames and icon bloom.
//
// The wide Web Design hero sits over the Clean Code + Accelerate pair on the
// left; Future Forward (tall) anchors the right. The row stretches so both
// sides share one height. Entrance is a subtle staggered rise.
//
// Heading is overridable so the section can be reused with different copy;
// pass `heading={null}` to drop it and use your own.

import WebDesignCard from "./bento-04/web-design-card"
import FutureForwardCard from "./bento-04/future-forward-card"
import CleanCodeCard from "./bento-04/clean-code-card"
import AccelerateCard from "./bento-04/accelerate-card"
import DottedFrame from "./bento-04/dotted-frame"
import IconHolo from "./bento-04/icon-holo"
import "./bento-04/bento-04.css"

const rise = "b4-rise"

// `b4-card` scopes the hover: it brightens the dashed frame (see dotted-frame)
// and blooms the icon (see bento-04.css). Each card carries its own gradient id
// in --b4-holo, so hovering one never recolours the others.
const card = `relative b4-card ${rise}`

const cardProps = (id: string, delay: number) => ({
    className: card,
    style: { animationDelay: `${delay}ms`, "--b4-holo": `url(#${id})` } as React.CSSProperties,
})

export default function Bento4({
    heading = "Built for teams that ship",
    subheading = "Design, code and speed in one system, so every idea reaches production looking exactly the way you imagined it.",
    className = "",
}: {
    heading?: React.ReactNode
    subheading?: React.ReactNode
    className?: string
}) {
    return (
        <div className={`flex flex-col items-center gap-12 ${className}`}>
            {heading !== null && (
                <header className={`max-w-2xl text-center ${rise}`}>
                    {/* Same vertical clip-text gradient as the card titles, mirrored for light. */}
                    <h2 className="bg-gradient-to-b from-[#18181B] to-[#71717A] bg-clip-text text-4xl font-semibold tracking-tight text-transparent dark:from-[#F9FAFB] dark:to-[#949495]">
                        {heading}
                    </h2>
                    {subheading !== null && (
                        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">{subheading}</p>
                    )}
                </header>
            )}

            {/* One row at lg (665 + 36 + 348 = 1049, the reference width); below
                that the right card drops under the left column and the medium
                pair goes single-file at sm. The cards keep their design at every
                size — only their illustrations shift/bleed. */}
            <div className="grid w-full max-w-[1049px] gap-9 lg:grid-cols-[minmax(0,1fr)_348px]">
                {/* Left column: wide hero over a pair of medium cards */}
                <div className="flex min-w-0 flex-col gap-9">
                    <div {...cardProps("holo-web", 0)}>
                        <DottedFrame id="holo-web" />
                        <IconHolo id="holo-web" />
                        <WebDesignCard />
                    </div>
                    <div className="grid min-h-0 flex-1 gap-9 sm:grid-cols-2">
                        <div {...cardProps("holo-clean", 120)} className={card}>
                            <DottedFrame id="holo-clean" />
                            <IconHolo id="holo-clean" />
                            <CleanCodeCard />
                        </div>
                        <div {...cardProps("holo-accel", 180)} className={card}>
                            <DottedFrame id="holo-accel" />
                            <IconHolo id="holo-accel" />
                            <AccelerateCard />
                        </div>
                    </div>
                </div>

                {/* Right: tall anchor. At lg the grid row stretches it to the left
                    column's height (the svg crops); stacked, it stands at its own
                    full height, centred at the reference width. */}
                <div {...cardProps("holo-future", 60)} className={`${card} mx-auto w-full max-w-[348px]`}>
                    <DottedFrame id="holo-future" />
                    <IconHolo id="holo-future" />
                    <FutureForwardCard />
                </div>
            </div>
        </div>
    )
}
