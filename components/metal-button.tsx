"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { MetalFx } from "metal-fx";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";

type MetalButtonProps = {
  href: string;
  children: React.ReactNode;
  reflectionTargets?: ReadonlyArray<React.RefObject<HTMLElement | null>>;
  className?: string;
};

export function MetalButton({
  href,
  children,
  reflectionTargets,
  className,
}: MetalButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="inline-flex w-full sm:w-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? "hover" : "rest"}
      whileTap={{ scale: 0.97 }}
      variants={{
        rest: { scale: 1, filter: "brightness(1) saturate(1)" },
        hover: { scale: 1.04, filter: "brightness(1.3) saturate(1.2)" },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.6 }}
    >
      <MetalFx
        variant="button"
        preset="chromatic"
        theme="dark"
        strength={isHovered ? 1 : 0.65}
        style={{ background: "#000" }}
        reflectionTargets={reflectionTargets}
      >
        <Button
          className={cn(
            "h-11 w-full sm:w-auto px-5 text-white overflow-hidden",
            className
          )}
          asChild
        >
          <Link href={href}>
            {children}
            <motion.span
              className="inline-flex"
              animate={{
                x: isHovered ? [0, 60, -200, 14, -5, 2, 0] : 0,
                opacity: isHovered ? [1, 0, 0, 1, 1, 1, 1] : 1,
              }}
              transition={{
                x: {
                  duration: 0.95,
                  times: [0, 0.4, 0.4001, 0.66, 0.8, 0.92, 1],
                  ease: [
                    [0.5, 0, 0.75, 0],
                    [0, 0, 1, 1],
                    [0.16, 1, 0.3, 1],
                    [0.4, 0, 0.6, 1],
                    [0.4, 0, 0.6, 1],
                    [0.4, 0, 0.2, 1],
                  ],
                },
                opacity: {
                  duration: 0.95,
                  times: [0, 0.4, 0.4001, 0.66, 0.8, 0.92, 1],
                },
              }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </Button>
      </MetalFx>
    </motion.div>
  );
}
