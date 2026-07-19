import WebDesignCard from "@/components/bento-4/web-design-card"
import FutureForwardCard from "@/components/bento-4/future-forward-card"
import CleanCodeCard from "@/components/bento-4/clean-code-card"
import AccelerateCard from "@/components/bento-4/accelerate-card"
import DottedFrame from "@/components/bento-4/dotted-frame"
import IconHolo from "@/components/bento-4/icon-holo"

// Premium bento — the wide Web Design hero sits over the Clean Code + Accelerate
// pair on the left; Future Forward (tall) anchors the right. The row stretches so
// both sides share one height. Entrance is a subtle staggered rise.
const rise = "animate-brand-item motion-reduce:!animate-none motion-reduce:!opacity-100"

// `b4-card` scopes the hover: it brightens the dashed frame (see dotted-frame)
// and is what each <IconHolo /> looks up to find its card's icon. Every card
// gets its own IconHolo so hovering one never recolours the others.
const card = `relative b4-card ${rise}`

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white p-8 dark:bg-zinc-950">
            <div className="flex items-stretch gap-9">
                {/* Left column: wide hero over a pair of medium cards */}
                <div className="flex w-[665px] max-w-full flex-col gap-9">
                    <div className={card} style={{ animationDelay: "0ms" }}>
                        <DottedFrame />
                        <IconHolo />
                        <WebDesignCard />
                    </div>
                    <div className="flex min-h-0 flex-1 gap-9">
                        <div className={`${card} flex-1`} style={{ animationDelay: "120ms" }}>
                            <DottedFrame />
                            <IconHolo />
                            <CleanCodeCard />
                        </div>
                        <div className={`${card} flex-1`} style={{ animationDelay: "180ms" }}>
                            <DottedFrame />
                            <IconHolo />
                            <AccelerateCard />
                        </div>
                    </div>
                </div>

                {/* Right: tall anchor, matched to the left column height */}
                <div className={`${card} w-[348px]`} style={{ animationDelay: "60ms" }}>
                    <DottedFrame />
                    <IconHolo />
                    <FutureForwardCard />
                </div>
            </div>
        </main>
    )
}
