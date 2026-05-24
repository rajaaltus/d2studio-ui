import styles from "./pixel-controls-spinner.module.css";

export function PixelControlsSpinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.spinner, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={[styles.cell, styles[`cell${i}` as keyof typeof styles]]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}
