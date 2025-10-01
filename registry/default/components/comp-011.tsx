"use client"

import { Card, CardContent } from "@/registry/default/ui/card"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { Check, Zap, Shield, Code } from "lucide-react"

export default function Component() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Built for performance with modern web standards and optimized for speed.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure by Default",
      description: "Enterprise-grade security with built-in protection against common vulnerabilities.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Developer First",
      description: "Intuitive APIs, comprehensive docs, and tools that developers love to use.",
    },
  ]

  const benefits = [
    "Easy to integrate and customize",
    "Comprehensive documentation",
    "Active community support",
    "Regular updates and improvements",
  ]

  return (
    <section className="w-full py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform provides all the tools and features you need to build,
                deploy, and scale your applications with confidence.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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

            <Button size="lg" className="w-fit">
              Learn More
            </Button>
          </div>

          <Card className="lg:order-first">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Why choose us?</h3>
                  <p className="text-muted-foreground">
                    Join thousands of developers who trust our platform.
                  </p>
                </div>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting at</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold">Free</div>
                      <div className="text-muted-foreground">forever</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}