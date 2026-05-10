"use client";

import "./spinner-icon.css";

interface PixelIconSpinnerProps {
  className?: string;
}

export function PixelIconSpinner({ className }: PixelIconSpinnerProps) {
  return (
    <div className={`pixel-spinner ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinner;
