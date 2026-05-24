import styles from "./pixel-terminal-icon.module.css";

const PEAK_GROUPS: Record<string, number[]> = {
  ptA: [34, 50, 66, 162, 178],
  ptB: [51, 67, 83, 147, 163, 179],
  ptC: [68, 84, 100, 132, 148, 164],
  ptD: [85, 101, 117, 133, 149],
  ptE: [102, 118, 134],
  ptF: [119, 199, 215],
  ptG: [200, 216],
  ptH: [201, 217],
  ptI: [202, 218],
  ptJ: [203, 219],
  ptK: [204, 220],
  ptL: [205, 221],
};

const CELL_TO_GROUP = new Map<number, string>();
for (const [group, indices] of Object.entries(PEAK_GROUPS)) {
  for (const i of indices) CELL_TO_GROUP.set(i, group);
}

export function PixelTerminalIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.icon, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: 256 }, (_, i) => {
        const group = CELL_TO_GROUP.get(i);
        if (!group) return <div key={i} className={styles.empty} />;
        return (
          <div
            key={i}
            className={[styles.cell, styles[group as keyof typeof styles]]
              .filter(Boolean)
              .join(" ")}
          />
        );
      })}
    </div>
  );
}
