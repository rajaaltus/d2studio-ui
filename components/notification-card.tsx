import * as React from "react";
import NotificationGlow from "@/components/notification-glow";
import { cn } from "@/lib/utils";

const BELL_PATH =
  "M215.695 162.557C199.545 146.394 184.289 131.126 184.289 100.651V75.3483C184.289 33.8013 150.515 0 109 0C67.4852 0 33.7109 33.8013 33.7109 75.3483V100.651C33.7109 131.126 18.4557 146.394 2.30499 162.557C0.0546974 164.81 -0.618817 168.197 0.599171 171.139C1.81716 174.081 4.68641 176 7.86829 176H210.132C213.314 176 216.184 174.081 217.401 171.139C218.619 168.197 217.946 164.81 215.695 162.557Z";

/** Holographic bell: glossy white body tinted blue (top-left) → warm (bottom-right). */
export function HoloBell({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 218 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={BELL_PATH} fill="white" />
      <path d={BELL_PATH} fill="url(#nb_blue)" />
      <path d={BELL_PATH} fill="url(#nb_warm)" />
      <defs>
        <radialGradient
          id="nb_blue"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(74.2822 -3.76193 3.02395 91.6016 62.2178 21.7619)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7597FF" />
          <stop offset={1} stopColor="#000207" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="nb_warm"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(159.903 -9.08834 7.72952 197.207 2.72322e-06 56.7993)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#000207" stopOpacity={0} />
          <stop offset={1} stopColor="#FFCE9C" />
        </radialGradient>
      </defs>
    </svg>
  );
}

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
          <HoloBell className="h-auto w-full drop-shadow-[0_10px_24px_rgba(90,80,150,0.28)]" />
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
