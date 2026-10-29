import { metrics, type CellShape } from "@/components/spinners/css-spinner";
import type { FreeSpinner } from "@/lib/free-spinners";

// The size the free spinners are drawn at, and copied at.
export const SIZE = 12;
const { cellSize, gap } = metrics(SIZE);

export const componentName = (s: FreeSpinner) => `Spinner${s.label.replace(/[^A-Za-z0-9]/g, "")}`;

// The copied code: a small component over the @d2/pixel-spinner engine, at the
// size drawn here, lit in the text colour around it so it suits either theme.
export function snippetFor(s: FreeSpinner, shape: CellShape = "square") {
  const name = componentName(s);
  return `// npx shadcn@latest add @d2/pixel-spinner
import * as React from "react";
import { PixelSpinner, type SpinnerPattern } from "@/components/ui/pixel-spinner";

const pattern: SpinnerPattern = ${JSON.stringify(s.pattern)};

export function ${name}(
  props: Omit<React.ComponentProps<typeof PixelSpinner>, "pattern" | "color">,
) {
  return (
    <PixelSpinner
      pattern={pattern}
      color="blue"
      customColor="currentColor"
      effect="none"
${shape === "circle" ? '      shape="circle"\n' : ""}      cellSize={${cellSize}}
      gap={${gap}}
      {...props}
    />
  );
}
`;
}

