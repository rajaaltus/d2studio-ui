import styles from "./chevron-right-icon.module.css";

const CELL_PEAK_FRAME: Record<number, number> = {
  40: 0, 100: 0,
  41: 1, 101: 1,
  53: 2, 54: 2, 67: 2, 79: 2, 89: 2, 90: 2,
  66: 3, 78: 3,
};

type ChevronRightIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  "aria-label"?: string;
};

export function ChevronRightIcon({
  className,
  "aria-label": ariaLabel = "Chevron right",
  ...props
}: ChevronRightIconProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={[styles.icon, className].filter(Boolean).join(" ")}
      {...props}
    >
      {Object.keys(CELL_PEAK_FRAME).map((key) => {
        const idx = Number(key);
        const row = Math.floor(idx / 12) + 1;
        const col = (idx % 12) + 1;
        const peak = CELL_PEAK_FRAME[idx];
        const peakClass = styles[`peak${peak}` as keyof typeof styles];
        return (
          <span
            key={idx}
            aria-hidden="true"
            className={[styles.cell, peakClass].filter(Boolean).join(" ")}
            style={{ gridRow: row, gridColumn: col }}
          />
        );
      })}
    </span>
  );
}
