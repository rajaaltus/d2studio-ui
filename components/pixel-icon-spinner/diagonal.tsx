"use client";

import "./diagonal.css";

interface PixelIconSpinnerDiagonalProps {
  className?: string;
}

export function PixelIconSpinnerDiagonal({ className }: PixelIconSpinnerDiagonalProps) {
  return (
    <div className={`pixel-spinner-diagonal ${className ?? ""}`.trim()}>
      {[0, 2, 4, 6, 8].map((i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerDiagonal;
