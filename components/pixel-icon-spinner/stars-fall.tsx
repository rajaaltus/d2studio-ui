"use client";

import "./stars-fall.css";

interface PixelIconSpinnerStarsFallProps {
  className?: string;
}

export function PixelIconSpinnerStarsFall({ className }: PixelIconSpinnerStarsFallProps) {
  return (
    <div className={`pixel-spinner-stars-fall ${className ?? ""}`.trim()}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerStarsFall;
