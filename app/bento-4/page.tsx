// The section itself lives in components/bento-4/bento-4.tsx so it can be
// dropped into any page; this route is just a place to look at it.

import Bento4 from "@/components/bento-4/bento-4"

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white p-8 dark:bg-zinc-950">
            <Bento4 />
        </main>
    )
}
