import * as React from "react";

type Rain3SpinnerProps = {
  className?: string;
  "aria-label"?: string;
};

export function Rain3Spinner({
  className,
  "aria-label": ariaLabel = "Loading",
}: Rain3SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={"rain-3" + (className ? ` ${className}` : "")}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}
