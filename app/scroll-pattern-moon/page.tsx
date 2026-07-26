"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PixelSpinner } from "@/components/pixel-spinner";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Copied from components/spinners/spinner-morph.tsx — the wedge texture and
 * its scrub-bound parallax, isolated so the scroll effect is the only thing
 * on the page. */
const DOT_PATTERN: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(ellipse farthest-corner at 6.25px 6.25px, var(--pattern-fg), var(--pattern-fg) 50%, transparent 50%)",
  backgroundSize: "6.25px 6.25px",
};

const GUIDE_LINES = [
  { x1: "50%", y1: "0", x2: "50%", y2: "100%" },
  { x1: "0", y1: "50%", x2: "100%", y2: "50%" },
];

const CENTER_SPINNER = {
  pattern: {
    rows: 3,
    cols: 3,
    interval: 170,
    frames: [
      [4],
      [4],
      [1, 3, 4, 5, 7],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [1, 3, 4, 5, 7],
      [4],
    ],
  },
  gradient: { from: "#f6d365", to: "#fda085", glow: "#fda085" },
  glow: 0.25,
} as const;

export default function ScrollPatternMoonPage() {
  const stageRef = React.useRef<HTMLDivElement>(null);

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
      <div className="flex h-[70vh] items-end justify-center pb-16 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Scroll
      </div>

      <div className="luminous-spinners relative overflow-hidden border-y">
        <div
          ref={stageRef}
          className="relative min-h-[70vh] overflow-hidden bg-[#f0f0f0] dark:bg-background"
        >
          <div
            aria-hidden="true"
            data-dot-layer
            className="pointer-events-none absolute -inset-y-44 inset-x-0"
            style={DOT_PATTERN}
          />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {GUIDE_LINES.map((l, i) => (
              <line
                key={`halo-${i}`}
                {...l}
                className="text-[#f0f0f0] dark:text-background"
                stroke="currentColor"
                strokeWidth="6"
              />
            ))}
            {GUIDE_LINES.map((l, i) => (
              <line
                key={`trace-${i}`}
                {...l}
                className="text-black/20 dark:text-white/15"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-[48px] bg-[#f0f0f0] p-1 dark:bg-background">
              <div className="chip-body relative flex h-[240px] w-[240px] items-center justify-center">
                {[
                  { top: 18, left: 18 },
                  { top: 18, right: 18 },
                  { bottom: 18, left: 18 },
                  { bottom: 18, right: 18 },
                ].map((pos, i) => (
                  <span
                    key={`stud-${i}`}
                    aria-hidden="true"
                    className="chip-stud pointer-events-none absolute h-2 w-2 rounded-full"
                    style={pos}
                  />
                ))}

                <div className="chip-panel flex h-[176px] w-[176px] items-center justify-center">
                  <PixelSpinner
                    pattern={CENTER_SPINNER.pattern}
                    color="violet"
                    gradient={CENTER_SPINNER.gradient}
                    glow={CENTER_SPINNER.glow}
                    cellSize={21}
                    gap={8}
                    shape="square"
                    effect="none"
                    pop
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[120vh]" />
    </main>
  );
}
