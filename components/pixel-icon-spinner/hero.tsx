"use client";

import "./hero-icon.css";

interface PixelIconSpinnerHeroProps {
  className?: string;
}

export function PixelIconSpinnerHero({ className }: PixelIconSpinnerHeroProps) {
  return (
    <div className={`pixel-spinner-hero ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerHero;
