import styles from "./activity-square-spinner.module.css";

const MASK_CELLS = [
  34, 45, 71, 86, 87, 102, 103, 117, 118, 119, 136, 137, 138, 152, 153, 168,
  169, 184, 210, 221,
];

const CELL_PEAK_FRAME: Record<number, number> = {
  119: 0, 136: 0,
  102: 1, 103: 1, 118: 1, 137: 1, 152: 1, 153: 1,
  86: 2, 87: 2, 117: 2, 138: 2, 168: 2, 169: 2,
  71: 3, 184: 3,
  34: 4, 45: 4, 221: 4,
};

type ActivitySquareSpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  "aria-label"?: string;
};

export function ActivitySquareSpinner({
  className,
  "aria-label": ariaLabel = "Loading",
  ...props
}: ActivitySquareSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={[styles.spinner, className].filter(Boolean).join(" ")}
      {...props}
    >
      {MASK_CELLS.map((idx) => {
        const row = Math.floor(idx / 16) + 1;
        const col = (idx % 16) + 1;
        const peak = CELL_PEAK_FRAME[idx];
        const peakClass =
          peak !== undefined ? styles[`peak${peak}` as keyof typeof styles] : "";
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
