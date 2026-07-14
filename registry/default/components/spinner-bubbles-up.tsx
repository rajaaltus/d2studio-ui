"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":180,"frames":[[12,14],[8,10,13,15],[4,6,9,11],[0,2,5,7],[1,3],[]]};

type SpinnerBubblesUpProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerBubblesUp({ color = "hotpink", ...props }: SpinnerBubblesUpProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
