import * as React from "react";
import NotificationGlow from "@/components/notification-glow";
import { Bell } from "@/components/bell";
import { cn } from "@/lib/utils";

export default function NotificationCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden rounded-[28px] bg-white",
        className
      )}
      {...props}
    >
      {/* Background: dot texture + colored lights, covers the whole section */}
      <NotificationGlow variant="light" className="absolute inset-0 h-full w-full" />

      <div className="relative flex aspect-square w-full items-center justify-center">
        {/* Ring around the bell */}
        <div
          className="absolute aspect-square w-[54%] rounded-full border border-black/[0.06]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.75) 55%, transparent 100%)" }}
        />
        {/* Bell + badge */}
        <div className="relative w-[30%]">
          <Bell className="h-auto w-full drop-shadow-[0_10px_24px_rgba(90,80,150,0.28)]" />
          <span className="absolute -right-3 -top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#ff5f36] to-[#d1350c] px-1.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(209,53,12,0.45)]">
            29
          </span>
        </div>
      </div>

      {/* Fade the texture out under the caption for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent" />
      <p className="relative px-8 pb-9 text-center text-lg font-medium leading-snug text-[#3f3f4c]">
        Keep up to date with any changes by receiving instant notifications.
      </p>
    </div>
  );
}
