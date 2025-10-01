"use client"

import { Card, CardContent } from "@/registry/default/ui/card"
import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import { ArrowRight, CheckCircle, Star, Users, Zap } from "lucide-react"

export default function Component() {
  const stats = [
    { label: "Active Users", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Success Rate", value: "99.9%", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Performance", value: "Fast", icon: <Zap className="h-5 w-5" /> },
  ]

  const features = [
    {
      title: "Modern Design",
      description: "Clean, contemporary interface that users love to interact with.",
    },
    {
      title: "Fully Responsive",
      description: "Looks perfect on desktop, tablet, and mobile devices.",
    },
    {
      title: "Easy Integration",
      description: "Drop-in component that works with your existing codebase.",
    },
  ]

  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Star className="w-3 h-3 mr-1" />
                Featured Section
              </Badge>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Build Something
                <span className="block text-primary">Amazing Today</span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Transform your ideas into reality with our powerful platform. 
                Join thousands of developers who are already building the future.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex justify-center text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Additional Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg" />
              <Card className="relative border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Ready to Deploy</h4>
                      <p className="text-sm text-muted-foreground">
                        Production-ready components you can trust
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}