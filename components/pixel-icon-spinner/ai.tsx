"use client";

import "./ai-icon.css";

interface PixelIconSpinnerAiProps {
  className?: string;
}

export function PixelIconSpinnerAi({ className }: PixelIconSpinnerAiProps) {
  return (
    <div className={`pixel-spinner-ai ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerAi;
