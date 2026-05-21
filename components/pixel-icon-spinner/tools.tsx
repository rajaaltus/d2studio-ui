"use client";

import "./tools.css";

interface PixelIconSpinnerToolsProps {
  className?: string;
}

export function PixelIconSpinnerTools({ className }: PixelIconSpinnerToolsProps) {
  return (
    <div className={`pixel-spinner-tools ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerTools;
