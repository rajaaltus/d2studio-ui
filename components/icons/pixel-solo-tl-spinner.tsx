import styles from "./pixel-solo-tl-spinner.module.css";

export function PixelSoloTlSpinner({
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
          className={[styles.cell, i === 0 ? styles.cell0 : null]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}
