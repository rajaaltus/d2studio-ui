"use client";

// The ambilight's copy of the card art, on its own so it can be left behind.
//
// The glow only ever exists above lg, but as children of <Glow> these were
// rendered on the server and serialised into the flight payload regardless — a
// second copy of all four exports, about half the document, which every phone
// downloaded and parsed in order to render none of it. Behind the ssr:false
// dynamic() in glow.tsx it is a chunk the desktop fetches after hydration and
// the phone never asks for.

import CardArt1 from "./card-art-1";
import CardArt2 from "./card-art-2";
import CardArt3 from "./card-art-3";
import CardArt4 from "./card-art-4";

const ART = { 1: CardArt1, 2: CardArt2, 3: CardArt3, 4: CardArt4 };

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
