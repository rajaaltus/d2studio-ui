// Frozen v1 snapshot of the Bento 4 section; this route is just a place to look at it.

import Bento4V1 from "@/components/bento-4-v1/bento-4"

export default function Page() {
    return (
        // overflow-x-clip: the dashed frames overhang each card by 34px, which
        // would otherwise widen the page on narrow screens.
        <main className="flex min-h-screen items-center justify-center overflow-x-clip bg-white px-6 py-12 sm:p-8 dark:bg-zinc-950">
            <Bento4V1 />
        </main>
    )
}
