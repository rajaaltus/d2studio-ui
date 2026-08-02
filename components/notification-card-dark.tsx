import * as React from "react";
import NotificationGlow from "@/components/notification-glow";
import { Bell } from "@/components/bell";
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
        {/* Shadow glow behind the disc — blurred annulus, masked out of a gradient disc.
            Blur lives on the parent: on one element the mask would clip the bleed away. */}
        <div
          aria-hidden
          className="absolute aspect-square w-[54%]"
          style={{ filter: "blur(5px)", mixBlendMode: "plus-lighter" }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              backgroundImage: "linear-gradient(135deg, #086FED, #CF5F1A)",
              /* stroke r=43.5 w=13 spans 37..50 of a 50-radius disc → inner edge at 74% */
              mask: "radial-gradient(farthest-side, transparent 74%, #000 74.5%)",
              WebkitMask: "radial-gradient(farthest-side, transparent 74%, #000 74.5%)",
            }}
          />
        </div>

        {/* Ring around the bell — #080808 disc with a gradient-stroked rim */}
        <div
          aria-hidden
          className="absolute aspect-square w-[54%] rounded-full border-[1.5px] border-transparent"
          style={{
            backgroundImage:
              "linear-gradient(#080808, #080808), " +
              "linear-gradient(135deg, #81B3FF, rgba(125,92,128,0.3) 50%, #EB581E)",
            backgroundOrigin: "padding-box, border-box",
            backgroundClip: "padding-box, border-box",
          }}
        />

        {/* Bell + badge */}
        <div className="relative w-[27%]">
          <Bell className="h-auto w-full drop-shadow-[0_12px_30px_rgba(40,90,220,0.35)]" />
          <span className="absolute -right-3 -top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#ff5f36] to-[#d1350c] px-1.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(209,53,12,0.5)]">
            29
          </span>
        </div>

      </div>

      {/* Gentle fade for caption legibility — keeps the dot pattern visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#060606]/70 to-transparent" />
      <p className="relative px-8 pb-9 text-center text-lg font-medium leading-snug text-white/60">
        Keep up to date with any changes by receiving instant notifications.
      </p>
    </div>
  );
}
