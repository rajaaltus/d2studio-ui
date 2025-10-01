"use client";

import { ComponentPreview } from "@/components/preview/component-preview";

// Component imports - dynamically loaded
import Comp001 from "@/registry/default/components/comp-001";
import Comp002 from "@/registry/default/components/comp-002";
import Comp010 from "@/registry/default/components/comp-010";

const componentMap: Record<string, React.ComponentType> = {
  "comp-001": Comp001,
  "comp-002": Comp002,
  "comp-010": Comp010,
};

interface ComponentPageClientProps {
  componentKey: string;
  code: string;
}

export function ComponentPageClient({
  componentKey,
  code,
}: ComponentPageClientProps) {
  const Component = componentMap[componentKey];

  if (!Component) {
    return null;
  }

  return (
    <ComponentPreview
      component={Component}
      componentName={componentKey}
      code={code}
      description=""
      tags={[]}
    />
  );
}
