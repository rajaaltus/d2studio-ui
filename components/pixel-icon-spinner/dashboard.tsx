"use client";

import "./dashboard.css";

interface PixelIconSpinnerDashboardProps {
  className?: string;
}

export function PixelIconSpinnerDashboard({ className }: PixelIconSpinnerDashboardProps) {
  return (
    <div className={`pixel-spinner-dashboard ${className ?? ""}`.trim()}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cell cell-${i}`} />
      ))}
    </div>
  );
}

export default PixelIconSpinnerDashboard;
