"use client";

import "./bento.css";

interface PixelIconSpinnerBentoProps {
  className?: string;
}

export function PixelIconSpinnerBento({ className }: PixelIconSpinnerBentoProps) {
  return (
    <div className={`pixel-spinner-bento ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerBento;
