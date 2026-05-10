"use client";

import { useMemo } from "react";
import "./chevron-icon.css";

const MASK = [10, 11, 19, 20, 28, 29, 36, 37, 43, 44, 50, 51];
const TOTAL = 64;

interface PixelIconChevronProps {
  className?: string;
}

export function PixelIconChevron({ className }: PixelIconChevronProps) {
  const mask = useMemo(() => new Set(MASK), []);

  const cells = [];
  for (let i = 0; i < TOTAL; i++) {
    const on = mask.has(i);
    cells.push(
      <div
        key={i}
        className={on ? `px on px-${i}` : "px"}
      />,
    );
  }

  return (
    <div
      className={`pixel-icon pixel-icon--chevron-right-outline-18 ${className ?? ""}`.trim()}
    >
      {cells}
    </div>
  );
}

export default PixelIconChevron;
