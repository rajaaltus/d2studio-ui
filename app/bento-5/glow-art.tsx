"use client";

// The ambilight's copy of the card art, on its own so it can be left behind.
//
// The glow only ever exists above lg, but as children of <Glow> these were
// rendered on the server and serialised into the flight payload regardless — a
// second copy of all four exports, about half the document, which every phone
// downloaded and parsed in order to render none of it. Behind the ssr:false
// dynamic() in glow.tsx it is a chunk the desktop fetches after hydration and
// the phone never asks for.

import SrcC1 from "./src-c-1";
import SrcC2 from "./src-c-2";
import SrcC3 from "./src-c-3";
import SrcC4 from "./src-c-4";

const ART = { 1: SrcC1, 2: SrcC2, 3: SrcC3, 4: SrcC4 };

export type Card = keyof typeof ART;

export default function GlowArt({ card }: { card: Card }) {
  const Art = ART[card];
  return (
    <Art
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    />
  );
}
