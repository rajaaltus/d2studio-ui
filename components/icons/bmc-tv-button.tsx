"use client";

import * as React from "react";

type BmcTvButtonProps = {
  href?: string;
  className?: string;
  label?: string;
};

const MASK_CELLS = new Set<number>([
  19, 20, 22, 25, 35, 36, 38, 41, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
  92, 93, 97, 98, 107, 109, 110, 113, 114, 123, 126, 129, 130, 139, 142, 145,
  146, 155, 157, 158, 161, 162, 171, 172, 173, 177, 178, 187, 193, 194, 202,
  203, 210, 211, 212, 213, 214, 215, 216, 217, 218, 227, 228, 229, 230, 231,
  232, 233,
]);

export function BmcTvButton({
  href = "https://buymeacoffee.com/godwindev",
  className,
  label = "Buy me a coffee",
}: BmcTvButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        "group relative inline-flex select-none items-center justify-center rounded-[12px] bg-neutral-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent" +
        (className ? ` ${className}` : "")
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[14px] bg-gradient-to-b from-white/5 via-amber-200/8 to-yellow-300/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block text-border drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-[filter] duration-300 group-hover:drop-shadow-[0_4px_14px_rgba(250,204,21,0.22)]"
      >
        <rect
          x={0.5}
          y={0.5}
          width={55}
          height={55}
          rx={11.5}
          fill="url(#bmc_tv_body_gradient)"
          fillOpacity={0.2}
        />
        <rect
          x={0.5}
          y={0.5}
          width={55}
          height={55}
          rx={11.5}
          stroke="currentColor"
        />
        <g filter="url(#bmc_tv_inner_shadow)">
          <rect
            x={4}
            y={4}
            width={48}
            height={48}
            rx={8}
            fill="url(#bmc_tv_screen_gradient)"
            fillOpacity={0.5}
          />
        </g>
        <defs>
          <filter
            id="bmc_tv_inner_shadow"
            x={4}
            y={4}
            width={49}
            height={48}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx={1} />
            <feGaussianBlur stdDeviation={2} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="shape" result="inner1" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha2"
            />
            <feOffset />
            <feGaussianBlur stdDeviation={1.65} />
            <feComposite in2="hardAlpha2" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
            <feBlend in2="inner1" />
          </filter>
          <linearGradient
            id="bmc_tv_body_gradient"
            x1={28}
            y1={0}
            x2={28}
            y2={56}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DEDEDE" />
            <stop offset={0.5} stopColor="#5E517A" />
            <stop offset={1} stopColor="#9578C8" />
          </linearGradient>
          <linearGradient
            id="bmc_tv_screen_gradient"
            x1={52}
            y1={4}
            x2={4}
            y2={52}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE9A8" />
            <stop offset={0.569024} stopColor="#2A2A2A" stopOpacity={0.5} />
            <stop offset={1} stopColor="#FDB08C" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <span className="relative block h-[47px] w-[47px] scale-[0.8]">
          <div className="pixel-icon pixel-icon--coffee absolute inset-0">
            {Array.from({ length: 256 }, (_, i) => (
              <div
                key={i}
                className={
                  MASK_CELLS.has(i) ? `px on px-${i}` : "px"
                }
              />
            ))}
          </div>
          <div
            className="pixel-icon pixel-icon--coffee absolute inset-0 opacity-60 [mix-blend-mode:plus-lighter]"
          >
            {Array.from({ length: 256 }, (_, i) => (
              <div
                key={`overlay-${i}`}
                className={
                  MASK_CELLS.has(i) ? `px on px-${i}` : "px"
                }
              />
            ))}
          </div>
        </span>
      </span>
    </a>
  );
}
