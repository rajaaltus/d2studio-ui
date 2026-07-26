"use client";

// Ambilight: the card's own artwork, blown out and blurred behind it, so the
// spill is sampled from the card instead of guessed — a card with a hot
// gradient throws a bright halo, a flat one barely glows. Screen on dark keeps
// only the light; multiply on the pale page leaves a tinted aura instead of a
// grey smudge. Blur is wide enough that the four halos pool across the section.
// It switches on when the section is on screen and off when it leaves — see
// load-in.tsx. The lit opacity is a variable so the animation has something
// theme-aware to land on; the class no longer sets it directly.
//
// will-change is pinned rather than left to Motion, which sets it for the length
// of an animation and drops it after. Dropping it de-promotes the layer, and
// re-rastering a 72px blur over saturated card art — four of them, two of which
// are card-height — is not a frame's worth of work: measured, that de-promotion
// was the section's worst frame at 170ms, and pinning it takes the whole pass to
// 24ms with no dropped frames. The blur radius is not the problem; at 24px it
// still cost 145ms. This is the case will-change is for — a layer whose opacity
// animates every time the reader passes — and the cost is the GPU memory for
// four promoted layers, held for the life of the page.
// ponytail: pinned on all four. If the memory ever matters, render the glow's
// source at a fraction of its size and scale it up — nothing under 72px of
// detail survives the blur anyway.
//
// A client component so the art below can be code-split. LoadIn returns null
// below lg, so GlowArt never renders there and its chunk is never requested.

import dynamic from "next/dynamic";

import LoadIn from "./load-in";
import type { Card } from "./glow-art";

const GlowArt = dynamic(() => import("./glow-art"), { ssr: false });

export default function Glow({ card, delay }: { card: Card; delay: number }) {
  return (
    <LoadIn
      glow
      delay={delay}
      className="pointer-events-none absolute -inset-10 mix-blend-multiply blur-[72px] saturate-150 will-change-[opacity] [--b5-glow:0.45] dark:mix-blend-screen dark:[--b5-glow:0.5]"
    >
      <GlowArt card={card} />
    </LoadIn>
  );
}
