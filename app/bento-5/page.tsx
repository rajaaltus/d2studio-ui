// The block itself lives in registry/default/components/bento-05.tsx — one copy,
// the one that ships — and this route is just a place to look at it. The runways
// either side are a screen of nothing, so the section's ambilight has somewhere
// to switch on and off; they are scaffolding, not part of the block.

import MetallicShimmer from "@/registry/default/components/metallic-shimmer";
import Bento05 from "@/registry/default/components/bento-05";

function Runway({ label }: { label: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#fafafa] dark:bg-black">
      <MetallicShimmer className="text-xs tracking-[0.2em] uppercase">
        {label}
      </MetallicShimmer>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Runway label="Scroll down ↓" />
      <main className="flex min-h-screen items-center justify-center">
        <Bento05 />
      </main>
      <Runway label="Scroll up ↑" />
    </>
  );
}
