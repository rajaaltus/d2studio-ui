"use client";

import * as React from "react";
import "./pricing.css";

interface PixelIconSpinnerPricingProps {
  className?: string;
  color?: string;
}

export function PixelIconSpinnerPricing({ className, color }: PixelIconSpinnerPricingProps) {
  const style = color ? ({ "--color": color } as React.CSSProperties) : undefined;
  return (
    <div className={`pixel-spinner-pricing ${className ?? ""}`.trim()} style={style}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerPricing;
