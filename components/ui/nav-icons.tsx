"use client";
import * as React from "react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelIconSpinner } from "@/components/pixel-icon-spinner";
import { PixelIconSpinnerHero } from "@/components/pixel-icon-spinner/hero";
import { PixelIconSpinnerAi } from "@/components/pixel-icon-spinner/ai";
import { PixelIconSpinnerBento } from "@/components/pixel-icon-spinner/bento";

type NavIconProps = LucideProps & { active?: boolean };

export const NavIcons = {
    blockicon: ({ active: _active = false, className }: NavIconProps) => {
      return (
        <span
          aria-hidden
          className={cn("inline-flex items-center justify-center", className)}
        >
          <PixelIconSpinner />
        </span>
// {/*
// <svg
//     width={15}
//     height={15}
//     viewBox="1 1.5 15 15"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     {...props}
//   >
//     {/* Static structure — frame + cross divider */}
//     <rect
//       x={2.85}
//       y={3.35}
//       width={11.3002}
//       height={11.3002}
//       rx={1.65}
//       stroke="currentColor"
//       strokeOpacity={0.55}
//       strokeWidth={0.7}
//       className="d2-nav-blend"
//     />
//     <line
//       x1={2.85}
//       y1={6.85313}
//       x2={14.1502}
//       y2={6.85313}
//       stroke="currentColor"
//       strokeOpacity={0.55}
//       strokeWidth={0.7}
//     />
//     <line
//       x1={6.44961}
//       y1={3.35}
//       x2={6.44961}
//       y2={14.6502}
//       stroke="currentColor"
//       strokeOpacity={0.55}
//       strokeWidth={0.7}
//     />
//     {animate && (
//       <g
//         mask="url(#nav_block_shine_mask)"
//         className="d2-nav-blend"
//       >
//         <motion.g
//           initial={{ x: -5 }}
//           animate={{ x: 18 }}
//           transition={{
//             repeat: Infinity,
//             duration: 1,
//             ease: "linear",
//             repeatDelay: 1,
//           }}
//         >
//           <rect
//             y={-2}
//             width={3.5}
//             height={20}
//             fill="url(#nav_block_shine_gradient)"
//             transform="skewX(-20)"
//           />
//         </motion.g>
//       </g>
//     )}
//     <defs>
//       <mask
//         id="nav_block_shine_mask"
//         maskUnits="userSpaceOnUse"
//         x={0}
//         y={0}
//         width={17}
//         height={17}
//       >
//         <rect
//           x={2.85}
//           y={3.35}
//           width={11.3002}
//           height={11.3002}
//           rx={1.65}
//           fill="none"
//           stroke="white"
//           strokeWidth={0.7}
//         />
//         <line
//           x1={2.85}
//           y1={6.85313}
//           x2={14.1502}
//           y2={6.85313}
//           stroke="white"
//           strokeWidth={0.7}
//         />
//         <line
//           x1={6.44961}
//           y1={3.35}
//           x2={6.44961}
//           y2={14.6502}
//           stroke="white"
//           strokeWidth={0.7}
//         />
//       </mask>
//       <linearGradient
//         id="nav_block_shine_gradient"
//         x1={0}
//         y1={0}
//         x2={1}
//         y2={0}
//       >
//         <stop offset={0} stopColor="#785CFF" stopOpacity={0} />
//         <stop offset={0.35} stopColor="#785CFF" stopOpacity={1} />
//         <stop offset={0.5} stopColor="#FFFFFF" stopOpacity={1} />
//         <stop offset={0.65} stopColor="#DC28AF" stopOpacity={1} />
//         <stop offset={1} stopColor="#FF683A" stopOpacity={0} />
//       </linearGradient>
//     </defs>
//   </svg> */}
      );
    },
    heroicon: ({ active: _active = false, className }: NavIconProps) => {
      return (
        <span
          aria-hidden
          className={cn("inline-flex items-center justify-center", className)}
        >
          <PixelIconSpinnerHero />
        </span>
      );
    },
    pricingicon: ({ active: _active = false, ...props }: NavIconProps) => (
        // paste svg here; split structural elements out, gate bloom/shimmer on `active`
        <>  </>
    ),
    illuicon: ({ active: _active = false, ...props }: NavIconProps) => (
        // paste svg here; split structural elements out, gate bloom/shimmer on `active`
        <>  </>
    ),
    aiicon: ({ active: _active = false, className }: NavIconProps) => {
      return (
        <span
          aria-hidden
          className={cn("inline-flex items-center justify-center", className)}
        >
          <PixelIconSpinnerAi />
        </span>
      );
    },
    bentoicon: ({ active: _active = false, className }: NavIconProps) => {
      return (
        <span
          aria-hidden
          className={cn("inline-flex items-center justify-center", className)}
        >
          <PixelIconSpinnerBento />
        </span>
      );
    },

}
