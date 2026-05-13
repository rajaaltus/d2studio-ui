"use client";
import * as React from "react";
import { motion } from "motion/react";
import { LucideProps } from "lucide-react";

type NavIconProps = LucideProps & { active?: boolean };

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduce;
}

export const NavIcons = {
    blockicon: ({ active = false, ...props }: NavIconProps) => {
      const reducedMotion = useReducedMotion();
      const animate = active && !reducedMotion;

      return (
<svg
    width={15}
    height={15}
    viewBox="1 1.5 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Static structure — frame + cross divider */}
    <rect
      x={2.85}
      y={3.35}
      width={11.3002}
      height={11.3002}
      rx={1.65}
      stroke="currentColor"
      strokeOpacity={0.55}
      strokeWidth={0.7}
      className="d2-nav-blend"
    />
    <line
      x1={2.85}
      y1={6.85313}
      x2={14.1502}
      y2={6.85313}
      stroke="currentColor"
      strokeOpacity={0.55}
      strokeWidth={0.7}
    />
    <line
      x1={6.44961}
      y1={3.35}
      x2={6.44961}
      y2={14.6502}
      stroke="currentColor"
      strokeOpacity={0.55}
      strokeWidth={0.7}
    />
    {animate && (
      <>
        {/* Phase 1 — boom from the + intersection */}
        <g filter="url(#filter0_f_7085_288)">
          <circle cx={6.44961} cy={6.85313} fill="url(#paint0_radial_7085_288)" r={0.4} opacity={0}>
            <animate
              attributeName="r"
              values="0.4;3;2.25"
              keyTimes="0;0.35;1"
              dur="0.9s"
              begin="0s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;0.55"
              keyTimes="0;0.35;1"
              dur="0.9s"
              begin="0s"
              fill="freeze"
            />
          </circle>
        </g>
        <g
          opacity={0.6}
          filter="url(#filter1_f_7085_288)"
          className="d2-nav-blend"
        >
          <circle
            cx={6.44961}
            cy={6.85313}
            r={2.25}
            fill="url(#paint0_radial_7085_288)"
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;1"
              keyTimes="0;1"
              dur="0.5s"
              begin="0.15s"
              fill="freeze"
            />
          </circle>
        </g>

        {/* Phase 2 — 4 beams shoot from the + to the rect edges */}
        <g filter="url(#nav_block_glow)" className="d2-nav-blend">
          {/* Up */}
          <line
            x1={6.44961}
            y1={6.85313}
            x2={6.44961}
            y2={3.35}
            stroke="url(#nav_block_beam_gradient)"
            strokeWidth={1.1}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            opacity={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={100}
              to={0}
              dur="0.4s"
              begin="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.65;1"
              dur="0.8s"
              begin="0.1s"
              fill="freeze"
            />
          </line>
          {/* Down */}
          <line
            x1={6.44961}
            y1={6.85313}
            x2={6.44961}
            y2={14.6502}
            stroke="url(#nav_block_beam_gradient)"
            strokeWidth={1.1}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            opacity={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={100}
              to={0}
              dur="0.4s"
              begin="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.65;1"
              dur="0.8s"
              begin="0.1s"
              fill="freeze"
            />
          </line>
          {/* Left */}
          <line
            x1={6.44961}
            y1={6.85313}
            x2={2.85}
            y2={6.85313}
            stroke="url(#nav_block_beam_gradient)"
            strokeWidth={1.1}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            opacity={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={100}
              to={0}
              dur="0.4s"
              begin="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.65;1"
              dur="0.8s"
              begin="0.1s"
              fill="freeze"
            />
          </line>
          {/* Right */}
          <line
            x1={6.44961}
            y1={6.85313}
            x2={14.1502}
            y2={6.85313}
            stroke="url(#nav_block_beam_gradient)"
            strokeWidth={1.1}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100}
            opacity={0}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={100}
              to={0}
              dur="0.4s"
              begin="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.65;1"
              dur="0.8s"
              begin="0.1s"
              fill="freeze"
            />
          </line>
        </g>

        {/* Phase 4 — outer line glow flash, fires when the beams arrive at the rect edges */}
        <g filter="url(#nav_block_glow)" className="d2-nav-blend">
          <rect
            x={2.85}
            y={3.35}
            width={11.3002}
            height={11.3002}
            rx={1.65}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1.1}
            strokeLinecap="round"
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              keyTimes="0;0.3;1"
              dur="0.7s"
              begin="0.5s"
              fill="freeze"
            />
          </rect>
        </g>

        {/* Phase 5 — gentle shimmer pulse on the outer rect stroke */}
        <motion.g
          className="d2-nav-blend"
          filter="url(#nav_block_glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.3, 0.7, 0.3] }}
          transition={{
            duration: 3.2,
            delay: 0.7,
            times: [0, 0.15, 0.45, 0.75, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <rect
            x={2.85}
            y={3.35}
            width={11.3002}
            height={11.3002}
            rx={1.65}
            fill="none"
            stroke="url(#nav_block_beam_gradient)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        </motion.g>
      </>
    )}
    <defs>
      <filter
        id="filter0_f_7085_288"
        x={1.25}
        y={1.25}
        width={12.5}
        height={12.5}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation={2}
          result="effect1_foregroundBlur_7085_288"
        />
      </filter>
      <filter
        id="filter1_f_7085_288"
        x={1.25}
        y={1.25}
        width={12.5}
        height={12.5}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation={2}
          result="effect1_foregroundBlur_7085_288"
        />
      </filter>
      <filter
        id="nav_block_glow"
        x={-4}
        y={-4}
        width={23}
        height={23}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur stdDeviation={1.4} result="bloom" />
        <feGaussianBlur stdDeviation={0.4} in="SourceGraphic" result="soft" />
        <feMerge>
          <feMergeNode in="bloom" />
          <feMergeNode in="bloom" />
          <feMergeNode in="soft" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient
        id="nav_block_beam_gradient"
        x1={0}
        y1={0}
        x2={15}
        y2={15}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#785CFF" />
        <stop offset={0.3} stopColor="#FFFFFF" />
        <stop offset={0.55} stopColor="#DC28AF" />
        <stop offset={0.8} stopColor="#FF683A" />
        <stop offset={1} stopColor="#15588B" />
      </linearGradient>
      <radialGradient
        id="paint0_radial_7085_288"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 4.5 -4.5 0 6.44961 6.85313)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFFFFF" />
        <stop offset={0.25} stopColor="#785CFF" />
        <stop offset={0.55} stopColor="#DC28AF" />
        <stop offset={0.8} stopColor="#FF683A" />
        <stop offset={1} stopColor="#15588B" stopOpacity={0.4} />
      </radialGradient>
    </defs>
  </svg>
      );
    },
    pricingicon: ({ active: _active = false, ...props }: NavIconProps) => (
        // paste svg here; split structural elements out, gate bloom/shimmer on `active`
        <>  </>
    ),
    illuicon: ({ active: _active = false, ...props }: NavIconProps) => (
        // paste svg here; split structural elements out, gate bloom/shimmer on `active`
        <>  </>
    )

}
