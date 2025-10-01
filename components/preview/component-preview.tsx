"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Code2,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  width: string;
  height: string;
  maxWidth: string;
}

const devices: Device[] = [
  {
    name: "Desktop",
    icon: Monitor,
    width: "100%",
    height: "600px",
    maxWidth: "1200px",
  },
  {
    name: "Tablet",
    icon: Tablet,
    width: "768px",
    height: "600px",
    maxWidth: "768px",
  },
  {
    name: "Mobile",
    icon: Smartphone,
    width: "375px",
    height: "600px",
    maxWidth: "375px",
  },
];

interface ComponentPreviewProps {
  component: React.ComponentType;
  componentName: string;
  code: string;
  className?: string;
  description?: string;
  tags?: string[];
}

export function ComponentPreview({
  component: Component,
  componentName,
  code,
  className,
  description,
  tags = [],
}: ComponentPreviewProps) {
  const [activeDevice, setActiveDevice] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentDevice = devices[activeDevice];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setActiveDevice(0);
    setIsDarkMode(false);
    setShowCode(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="overflow-hidden p-0">
        {/* Header */}
        <div className="border-b bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{componentName}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Device Controls */}
            <div className="flex items-center gap-1 bg-background rounded-lg p-1">
              {devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <Button
                    key={device.name}
                    variant={activeDevice === index ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveDevice(index)}
                    className="h-8 px-3"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{device.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-8 w-8 p-0"
                title="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* View Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCode(!showCode)}
                className="h-8 w-8 p-0"
                title={showCode ? "Show preview" : "Show code"}
              >
                {showCode ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Code2 className="h-4 w-4" />
                )}
              </Button>

              {/* Copy Code */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
                title="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              {/* Reset */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0"
                title="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
                title="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>
              {currentDevice.name} •{" "}
              {currentDevice.width === "100%"
                ? "Responsive"
                : currentDevice.width}
            </span>
            <span>{showCode ? "Code View" : "Preview Mode"}</span>
          </div>
        </div>

        {/* Preview Area */}
        <CardContent className="p-0">
          {showCode ? (
            /* Code View */
            <div className="relative">
              <pre className="p-6 text-sm overflow-x-auto bg-muted/50">
                <code className="language-tsx">{code}</code>
              </pre>
            </div>
          ) : (
            /* Component Preview */
            <div
              className={cn(
                "mx-auto transition-all duration-300 ease-in-out",
                isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative",
              )}
              style={{
                width: currentDevice.width,
                maxWidth: currentDevice.maxWidth,
                height: isFullscreen ? "100vh" : currentDevice.height,
              }}
            >
              <div
                className={cn(
                  "w-full h-full overflow-auto transition-colors duration-200",
                  isDarkMode ? "dark bg-background" : "bg-background",
                  isFullscreen ? "p-8" : "p-6",
                )}
              >
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Exit Fullscreen
                  </Button>
                )}

                <div className="flex items-center justify-center min-h-full">
                  <Component />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t bg-muted/30 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Install:{" "}
              <code className="px-1 py-0.5 bg-muted rounded">
                npx shadcn@latest add https://d2studio.dev/r/
                {componentName.toLowerCase()}.json
              </code>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              {copied ? "Copied!" : "Copy Install Command"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
