"use client";

import React from "react";

const WORDMARK_CLASSES =
  "block w-full text-center font-sans font-bold leading-[0.85] tracking-[-0.05em] text-[clamp(5.625rem,24.375vw,18.75rem)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]";

const COLOR_GRADIENT =
  "linear-gradient(270deg, #56DAFF 0%, #A8FF80 18%, #FFF4A3 35%, #FF9CC8 55%, #C28AFF 75%, #56DAFF 100%)";

export function FooterIllustrationCard2() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = React.useState(false);
  const [flashKey, setFlashKey] = React.useState<number | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--reveal-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--reveal-y", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setFlashKey(Date.now());
  };

  return (
    <section
      aria-hidden="true"
      className="max-w-6xl w-full border-x mx-auto overflow-hidden select-none"
    >
      <div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full flex items-end justify-center px-4 pt-8"
        style={
          {
            "--reveal-x": "50%",
            "--reveal-y": "50%",
          } as React.CSSProperties
        }
      >
        {/* Base: dim wordmark */}
        <span
          className={`${WORDMARK_CLASSES} bg-gradient-to-b from-foreground/25 via-foreground/10 to-transparent`}
        >
          D2 STUDIO
        </span>

        {/* Flash: particle-line burst triggered on mouse-leave, fades fast */}
        {flashKey !== null && (
          <span
            key={flashKey}
            className="pointer-events-none absolute inset-0 flex items-end justify-center px-4 pt-8 mix-blend-color-dodge"
            style={{
              WebkitMaskImage:
                "repeating-linear-gradient(0deg, transparent 0, black 0.21px, black 1.46px, transparent 1.67px, transparent 6.683px)",
              maskImage:
                "repeating-linear-gradient(0deg, transparent 0, black 0.21px, black 1.46px, transparent 1.67px, transparent 6.683px)",
            }}
          >
            <span
              className={`${WORDMARK_CLASSES} animate-d2-flash`}
              style={{
                backgroundImage: COLOR_GRADIENT,
                backgroundSize: "300% 100%",
              }}
            >
              D2 STUDIO
            </span>
          </span>
        )}

        {/* Hover overlay: solid blue fill revealed by spotlight */}
        <span
          className="pointer-events-none absolute inset-0 flex items-end justify-center px-4 pt-8 mix-blend-screen transition-opacity duration-300"
          style={{
            opacity: hovering ? 0.35 : 0,
            WebkitMaskImage:
              "radial-gradient(circle 220px at var(--reveal-x) var(--reveal-y), black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            maskImage:
              "radial-gradient(circle 220px at var(--reveal-x) var(--reveal-y), black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
          }}
        >
          <span
            className={WORDMARK_CLASSES}
            style={{
              backgroundImage:
                "linear-gradient(135deg, #7DCFFF 0%, #56DAFF 50%, #B8E5FF 100%)",
            }}
          >
            D2 STUDIO
          </span>
        </span>

        {/* Hover overlay: colorful wordmark with stripe mask, revealed by cursor spotlight */}
        <span
          className="pointer-events-none absolute inset-0 flex items-end justify-center px-4 pt-8 mix-blend-hard-light transition-opacity duration-300"
          style={{
            opacity: hovering ? 0.9 : 0,
            WebkitMaskImage:
              "repeating-linear-gradient(0deg, transparent 0, black 0.21px, black 1.46px, transparent 1.67px, transparent 6.683px), radial-gradient(circle 220px at var(--reveal-x) var(--reveal-y), black 0%, black 45%, rgba(0,0,0,0.6) 70%, transparent 100%), radial-gradient(ellipse 75% 90% at center, black 35%, transparent 100%)",
            maskImage:
              "repeating-linear-gradient(0deg, transparent 0, black 0.21px, black 1.46px, transparent 1.67px, transparent 6.683px), radial-gradient(circle 220px at var(--reveal-x) var(--reveal-y), black 0%, black 45%, rgba(0,0,0,0.6) 70%, transparent 100%), radial-gradient(ellipse 75% 90% at center, black 35%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          <span
            className={WORDMARK_CLASSES}
            style={{
              backgroundImage: COLOR_GRADIENT,
              WebkitMaskImage: "none",
              maskImage: "none",
            }}
          >
            D2 STUDIO
          </span>
        </span>
      </div>
    </section>
  );
}
