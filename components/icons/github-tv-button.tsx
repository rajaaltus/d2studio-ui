"use client";

import * as React from "react";

type GithubTvButtonProps = {
  href?: string;
  className?: string;
  label?: string;
};

const MASK_CELLS = new Set<number>([
  22, 23, 24, 25, 36, 37, 38, 39, 40, 41, 42, 43, 51, 52, 53, 54, 55, 56, 57,
  58, 59, 60, 66, 67, 76, 77, 82, 83, 92, 93, 97, 98, 99, 108, 109, 110, 113,
  114, 125, 126, 129, 130, 141, 142, 145, 146, 147, 156, 157, 158, 162, 163,
  164, 171, 172, 173, 178, 180, 181, 186, 187, 188, 189, 195, 202, 203, 204,
  212, 213, 218, 219,
]);

const PEAK_FRAME_BY_CELL: Record<number, 0 | 1 | 2 | 3> = (() => {
  const map: Record<number, 0 | 1 | 2 | 3> = {};
  const groups: ReadonlyArray<readonly [0 | 1 | 2 | 3, readonly number[]]> = [
    [0, [164, 171, 181, 186]],
    [
      1,
      [
        53, 54, 55, 56, 57, 58, 83, 92, 99, 108, 147, 156, 163, 172, 180, 187,
        202,
      ],
    ],
    [
      2,
      [
        37, 38, 39, 40, 41, 42, 51, 52, 59, 60, 67, 76, 82, 93, 98, 109, 114,
        125, 130, 141, 146, 157, 162, 173, 188, 195, 203, 204, 213, 218,
      ],
    ],
    [
      3,
      [
        22, 23, 24, 25, 36, 43, 66, 77, 97, 110, 113, 126, 129, 142, 145, 158,
        178, 189, 212, 219,
      ],
    ],
  ];
  for (const [frame, cells] of groups) {
    for (const cell of cells) map[cell] = frame;
  }
  return map;
})();

export function GithubTvButton({
  href = "https://github.com/godwin159",
  className,
  label = "Open GitHub repository",
}: GithubTvButtonProps) {
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
        className="pointer-events-none absolute inset-0 -z-10 rounded-[14px] bg-gradient-to-b from-white/10 via-fuchsia-300/10 to-cyan-300/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block text-border drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-[filter] duration-300 group-hover:drop-shadow-[0_4px_14px_rgba(149,120,200,0.45)]"
      >
        <rect
          x={0.5}
          y={0.5}
          width={55}
          height={55}
          rx={11.5}
          fill="url(#gh_tv_body_gradient)"
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
        <g filter="url(#gh_tv_inner_shadow)">
          <rect
            x={4}
            y={4}
            width={48}
            height={48}
            rx={8}
            fill="url(#gh_tv_screen_gradient)"
            fillOpacity={0.5}
          />
        </g>
        <defs>
          <filter
            id="gh_tv_inner_shadow"
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
            id="gh_tv_body_gradient"
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
            id="gh_tv_screen_gradient"
            x1={52}
            y1={4}
            x2={4}
            y2={52}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B9CEFF" />
            <stop offset={0.569024} stopColor="#2A2A2A" stopOpacity={0.5} />
            <stop offset={1} stopColor="#FDB08C" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <span className="gh-pixel-grid">
          {Array.from({ length: 256 }, (_, i) => {
            if (!MASK_CELLS.has(i)) return <span key={i} />;
            const col = i % 16;
            const row = Math.floor(i / 16);
            const frame = PEAK_FRAME_BY_CELL[i];
            return (
              <span
                key={i}
                className={`gh-pixel-cell gh-pixel-cell--f${frame}`}
                style={
                  {
                    "--col": col,
                    "--row": row,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </span>
      </span>
    </a>
  );
}
