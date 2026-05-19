"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { MetalFx } from "metal-fx";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

type MetalButtonSlideProps = {
  href: string;
  children: React.ReactNode;
  reflectionTargets?: ReadonlyArray<React.RefObject<HTMLElement | null>>;
  className?: string;
};

export function MetalButtonSlide({
  href,
  children,
  reflectionTargets,
  className,
}: MetalButtonSlideProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = resolvedTheme === "light";

  if (!mounted) {
    return (
      <div className="inline-flex w-full sm:w-auto [&_.metal-fx-root]:w-full sm:[&_.metal-fx-root]:w-auto [&_.metal-fx-content]:w-full sm:[&_.metal-fx-content]:w-auto">
        <Button
          className={cn(
            "h-11 w-full sm:w-auto px-5 bg-white text-black dark:bg-black dark:text-white",
            className
          )}
          asChild
        >
          <Link href={href}>
            {children}
            <span className="relative inline-flex size-4 overflow-hidden">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="inline-flex w-full sm:w-auto [&_.metal-fx-root]:w-full sm:[&_.metal-fx-root]:w-auto [&_.metal-fx-content]:w-full sm:[&_.metal-fx-content]:w-auto"
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
        theme={isLight ? "light" : "dark"}
        strength={isHovered ? 1 : 0.70}
        style={{ background: isLight ? "#fff" : "#000" }}
        reflectionTargets={reflectionTargets}
      >
        <Button
          className={cn(
            "h-11 w-full sm:w-auto px-5",
            isLight ? "text-black" : "text-white",
            className
          )}
          asChild
        >
          <Link href={href}>
            {children}
            <span className="relative inline-flex size-4 overflow-hidden">
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  x: isHovered ? 18 : 0,
                  y: isHovered ? -18 : 0,
                  opacity: isHovered ? 0 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                  mass: 1,
                  opacity: { duration: 0.25, ease: "easeOut" },
                }}
              >
                <ArrowUpRight size={16} />
              </motion.span>
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                initial={{ x: -18, y: 18, opacity: 0 }}
                animate={{
                  x: isHovered ? 0 : -18,
                  y: isHovered ? 0 : 18,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                  mass: 1,
                  delay: isHovered ? 0.08 : 0,
                  opacity: {
                    duration: 0.3,
                    ease: "easeOut",
                    delay: isHovered ? 0.08 : 0,
                  },
                }}
                aria-hidden="true"
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </span>
          </Link>
        </Button>
      </MetalFx>
    </motion.div>
  );
}
