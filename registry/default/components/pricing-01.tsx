"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import {
  D2Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/d2-card";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      popular: false,
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "Basic support", included: true },
        { name: "1GB storage", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
        { name: "Custom integrations", included: false },
      ],
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For growing teams",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "Priority support", included: true },
        { name: "100GB storage", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom integrations", included: true },
        { name: "White-label options", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      popular: false,
      features: [
        { name: "Unlimited everything", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Unlimited storage", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom integrations", included: true },
        { name: "White-label options", included: true },
      ],
    },
  ];

  return (
    <section className="@container font-sans w-full py-12 @md:py-16 @xl:py-24">
      <div className="container px-4 @md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl @md:text-4xl @xl:text-5xl font-bold tracking-tight">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground @md:text-lg">
            Select the perfect plan for your needs. Upgrade or downgrade at any
            time.
          </p>
        </div>

        <div className="grid gap-6  @xl:grid-cols-3 @xl:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <D2Card
              key={index}
              className={`relative transition-all ${
                plan.popular ? "border-primary shadow-lg @xl:scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="flex flex-col items-start pb-8">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="">
                  <span className="text-4xl @xl:text-5xl font-bold">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>

                <div className="space-y-3 pt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <Check className="size-3 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="flex size-5 items-center justify-center rounded-full bg-muted">
                          <X className="size-3 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-sm"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </D2Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
