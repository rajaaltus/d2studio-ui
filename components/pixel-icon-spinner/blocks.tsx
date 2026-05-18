"use client";

import "./blocks.css";

interface PixelIconSpinnerBlocksProps {
  className?: string;
}

export function PixelIconSpinnerBlocks({ className }: PixelIconSpinnerBlocksProps) {
  return (
    <div className={`pixel-spinner-blocks ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerBlocks;
