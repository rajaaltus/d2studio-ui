import styles from "./arrow-up-line-icon.module.css";

const MASK_CELLS = [
  1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 19, 20, 26, 27, 28, 29, 33, 34, 35,
  36, 37, 38, 43, 44, 51, 52, 59, 60,
];

type ArrowUpLineIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  "aria-label"?: string;
};

export function ArrowUpLineIcon({
  className,
  "aria-label": ariaLabel = "Arrow up to line",
  ...props
}: ArrowUpLineIconProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={[styles.icon, className].filter(Boolean).join(" ")}
      {...props}
    >
      {MASK_CELLS.map((idx) => {
        const row = Math.floor(idx / 8) + 1;
        const col = (idx % 8) + 1;
        return (
          <span
            key={idx}
            aria-hidden="true"
            className={styles.cell}
            style={{ gridRow: row, gridColumn: col }}
          />
        );
      })}
    </span>
  );
}
