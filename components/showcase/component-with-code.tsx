"use client";

import { PreviewWrapper } from "@/components/preview/preview-wrapper";
import { useEffect, useState } from "react";

interface ComponentWithCodeProps {
  componentName: string;
  component: React.ComponentType;
}

export function ComponentWithCode({
  componentName,
  component: Component,
}: ComponentWithCodeProps) {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(`/api/component-code/${componentName}`);
        if (response.ok) {
          const data = await response.json();
          setCode(data.code);
        }
      } catch (error) {
        console.error("Failed to fetch component code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [componentName]);

  return (
    <PreviewWrapper componentName={componentName} code={code} minHeight="500px">
      <div className="origin-center w-full flex items-center justify-center flex-1 h-full font-sans">
        <Component />
      </div>
    </PreviewWrapper>
  );
}
