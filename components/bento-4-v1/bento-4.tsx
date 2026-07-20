// Bento 4 (v1 snapshot) — frozen copy of the section as one drop-in component: heading, the four
// cards, their dashed frames, icon bloom and per-card cursor.
//
// The wide Web Design hero sits over the Clean Code + Accelerate pair on the
// left; Future Forward (tall) anchors the right. The row stretches so both
// sides share one height. Entrance is a subtle staggered rise.
//
// Heading is overridable so the section can be reused with different copy;
// pass `heading={null}` to drop it and use your own.

import WebDesignCard from "@/components/bento-4-v1/web-design-card"
import FutureForwardCard from "@/components/bento-4-v1/future-forward-card"
import CleanCodeCard from "@/components/bento-4-v1/clean-code-card"
import AccelerateCard from "@/components/bento-4-v1/accelerate-card"
import DottedFrame from "@/components/bento-4-v1/dotted-frame"
import IconHolo from "@/components/bento-4-v1/icon-holo"
import DitherCursor from "@/components/bento-4-v1/dither-cursor"

const rise = "animate-brand-item motion-reduce:!animate-none motion-reduce:!opacity-100"

// `b4-card` scopes the hover: it brightens the dashed frame (see dotted-frame)
// and blooms the icon (see globals.css). Each card carries its own gradient id
// in --b4-holo, so hovering one never recolours the others.
const card = `relative b4-card ${rise}`

const cardProps = (id: string, delay: number) => ({
    className: card,
    style: { animationDelay: `${delay}ms`, "--b4-holo": `url(#${id})` } as React.CSSProperties,
})

export default function Bento4V1({
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

            <div className="flex items-stretch gap-9">
                {/* Left column: wide hero over a pair of medium cards */}
                <div className="flex w-[665px] max-w-full flex-col gap-9">
                    <div {...cardProps("v1-holo-web", 0)}>
                        <DottedFrame id="v1-holo-web" />
                        <IconHolo id="v1-holo-web" />
                        <WebDesignCard />
                        <DitherCursor seed="holo-web" />
                    </div>
                    <div className="flex min-h-0 flex-1 gap-9">
                        <div {...cardProps("v1-holo-clean", 120)} className={`${card} flex-1`}>
                            <DottedFrame id="v1-holo-clean" />
                            <IconHolo id="v1-holo-clean" />
                            <CleanCodeCard />
                            <DitherCursor seed="holo-clean" />
                        </div>
                        <div {...cardProps("v1-holo-accel", 180)} className={`${card} flex-1`}>
                            <DottedFrame id="v1-holo-accel" />
                            <IconHolo id="v1-holo-accel" />
                            <AccelerateCard />
                            <DitherCursor seed="holo-accel" />
                        </div>
                    </div>
                </div>

                {/* Right: tall anchor, matched to the left column height */}
                <div {...cardProps("v1-holo-future", 60)} className={`${card} w-[348px]`}>
                    <DottedFrame id="v1-holo-future" />
                    <IconHolo id="v1-holo-future" />
                    <FutureForwardCard />
                    <DitherCursor seed="holo-future" />
                </div>
            </div>
        </div>
    )
}
