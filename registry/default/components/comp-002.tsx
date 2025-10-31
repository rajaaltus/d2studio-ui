"use client";

import { Button } from "@/registry/default/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";
import {
  D2Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/d2-card";

interface FeatureCardProps {
  title?: string;
  description?: string;
  features?: string[];
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Component({
  title = "Premium Features",
  description = "Everything you need to build modern applications",
  features = [
    "Advanced analytics dashboard",
    "Real-time collaboration",
    "API access and webhooks",
    "Priority support",
  ],
  buttonText = "Get Started",
  onButtonClick = () => console.log("Button clicked"),
}: FeatureCardProps = {}) {
  return (
    <D2Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-start py-4">
        <CardTitle className="text-xl flex gap-2 items-center justify-start">
          <BadgeCheck
            size={48}
            className="p-2 shrink-0 bg-accent text-foreground/70 rounded-full border border-border/20 
            shadow-[inset_0_-1px_1px_0_rgba(255,255,255,0.9),inset_0_1px_1px_0_rgba(0,0,0,0.02)]
            dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_3px_6px_0_rgba(0,0,0,0.02)]"
          />
          <div className="flex flex-col">
            {title}
            <CardDescription>{description}</CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 py-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button onClick={onButtonClick} className="w-full">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </D2Card>
  );
}
