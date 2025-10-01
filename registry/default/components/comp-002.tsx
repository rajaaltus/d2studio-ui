"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/default/ui/card"
import { Button } from "@/registry/default/ui/button"
import { ArrowRight } from "lucide-react"

interface FeatureCardProps {
  title?: string
  description?: string
  features?: string[]
  buttonText?: string
  onButtonClick?: () => void
}

export default function Component({
  title = "Premium Features",
  description = "Everything you need to build modern applications",
  features = [
    "Advanced analytics dashboard",
    "Real-time collaboration",
    "API access and webhooks",
    "Priority support"
  ],
  buttonText = "Get Started",
  onButtonClick = () => console.log("Button clicked")
}: FeatureCardProps = {}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
    </Card>
  )
}