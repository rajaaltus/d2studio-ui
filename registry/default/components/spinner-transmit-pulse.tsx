"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":4,"interval":180,"frames":[[5,6,9,10],[0,1,2,3,4,7,8,11,12,13,14,15],[],[5,6,9,10]]};

type SpinnerTransmitPulseProps = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerTransmitPulse({ color = "hotpink", ...props }: SpinnerTransmitPulseProps) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
