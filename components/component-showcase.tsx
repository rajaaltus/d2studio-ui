"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const showcaseItems = [
    {
      name: "Buttons",
      code: `<Button variant="default">
  Default Button
</Button>

<Button variant="outline">
  Outline Button
</Button>

<Button variant="ghost">
  Ghost Button
</Button>`,
      preview: (
        <div className="space-y-3">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      ),
    },
    {
      name: "Cards",
      code: `<Card className="p-6">
  <h3 className="font-medium mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card content goes here.
  </p>
</Card>`,
      preview: (
        <Card className="p-6">
          <h3 className="font-medium mb-2">Card Title</h3>
          <p className="text-muted-foreground">Card content goes here.</p>
        </Card>
      ),
    },
    {
      name: "Avatars",
      code: `<Avatar>
  <AvatarFallback>
    JS
  </AvatarFallback>
</Avatar>

<Avatar className="h-12 w-12">
  <AvatarFallback>
    MD
  </AvatarFallback>
</Avatar>`,
      preview: (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full text-xs bg-card">
              <span>Showcase</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              See Components in Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Interactive preview of our component library. Click on any tab to
              see the component code and live preview side by side.
            </p>
          </div>

          {/* Component Showcase */}
          <Card className="overflow-hidden p-0">
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex">
                {showcaseItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "px-6 py-4 text-sm font-medium border-r border-border last:border-r-0 transition-colors",
                      activeTab === index
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Code Panel */}
              <div className="p-6 border-r border-border lg:border-r lg:border-b-0 border-b">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Code</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{showcaseItems[activeTab].code}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Preview</h3>
                  <div className="flex items-center justify-center min-h-[120px] border border-border rounded-lg bg-background/50">
                    {showcaseItems[activeTab].preview}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <StatCard number="50+" label="Components" />
            <StatCard number="100%" label="TypeScript" />
            <StatCard number="0" label="Dependencies" />
            <StatCard number="∞" label="Customizable" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <Card className="p-6 text-center bg-card/30 border-border/50">
      <div className="text-2xl md:text-3xl font-bold mb-1">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}
