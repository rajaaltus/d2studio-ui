"use client";

import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { ArrowRight, Code2, Layers, Palette } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full text-xs bg-card">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>v1.0.0 • ultra modern • monospace</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Component</span>
              <span className="block bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Library
              </span>
              <span className="block text-muted-foreground">Redefined</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ultra modern, monospace-first component library built for{" "}
              <span className="text-foreground font-medium">developers</span> who value{" "}
              <span className="text-foreground font-medium">precision</span> and{" "}
              <span className="text-foreground font-medium">clarity</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              Browse Components
              <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Code2 size={16} />
              View Source
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
            <FeatureCard
              icon={<Code2 size={20} />}
              title="Developer First"
              description="Built by developers, for developers. Every component is designed with DX in mind."
            />
            <FeatureCard
              icon={<Palette size={20} />}
              title="Monochromatic"
              description="Pure black and white aesthetic. No distractions, just clean interfaces."
            />
            <FeatureCard
              icon={<Layers size={20} />}
              title="Modular System"
              description="Mix and match components. Copy, customize, and make them your own."
            />
          </div>

          {/* Code Preview */}
          <div className="pt-16">
            <Card className="p-6 text-left max-w-2xl mx-auto bg-card/50 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Terminal</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <span>npx shadcn add button</span>
                </div>
                <div className="text-muted-foreground">
                  Installing button component...
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">Component installed successfully</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-2 rounded-lg bg-foreground/5 border border-border/30">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}