import { cn } from "@/lib/utils";

/**
 * Ambient backdrop for the notification card: a centered dot-matrix texture
 * masked to an ellipse, lit from behind by two blurred color fields (blue
 * left, warm-red right). Covers the whole section.
 *
 * `variant="dark"` → white dots on black, additive `plus-lighter` lights.
 * `variant="light"` → dots inverted to dark-on-white (`multiply`), softer lights.
 */
export default function NotificationGlow({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const light = variant === "light";
  return (
    <div
      className={cn("relative overflow-hidden", light ? "bg-white" : "bg-[#060606]", className)}
    >
      {/* Two colored lights — blurred discs (Figma specs).
          Blue: Ø51%, #2660FF @20%, Plus-lighter.  Orange: Ø31%, linear @20%, Normal. */}
      <div className="absolute inset-0">
        <div
          className="absolute rounded-full"
          style={{
            left: "-2%",
            top: "4%",
            width: "51%",
            aspectRatio: "1",
            background: light ? "radial-gradient(circle, #8AA6FF 0%, transparent 66%)" : "#2660FF",
            filter: "blur(44px)",
            opacity: light ? 0.5 : 0.42,
            mixBlendMode: light ? "normal" : "plus-lighter",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "24%",
            width: "31%",
            aspectRatio: "1",
            background: light
              ? "radial-gradient(circle, #FFAD84 0%, transparent 66%)"
              : "linear-gradient(135deg, #FF6A00 0%, #EB581E 100%)",
            filter: "blur(40px)",
            opacity: light ? 0.45 : 0.42,
            mixBlendMode: light ? "normal" : "plus-lighter",
          }}
        />
        {/* Second blue disc — builds up the blue light shade (dark only) */}
        {!light && (
          <div
            className="absolute rounded-full"
            style={{
              left: "8%",
              top: "16%",
              width: "51%",
              aspectRatio: "1",
              background: "#2660FF",
              filter: "blur(44px)",
              opacity: 0.38,
              mixBlendMode: "plus-lighter",
            }}
          />
        )}
      </div>

      {/* Dot matrix — a single crisp CSS sheet (no image scaling / moiré),
          masked to a center ellipse, tinted by the lights below. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)"
          } 0.6px, transparent 0.78px)`,
          backgroundSize: "4.95px 4.95px",
          mixBlendMode: light ? "multiply" : "plus-lighter",
          opacity: light ? 0.55 : 0.5,
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000 55%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
