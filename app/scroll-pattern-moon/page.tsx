"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Wedge texture from components/spinners/spinner-morph.tsx, scaled up. */
const TILE = 8;
const DOT_PATTERN: React.CSSProperties = {
  backgroundImage: `radial-gradient(ellipse farthest-corner at ${TILE}px ${TILE}px, var(--pattern-fg), var(--pattern-fg) 50%, transparent 50%)`,
  backgroundSize: `${TILE}px ${TILE}px`,
};

export default function ScrollPatternMoonPage() {
  const stageRef = React.useRef<HTMLDivElement>(null);

  /* Scrub-bound parallax on the texture layer — copied from SpinnerMorph. */
  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const dots = stage.querySelector<HTMLDivElement>("[data-dot-layer]");
      if (!dots) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        dots,
        { yPercent: -22, scale: 1.06 },
        {
          yPercent: 22,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.25,
          },
        }
      );
    },
    { scope: stageRef }
  );

  return (
    <main className="bg-background">
      <style>{css}</style>

      <div className="h-[30vh]" />

      <div
        ref={stageRef}
        className="relative min-h-[85vh] overflow-hidden border-y bg-background"
      >
        {/* Texture is clipped to the rectangle the four rules describe, so the
            outer margins stay clean. Clipping sits on the static parent — the
            child is what parallaxes. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] inset-y-[14%] overflow-hidden"
        >
          <div
            data-dot-layer
            className="absolute inset-x-0 -inset-y-44"
            style={DOT_PATTERN}
          />
        </div>

        {/* Four rules — the framing grid. */}
        <div className="pointer-events-none absolute inset-y-0 left-[12%] w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-[12%] w-px bg-border" />
        <div className="pointer-events-none absolute inset-x-0 top-[14%] h-px bg-border" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[14%] h-px bg-border" />

        {/* Centered square. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="spm-square grid size-40 place-items-center rounded-2xl">
            <span className="spm-shimmer-text text-sm font-medium tracking-tight">
              Scroll me
            </span>
          </div>
        </div>
      </div>

      {/* Dummy bento — scroll fodder below the stage. */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 py-24 sm:grid-cols-2">
        {BENTO.map((card) => (
          <div
            key={card.kicker}
            className={`rounded-xl border bg-card p-6 ${card.span}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {card.kicker}
            </p>
            <h3 className="mt-3 text-lg font-medium tracking-tight">
              {card.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {card.body}
            </p>
            <div className="mt-6 h-24 rounded-lg border border-dashed" />
          </div>
        ))}
      </div>

      <div className="h-[30vh]" />
    </main>
  );
}

const BENTO = [
  {
    kicker: "One",
    title: "Placeholder card",
    body: "Dummy copy so the grid has something to render.",
    span: "sm:col-span-2",
  },
  {
    kicker: "Two",
    title: "Placeholder card",
    body: "Dummy copy so the grid has something to render.",
    span: "",
  },
  {
    kicker: "Three",
    title: "Placeholder card",
    body: "Dummy copy so the grid has something to render.",
    span: "",
  },
  {
    kicker: "Four",
    title: "Placeholder card",
    body: "Dummy copy so the grid has something to render.",
    span: "sm:col-span-2",
  },
];

const css = `
.spm-square {
  background: #111111;
  box-shadow: inset -2px 2px 2px 2px rgba(0, 0, 0, .4);
}

.spm-shimmer-text {
  background-image: linear-gradient(105deg, #6b6b6b 0%, #ffebc6 53%, #6b6b6b 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer-text 3.2s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .spm-shimmer-text { animation: none; }
  .spm-shimmer-text { color: #cfcfcf; background-image: none; }
}
`;
