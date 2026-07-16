import WebDesignCard from "@/components/bento-4/web-design-card"
import FutureForwardCard from "@/components/bento-4/future-forward-card"
import CleanCodeCard from "@/components/bento-4/clean-code-card"
import AccelerateCard from "@/components/bento-4/accelerate-card"

// Premium bento — the wide Web Design hero sits over the Clean Code + Accelerate
// pair on the left; Future Forward (tall) anchors the right. The row stretches so
// both sides share one height. Entrance is a subtle staggered rise.
const rise = "animate-brand-item motion-reduce:!animate-none motion-reduce:!opacity-100"

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white p-8 dark:bg-zinc-950">
            <div className="flex w-full max-w-[1024px] items-stretch justify-center gap-5">
                {/* Left column: wide hero over a pair of medium cards */}
                <div className="flex w-[665px] max-w-full flex-col gap-5">
                    <div className={rise} style={{ animationDelay: "0ms" }}>
                        <WebDesignCard />
                    </div>
                    <div className="flex min-h-0 flex-1 gap-5">
                        <div className={`flex-1 ${rise}`} style={{ animationDelay: "120ms" }}>
                            <CleanCodeCard />
                        </div>
                        <div className={`flex-1 ${rise}`} style={{ animationDelay: "180ms" }}>
                            <AccelerateCard />
                        </div>
                    </div>
                </div>

                {/* Right: tall anchor, matched to the left column height */}
                <div className={`${rise} flex`} style={{ animationDelay: "60ms" }}>
                    <div className="flex-1">
                        <FutureForwardCard />
                    </div>
                </div>
            </div>
        </main>
    )
}
