// Bento 4 — the whole section as one drop-in component: heading, the four
// cards, their dashed frames and icon bloom.
//
// The wide Web Design hero sits over the Clean Code + Accelerate pair on the
// left; Future Forward (tall) anchors the right. The row stretches so both
// sides share one height. Entrance is a subtle staggered rise.
//
// Heading is overridable so the section can be reused with different copy;
// pass `heading={null}` to drop it and use your own.

import WebDesignCard from "@/components/bento-4/web-design-card"
import FutureForwardCard from "@/components/bento-4/future-forward-card"
import CleanCodeCard from "@/components/bento-4/clean-code-card"
import AccelerateCard from "@/components/bento-4/accelerate-card"
import DottedFrame from "@/components/bento-4/dotted-frame"
import IconHolo from "@/components/bento-4/icon-holo"

const rise = "animate-brand-item motion-reduce:!animate-none motion-reduce:!opacity-100"

// `b4-card` scopes the hover: it brightens the dashed frame (see dotted-frame)
// and blooms the icon (see globals.css). Each card carries its own gradient id
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

            {/* Three shapes out of one flat grid — the hero, the medium pair and
                the tall anchor are siblings so each breakpoint can place them
                independently. Nesting the hero and the pair in a left column (the
                obvious reading of the lg layout) is what makes the tablet
                arrangement impossible: the pair could never sit beside the anchor
                while the hero spanned the row above it.

                  <sm   one column, everything stacked.
                  sm    two columns. Hero spans both; below it the pair stacks
                        single-file on the left with the anchor beside it at its
                        native 348 — otherwise the anchor is a narrow card
                        stranded under two full-width rows, and widening it is no
                        answer since its art scales with width and would double
                        the card's height.
                  lg    665 + 36 + 348 = 1049, the reference width. Hero back over
                        the pair, which goes two-across, and the anchor spans both
                        rows down the right.

                The cards keep their design at every size — only their
                illustrations shift/bleed. */}
            <div className="grid w-full max-w-[1049px] gap-9 sm:grid-cols-[minmax(0,1fr)_348px]">
                <div
                    {...cardProps("holo-web", 0)}
                    className={`${card} sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1`}
                >
                    <DottedFrame id="holo-web" />
                    <IconHolo id="holo-web" />
                    <WebDesignCard />
                </div>

                {/* The medium pair. Single-file until lg, where the left column is
                    finally wide enough to seat them side by side. */}
                <div className="grid min-h-0 min-w-0 gap-9 sm:col-start-1 lg:row-start-2 lg:grid-cols-2">
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

                {/* Tall anchor. At lg it spans both rows and the stretch crops its
                    svg to the left column's height; at sm it shares row 2 with the
                    pair; stacked, it stands at its own full height, centred. */}
                <div
                    {...cardProps("holo-future", 60)}
                    className={`${card} mx-auto w-full max-w-[348px] sm:col-start-2 sm:row-start-2 lg:row-start-1 lg:row-span-2`}
                >
                    <DottedFrame id="holo-future" />
                    <IconHolo id="holo-future" />
                    <FutureForwardCard />
                </div>
            </div>
        </div>
    )
}
