import * as React from "react";
import NotificationGlow from "@/components/notification-glow";
import { HoloBell } from "@/components/notification-card";
import { cn } from "@/lib/utils";

/**
 * Dark notification card — reconstructed in CSS. Full-bleed dot-glow
 * background ([[NotificationGlow]]) with the holographic bell, ring and badge
 * on top. Counterpart to the light `NotificationCard`; swap by theme.
 */
export default function NotificationCardDark({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden rounded-[28px] bg-[#060606]",
        className
      )}
      {...props}
    >
      {/* Background: dot texture + colored lights, covers the whole section */}
      <NotificationGlow className="absolute inset-0 h-full w-full" />

      <div className="relative flex aspect-square w-full items-center justify-center">
        {/* Shadow glow behind the disc — blurred gradient stroke, plus-lighter */}
        <svg
          viewBox="0 0 100 100"
          className="absolute aspect-square w-[54%]"
          style={{ filter: "blur(5px)", mixBlendMode: "plus-lighter" }}
          aria-hidden
        >
          <circle cx="50" cy="50" r="43.5" fill="none" stroke="url(#ring_shadow)" strokeWidth="13" />
          <defs>
            <linearGradient id="ring_shadow" x1="16" y1="16" x2="84" y2="84" gradientUnits="userSpaceOnUse">
              <stop stopColor="#086FED" />
              <stop offset="1" stopColor="#CF5F1A" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ring around the bell — #080808 disc with a gradient-stroked rim */}
        <svg
          viewBox="0 0 100 100"
          className="absolute aspect-square w-[54%]"
          aria-hidden
        >
          <circle cx="50" cy="50" r="49" fill="#080808" stroke="url(#ring_stroke)" strokeWidth="1.2" />
          <defs>
            <linearGradient id="ring_stroke" x1="14" y1="14" x2="86" y2="86" gradientUnits="userSpaceOnUse">
              <stop stopColor="#81B3FF" />
              <stop offset="0.5" stopColor="#7D5C80" stopOpacity="0.3" />
              <stop offset="1" stopColor="#EB581E" />
            </linearGradient>
          </defs>
        </svg>
        {/* Bell + badge */}
        <div className="relative w-[30%]">
          <HoloBell className="h-auto w-full drop-shadow-[0_12px_30px_rgba(40,90,220,0.35)]" />
          <span className="absolute -right-3 -top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#ff5f36] to-[#d1350c] px-1.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(209,53,12,0.5)]">
            29
          </span>
        </div>

        {/* Orange half-circle glow — semicircle rotated 62° over the disc, front */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[64%]"
          style={{
            aspectRatio: "2 / 1",
            borderRadius: "9999px 9999px 0 0",
            background: "linear-gradient(90deg, #FF8126 0%, #994D17 100%)",
            opacity: 0.5,
            filter: "blur(20px)",
            mixBlendMode: "plus-lighter",
            transform: "translate(-50%, -50%) rotate(125deg)",
          }}
          aria-hidden
        />
      </div>

      {/* Fade the texture out under the caption for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#060606] via-[#060606]/80 to-transparent" />
      <p className="relative px-8 pb-9 text-center text-lg font-medium leading-snug text-white/60">
        Keep up to date with any changes by receiving instant notifications.
      </p>
    </div>
  );
}
