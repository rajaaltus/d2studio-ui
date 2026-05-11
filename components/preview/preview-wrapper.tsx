"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import type { ImperativePanelHandle } from "react-resizable-panels";
import {
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Terminal,
  Maximize2,
  RefreshCw,
  Eye,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SyntaxHighlighter } from "@/components/ui/syntax-highlighter";

interface PreviewWrapperProps {
  children: React.ReactNode;
  componentName: string;
  code?: string;
  className?: string;
  minHeight?: string;
  iframeHeight?: number;
  figmaUrl?: string;
  codeStatus?: "coming_soon" | "available";
  isNew?: boolean;
}

export function PreviewWrapper({
  children,
  componentName,
  code,
  className,
  minHeight = "400px",
  iframeHeight = 930,
  figmaUrl,
  codeStatus = "available",
  isNew = false,
}: PreviewWrapperProps) {
  const [view, setView] = React.useState<"preview" | "code" | "figma">("preview");
  const [copiedInstall, setCopiedInstall] = React.useState(false);
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);
  const [currentSize, setCurrentSize] = React.useState(100);
  const [key, setKey] = React.useState(0);

  const installCommand = `npx shadcn@latest add https://ui.d2studio.dev/r/${componentName.toLowerCase()}.json`;

  const handleCopyInstall = React.useCallback(async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  }, [installCommand]);

  const handleSizeChange = React.useCallback((value: string) => {
    const size = parseInt(value);
    setCurrentSize(size);
    if (resizablePanelRef?.current) {
      resizablePanelRef.current.resize(size);
    }
  }, []);

  const handleRefresh = React.useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  const handleMaximize = React.useCallback(() => {
    handleSizeChange("100");
  }, [handleSizeChange]);

  return (
    <div
      className={cn("relative w-full max-w-6xl border-x mx-auto", className)}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-1 screen-line-after screen-line-before">
        <div className="flex items-center justify-start gap-4 ">
          {/* Component Name Badge */}
          <div className="hidden h-auto items-center gap-2 rounded-sm font-sans px-2 capitalize sm:inline-flex">
            <span>{componentName}</span>
            {isNew && (
              <span className="relative inline-flex items-center overflow-hidden rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-[0_0_12px_oklch(0.7_0.2_50/0.5)]">
                <span className="relative z-10">New</span>
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shimmer_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  aria-hidden="true"
                />
              </span>
            )}
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          {/* Preview/Code/Figma Toggle */}
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "preview" | "code" | "figma")}
            className="hidden sm:flex bg-muted  items-center justify-center rounded-md  py-2 px-1"
          >
            <TabsList className="h-7 gap-1 rounded-md bg-muted p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
              <TabsTrigger
                value="preview"
                className="h-[2rem] rounded-sm px-3 text-xs data-[state=active]:bg-background dark:data-[state=active]:bg-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Eye />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="h-[2rem] rounded-sm px-3 text-xs data-[state=active]:bg-background dark:data-[state=active]:bg-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Code />
                Code
              </TabsTrigger>
              {figmaUrl && (
                <TabsTrigger
                  value="figma"
                  className="h-[2rem] rounded-sm px-3 text-xs data-[state=active]:bg-background dark:data-[state=active]:bg-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.02106 8.99999C9.02106 7.34314 10.3642 6 12.021 6C13.6779 6 15.021 7.34318 15.021 8.99999C15.021 10.6569 13.6779 12 12.021 12C10.3642 12 9.02106 10.6568 9.02106 8.99999Z"
                      fill="#00BCFF"
                    />
                    <path
                      d="M3.02106 15.0001C3.02106 13.3432 4.3642 12.0001 6.02105 12.0001L7.61978 11.156L9.02103 12.0001V15.0001C9.02103 16.6569 7.67789 18 6.02105 18C4.3642 18 3.02106 16.6569 3.02106 15.0001Z"
                      fill="#00CF7F"
                    />
                    <path
                      d="M9.02106 0L7.38861 2.83605L9.02106 5.99998H11.979C13.6358 5.99998 14.979 4.65683 14.979 2.99999C14.979 1.34314 13.6358 0 11.979 0H9.02106Z"
                      fill="#FF7361"
                    />
                    <path
                      d="M2.97894 2.99999C2.97894 4.65683 4.32209 5.99998 5.97893 5.99998L7.57035 6.61465L9.021 5.99998V0H5.9789C4.32209 0 2.97894 1.34314 2.97894 2.99999Z"
                      fill="#FF4D12"
                    />
                    <path
                      d="M3.02106 9.00002C3.02106 10.6569 4.3642 12 6.02105 12H9.02103V6H6.02105C4.3642 6 3.02106 7.34318 3.02106 9.00002Z"
                      fill="#B659FF"
                    />
                  </svg>
                  Figma
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>

          {/* Screen Size Selector - Only visible in preview mode */}
          {view === "preview" && (
            <>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <ToggleGroup
                type="single"
                value={currentSize.toString()}
                onValueChange={handleSizeChange}
                className="hidden gap-1 sm:flex"
              >
                <ToggleGroupItem
                  value="100"
                  className="h-[22px] w-[22px] rounded-sm p-0"
                  title="Desktop"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="60"
                  className="h-[22px] w-[22px] rounded-sm p-0"
                  title="Tablet"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="30"
                  className="h-[22px] w-[22px] rounded-sm p-0"
                  title="Mobile"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Refresh Button - Only in preview mode */}
          {view === "preview" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-[22px] w-[22px] rounded-sm p-0"
              onClick={handleRefresh}
              title="Refresh preview"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Maximize Button - Only in preview mode */}
          {view === "preview" && currentSize !== 100 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-[22px] w-[22px] rounded-sm p-0"
              onClick={handleMaximize}
              title="Maximize"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          )}

          <div className="h-4 w-px bg-border" />

          {/* Install Command */}
          <Button
            variant="ghost"
            className="hidden h-[22px] w-auto gap-1.5 rounded-sm px-2 text-xs md:flex lg:w-auto"
            size="sm"
            onClick={handleCopyInstall}
          >
            {copiedInstall ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Terminal className="h-3.5 w-3.5" />
            )}
            <span className="hidden lg:inline">
              npx shadcn add {componentName}
            </span>
          </Button>
        </div>
      </div>

      {/* Preview/Code/Figma Content */}
      <div
        className="relative"
        style={
          {
            "--height": `${iframeHeight}px`,
          } as React.CSSProperties
        }
      >
        {view === "preview" ? (
          <div className="relative  w-full h-full ">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 -z-10 bg-background"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "24px 24px",
                backgroundPosition: "center center",
                opacity: 0.3,
              }}
            />

            <ResizablePanelGroup
              direction="horizontal"
              className="relative z-10 overflow-visible"
              onLayout={(sizes) => {
                setCurrentSize(Math.round(sizes[0] || 100));
              }}
            >
              <ResizablePanel
                ref={resizablePanelRef}
                className="relative bg-background"
                defaultSize={currentSize}
                minSize={20}
                maxSize={100}
              >
                <div
                  key={key}
                  className="relative   min-h-[400px] h-full w-full"
                  style={{ minHeight }}
                >
                  {children}
                </div>

                {/* Size Indicator */}
                {currentSize < 100 && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white dark:bg-white/80 dark:text-black">
                    {Math.round((currentSize / 100) * 1400)}px
                  </div>
                )}
              </ResizablePanel>

              <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block" />

              <ResizablePanel defaultSize={100 - currentSize} minSize={0} />
            </ResizablePanelGroup>
          </div>
        ) : view === "figma" ? (
          <div className="relative min-h-[400px] w-full">
            {figmaUrl ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border bg-background">
                <div className="mb-4 text-center space-y-2">
                  <p className="text-sm font-medium">Figma File</p>
                  <p className="text-xs text-muted-foreground">
                    Open this block in Figma
                  </p>
                </div>
                <Button asChild>
                  <a
                    href={figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.02106 8.99999C9.02106 7.34314 10.3642 6 12.021 6C13.6779 6 15.021 7.34318 15.021 8.99999C15.021 10.6569 13.6779 12 12.021 12C10.3642 12 9.02106 10.6568 9.02106 8.99999Z"
                        fill="#00BCFF"
                      />
                      <path
                        d="M3.02106 15.0001C3.02106 13.3432 4.3642 12.0001 6.02105 12.0001L7.61978 11.156L9.02103 12.0001V15.0001C9.02103 16.6569 7.67789 18 6.02105 18C4.3642 18 3.02106 16.6569 3.02106 15.0001Z"
                        fill="#00CF7F"
                      />
                      <path
                        d="M9.02106 0L7.38861 2.83605L9.02106 5.99998H11.979C13.6358 5.99998 14.979 4.65683 14.979 2.99999C14.979 1.34314 13.6358 0 11.979 0H9.02106Z"
                        fill="#FF7361"
                      />
                      <path
                        d="M2.97894 2.99999C2.97894 4.65683 4.32209 5.99998 5.97893 5.99998L7.57035 6.61465L9.021 5.99998V0H5.9789C4.32209 0 2.97894 1.34314 2.97894 2.99999Z"
                        fill="#FF4D12"
                      />
                      <path
                        d="M3.02106 9.00002C3.02106 10.6569 4.3642 12 6.02105 12H9.02103V6H6.02105C4.3642 6 3.02106 7.34318 3.02106 9.00002Z"
                        fill="#B659FF"
                      />
                    </svg>
                    Open in Figma
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-zinc-950 text-sm text-muted-foreground dark:bg-zinc-900">
                <div className="text-center space-y-2">
                  <p>No Figma file available</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {codeStatus === "coming_soon" ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-zinc-950 text-sm text-muted-foreground dark:bg-zinc-900">
                <div className="text-center space-y-2">
                  <p className="text-base font-medium">Coming Soon</p>
                  <p className="text-xs opacity-60">
                    Code for this block will be available soon
                  </p>
                </div>
              </div>
            ) : code ? (
              <SyntaxHighlighter
                code={code}
                language="tsx"
                filename={`${componentName}.tsx`}
                withMeta={true}
              />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-zinc-950 text-sm text-muted-foreground dark:bg-zinc-900">
                <div className="text-center space-y-2">
                  <p>Loading code...</p>
                  <p className="text-xs opacity-60">
                    Fetching component source
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
