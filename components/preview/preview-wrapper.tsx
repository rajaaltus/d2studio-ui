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
  Lock,
} from "lucide-react";
import { cn, copyText } from "@/lib/utils";
import { SyntaxHighlighter } from "@/components/ui/syntax-highlighter";
import { ComingSoonSpinner } from "@/components/preview/coming-soon-spinner";

type AccessTier = "free" | "pro";

interface PreviewWrapperProps {
  children: React.ReactNode;
  componentName: string;
  code?: string;
  className?: string;
  minHeight?: string;
  iframeHeight?: number;
  codeStatus?: "coming_soon" | "available";
  isNew?: boolean;
  accessTier?: AccessTier;
}

export function PreviewWrapper({
  children,
  componentName,
  code,
  className,
  minHeight = "400px",
  iframeHeight = 930,
  codeStatus = "available",
  isNew = false,
  accessTier = "free",
}: PreviewWrapperProps) {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [copiedInstall, setCopiedInstall] = React.useState(false);
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);
  const [currentSize, setCurrentSize] = React.useState(100);
  const [key, setKey] = React.useState(0);

  const installCommand = `npx shadcn@latest add https://ui.d2studio.dev/r/${componentName.toLowerCase()}.json`;

  const handleCopyInstall = React.useCallback(async () => {
    await copyText(installCommand);
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
      className={cn("relative w-full max-w-7xl border-x mx-auto", className)}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-1 screen-line-after screen-line-before">
        <div className="flex items-center justify-start gap-4 ">
          {/* Component Name Badge */}
          <div className="hidden h-auto items-center gap-2 rounded-sm font-sans px-2 capitalize sm:inline-flex">
            <span>{componentName}</span>
            <AccessTierTag tier={accessTier} />
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
          {/* Preview/Code Toggle */}
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "preview" | "code")}
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

      {/* Preview/Code Content */}
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
        ) : (
          <div className="relative">
            {code ? (
              <SyntaxHighlighter
                code={code}
                language="tsx"
                filename={`${componentName}.tsx`}
                withMeta={true}
              />
            ) : (
              <ComingSoonNotice
                componentName={componentName}
                accessTier={accessTier}
                title="Code coming soon"
                hint="We're packaging this block — the code will be posted here soon."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ComingSoonNoticeProps {
  title: string;
  hint?: string;
  componentName?: string;
  accessTier?: AccessTier;
}

function ComingSoonNotice({
  title,
  hint,
  componentName,
  accessTier = "free",
}: ComingSoonNoticeProps) {
  const isLocked = accessTier === "pro";
  const filename = componentName ? `${componentName.toLowerCase()}.tsx` : null;

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-muted">
      <div className="flex h-10 items-center gap-2 border-b border-border/60 px-4">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        {filename && (
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            {filename}
          </span>
        )}
        {isLocked && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Pro
          </span>
        )}
      </div>

      <div className="relative flex min-h-[360px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-60"
          style={{ background: "var(--d2-flash-gradient)" }}
        />
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 ring-1 ring-border">
          <ComingSoonSpinner />
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {hint && (
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

function AccessTierTag({ tier }: { tier: AccessTier }) {
  const isPro = tier === "pro";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isPro
          ? "bg-amber-500/15 text-amber-600 ring-1 ring-inset ring-amber-500/30 dark:text-amber-400"
          : "bg-emerald-500/15 text-emerald-600 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-400"
      )}
    >
      {isPro ? "Pro" : "Free"}
    </span>
  );
}

