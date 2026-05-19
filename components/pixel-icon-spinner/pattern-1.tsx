"use client";

import "./pattern-1.css";

interface PixelIconSpinnerPattern1Props {
  className?: string;
}

export function PixelIconSpinnerPattern1({ className }: PixelIconSpinnerPattern1Props) {
  return (
    <div className={`pixel-spinner-pattern-1 ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerPattern1;
