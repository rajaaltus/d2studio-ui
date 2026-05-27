"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import styles from "./d2-toggle-lite.module.css";

interface D2ToggleLiteProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}

export function D2ToggleLite({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
}: D2ToggleLiteProps) {
  const rawId = useId();
  const filterId = `d2tl-goo-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <label
      className={cn("inline-flex", styles.root, className)}
      aria-label={ariaLabel}
    >
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={styles.input}
        suppressHydrationWarning
      />
      <svg
        viewBox="0 0 292 142"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-hidden
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={10} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>

        <path
          d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
          className={styles.bg}
        />

        <g filter={`url(#${filterId})`} className={styles.thumbGroup}>
          <rect
            x={13}
            y={42}
            width={116}
            height={58}
            rx={29}
            className={styles.thumbCenter}
          />
          <rect
            x={14}
            y={14}
            width={114}
            height={114}
            rx={58}
            className={cn(styles.thumbSide, styles.thumbLeft)}
          />
          <rect
            x={164}
            y={14}
            width={114}
            height={114}
            rx={58}
            className={cn(styles.thumbSide, styles.thumbRight)}
          />
        </g>

        {/* Sun — sits over the left thumb position. */}
        <g
          className={styles.iconSun}
          transform="translate(46 47) scale(2)"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <circle cx={12} cy={12} r={4} />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </g>

        {/* Moon — sits over the right thumb position. */}
        <g
          className={styles.iconMoon}
          transform="translate(197 47) scale(2)"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </g>
      </svg>
    </label>
  );
}
