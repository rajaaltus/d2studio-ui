import { cn } from "@/lib/utils";

/** Callout line/tick colour — #F4F4F4 @ 60% */
const HAIRLINE = "oklch(0.967 0 0 / 0.6)";
/** Fill track spans x=16.158 → 175.042 inside the 392px pill (83% ⇒ 131.87, per the reference). */
const TRACK_WIDTH = 158.884;

export default function ProgressBar({
  value = 83,
  label = "Progress..",
  className,
}: {
  value?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "relative h-12 w-[392px] rounded-full backdrop-blur-[20px]",
        className,
      )}
      style={{
        background:
          "linear-gradient(90deg, oklch(0.925 0.036 256 / 0.2) 0%, oklch(0.887 0.074 310.1 / 0.2) 50%, oklch(0.958 0.037 79.1 / 0.2) 100%)",
        outline: "1px solid " + HAIRLINE,
        outlineOffset: "-1px",
        boxShadow:
          "0 0 4px 2px oklch(0.964 0 0 / 0.25), inset 1px 1px 10px 0 oklch(0.985 0 0)",
      }}
    >
      {/* progress fill */}
      <div
        className="absolute top-[21px] left-[16.158px] h-1.5 rounded-[3px]"
        style={{
          width: (TRACK_WIDTH * pct) / 100,
          background:
            "linear-gradient(90deg, oklch(0.701 0.179 297) 37.4%, oklch(0.838 0.116 221.2) 59.7%, oklch(0.908 0.169 147.7) 75.6%, oklch(0.922 0 0 / 0.7) 100%)",
        }}
      />

      {/* left leader ──┤ */}
      <div
        className="absolute top-[23.5px] left-[184.807px] h-px w-6"
        style={{ background: HAIRLINE }}
      />
      <div
        className="absolute top-[19.5px] left-[209.307px] h-[9px] w-px"
        style={{ background: HAIRLINE }}
      />

      {/* label, centred between the ticks */}
      <div className="absolute inset-y-0 right-[59.693px] left-[209.807px] flex items-center justify-center gap-[9.5px] text-xs whitespace-nowrap">
        <span style={{ color: "oklch(0.943 0.091 155.3 / 0.8)" }}>
          ({pct}%)
        </span>
        <span style={{ color: "oklch(0.979 0 0)" }}>{label}</span>
      </div>

      {/* right leader ├── */}
      <div
        className="absolute top-[19.5px] left-[332.307px] h-[9px] w-px"
        style={{ background: HAIRLINE }}
      />
      <div
        className="absolute top-[23.5px] left-[332.807px] h-px w-6"
        style={{ background: HAIRLINE }}
      />
    </div>
  );
}
