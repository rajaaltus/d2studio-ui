"use client";

import { Card, CardContent } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Check, Zap, Shield, Code } from "lucide-react";
import { DottedMap } from "@/components/ui/dotted-map";

export default function Component() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Built for performance with modern web standards and optimized for speed.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure by Default",
      description:
        "Enterprise-grade security with built-in protection against common vulnerabilities.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Developer First",
      description:
        "Intuitive APIs, comprehensive docs, and tools that developers love to use.",
    },
  ];

  const markers = [
    {
      lat: 40.7128,
      lng: -74.006,
      size: 0.3,
    }, // New York
    {
      lat: 34.0522,
      lng: -118.2437,
      size: 0.3,
    }, // Los Angeles
    {
      lat: 51.5074,
      lng: -0.1278,
      size: 0.3,
    }, // London
    {
      lat: -33.8688,
      lng: 151.2093,
      size: 0.3,
    }, // Sydney
    {
      lat: 48.8566,
      lng: 2.3522,
      size: 0.3,
    }, // Paris
    {
      lat: 35.6762,
      lng: 139.6503,
      size: 0.3,
    }, // Tokyo
    {
      lat: 55.7558,
      lng: 37.6176,
      size: 0.3,
    }, // Moscow
    {
      lat: 39.9042,
      lng: 116.4074,
      size: 0.3,
    }, // Beijing
    {
      lat: 28.6139,
      lng: 77.209,
      size: 0.3,
    }, // New Delhi
    {
      lat: -23.5505,
      lng: -46.6333,
      size: 0.3,
    }, // São Paulo
    {
      lat: 1.3521,
      lng: 103.8198,
      size: 0.3,
    }, // Singapore
    {
      lat: 25.2048,
      lng: 55.2708,
      size: 0.3,
    }, // Dubai
    {
      lat: 52.52,
      lng: 13.405,
      size: 0.3,
    }, // Berlin
    {
      lat: 19.4326,
      lng: -99.1332,
      size: 0.3,
    }, // Mexico City
    {
      lat: -26.2041,
      lng: 28.0473,
      size: 0.3,
    }, // Johannesburg
  ];

  const benefits = [
    "Easy to integrate and customize",
    "Comprehensive documentation",
    "Active community support",
    "Regular updates and improvements",
  ];

  return (
    <section className="w-full py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center ">
          <DottedMap
            className="absolute max-w-xl md:max-w-3xl right-0 [mask-image:radial-gradient(350px_circle_at_center,white,transparent)]"
            markers={markers}
          />
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="w-fit  shadow-[inset_0_-1px_1px_0_rgba(255,255,255,0.9),inset_0_1px_1px_0_rgba(0,0,0,0.02)]
                dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_3px_6px_0_rgba(0,0,0,0.02)]"
              >
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform provides all the tools and features you need to
                build, deploy, and scale your applications with confidence.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground  shadow-[inset_0_-1px_1px_0_rgba(255,255,255,0.9),inset_0_1px_1px_0_rgba(0,0,0,0.02)]
            dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_3px_6px_0_rgba(0,0,0,0.02)]"
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-fit bg-background text-foreground hover:bg-muted/50 dark:ring-input border-input/50 dark:border-input relative border-b-2 shadow-sm shadow-zinc-950/15 ring-1 ring-zinc-300 hover:cursor-pointer"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
