"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":3,"interval":260,"frames":[[4],[1,3,5,7],[0,2,6,8]]};

type SpinnerRippleOutProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerRippleOut({ color = "hotpink", ...props }: SpinnerRippleOutProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
