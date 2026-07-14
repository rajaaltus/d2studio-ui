"use client";

import * as React from "react";
import {
  PixelSpinner,
  type SpinnerColor,
  type SpinnerPattern,
} from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = {"size":5,"interval":240,"frames":[[12],[6,7,8,11,13,16,17,18],[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24]]};

type SpinnerConcentric5Props = Omit<
  React.ComponentProps<typeof PixelSpinner>,
  "pattern" | "color"
> & { color?: SpinnerColor };

export function SpinnerConcentric5({ color = "blue", ...props }: SpinnerConcentric5Props) {
  return <PixelSpinner pattern={pattern} color={color} {...props} />;
}
