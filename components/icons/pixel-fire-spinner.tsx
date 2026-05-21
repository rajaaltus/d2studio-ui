import styles from "./pixel-fire-spinner.module.css";

export function PixelFireSpinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.pixelSpinner, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: 16 }, (_, i) => (
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
